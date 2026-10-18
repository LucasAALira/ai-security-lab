package io.github.lucasaalira.aisecuritylab;

import android.content.ContentProvider;
import android.content.ContentValues;
import android.database.Cursor;
import android.database.MatrixCursor;
import android.net.Uri;
import android.os.ParcelFileDescriptor;
import android.provider.OpenableColumns;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;

/**
 * Entrega, só para leitura, os arquivos de backup gravados em cache/backups ao app escolhido no
 * compartilhamento. Não é exportado: o acesso vem da permissão temporária dada no próprio envio.
 */
public class BackupProvider extends ContentProvider {
    static final String AUTHORITY = "io.github.lucasaalira.aisecuritylab.backups";
    static final String DIR = "backups";

    @Override
    public boolean onCreate() {
        return true;
    }

    private File fileFor(Uri uri) throws FileNotFoundException {
        String name = uri.getLastPathSegment();
        if (name == null || !name.matches("[A-Za-z0-9._-]{1,120}")) throw new FileNotFoundException();
        File dir = new File(getContext().getCacheDir(), DIR);
        File file = new File(dir, name);
        try {
            if (!file.getCanonicalPath().startsWith(dir.getCanonicalPath() + File.separator)) throw new FileNotFoundException();
        } catch (IOException e) {
            throw new FileNotFoundException();
        }
        if (!file.isFile()) throw new FileNotFoundException();
        return file;
    }

    @Override
    public ParcelFileDescriptor openFile(Uri uri, String mode) throws FileNotFoundException {
        if (!"r".equals(mode)) throw new SecurityException("Somente leitura");
        return ParcelFileDescriptor.open(fileFor(uri), ParcelFileDescriptor.MODE_READ_ONLY);
    }

    @Override
    public Cursor query(Uri uri, String[] projection, String selection, String[] args, String sort) {
        File file;
        try {
            file = fileFor(uri);
        } catch (FileNotFoundException e) {
            return null;
        }
        MatrixCursor c = new MatrixCursor(new String[] {OpenableColumns.DISPLAY_NAME, OpenableColumns.SIZE});
        c.addRow(new Object[] {file.getName(), file.length()});
        return c;
    }

    @Override
    public String getType(Uri uri) {
        return "application/json";
    }

    @Override
    public Uri insert(Uri uri, ContentValues values) {
        return null;
    }

    @Override
    public int delete(Uri uri, String selection, String[] args) {
        return 0;
    }

    @Override
    public int update(Uri uri, ContentValues values, String selection, String[] args) {
        return 0;
    }
}
