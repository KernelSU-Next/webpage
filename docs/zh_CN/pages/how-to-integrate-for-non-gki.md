# 为非 GKI 设备集成 KernelSU Next

KernelSU Next 可以集成到非 GKI 内核中，并已向下移植到 4.14 及更早版本。

由于非 GKI 内核碎片化严重，我们没有通用的构建方式，因此无法提供非 GKI 的 boot.img。不过，您可以自行构建集成了 KernelSU Next 的内核。

首先，您需要能够从内核源码构建出可启动的内核。如果内核不是开源的，则很难在您的设备上运行 KernelSU Next。

如果您能够构建可启动内核，有两种方式可以将 KernelSU Next 集成到内核源码中：

1. 通过 `kprobe` 自动集成
2. 手动集成

## 通过 kprobe 集成

KernelSU Next 使用 kprobe 作为内核钩子。如果 kprobe 在您的内核上运行稳定，我们推荐使用此方式集成。

首先，将 KernelSU Next 添加到您的内核源码树：

```sh
curl -LSs "https://raw.githubusercontent.com/KernelSU-Next/KernelSU-Next/next/kernel/setup.sh" | bash -s legacy
```

然后，检查内核配置中是否已启用 kprobe。如果未启用，请添加以下配置：

```txt
CONFIG_KPROBES=y
CONFIG_KPROBE_EVENTS=y
CONFIG_KSU_KPROBE_HOOKS=y
CONFIG_KSU=y
```

重新构建内核后，KernelSU Next 应可正常工作。

如果发现 KPROBES 仍未启用，可尝试启用 `CONFIG_MODULES`。若问题仍未解决，请使用 `make menuconfig` 搜索其他 KPROBES 依赖项。

如果集成 KernelSU Next 后遇到启动循环，这可能意味着**您的内核中 kprobe 存在问题**，需要修复该 bug 或改用其他方式。

::: tip 如何检查 kprobe 是否损坏？
在 `KernelSU/kernel/ksu.c` 中注释掉 `ksu_sucompat_init()` 和 `ksu_ksud_init()`。如果设备能正常启动，则说明 kprobe 可能已损坏。
:::

## 手动修改内核源码

如果 kprobe 在您的内核上无法正常工作——无论是由于上游 bug，还是您的内核版本低于 4.14——可以尝试以下方法：

首先，将 KernelSU Next 添加到您的内核源码树：

```sh
curl -LSs "https://raw.githubusercontent.com/KernelSU-Next/KernelSU-Next/next/kernel/setup.sh" | bash -s legacy
```

请注意，在某些设备上，defconfig 可能位于 `arch/arm64/configs`，也可能位于 `arch/arm64/configs/vendor/your_defconfig`。无论使用哪个 defconfig，请确保将 `CONFIG_KSU` 设置为 `y`（启用）或 `n`（禁用）。例如，若选择启用，defconfig 中应包含以下内容：

```txt
# KernelSU Next
CONFIG_KSU=y
```

接下来，将 KernelSU Next 调用添加到内核源码中。以下是一些供参考的补丁：

::: code-group

