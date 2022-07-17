import * as _ from 'radash'

// const url = "https://api.cloudinary.com/v1_1/demo/image/upload";
// const form = document.querySelector("form");

import { ChangeEventHandler, useState } from 'react'

export default function SingleImageUpload({
  onChange,
  preview = true
}: {
  onChange?: (file: File) => void
  preview?: boolean
}) {
  const [files, setFiles] = useState<File[]>([])

  const handleChange: ChangeEventHandler<HTMLInputElement> = event => {
    console.log('x--> FILES: ', event.target.files)
    const fileList = event.target.files
    if (!fileList) return
    const files = _.iter(fileList.length, (acc, idx) => [...acc, fileList[idx - 1]], [] as File[])
    setFiles(files)
    onChange?.(files[0])
  }

  return (
    <div>
      <form>
        <input onChange={handleChange} type="file" name="files" />
      </form>
      {preview && (
        <div className="grid grid-cols-2 gap-2 mt-2">
          {files.map((file, idx) => (
            <img key={idx} className="w-auto h-auto" src={window.URL.createObjectURL(file)} />
          ))}
        </div>
      )}
    </div>
  )
}
