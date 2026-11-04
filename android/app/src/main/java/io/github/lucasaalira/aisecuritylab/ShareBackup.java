package io.github.lucasaalira.aisecuritylab;

import android.app.Activity;
import android.content.ClipData;
import android.content.Intent;
import android.net.Uri;

/**
 * Abre o compartilhamento do Android com o arquivo de backup, na linha principal.
 *
 * É uma classe de verdade, e não uma classe anônima, porque o aplicativo também é montado sem
 * Gradle (javac + d8): quanto menos açúcar no bytecode, menos depende da versão da ferramenta.
 */
final class ShareBackup implements Runnable {
    private final Activity activity;
    private final String name;
    private final Uri uri;

    ShareBackup(Activity activity, String name, Uri uri) {
        this.activity = activity;
        this.name = name;
        this.uri = uri;
    }

    @Override
    public void run() {
        Intent send = new Intent(Intent.ACTION_SEND);
        send.setType("application/json");
        send.putExtra(Intent.EXTRA_STREAM, uri);
        send.putExtra(Intent.EXTRA_SUBJECT, activity.getString(R.string.backup_subject));
        // O ClipData leva o nome do arquivo e é por onde a permissão temporária acompanha o envio.
        send.setClipData(ClipData.newRawUri(name, uri));
        send.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
        Intent chooser = Intent.createChooser(send, activity.getString(R.string.share_backup));
        chooser.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
        activity.startActivity(chooser);
    }
}
