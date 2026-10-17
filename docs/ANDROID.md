# Android — AI Security Lab

O aplicativo empacota o mesmo conteúdo da branch Dev com Capacitor 8. Aulas, desafios, campanhas, moedas, loja e sala de troféus ficam disponíveis offline. Links de referências e notícias abrem conteúdo externo e precisam de internet. O aplicativo não executa ataques nem acessa ambientes reais.

## Baixar o APK de teste

No GitHub, abra **Actions → Android APK → execução concluída → Artifacts → ai-security-lab-android-debug**. Extraia o ZIP e abra `app-debug.apk` no Android. Autorize a instalação para o aplicativo que abriu o arquivo, se solicitado pelo Android.

O workflow roda em PRs para Dev/main, após pushes nessas branches e manualmente quando o workflow estiver na branch padrão. Os artefatos ficam disponíveis por 30 dias e exigem login no GitHub.

## Compilar localmente

Requisitos: Node 22.12+, Java 21, Android SDK 36 e Build Tools 36.0.0. Configure `JAVA_HOME` e `ANDROID_HOME` (ou `android/local.properties`, que não é versionado).

```sh
npm ci
npm run android:apk
```

Saída: `android/app/build/outputs/apk/debug/app-debug.apk`.
No Windows, execute `npm run android:sync`, entre em `android` e rode `gradlew.bat assembleDebug`. Para abrir no Android Studio: `npm run android:open`.

## Progresso e atualizações

O armazenamento do aplicativo é separado do navegador. Exporte o JSON no site e importe pelo cartão **Backup do progresso** no app. No Android, exportar abre o compartilhamento nativo: escolha um destino e confira se o arquivo foi salvo. A importação substitui o progresso somente após confirmação. Não existe sincronização automática.

Este APK é uma build **debug para testes**, não uma publicação na Play Store. Cada máquina/runner pode usar uma chave debug diferente; uma atualização com outra assinatura exige desinstalar a versão anterior. **Exporte seu progresso antes de desinstalar**, pois os dados locais serão removidos. Para distribuição estável, use uma chave release própria, mantida fora do repositório, e aumente `versionCode` a cada lançamento. Não distribua o APK release sem assinatura.

## Verificação no aparelho

Antes de lançar, teste abertura offline; navegação e botão Voltar; concluir lição e persistir XP após reiniciar; comprar item e trocar tema; exportar/importar JSON; seleção de arquivos; teclado; rotação e recortes de tela. O build automatizado não substitui essa verificação em um dispositivo real.
