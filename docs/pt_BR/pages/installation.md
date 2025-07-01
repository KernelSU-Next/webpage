# Instalação

## Fácil integração

Copie, cole e execute! Comandos CLI de fácil integração.

>[!note] OBSERVAÇÃO
>Execute os comandos a seguir no diretório raiz do código-fonte do kernel, conforme suas necessidades.  
Atenção: o branch `Dev` ainda não foi completamente testado e pode não ser adequado para a maioria dos dispositivos. Caso encontre algum bug, você pode corrigi-lo por conta própria ou relatar o problema ao desenvolvedor.

### KernelSU Next

::: code-group
```sh [Último lançamento]
curl -LSs "https://raw.githubusercontent.com/KernelSU-Next/KernelSU-Next/next/kernel/setup.sh" | bash -
```

```sh [Branch next (dev)]
curl -LSs "https://raw.githubusercontent.com/KernelSU-Next/KernelSU-Next/next/kernel/setup.sh" | bash -s next
```

```sh [Tag específica]
curl -LSs "https://raw.githubusercontent.com/KernelSU-Next/KernelSU-Next/next/kernel/setup.sh" | bash -s v1.0.8
```