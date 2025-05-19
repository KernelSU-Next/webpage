---
# https://vitepress.dev/reference/default-theme-home-page
layout: home
title: Home

hero:
  name: "KernelSU Next"
  text: "An advanced kernel-based root solution for Android"
  tagline: Supports kernel 4.4 - 6.6 (Non-GKI & GKI)
  image:
    src: /logo.png
    alt: "KernelSU Next"
  actions:
    - theme: brand
      text: Installation
      link: pages/installation
    - theme: alt
      text: Github
      link: https://github.com/KernelSU-Next/KernelSU-Next

features:
  - title: Non-GKI kernel support
    details: Non-GKI kernel support from 4.x - 5.4 with LTS mode (3.x is experimental)
  - title: GKI kernel support
    details: GKI kernels support from 5.10 - 6.6 with GKI mode (6.6+ is experimental)
  - title: Dynamic module mount
    details: Includes both Magic Mount and OverlayFS, which can be switched from the settings with a single toggle
  - title: New manager features
    details: Manager app has a new, redesigned look with several feature improvements and a UI overhaul
  - title: Module backup & restoration
    details: Allows for backup and restoration of modules, whether they were uninstalled accidentally, you changed your mind, or you simply want to restore a specific backup
  - title: Auto-updates
    details: Manager app updates automatically with new releases
  - title: Frequent updates
    details: Frequently updated with lots of upcoming features
  - title: Hide hosts
    details: Hides hosts file modifications from detectors using app profile unmount, allowing you to use ad blockers without any hassle
  - title: Bulk installation
    details: Bulk install multiple modules at once, select all the modules you want and everything will be installed in serial
  - title: Custom image size
    details: Customizable OverlayFS sparse image size to whatever value that suits your needs, default size is 6GB
  - title: SU Allowlist backup & restoration
    details: Backup and restore SU permission allowlist for all apps you previously given, useful to restore all the SU permissions you previously allowed on different device or setup
  - title: SuSFS Controls & Info
    details: Get compatibility/basic info for SuSFS & Controls for KPROBES hooks hiding mode

