import * as t from "./types"

const URL = 'https://api.cloudinary.com/v1_1/demo/image/upload'

type Image = {
  url: string
  asset_id: string
}

export const upload = async (files: File[]): Promise<t.Asset[]> => {
  const formData = new FormData()
  const assets: t.Asset[] = []
  for (const file of files) {
    formData.append('file', file)
    formData.append('upload_preset', 'docs_upload_example_us_preset')
    const response = await fetch(URL, {
      method: 'POST',
      body: formData
    })
    const image = await response.json() as Image
    assets.push({
      url: image.url,
      id: image.asset_id
    })
  }
  return assets
}

export default {
  upload
}

