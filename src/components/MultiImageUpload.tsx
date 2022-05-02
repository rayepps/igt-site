import _ from 'radash'

// const url = "https://api.cloudinary.com/v1_1/demo/image/upload";
// const form = document.querySelector("form");

import { ChangeEventHandler, useState } from "react"

// form.addEventListener("submit", (e) => {
//   e.preventDefault();

//   const files = document.querySelector("[type=file]").files;
//   const formData = new FormData();

//   for (let i = 0; i < files.length; i++) {
//     let file = files[i];
//     formData.append("file", file);
//     formData.append("upload_preset", "docs_upload_example_us_preset");

//     fetch(url, {
//       method: "POST",
//       body: formData
//     })
//       .then((response) => {
//         return response.text();
//       })
//       .then((data) => {
//         document.getElementById("data").innerHTML += data;
//       });
//   }
// });

export default function MultiImageUpload({
  onChange
}: {
  onChange?: (files: File[]) => void
}) {

  const [files, setFiles] = useState<File[]>([])

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const fileList =  event.target.files
    if (!fileList) return
    const files = _.iter(fileList.length, (acc, idx) => ([ ...acc, fileList[idx-1]]), [] as File[])
    setFiles(files)
    onChange?.(files)
  }

  return (
    <div>
      <form>
        <input onChange={handleChange} type="file" name="files[]" multiple />
      </form>
      <div className="grid grid-cols-2 gap-2 mt-2">
        {files.map((file, idx) => (
          <img key={idx} className="w-auto h-auto" src={window.URL.createObjectURL(file)} />
        ))}
      </div>
    </div>
  )
}
