package io.github.lucasaalira.aisecuritylab;

import android.content.res.AssetManager;
import android.net.Uri;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

/**
 * Serve o site empacotado em `assets/public` por um endereço https.
 *
 * O domínio é o que o Android reserva para conteúdo local (`appassets.androidplatform.net`), e não
 * `file://`: assim a página roda numa origem https de verdade, com `localStorage`, `fetch` e os
 * módulos do JavaScript funcionando como no navegador — que é onde o progresso de quem estuda fica
 * guardado. Nenhum pedido sai do aparelho: o que não estiver no pacote devolve 404, e qualquer
 * endereço de outro domínio abre no navegador, fora do aplicativo.
 */
final class SiteAssets extends WebViewClient {
    static final String HOST = "appassets.androidplatform.net";
    static final String START = "https://" + HOST + "/index.html";

    /** Pasta dentro do APK onde o `npm run build` foi copiado. */
    private static final String ROOT = "public";

    private final MainActivity activity;

    SiteAssets(MainActivity activity) {
        this.activity = activity;
    }

    @Override
    public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
        Uri url = request.getUrl();
        if (!HOST.equals(url.getHost())) return null;

        String path = url.getPath();
        if (path == null || path.isEmpty() || "/".equals(path)) path = "/index.html";
        // O endereço vem da própria página, mas um ".." mal-intencionado sairia da pasta do pacote.
        if (path.contains("..")) return notFound();

        AssetManager assets = activity.getAssets();
        try {
            InputStream in = assets.open(ROOT + path);
            String mime = Mime.of(path);
            WebResourceResponse answer = new WebResourceResponse(mime, Mime.textual(mime) ? "utf-8" : null, in);
            answer.setResponseHeaders(headersFor(path));
            return answer;
        } catch (IOException missing) {
            return notFound();
        }
    }

    @Override
    public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
        Uri url = request.getUrl();
        if (HOST.equals(url.getHost())) return false;
        activity.openOutside(url);
        return true;
    }

    /**
     * O Vite assina no nome os arquivos de `/assets/` (`index-a1b2c3d4.js`): o nome muda quando o
     * conteúdo muda, então eles podem ficar no cache para sempre e a abertura do aplicativo não
     * espera por eles de novo. O resto — a começar pelo `index.html` — é sempre relido, para uma
     * versão nova aparecer assim que o pacote é atualizado.
     */
    private static Map<String, String> headersFor(String path) {
        Map<String, String> headers = new HashMap<>();
        headers.put("Cache-Control", path.startsWith("/assets/") ? "public, max-age=31536000, immutable" : "no-cache");
        headers.put("X-Content-Type-Options", "nosniff");
        return headers;
    }

    private static WebResourceResponse notFound() {
        WebResourceResponse answer = new WebResourceResponse("text/plain", "utf-8", new ByteArrayInputStream(new byte[0]));
        answer.setStatusCodeAndReasonPhrase(404, "Not Found");
        return answer;
    }
}
