import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ImagePlus, Trash2 } from 'lucide-react'
import { cn } from '../../lib/utils'

// Drag-drop multi-image uploader with previews. Files are kept in memory as
// object URLs; actual upload wiring arrives with the API in step 6.
export default function ImageUploader({ max = 5, onChange, className }) {
  const [items, setItems] = useState([])
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef(null)
  const itemsRef = useRef(items)
  itemsRef.current = items

  useEffect(
    () => () => itemsRef.current.forEach((it) => URL.revokeObjectURL(it.url)),
    [],
  )

  const addFiles = (fileList) => {
    const next = [...items]
    for (const file of Array.from(fileList)) {
      if (next.length >= max) break
      if (!file.type.startsWith('image/')) continue
      next.push({
        id: `${file.name}-${Date.now()}-${next.length}`,
        name: file.name,
        url: URL.createObjectURL(file),
        file,
      })
    }
    setItems(next)
    onChange?.(next)
  }

  const remove = (id) => {
    const target = items.find((it) => it.id === id)
    if (target) URL.revokeObjectURL(target.url)
    const next = items.filter((it) => it.id !== id)
    setItems(next)
    onChange?.(next)
  }

  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          addFiles(e.dataTransfer.files)
        }}
        className={cn(
          'flex w-full flex-col items-center justify-center gap-3 rounded-2xl border border-dashed px-6 py-10 transition-all duration-300',
          dragging
            ? 'border-red bg-red/5 shadow-glow-soft'
            : 'border-gray-line bg-black/40 hover:border-gray-mid',
        )}
      >
        <ImagePlus className={cn('h-8 w-8', dragging ? 'text-red-light' : 'text-gray-mid')} strokeWidth={1.2} />
        <span className="text-sm text-gray-light">
          Drag photos here, or <span className="text-red-light">browse</span>
        </span>
        <span className="font-mono text-[10px] uppercase tracking-eyebrow text-gray-mid">
          {items.length} / {max} · JPG · PNG · WEBP
        </span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          addFiles(e.target.files)
          e.target.value = ''
        }}
      />

      {items.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-5">
          <AnimatePresence>
            {items.map((it) => (
              <motion.div
                key={it.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group relative aspect-square overflow-hidden border border-gray-line"
              >
                <img src={it.url} alt={it.name} className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => remove(it.id)}
                  aria-label={`Remove ${it.name}`}
                  className="absolute inset-0 flex items-center justify-center bg-black/70 opacity-0 transition-opacity duration-200 focus-visible:opacity-100 group-hover:opacity-100"
                >
                  <Trash2 className="h-4 w-4 text-red-light" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
