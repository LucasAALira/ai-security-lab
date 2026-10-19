package io.github.lucasaalira.aisecuritylab;

import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.ClipData;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.webkit.JavascriptInterface;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

/**
 * O app inteiro é o site de dist/, empacotado em assets/public e servido de dentro do APK por um
 * endereço https reservado pelo Android para isso (appassets.androidplatform.net). Nada vem da
 * internet: o progresso fica no armazenamento do WebView, só neste aparelho.
 *
 * A ponte com a página (window.AslNative) faz só duas coisas: compartilhar o arquivo de backup e
 * informar a versão. O botão Voltar pergunta à página o que fazer (fechar diálogo, voltar ou sair).
 */
public class MainActivity extends Activity {
    static final String HOST = "appassets.androidplatform.net";
    static final String START = "https://" + HOST + "/index.html";
    static final String VERSION = "2.3.1";
    private static final int FILE_REQUEST = 41;

    // Classes aninhadas são estáticas (sem classes internas nem anônimas): o build sem Gradle usa o
    // d8 direto, e assim o bytecode fica simples para qualquer versão dele.
    WebView web;
    ValueCallback<Uri[]> fileCallback;

    @Override
    protected void onCreate(Bundle saved) {
        super.onCreate(saved);
        web = new WebView(this);
        web.setBackgroundColor(0xFF050505);
        setContentView(web);

        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setDatabaseEnabled(true);
        // Só o conteúdo empacotado: nada de arquivos do aparelho nem conteúdo misto.
        s.setAllowFileAccess(false);
        s.setAllowContentAccess(false);
        s.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        s.setMediaPlaybackRequiresUserGesture(true);
        // Respeita o tamanho de fonte escolhido nas configurações do Android.
        s.setTextZoom(Math.round(getResources().getConfiguration().fontScale * 100));

        web.addJavascriptInterface(new Bridge(this), "AslNative");
        web.setWebViewClient(new LocalClient(this));
        web.setWebChromeClient(new Chrome(this));

        if (saved != null) web.restoreState(saved);
        else web.loadUrl(START);
    }

    /** Serve os arquivos de assets/public; qualquer outro endereço abre fora do app. */
    static final class LocalClient extends WebViewClient {
        final MainActivity a;

        LocalClient(MainActivity a) {
            this.a = a;
        }

        @Override
        public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
            Uri url = request.getUrl();
            if (!HOST.equals(url.getHost())) return null;
            String path = url.getPath();
            if (path == null || path.isEmpty() || "/".equals(path)) path = "/index.html";
            if (path.contains("..")) return notFound();
            try {
                InputStream in = a.getAssets().open("public" + path);
                String mime = mimeOf(path);
                Map<String, String> headers = new HashMap<>();
                headers.put("Cache-Control", "no-cache");
                headers.put("X-Content-Type-Options", "nosniff");
                WebResourceResponse r = new WebResourceResponse(mime, textual(mime) ? "utf-8" : null, in);
                r.setResponseHeaders(headers);
                return r;
            } catch (IOException e) {
                return notFound();
            }
        }

