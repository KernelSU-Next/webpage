# 安装

## 轻松集成

复制、粘贴并运行！轻松集成的 CLI 命令。

>[!info] 信息
>根据自己的需求在内核源代码根目录下运行下列命令。  
请注意：`Dev` 分支未经充分测试，可能不适用大多数设备环境，发现 Bug 有能力请自己修或向开发者提交 Issue。


### KernelSU Next

::: code-group
```sh [最新发行版本（稳定版）]
curl -LSs "https://raw.githubusercontent.com/KernelSU-Next/KernelSU-Next/next/kernel/setup.sh" | bash -
```

```sh [next 分支（Dev）]
curl -LSs "https://raw.githubusercontent.com/KernelSU-Next/KernelSU-Next/next/kernel/setup.sh" | bash -s next
```

```sh [指定版本标签（以 v1.0.3 为例）]
curl -LSs "https://raw.githubusercontent.com/KernelSU-Next/KernelSU-Next/next/kernel/setup.sh" | bash -s v1.0.8
```
