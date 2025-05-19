# 安装

## 轻松集成
复制、粘贴并运行！轻松集成的 CLI 命令

>[!info] 信息
>根据自己的需求在内核源代码根目录下运行下列命令请注意：Dev 分支未经充分测试，可能不适用大多数设备环境，发现 bug 有能力请自己修或向开发者提交 issue.


### KernelSU Next
::: code-group
```sh [最新发行版本（稳定版)]
curl -LSs "https://raw.githubusercontent.com/rifsxd/KernelSU-Next/next/kernel/setup.sh" | bash -
```

```sh [Next 分支（Dev)]
curl -LSs "https://raw.githubusercontent.com/rifsxd/KernelSU-Next/next/kernel/setup.sh" | bash -s next
```

```sh [指定版本标签（以 v1.0.3 为例)]
curl -LSs "https://raw.githubusercontent.com/rifsxd/KernelSU-Next/next/kernel/setup.sh" | bash -s v1.0.3
```

:::

### SuSFS ඞ

::: code-group
```sh [Next-SuSFS 分支（稳定版）]
curl -LSs "https://raw.githubusercontent.com/rifsxd/KernelSU-Next/next-susfs/kernel/setup.sh" | bash -s next-susfs
```

```sh [Next-SuSFS 分支（Dev）]
curl -LSs "https://raw.githubusercontent.com/rifsxd/KernelSU-Next/next-susfs/kernel/setup.sh" | bash -s next-susfs-dev
```
:::

