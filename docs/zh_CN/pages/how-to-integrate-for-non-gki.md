# 为非 GKI 设备集成

KernelSU Next 可以集成到非 GKI 内核中，并已向后移植到 4.14 及更早版本。

由于非 GKI 内核存在碎片化，我们没有通用的方法来构建它们，因此无法提供适用于非 GKI 的 boot.img。不过，你仍然可以自行编译集成了 KernelSU Next 的内核。

首先，你需要能够从内核源码编译出一个可启动的内核。如果该设备的内核不是开源的，那么在该设备上运行 KernelSU Next 将会比较困难。

如果你能够编译出可启动的内核，那么有两种方式可以将 KernelSU Next 集成到内核源码中：

1. 使用 `kprobe` 自动集成  
2. 手动集成  

---

# 使用 kprobe 集成

KernelSU Next 使用 **kprobe** 作为其内核 Hook 机制。如果你的内核能够可靠地运行 kprobe，我们推荐使用这种方式进行集成。

首先，将 KernelSU Next 添加到你的内核源码树中：

```sh
curl -LSs "https://raw.githubusercontent.com/KernelSU-Next/KernelSU-Next/next/kernel/setup.sh" | bash -s legacy
```

然后，检查你的 **kernel config** 中是否启用了 kprobe。如果没有，请添加以下配置：

```txt
CONFIG_KPROBES=y
CONFIG_KPROBE_EVENTS=y
CONFIG_KSU_KPROBE_HOOKS=y
CONFIG_KSU=y
```

现在重新编译你的内核，KernelSU Next 应该就可以正常工作了。

如果你发现 **KPROBES 仍然没有启用**，可以尝试启用：

```
CONFIG_MODULES
```

如果仍然无法解决，可以使用 `make menuconfig` 搜索 **KPROBES 的依赖项** 并启用它们。

不过，如果在集成 KernelSU Next 后 **设备出现 bootloop**，这可能意味着 **你的内核中的 kprobe 存在问题**。此时你需要修复 kprobe 的问题，或者使用其他方式集成。

::: tip 如何检查 KPROBE 是否损坏？
在 `KernelSU/kernel/ksu.c` 中注释掉：

```
ksu_sucompat_init()
ksu_ksud_init()
```

如果设备能够正常启动，那么说明 **kprobe 可能存在问题**。
:::

---

# 手动修改内核源码

如果你的内核 **无法使用 kprobe** —— 例如由于 **上游 bug**，或者你的内核版本 **早于 4.14**，你可以尝试使用以下方式。

首先，将 KernelSU Next 添加到你的内核源码树：

```sh
curl -LSs "https://raw.githubusercontent.com/KernelSU-Next/KernelSU-Next/next/kernel/setup.sh" | bash -s legacy
```

请注意，在某些设备上，**defconfig** 可能位于：

```
arch/arm64/configs
```

或者：

```
arch/arm64/configs/vendor/your_defconfig
```

无论你使用哪个 defconfig，请确保启用了 `CONFIG_KSU`：

```
y  -> 启用
n  -> 禁用
```

例如，如果启用它，你的 **defconfig** 应该包含：

```txt
# KernelSU Next
CONFIG_KSU=y
```

接下来，你需要在 **内核源码中添加 KernelSU Next 的调用**。下面提供了一些补丁作为参考：

::: code-group

```diff [exec.c]
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
+#ifdef CONFIG_KSU
+	ksu_handle_execveat((int *)AT_FDCWD, &filename, &argv, &envp, 0);
+#endif
 	return do_execveat_common(AT_FDCWD, filename, argv, envp, 0);
 }
```

```diff [open.c]
diff --git a/fs/open.c b/fs/open.c
--- a/fs/open.c
+++ b/fs/open.c
+#ifdef CONFIG_KSU
+__attribute__((hot))
+extern int ksu_handle_faccessat(int *dfd, const char __user **filename_user,
+				int *mode, int *flags);
+#endif

 SYSCALL_DEFINE3(faccessat, int, dfd, const char __user *, filename, int, mode)
 {
+#ifdef CONFIG_KSU
+	ksu_handle_faccessat(&dfd, &filename, &mode, NULL);
+#endif
```

```diff [read_write.c]
--- a/fs/read_write.c
+++ b/fs/read_write.c
@@ -568,11 +568,21 @@ static inline void file_pos_write(struct file *file, loff_t pos)

+#ifdef CONFIG_KSU
+extern bool ksu_vfs_read_hook __read_mostly;
+extern __attribute__((cold)) int ksu_handle_sys_read(unsigned int fd,
+				char __user **buf_ptr, size_t *count_ptr);
+#endif

 SYSCALL_DEFINE3(read, unsigned int, fd, char __user *, buf, size_t, count)
 {
+#ifdef CONFIG_KSU
+	if (unlikely(ksu_vfs_read_hook))
+		ksu_handle_sys_read(fd, &buf, &count);
+#endif
```

```diff [stat.c]
diff --git a/fs/stat.c b/fs/stat.c
--- a/fs/stat.c
+++ b/fs/stat.c
+#ifdef CONFIG_KSU
+__attribute__((hot))
+extern int ksu_handle_stat(int *dfd, const char __user **filename_user,
+				int *flags);
+#endif

 SYSCALL_DEFINE4(newfstatat, int, dfd, const char __user *, filename,
 		struct stat __user *, statbuf, int, flag)
 {
+#ifdef CONFIG_KSU
+	ksu_handle_stat(&dfd, &filename, &flag);
+#endif
```

```diff [reboot.c]
diff --git a/kernel/reboot.c b/kernel/reboot.c
--- a/kernel/reboot.c
+++ b/kernel/reboot.c
+#ifdef CONFIG_KSU
+extern int ksu_handle_sys_reboot(int magic1, int magic2, unsigned int cmd, void __user **arg);
+#endif

 SYSCALL_DEFINE4(reboot, int, magic1, int, magic2, unsigned int, cmd,
 		void __user *, arg)
 {
+#ifdef CONFIG_KSU
+	ksu_handle_sys_reboot(magic1, magic2, cmd, &arg);
+#endif
```

:::

你需要在内核源码中找到以下 **5 个函数**：

1. `do_execve`，通常在 `fs/exec.c`
2. `SYSCALL_DEFINE3(faccessat)`，通常在 `fs/open.c`
3. `vfs_read`，通常在 `fs/read_write.c`
4. `SYSCALL_DEFINE4(newfstatat)`，通常在 `fs/stat.c`
5. `SYSCALL_DEFINE4(reboot)`，通常在 `kernel/reboot.c`

最后，重新编译你的内核，KernelSU Next 应该就可以正常工作。

---

Credits for supporting Legacy devices:

- [@sidex15](https://github.com/sidex15)
- [@maxsteeel](https://github.com/maxsteeel)
- [@rifsxd](https://github.com/rifsxd)
