import * as t from 'src/types'

export default function GridGallery({
  current,
  images,
  className = '',
  onImageClick
}: {
  current: t.Asset
  images: t.Asset[]
  className?: string
  onImageClick?: (image: t.Asset) => void
}) {
  return (
    <div className={className}>
      <img src={current?.url} className="w-full h-96 object-contain mb-2" />
      <div className="grid grid-cols-4 gap-2">
        {images.map(image => (
          <img
            key={image.id}
            className="h-40 w-full object-cover hover:cursor-pointer"
            onClick={() => onImageClick?.(image)}
            src={image.url}
          />
        ))}
      </div>
    </div>
  )
}
