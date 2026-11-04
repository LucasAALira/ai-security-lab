package io.github.lucasaalira.aisecuritylab;

import android.net.Uri;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebView;

/**
 * O que a página pede ao sistema fora do conteúdo. Hoje é só um: o seletor de arquivos que aparece
 * em "Importar progresso", no Relicário.
 */
final class SiteChrome extends WebChromeClient {
    private final MainActivity activity;

    SiteChrome(MainActivity activity) {
        this.activity = activity;
    }

    @Override
    public boolean onShowFileChooser(WebView view, ValueCallback<Uri[]> callback, FileChooserParams params) {
        return activity.startFileChooser(params.createIntent(), callback);
    }
}
