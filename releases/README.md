# Pacote Android

O aplicativo é o mesmo site, empacotado: todo o conteúdo vai dentro do APK e funciona sem internet. O progresso fica no aparelho; para levá-lo a outro, use *Exportar progresso* no Relicário.

## Versão atual

A **2.7.0** (versionCode 9) é gerada pelo fluxo **APK** em *Actions*: abra o fluxo, clique em
*Run workflow* e baixe o arquivo em *Artifacts* ao terminar. O resumo da execução mostra o tamanho
e o SHA-256 para conferir o download:

```sh
sha256sum ai-security-lab-2.7.0.apk
```

O pacote anterior continua aqui:

| Arquivo | Versão | versionCode | Tamanho | SHA-256 |
| --- | --- | --- | --- | --- |
| [`ai-security-lab-2.6.0.apk`](./ai-security-lab-2.6.0.apk) | 2.6.0 | 8 | 2.6M | `3df4fbdec4e1f447b337af9ac350549afd6d1a3533827cf63937e9aa9ca4a2d2` |

### Antes de instalar a 2.7.0

A chave que assinou a 2.6.0 não está guardada em lugar nenhum, e o Android só aceita atualizar um
aplicativo quando a assinatura é a mesma. Então, nesta troca: **exporte o progresso** em *Relicário
› backup*, desinstale o aplicativo atual, instale a 2.7.0 e importe o backup.

Para que as próximas versões instalem por cima, guarde uma chave fixa nos segredos do repositório
(*Settings › Secrets and variables › Actions*): `ANDROID_KEYSTORE_BASE64` (o arquivo em base64, de
`base64 -w0 minha.keystore`) e `ANDROID_KEYSTORE_PASSWORD`. O fluxo passa a usá-la e avisa no resumo
qual das duas situações ocorreu. Uma chave serve para sempre: guarde o arquivo fora do repositório.

## Como instalar

1. Baixe o arquivo no próprio aparelho (ou envie por cabo).
2. Abra o arquivo. Na primeira vez, o Android pede para permitir a instalação de fontes desconhecidas para o aplicativo que está abrindo o APK (navegador ou gerenciador de arquivos).
3. Android 7.0 ou mais novo (minSdk 24). Nenhuma permissão é usada além do acesso à internet, que só serve para abrir os links externos de referência.

**Este é um pacote de depuração, assinado com uma chave de teste.** Ele não vem de loja, não recebe atualização automática e não deve ser distribuído como versão oficial. Para atualizar, baixe o APK novo e instale por cima: o progresso é preservado enquanto a assinatura for a mesma.

## O que muda em cada versão

| Versão | O que entrou |
| --- | --- |
| 2.7.0 | Visual Cursemark em pixel art no site inteiro, com os chefes em sprite; menu de cinco entradas com submenus; chefe e módulo em páginas próprias; abertura com tutorial do módulo 01 e escolha entre três trilhas. |
| 2.6.0 | Nove amostras de análise de segredos baseadas em casos documentados (23 no total). |
| 2.5.0 | Treino de análise de código (Escrutínio): 14 amostras de triagem com falsos positivos e o quiz de o que fazer em seguida. |
| 2.4.0 | Quinze casos reais brasileiros nos dossiês. |
| 2.3.x | Ilustrações nas áreas, analogias nos módulos e exercícios de arquitetura. |

## Como gerar outra vez

```sh
npm run build && sh scripts/build-apk.sh
```

O script monta o APK sem Gradle, com as ferramentas do SDK apontadas por variáveis de ambiente (`ANDROID_JAR`, `AAPT2`, `ZIPALIGN`, `D8_JAR`, `APKSIGNER_JAR` e `KEYSTORE`); o cabeçalho do script explica cada uma. Com o Android Studio, o projeto em `android/` também abre normalmente (`./gradlew assembleDebug`).
