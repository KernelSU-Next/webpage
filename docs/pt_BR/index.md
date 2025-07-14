---
# https://vitepress.dev/reference/default-theme-home-page
layout: home
title: Início

hero:
  name: "KernelSU Next"
  text: "Uma solução root avançada baseada em kernel para Android"
  tagline: Suporta kernels 4.4 - 6.6 (Não-GKI e GKI)
  image:
    src: /logo.png
    alt: "KernelSU Next"
  actions:
    - theme: brand
      text: Instalação
      link: /pt_BR/pages/installation
    - theme: alt
      text: GitHub
      link: https://github.com/KernelSU-Next/KernelSU-Next

features:
  - title: Suporte a kernel não-GKI
    details: Suporta kernels não-GKI de 4.x - 5.4 com modo LTS (3.x é experimental).
  - title: Suporte ao kernel GKI
    details: Suporta kernels GKI de 5.10 - 6.6 com modo GKI (6.6+ é experimental).
  - title: Montagem de módulo dinâmica
    details: Inclui suporte a Magic Mount e OverlayFS, que podem ser alternados nas configurações com um único botão.
  - title: Novos recursos do gerenciador
    details: O app do gerenciador apresenta uma interface redesenhada com diversas melhorias e uma reformulação completa da IU.
  - title: Backup e restauração de módulo
    details: Permite fazer backup e restaurar módulos, independentemente de terem sido desinstalados acidentalmente, de você ter mudado de ideia ou de desejar restaurar um backup específico.
  - title: Atualizações automáticas
    details: O app do gerenciador é atualizado automaticamente a cada nova versão.
  - title: Atualizações frequentes
    details: Recebe melhorias contínuas e novos recursos de forma regular.
  - title: Ocultar hosts
    details: Oculta modificações de arquivos hosts de detectores usando a desmontagem do Perfil do Aplicativo, permitindo que bloqueadores de anúncios funcionem perfeitamente.
  - title: Instalação em massa
    details: Instale vários módulos de uma vez, selecione todos os módulos desejados e eles serão instalados sequencialmente.
  - title: Tamanho de imagem personalizado
    details: Personalize o tamanho da imagem esparsa do OverlayFS para atender às suas necessidades. O tamanho padrão é 6 GB.
  - title: Backup e restauração da lista de permissões SU
    details: Faça backup e restaure a lista de permissões do SU para todos os apps concedidos anteriormente, facilitando a recuperação de permissões em um novo dispositivo ou configuração.
  - title: Controles e informações do SuSFS
    details: Veja detalhes de compatibilidade e informações básicas do SuSFS, juntamente com controles para o modo de ocultação de ganchos KPROBES.
  - title: WebUI X
    details: O WebUI X oferece uma maneira inovadora de gerenciar WebUIs, apresentando APIs aprimoradas em nível de sistema que os desenvolvedores de módulos/WebUI podem aproveitar. Ele também inclui suporte a Monet para um Material You consistente em todo o design.