```diff[exec.c]
diff --git a/fs/exec.c b/fs/exec.c
--- a/fs/exec.c
+++ b/fs/exec.c
@@ -1886,12 +1886,26 @@ static int do_execveat_common(int fd, struct filename *filename,
 	return retval;
 }
 
+#ifdef CONFIG_KSU
+__attribute__((hot))
+extern int ksu_handle_execveat(int *fd, struct filename **filename_ptr,
+				void *argv, void *envp, int *flags);
+#endif
+
 int do_execve(struct filename *filename,
 	const char __user *const __user *__argv,
 	const char __user *const __user *__envp)
 {
 	struct user_arg_ptr argv = { .ptr.native = __argv };
 	struct user_arg_ptr envp = { .ptr.native = __envp };
+#ifdef CONFIG_KSU
+	ksu_handle_execveat((int *)AT_FDCWD, &filename, &argv, &envp, 0);
+#endif
 	return do_execveat_common(AT_FDCWD, filename, argv, envp, 0);
 }
 
@@ -1919,6 +1933,10 @@
static int compat_do_execve(struct filename *filename,
 		.is_compat = true,
 		.ptr.compat = __envp,
 	};
+#ifdef CONFIG_KSU // 32 位 ksud 及 32-on-64 支持
+	ksu_handle_execveat((int *)AT_FDCWD, &filename, &argv, &envp, 0);
+#endif
 	return do_execveat_common(AT_FDCWD, filename, argv, envp, 0);
 }
 
```
```diff[open.c]
diff --git a/fs/open.c b/fs/open.c
--- a/fs/open.c
+++ b/fs/open.c
+#ifdef CONFIG_KSU
+__attribute__((hot)) 
+extern int ksu_handle_faccessat(int *dfd, const char __user **filename_user,
+				int *mode, int *flags);
+#endif
+
/*
 * access() needs to use the real uid/gid, not the effective uid/gid.
 * We do this by temporarily clearing all FS-related capabilities and
 * switching the fsuid/fsgid around to the real ones.
 */
SYSCALL_DEFINE3(faccessat, int, dfd, const char __user *, filename, int, mode)
{
	const struct cred *old_cred;
	struct cred *override_cred;
	struct path path;
	struct inode *inode;
	int res;
	unsigned int lookup_flags = LOOKUP_FOLLOW;
 
+#ifdef CONFIG_KSU
+	ksu_handle_faccessat(&dfd, &filename, &mode, NULL);
+#endif
+
 	if (mode & ~S_IRWXO)	/* where's F_OK, X_OK, W_OK, R_OK? */
 		return -EINVAL;
```
```diff[read_write.c]
--- a/fs/read_write.c
+++ b/fs/read_write.c
@@ -568,11 +568,21 @@ static inline void file_pos_write(struct file *file, loff_t pos)
 		file->f_pos = pos;
 }
 
+#ifdef CONFIG_KSU
+extern bool ksu_vfs_read_hook __read_mostly;
+extern __attribute__((cold)) int ksu_handle_sys_read(unsigned int fd,
+				char __user **buf_ptr, size_t *count_ptr);
+#endif
+
 SYSCALL_DEFINE3(read, unsigned int, fd, char __user *, buf, size_t, count)
 {
 	struct fd f = fdget_pos(fd);
 	ssize_t ret = -EBADF;
 
+#ifdef CONFIG_KSU
+	if (unlikely(ksu_vfs_read_hook)) 
+		ksu_handle_sys_read(fd, &buf, &count);
+#endif
 	if (f.file) {
 		loff_t pos = file_pos_read(f.file);
 		ret = vfs_read(f.file, buf, count, &pos);
```
```diff[stat.c]
diff --git a/fs/stat.c b/fs/stat.c
--- a/fs/stat.c
+++ b/fs/stat.c
@@ -353,6 +353,10 @@ SYSCALL_DEFINE2(newlstat, const char __user *, filename,
 	return cp_new_stat(&stat, statbuf);
 }
 
+#ifdef CONFIG_KSU
+__attribute__((hot)) 
+extern int ksu_handle_stat(int *dfd, const char __user **filename_user,
+				int *flags);
+#endif
+

#if !defined(__ARCH_WANT_STAT64) || defined(__ARCH_WANT_SYS_NEWFSTATAT)
SYSCALL_DEFINE4(newfstatat, int, dfd, const char __user *, filename,
		struct stat __user *, statbuf, int, flag)
{
	struct kstat stat;
	int error;

+#ifdef CONFIG_KSU
+	ksu_handle_stat(&dfd, &filename, &flag);
+#endif
 	error = vfs_fstatat(dfd, filename, &stat, flag);
 	if (error)
 		return error;
```
```diff[reboot.c]
diff --git a/kernel/reboot.c b/kernel/reboot.c
--- a/kernel/reboot.c
+++ b/kernel/reboot.c
@@ -277,6 +277,11 @@ 
  *
  * reboot doesn't sync: do that yourself before calling this.
  */
+
+#ifdef CONFIG_KSU
+extern int ksu_handle_sys_reboot(int magic1, int magic2, unsigned int cmd, void __user **arg);
+#endif
+
SYSCALL_DEFINE4(reboot, int, magic1, int, magic2, unsigned int, cmd,
		void __user *, arg)
{
	struct pid_namespace *pid_ns = task_active_pid_ns(current);
	char buffer[256];
	int ret = 0;
 
+#ifdef CONFIG_KSU 
+	ksu_handle_sys_reboot(magic1, magic2, cmd, &arg);
+#endif
 	/* We only trust the superuser with rebooting the system. */
 	if (!ns_capable(pid_ns->user_ns, CAP_SYS_BOOT))
 		return -EPERM;
```
:::

您需要在内核源码中找到以下五个函数：

1. `do_execve`，通常位于 `fs/exec.c`
2. `SYSCALL_DEFINE3`，通常位于 `fs/open.c`
3. `vfs_read`，通常位于 `fs/read_write.c`
4. `SYSCALL_DEFINE4`，通常位于 `fs/stat.c`
5. `SYSCALL_DEFINE4`，通常位于 `kernel/reboot.c`

完成后重新构建内核，KernelSU Next 应可正常工作。


旧版设备支持贡献者：

- [@sidex15](https://github.com/sidex15)
- [@maxsteeel](https://github.com/maxsteeel)
- [@rifsxd](https://github.com/rifsxd)
