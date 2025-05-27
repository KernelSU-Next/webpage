---
# https://vitepress.dev/reference/default-theme-home-page
layout: home
title: Android 上的高级内核级 root 解决方案

hero:
  name: "KernelSU Next"
  text: "新一代安卓内核级 Root 方案"
  tagline: 支持从 4.4 到 6.6 的大多数安卓设备内核
  image:
    src: /logo.png
    alt: "KernelSU Next"
  actions:
    - theme: brand
      text: 安装
      link: /zh_CN/pages/installation
    - theme: alt
      text: Github
      link: https://github.com/KernelSU-Next/KernelSU-Next

features:
  - title: 非 GKI 内核支持
    details: 4.x - 5.4 版本支持非 GKI 内核，且采用 LTS 模式（3.x 版本为实验性版本）
  - title: GKI 内核支持
    details: 5.10 - 6.6 版本支持 GKI 内核，且采用 GKI 模式（6.6 及以上版本为实验性版本）
  - title: 动态模块挂载
    details: 支持 Magic Mount 和 OverlayFS 两种模块挂载模式，可根据喜好通过设置轻松切换
  - title: 全新设计的管理器
    details: 管理器应用现在拥有一个全新设计的界面并带来了多个功能改进
  - title: 模块备份与恢复
    details: 支持备份及恢复安装过的所有模块，再也不用担心模块不翼而飞了！
  - title: 自动更新
    details: 管理器应用会自动检查最新版本的更新
  - title: 马不停蹄
    details: 管理团队定期更新并带来许多令人耳目一新的新功能
  - title: 隐藏 Hosts
    details: 通过应用程序配置文件卸载隐藏对 hosts 文件的修改，让你无障碍使用广告拦截器
  - title: 批量安装
    details: 一次批量安装多个模块，选择你需要的所有模块，管理器会自动依次安装
  - title: 自定义镜像大小
    details: 可自定义 OverlayFS 稀疏镜像大小以满足你的需求，默认大小为 6GB
  - title: 超级用户列表备份与恢复
    details: 备份和恢复所有授予超级用户权限的 APP 列表及其 APP Profile 配置，妈妈再也不用担心配置丢失了！
  - title: SuSFS 运行控制
    details: 获取 SuSFS 的运行状态（如有）以及操作 KPROBES 钩子隐藏模式
  - title:
    details: WebUI X 是一种管理 WebUI 的创新方法，它拥有更多系统级 API，模块/WebUI 开发者可以根据自身需求进行升级，同时还支持无缝衔接的 Material U 界面。

