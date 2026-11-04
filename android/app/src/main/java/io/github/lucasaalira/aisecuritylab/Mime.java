package io.github.lucasaalira.aisecuritylab;

import java.util.Locale;

/**
 * Tipo de conteúdo pela extensão do arquivo.
 *
 * O WebView decide o que fazer com a resposta pelo tipo declarado, e não pelo conteúdo — o
 * cabeçalho `X-Content-Type-Options: nosniff` em SiteAssets fecha essa porta de propósito. Então a
 * lista precisa cobrir tudo o que o `npm run build` gera: página, módulos, estilo, fontes e as
 * imagens em pixel art.
 */
final class Mime {
    private Mime() {
    }

    static String of(String path) {
        String p = path.toLowerCase(Locale.ROOT);
        if (p.endsWith(".html")) return "text/html";
        if (p.endsWith(".js") || p.endsWith(".mjs")) return "text/javascript";
        if (p.endsWith(".css")) return "text/css";
        if (p.endsWith(".json")) return "application/json";
        if (p.endsWith(".svg")) return "image/svg+xml";
        if (p.endsWith(".png")) return "image/png";
        if (p.endsWith(".jpg") || p.endsWith(".jpeg")) return "image/jpeg";
        if (p.endsWith(".webp")) return "image/webp";
        if (p.endsWith(".avif")) return "image/avif";
        if (p.endsWith(".gif")) return "image/gif";
        if (p.endsWith(".ico")) return "image/x-icon";
        if (p.endsWith(".woff2")) return "font/woff2";
        if (p.endsWith(".woff")) return "font/woff";
        if (p.endsWith(".ttf")) return "font/ttf";
        if (p.endsWith(".wasm")) return "application/wasm";
        if (p.endsWith(".riv")) return "application/octet-stream";
        if (p.endsWith(".txt") || p.endsWith(".md")) return "text/plain";
        return "application/octet-stream";
    }

    /** Tipos em que o WebView precisa saber a codificação; nos binários, declarar uma atrapalha. */
    static boolean textual(String mime) {
        return mime.startsWith("text/") || mime.equals("application/json") || mime.equals("image/svg+xml");
    }
}
