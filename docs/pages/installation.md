# Installation

## Easy integration

Copy, paste, and run! Easy-to-integrate CLI commands.

>[!note]
>Run the following commands from the root directory of your kernel source, as needed.  
Warning: the `Dev` branch hasn't been fully tested and may not be suitable for most devices. If you find any bug, feel free to fix them yourself or submit an issue to the developer.

### KernelSU Next

::: code-group
```sh [Latest release]
curl -LSs "https://raw.githubusercontent.com/KernelSU-Next/KernelSU-Next/next/kernel/setup.sh" | bash -
```

```sh [next branch (dev)]
curl -LSs "https://raw.githubusercontent.com/KernelSU-Next/KernelSU-Next/next/kernel/setup.sh" | bash -s next
```

```sh [Specific tag]
curl -LSs "https://raw.githubusercontent.com/KernelSU-Next/KernelSU-Next/next/kernel/setup.sh" | bash -s v1.0.8
```
