package io.github.lucasaalira.aisecuritylab;

import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.widget.Toast;

import java.util.Locale;

/**
 * A tela do aplicativo: um WebView ocupando tudo, com o site de `dist/` servido de dentro do pacote
 * (veja SiteAssets). Não há internet envolvida — o progresso fica no armazenamento do WebView,
 * neste aparelho, e sai daqui só pelo backup que a própria pessoa compartilha.
 *
 * A classe cuida do que é do aplicativo: criar e configurar o WebView, o ciclo de vida, o botão
 * Voltar, abrir links externos e o seletor de arquivos da importação. O que é do site fica no
 * próprio site.
 */
public class MainActivity extends Activity {
    /** Código do pedido do seletor de arquivos ("Importar progresso"). */
    private static final int FILE_REQUEST = 41;

    private WebView web;
    private ValueCallback<Uri[]> fileCallback;

    @Override
    protected void onCreate(Bundle saved) {
        super.onCreate(saved);
        web = new WebView(this);
        // O mesmo carvão do tema e da tela de abertura: sem clarão branco antes do primeiro quadro.
        web.setBackgroundColor(0xFF0A0E0F);
        setContentView(web);
        configure(web);

        if (saved != null) web.restoreState(saved);
        else web.loadUrl(SiteAssets.START);
    }

    private void configure(WebView view) {
        WebSettings settings = view.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        // Só o que está no pacote: nada de arquivos do aparelho nem de conteúdo misto.
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        // Som e música só começam depois de um toque, como no navegador.
        settings.setMediaPlaybackRequiresUserGesture(true);
        // Respeita o tamanho de fonte escolhido nas configurações do Android.
        settings.setTextZoom(Math.round(getResources().getConfiguration().fontScale * 100));

        view.addJavascriptInterface(new SiteBridge(this), "AslNative");
        view.setWebViewClient(new SiteAssets(this));
        view.setWebChromeClient(new SiteChrome(this));
    }

    /**
     * Botão Voltar: quem decide é a página — ela fecha um diálogo aberto ou volta uma página. Só
     * quando não há o que fechar (`exit`) o aplicativo sai.
     */
    @Override
    @SuppressWarnings("unchecked")  // BackHandler é um ValueCallback cru; veja o porquê lá.
    public void onBackPressed() {
        if (web == null) {
            super.onBackPressed();
            return;
        }
        web.evaluateJavascript("(window.__aslBack ? window.__aslBack() : 'exit')", new BackHandler(this));
    }

    /** Sai de verdade. Chamado pelo BackHandler quando a página não tinha o que fechar. */
    void leave() {
        super.onBackPressed();
    }

    /** Abre um endereço de fora no navegador do aparelho; esquemas estranhos são ignorados. */
    void openOutside(Uri url) {
        String scheme = url.getScheme() == null ? "" : url.getScheme().toLowerCase(Locale.ROOT);
        if (!scheme.equals("https") && !scheme.equals("http") && !scheme.equals("mailto")) return;
        try {
            startActivity(new Intent(Intent.ACTION_VIEW, url));
        } catch (ActivityNotFoundException semNavegador) {
            Toast.makeText(this, R.string.no_browser, Toast.LENGTH_SHORT).show();
        }
    }

    /** Guarda o retorno do seletor de arquivos até o Android responder. */
    boolean startFileChooser(Intent intent, ValueCallback<Uri[]> callback) {
        if (fileCallback != null) fileCallback.onReceiveValue(null);
        fileCallback = callback;
        try {
            startActivityForResult(intent, FILE_REQUEST);
            return true;
        } catch (ActivityNotFoundException semSeletor) {
            fileCallback = null;
            return false;
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
}
