# Pacote Android

O aplicativo é o mesmo site, empacotado: todo o conteúdo vai dentro do APK e funciona sem internet. O progresso fica no aparelho; para levá-lo a outro, use *Exportar progresso* no Relicário.

## Versão atual

| Arquivo | Versão | versionCode | Tamanho | SHA-256 |
| --- | --- | --- | --- | --- |
| [`ai-security-lab-2.5.0.apk`](./ai-security-lab-2.5.0.apk) | 2.5.0 | 7 | 2.5M | `27f07af6a3c111ef918dfaca660dd8559a69de698ff494439ec6b73017f7ed4d` |

Confira o arquivo baixado antes de instalar:

```sh
sha256sum ai-security-lab-2.5.0.apk
```

## Como instalar

1. Baixe o arquivo no próprio aparelho (ou envie por cabo).
2. Abra o arquivo. Na primeira vez, o Android pede para permitir a instalação de fontes desconhecidas para o aplicativo que está abrindo o APK (navegador ou gerenciador de arquivos).
3. Android 7.0 ou mais novo (minSdk 24). Nenhuma permissão é usada além do acesso à internet, que só serve para abrir os links externos de referência.

**Este é um pacote de depuração, assinado com uma chave de teste.** Ele não vem de loja, não recebe atualização automática e não deve ser distribuído como versão oficial. Para atualizar, baixe o APK novo e instale por cima: o progresso é preservado enquanto a assinatura for a mesma.

## O que muda em cada versão

| Versão | O que entrou |
| --- | --- |
| 2.5.0 | Treino de análise de código (Escrutínio): 14 amostras de triagem com falsos positivos e o quiz de o que fazer em seguida. |
| 2.4.0 | Quinze casos reais brasileiros nos dossiês. |
| 2.3.x | Ilustrações nas áreas, analogias nos módulos e exercícios de arquitetura. |

## Como gerar outra vez

```sh
npm run build && sh scripts/build-apk.sh
```

O script monta o APK sem Gradle, com as ferramentas do SDK apontadas por variáveis de ambiente (`ANDROID_JAR`, `AAPT2`, `ZIPALIGN`, `D8_JAR`, `APKSIGNER_JAR` e `KEYSTORE`); o cabeçalho do script explica cada uma. Com o Android Studio, o projeto em `android/` também abre normalmente (`./gradlew assembleDebug`).
