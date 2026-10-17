import { Capacitor } from '@capacitor/core'

/** Native WebViews cannot reliably download blob URLs; share a private cache file instead. */
export async function exportFile(name: string, content: string): Promise<'shared' | 'downloaded'> {
  if (Capacitor.isNativePlatform()) {
    const [{ Filesystem, Directory, Encoding }, { Share }] = await Promise.all([
      import('@capacitor/filesystem'), import('@capacitor/share'),
    ])
    const { uri } = await Filesystem.writeFile({
      path: `backups/${name}`, data: content, directory: Directory.Cache,
      encoding: Encoding.UTF8, recursive: true,
    })
    await Share.share({ title: 'Backup AI Security Lab', files: [uri], dialogTitle: 'Salvar ou compartilhar progresso' })
    return 'shared'
  }
  const url = URL.createObjectURL(new Blob([content], { type: 'application/json' }))
  const a = document.createElement('a')
  a.href = url
  a.download = name
  document.body.append(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
  return 'downloaded'
}
