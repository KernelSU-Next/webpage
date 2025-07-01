---
# https://vitepress.dev/reference/default-theme-home-page
layout: home
title: Home

hero:
  name: "KernelSU Next"
  text: "An advanced kernel-based root solution for Android"
  tagline: Supports kernels 4.4 - 6.6 (Non-GKI & GKI)
  image:
    src: /logo.png
    alt: "KernelSU Next"
  actions:
    - theme: brand
      text: Installation
      link: pages/installation
    - theme: alt
      text: GitHub
      link: https://github.com/KernelSU-Next/KernelSU-Next

features:
  - title: Non-GKI kernel support
    details: Supports non-GKI kernels from 4.x - 5.4 with LTS mode (3.x is experimental).
  - title: GKI kernel support
    details: Supports GKI kernels from 5.10 - 6.6 with GKI mode (6.6+ is experimental).
  - title: Dynamic module mount
    details: Includes support for Magic Mount and OverlayFS, which can be switched from the settings with a single toggle.
  - title: New manager features
    details: The manager app features a redesigned interface with several improvements and a complete UI overhaul.
  - title: Module backup & restore
    details: Allows backup and restoration of modules, whether they were accidentally uninstalled, you changed your mind, or want to restore a specific backup.
  - title: Automatic updates
    details: The manager app updates automatically with each new release.
  - title: Frequent updates
    details: Regularly updated with many upcoming features and improvements.
  - title: Hide hosts
    details: Hides hosts file modifications from detectors using App Profile unmount, allowing ad blockers to work seamlessly.
  - title: Bulk installation
    details: Install multiple modules at once, select all desired modules and they'll be installed sequentially.
  - title: Custom image size
    details: Customize the size of the OverlayFS sparse image to suit your needs. The default size is 6 GB.
  - title: SU allowlist backup & restore
    details: Backup and restore the SU permission allowlist for all previously granted apps, making it easy to recover permissions on a new device or setup.
  - title: SuSFS controls & info
    details: View compatibility details and basic info about SuSFS, along with controls for KPROBES hook-hiding mode.
  - title: WebUI X
    details: WebUI X offers an innovative way to manage WebUIs, featuring enhanced system-level APIs that module/WebUI developers can leverage. It also includes Monet support for a consistent Material You design throughout.
