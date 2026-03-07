# Integrate for non-GKI devices

KernelSU Next can be integrated into non-GKI kernels and was backported to 4.14 and earlier versions.

Due to the fragmentation of non-GKI kernels, we don't have a universal way to build them; therefore, we cannot provide a non-GKI boot.img. However, you can build the kernel with KernelSU Next integrated on your own.

First, you should be able to build a bootable kernel from kernel source code. If the kernel isn't open source, then it is difficult to run KernelSU Next for your device.

If you're able to build a bootable kernel, there are two ways to integrate KernelSU Next into the kernel source code:

1. Automatically with `kprobe`
2. Manually

## Integrate with kprobe

KernelSU Next uses kprobe for its kernel hooks. If kprobe runs reliably on your kernel, we recommend integrating KernelSU Next this way.

First, add KernelSU Next to your kernel source tree:

```sh
curl -LSs "https://raw.githubusercontent.com/KernelSU-Next/KernelSU-Next/next/kernel/setup.sh" | bash -s legacy
```

Then, you should check if kprobe is enabled in your kernel config. If it isn't, add these configs to it:

```txt
CONFIG_KPROBES=y
CONFIG_KPROBE_EVENTS=y
CONFIG_KSU_KPROBE_HOOKS=y
CONFIG_KSU=y
```

Now, when you re-build your kernel, KernelSU Next should work correctly.

If you find that KPROBES is still not enabled, you can try enabling `CONFIG_MODULES`. If that doesn't solve the issue, use `make menuconfig` to search for other KPROBES dependencies.

However, if you encounter a bootloop after integrating KernelSU Next, this may indicate that the **kprobe is broken in your kernel**, which means that you should fix the kprobe bug or use another way.

::: tip HOW TO CHECK IF KPROBE IS BROKEN？
Comment out `ksu_sucompat_init()` and `ksu_ksud_init()` in `KernelSU/kernel/ksu.c`. If the device boots normally, kprobe may be broken.
:::

## Manually modify the kernel source

If kprobe doesn't work on your kernel—either because of an upstream bug or because your kernel is older than 4.14 you can try the following approach:

First, add KernelSU Next to your kernel source tree:

```sh
curl -LSs "https://raw.githubusercontent.com/KernelSU-Next/KernelSU-Next/next/kernel/setup.sh" | bash -s legacy
```

Keep in mind that, on some devices, your defconfig may be located at `arch/arm64/configs` or in other cases, it may be at `arch/arm64/configs/vendor/your_defconfig`. Regardless of the defconfig you're using, make sure to enable `CONFIG_KSU` with `y` to enable or `n` to disable it. For example, if you choose to enable it, your defconfig should contain the following string:

```txt
# KernelSU Next
CONFIG_KSU=y
```

Next, add KernelSU Next calls to the kernel source. Below are some patches for reference:

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
+#ifdef CONFIG_KSU // 32-bit ksud and 32-on-64 support
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

You should find the five functions in kernel source:

1. `do_execve`, usually in `fs/exec.c`
2. `SYSCALL_DEFINE3`, usually in `fs/open.c`
3. `vfs_read`, usually in `fs/read_write.c`
4. `SYSCALL_DEFINE4`, usually in `fs/stat.c`
5. `SYSCALL_DEFINE4`, usually in `kernel/reboot.c`

Finally, build your kernel again, and KernelSU Next should work correctly.


Credits for supporting Legacy devices:
@sidex15 
@maxsteeel
@rifsxd
