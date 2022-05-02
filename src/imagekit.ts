import * as t from 'src/types'
import api from 'src/api'

// Docs: https://docs.imagekit.io/api-reference/upload-file-api/client-side-file-upload
const URL = 'https://upload.imagekit.io/api/v1/files/upload'

type Image = {
  url: string
  fileId: string
}

export const upload = async (files: File[]): Promise<t.Asset[]> => {
  const assets: t.Asset[] = []
  for (const file of files) {
    const { data } = await api.assets.authenticate({})
    console.log(file)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('publicKey', 'public_MYU1V7Cu++7LE7t+IzBJzXip0s0=')
    formData.append('signature', data.signature)
    formData.append('expire', `${data.expire}`)
    formData.append('token', data.token)
    formData.append('fileName', file.name)
    const response = await fetch(URL, {
      method: 'POST',
      body: formData
    })
    const image = (await response.json()) as Image
    assets.push({
      url: image.url,
      id: image.fileId
    })
  }
  return assets
}

export default {
  upload
}
