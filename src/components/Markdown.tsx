import { marked } from 'marked'

const renderer: Partial<Omit<marked.Renderer<false>, "constructor" | "options">> = {
  heading: (text: string, level: 1 | 2 | 3 | 4 | 5 | 6) => {
    const sizes = {
      1: 'text-5xl',
      2: 'text-4xl',
      3: 'text-3xl',
      4: 'text-2xl',
      5: 'text-1xl',
      6: 'text-1xl'
    }
    return `
      <h${level} class="font-bold ${sizes[level]} mb-6">
        ${text}
      </h${level}>
    `
  },
  // code: (code: string, language: string | undefined, isEscaped: boolean): string => {
  //   throw new Error('Function not implemented.')
  // },
  // blockquote: (quote: string): string => {
  //   throw new Error('Function not implemented.')
  // },
  // html: (html: string): string => {
  //   throw new Error('Function not implemented.')
  // },
  // hr: (): string => {
  //   throw new Error('Function not implemented.')
  // },
  list: (body: string, ordered: boolean, start: number): string => {
    return `
      <${ordered ? 'ol' : 'ul'} class="pl-4 list-disc">
        ${body}
      </${ordered ? 'ol' : 'ul'}>
    `
  },
  // listitem: (text: string, task: boolean, checked: boolean): string => {
  //   throw new Error('Function not implemented.')
  // },
  // checkbox: (checked: boolean): string => {
  //   throw new Error('Function not implemented.')
  // },
  paragraph: (text: string): string => {
    return `
      <p class="text-lg mb-6">${text}</p>
    `
  },
  // table: (header: string, body: string): string => {
  //   throw new Error('Function not implemented.')
  // },
  // tablerow: (content: string): string => {
  //   throw new Error('Function not implemented.')
  // },
  // tablecell: (content: string, flags: { header: boolean; align: 'center' | 'left' | 'right' | null }): string => {
  //   throw new Error('Function not implemented.')
  // },
  strong: (text: string): string => {
    return `
      <strong class="font-bold">${text}</strong>
    `
  },
  // em: (text: string): string => {
  //   throw new Error('Function not implemented.')
  // },
  // codespan: (code: string): string => {
  //   throw new Error('Function not implemented.')
  // },
  // br: (): string => {
  //   throw new Error('Function not implemented.')
  // },
  // del: (text: string): string => {
  //   throw new Error('Function not implemented.')
  // },
  // link: (href: string | null, title: string | null, text: string): string => {
  //   throw new Error('Function not implemented.')
  // },
  // image: (href: string | null, title: string | null, text: string): string => {
  //   throw new Error('Function not implemented.')
  // },
  // text: (text: string): string => {
  //   throw new Error('Function not implemented.')
  // }
}

marked.use({ renderer })

export default function Markdown({ markdown }: { markdown?: string }) {
  if (!markdown) return null
  const html = marked.parse(markdown)
  return <div dangerouslySetInnerHTML={{ __html: html }} />
}
