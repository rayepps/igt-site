import { useState } from "react";
import { HiOutlineLink } from "react-icons/hi";


export default function CopyToClipboard({ 
  content,
  name
}: { 
  content: string 
  name: string
}) {

  const [copyText, setCopyText] = useState(`copy ${name}`)

  const copyLinkToClipboard = () => {
    setCopyText('copied!')
    navigator.clipboard.writeText(content)
    setTimeout(() => setCopyText(`copy ${name}`), 2000)
  }

  return (
    <button
      onClick={copyLinkToClipboard}
      className="flex items-center mr-2 p-2 group bg-slate-200 rounded active:bg-black"
    >
      <span className="inline-block whitespace-nowrap overflow-hidden max-w-0 group-hover:max-w-2xl transition-[max-width] duration-200 group-active:text-white">
        {copyText}
      </span>
      <HiOutlineLink size={21} className="text-black inline group-active:text-white" />
    </button>
  )
}
