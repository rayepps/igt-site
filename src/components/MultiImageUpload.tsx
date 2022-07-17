import * as _ from 'radash'
import * as t from 'src/types'

import { ChangeEventHandler, useState } from 'react'
import { HiX } from 'react-icons/hi'
import imagekit from 'src/imagekit'
import { v4 as uuid } from 'uuid'

type FileAsset = {
  file: File | null
  loading: boolean
  url: string | null
  id: string
  pending: boolean
}

export default function MultiImageUpload({
  onChange,
  initial = [],
  preview = true,
  columns = 2
}: {
  onChange?: (files: t.Asset[]) => void
  initial?: t.Asset[]
  preview?: boolean
  columns?: 1 | 2 | 3 | 4
}) {
  const [assets, setAssets] = useState<Record<string, FileAsset>>(
    _.objectify(
      initial.map(init => ({
        id: init.id,
        url: init.url,
        file: null,
        loading: false,
        pending: false
      })),
      x => x.id
    )
  )

  const handleChange: ChangeEventHandler<HTMLInputElement> = async event => {
    const fileList = event.target.files
    if (!fileList) return
    const files = _.iter(fileList.length, (acc, idx) => [...acc, fileList[idx - 1]], [] as File[])
    let latestAssets: Record<string, FileAsset> = { ...assets, ..._.objectify(
      files.map(file => ({
        id: uuid(),
        loading: true,
        url: null,
        file,
        pending: true
      })),
      na => na.id
    ) }
    setAssets(latestAssets)
    for (const newAsset of Object.values(latestAssets)) {
      const [result] = await imagekit.upload([newAsset.file!])
      latestAssets = _.shake({
        ...latestAssets,
        [newAsset.id]: undefined as any,
        [result.id]: {
          id: result.id,
          url: result.url,
          file: newAsset.file,
          loading: false
        }
      })
      setAssets(latestAssets)
    }
    onChange?.(
      Object.values(latestAssets).map(fa => ({
        id: fa.id,
        url: fa.url ?? ''
      }))
    )
  }

  const removeAsset = (asset: FileAsset) => () => {
    const newAssets: Record<string, FileAsset> = _.shake({
      ...assets,
      [asset.id]: undefined as any
    })
    setAssets(newAssets)
    onChange?.(
      Object.values(newAssets).map(fa => ({
        id: fa.id,
        url: fa.url ?? ''
      }))
    )
  }

  return (
    <div>
      <form>
        {/* <input onChange={handleChange} accept="image/*" type="file" name="files[]" multiple /> */}
        <label className="custom-file-input" htmlFor="multiupload" /> 
        <input onChange={handleChange} id="multiupload" type="file" multiple name="files[]" accept="image/*" className="invisible" />
      </form>
      {preview && (
        <div className={`grid grid-cols-${columns} gap-2 mt-2`}>
          {Object.values(assets).map((asset, idx) => (
            <div key={asset.id} className="relative bg-slate-200">
              {!asset.loading && <img key={idx} className="w-full h-28 object-contain object-center" src={asset.url ?? ''} />}
              {asset.loading && <span>loading...</span>}
              <div className="absolute bg-black-opaque p-1 top-0 right-0 inline-block hover:bg-black hover:cursor-pointer" onClick={removeAsset(asset)}>
                <HiX className="text-slate-200" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
