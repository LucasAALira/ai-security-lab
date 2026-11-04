package io.github.lucasaalira.aisecuritylab;

import android.content.pm.PackageManager;
import android.net.Uri;
import android.webkit.JavascriptInterface;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;

/**
 * O que a página pode pedir ao aplicativo, em `window.AslNative` (o lado de lá está em
 * `src/lib/native.ts`). São duas coisas e nada mais: dizer qual é a versão instalada e entregar o
 * arquivo de backup ao compartilhamento do Android.
 *
 * Cuidado que vale lembrar: tudo aqui é chamado pelo JavaScript, numa linha de execução do próprio
 * WebView. Por isso nada toca a tela direto — o compartilhamento é enfileirado na linha principal.
 */
final class SiteBridge {
    /** Nome de arquivo aceito no backup: sem caminho, sem espaço, terminando em .json. */
    private static final String NOME = "[A-Za-z0-9._-]{1,120}";

    private final MainActivity activity;

    SiteBridge(MainActivity activity) {
        this.activity = activity;
    }

    /**
     * A versão instalada, lida do próprio pacote. Antes era uma constante escrita à mão aqui, que
     * envelheceu sem ninguém notar e passou a informar uma versão que não era a do aplicativo.
     */
    @JavascriptInterface
    public String version() {
        try {
            String nome = activity.getPackageManager().getPackageInfo(activity.getPackageName(), 0).versionName;
            return nome == null ? "" : nome;
        } catch (PackageManager.NameNotFoundException impossivel) {
            return "";
        }
    }

    /** Grava o backup no cache e abre o compartilhamento (Drive, Arquivos, e-mail...). */
    @JavascriptInterface
    public boolean shareBackup(String name, String json) {
        if (name == null || json == null || !name.matches(NOME) || !name.endsWith(".json")) return false;
        try {
            File dir = new File(activity.getCacheDir(), BackupProvider.DIR);
            if (!dir.isDirectory() && !dir.mkdirs()) return false;
            File file = new File(dir, name);
            FileOutputStream out = new FileOutputStream(file);
            try {
                out.write(json.getBytes(StandardCharsets.UTF_8));
            } finally {
                out.close();
            }
            Uri uri = Uri.parse("content://" + BackupProvider.AUTHORITY + "/" + name);
            activity.runOnUiThread(new ShareBackup(activity, name, uri));
            return true;
        } catch (IOException falhou) {
            return false;
        }
    }
}
