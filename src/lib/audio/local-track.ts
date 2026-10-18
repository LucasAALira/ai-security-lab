export interface LocalTrack { name: string; blob: Blob }
const DB = 'ai-security-lab-music'
/** Separate from progress backups: personal audio never leaves this device. */
export async function trackStorage(action: 'read' | 'write' | 'delete', track?: LocalTrack): Promise<LocalTrack | undefined> {
  const db = await new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB, 1)
    request.onupgradeneeded = () => request.result.createObjectStore('tracks')
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
    request.onblocked = () => reject(new Error('Armazenamento ocupado'))
  })
  try {
    return await new Promise((resolve, reject) => {
      const tx = db.transaction('tracks', action === 'read' ? 'readonly' : 'readwrite')
      const store = tx.objectStore('tracks')
      const request = action === 'read' ? store.get('current') : action === 'write' ? store.put(track, 'current') : store.delete('current')
      tx.oncomplete = () => resolve(action === 'read' ? request.result : undefined)
      tx.onabort = tx.onerror = () => reject(tx.error ?? new Error('Falha no armazenamento'))
    })
  } finally { db.close() }
}

export const MAX_TRACK_BYTES = 150 * 1024 * 1024
export function validateTrack(file: File): string | null {
  if (!file.size) return 'O arquivo está vazio.'
  if (file.size > MAX_TRACK_BYTES) return 'Escolha uma música de até 150 MB.'
  if (!file.type.startsWith('audio/') && !/\.(mp3|m4a|aac|ogg|wav|flac|opus)$/i.test(file.name)) return 'Escolha um arquivo de áudio, como MP3, M4A ou OGG.'
  return null
}

export function checkDecodable(file: File): Promise<void> {
  return new Promise((resolve, reject) => {
    const audio = new Audio()
    const url = URL.createObjectURL(file)
    const finish = (error?: Error) => {
      clearTimeout(timer)
      audio.onloadedmetadata = audio.onerror = null
      audio.removeAttribute('src'); audio.load(); URL.revokeObjectURL(url)
      if (error) reject(error); else resolve()
    }
    const timer = setTimeout(() => finish(new Error('Não foi possível ler o áudio. Tente um arquivo MP3.')), 15000)
    audio.onloadedmetadata = () => finish()
    audio.onerror = () => finish(new Error('Este áudio não é compatível com o dispositivo. Tente MP3.'))
    audio.preload = 'metadata'; audio.src = url
  })
}