        @Override
        public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
            Uri url = request.getUrl();
            if (HOST.equals(url.getHost())) return false;
            a.openOutside(url);
            return true;
        }
    }

    static final class Chrome extends WebChromeClient {
        final MainActivity a;

        Chrome(MainActivity a) {
            this.a = a;
        }

        /** "Importar progresso": o seletor de arquivos do Android. */
        @Override
        public boolean onShowFileChooser(WebView view, ValueCallback<Uri[]> callback, FileChooserParams params) {
            if (a.fileCallback != null) a.fileCallback.onReceiveValue(null);
            a.fileCallback = callback;
            try {
                a.startActivityForResult(params.createIntent(), FILE_REQUEST);
                return true;
            } catch (ActivityNotFoundException e) {
                a.fileCallback = null;
                return false;
            }
        }
    }

    /** O que a página pode pedir ao app. */
    static final class Bridge {
        final MainActivity a;

        Bridge(MainActivity a) {
            this.a = a;
        }

        @JavascriptInterface
        public String version() {
            return VERSION;
        }

        /** Grava o backup no cache do app e abre o compartilhamento (Drive, Arquivos, e-mail...). */
        @JavascriptInterface
        public boolean shareBackup(String name, String json) {
            if (name == null || json == null || !name.matches("[A-Za-z0-9._-]{1,120}") || !name.endsWith(".json")) return false;
            try {
                File dir = new File(a.getCacheDir(), BackupProvider.DIR);
                if (!dir.isDirectory() && !dir.mkdirs()) return false;
                File file = new File(dir, name);
                try (FileOutputStream out = new FileOutputStream(file)) {
                    out.write(json.getBytes(StandardCharsets.UTF_8));
                }
                Uri uri = Uri.parse("content://" + BackupProvider.AUTHORITY + "/" + name);
                a.runOnUiThread(new ShareTask(a, name, uri));
                return true;
            } catch (IOException e) {
                return false;
            }
        }
    }

    /** Botão Voltar: a página fecha um diálogo aberto ou volta uma página; na página inicial, sai do app. */
    @Override
    public void onBackPressed() {
        if (web == null) {
            super.onBackPressed();
            return;
        }
        @SuppressWarnings("unchecked")
        ValueCallback<String> answer = new BackResult(this);
        web.evaluateJavascript("(window.__aslBack ? window.__aslBack() : 'exit')", answer);
    }

    void leave() {
        super.onBackPressed();
    }

    /** Resposta da página ao botão Voltar. Tipo cru de propósito: evita o método-ponte genérico. */
    @SuppressWarnings({"rawtypes", "unchecked"})
    static final class BackResult implements ValueCallback {
        final MainActivity a;

        BackResult(MainActivity a) {
            this.a = a;
        }

        @Override
        public void onReceiveValue(Object value) {
            if ("\"exit\"".equals(value)) a.leave();
        }
    }

    /** Abre o compartilhamento do Android com o arquivo de backup. */
    static final class ShareTask implements Runnable {
        final MainActivity a;
        final String name;
        final Uri uri;

        ShareTask(MainActivity a, String name, Uri uri) {
            this.a = a;
            this.name = name;
            this.uri = uri;
        }

        @Override
        public void run() {
            Intent send = new Intent(Intent.ACTION_SEND);
            send.setType("application/json");
            send.putExtra(Intent.EXTRA_STREAM, uri);
            send.putExtra(Intent.EXTRA_SUBJECT, "Backup do AI Security Lab");
            send.setClipData(ClipData.newRawUri(name, uri));
            send.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
            Intent chooser = Intent.createChooser(send, a.getString(R.string.share_backup));
            chooser.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
            a.startActivity(chooser);
        }
    }

    @Override
    protected void onActivityResult(int request, int result, Intent data) {
        if (request == FILE_REQUEST && fileCallback != null) {
            fileCallback.onReceiveValue(WebChromeClient.FileChooserParams.parseResult(result, data));
            fileCallback = null;
            return;
        }
        super.onActivityResult(request, result, data);
    }

    @Override
    protected void onSaveInstanceState(Bundle out) {
        super.onSaveInstanceState(out);
        if (web != null) web.saveState(out);
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (web != null) web.onResume();
    }

    @Override
    protected void onPause() {
        if (web != null) web.onPause();
        super.onPause();
    }

    @Override
    protected void onDestroy() {
        if (web != null) {
            web.destroy();
            web = null;
        }
        super.onDestroy();
    }

    void openOutside(Uri url) {
        String scheme = url.getScheme() == null ? "" : url.getScheme().toLowerCase(Locale.ROOT);
        if (!scheme.equals("https") && !scheme.equals("http") && !scheme.equals("mailto")) return;
        try {
            startActivity(new Intent(Intent.ACTION_VIEW, url));
        } catch (ActivityNotFoundException e) {
            Toast.makeText(this, R.string.no_browser, Toast.LENGTH_SHORT).show();
        }
    }

    private static WebResourceResponse notFound() {
        WebResourceResponse r = new WebResourceResponse("text/plain", "utf-8", new ByteArrayInputStream(new byte[0]));
        r.setStatusCodeAndReasonPhrase(404, "Not Found");
        return r;
    }

    private static boolean textual(String mime) {
        return mime.startsWith("text/") || mime.equals("application/json") || mime.equals("image/svg+xml");
    }

    static String mimeOf(String path) {
        String p = path.toLowerCase(Locale.ROOT);
        if (p.endsWith(".html")) return "text/html";
        if (p.endsWith(".js") || p.endsWith(".mjs")) return "text/javascript";
        if (p.endsWith(".css")) return "text/css";
        if (p.endsWith(".json")) return "application/json";
        if (p.endsWith(".svg")) return "image/svg+xml";
        if (p.endsWith(".png")) return "image/png";
        if (p.endsWith(".jpg") || p.endsWith(".jpeg")) return "image/jpeg";
        if (p.endsWith(".webp")) return "image/webp";
        if (p.endsWith(".gif")) return "image/gif";
        if (p.endsWith(".ico")) return "image/x-icon";
        if (p.endsWith(".woff2")) return "font/woff2";
        if (p.endsWith(".woff")) return "font/woff";
        if (p.endsWith(".wasm")) return "application/wasm";
        if (p.endsWith(".txt") || p.endsWith(".md")) return "text/plain";
        return "application/octet-stream";
    }
}
