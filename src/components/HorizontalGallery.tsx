

export default function HorizontalGallery({
  images,
  className = 'h-52'
}: {
  images: string[]
  className?: string
}) {
  return (
    <div
      className="flex flex-row overflow-x-scroll"
    >
      {(images ?? []).map((imageUrl, i) => (
        <img key={imageUrl} className={`rounded ${className} w-auto mr-4`} src={imageUrl} />  
      ))}
    </div>
  )
}