package io.github.lucasaalira.aisecuritylab;

import android.webkit.ValueCallback;

/**
 * Resposta da página ao botão Voltar.
 *
 * A página sabe se há um diálogo aberto ou uma página anterior na trilha, então ela é quem decide:
 * devolve "handled" quando tratou, "exit" quando não havia o que fechar. Só nesse caso o aplicativo
 * sai. O tipo é cru de propósito — com `ValueCallback<String>` o javac gera um método-ponte, e o
 * build sem Gradle fica mais simples sem ele.
 */
@SuppressWarnings({"rawtypes", "unchecked"})
final class BackHandler implements ValueCallback {
    private final MainActivity activity;

    BackHandler(MainActivity activity) {
        this.activity = activity;
    }

    @Override
    public void onReceiveValue(Object value) {
        // evaluateJavascript devolve JSON: a string "exit" chega entre aspas.
        if ("\"exit\"".equals(value)) activity.leave();
    }
}
