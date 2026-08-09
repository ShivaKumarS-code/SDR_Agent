import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface MarkdownRendererProps {
  content: string
}

function preprocessMarkdown(raw: string): string {
  if (!raw) return ''

  let text = raw

  // Convert literal backslash-n sequences if stringified
  if (text.includes('\\n')) {
    text = text.replace(/\\n/g, '\n')
  }

  // Normalize LLM heading bold wrapping: `**# Heading**` -> `# Heading`
  text = text.replace(/^\s*\*\*\s*(#+\s+.*?)\s*\*\*/gm, '$1')

  // Normalize `**# Heading` without trailing asterisks -> `# Heading`
  text = text.replace(/^\s*\*\*\s*(#+\s+.*)/gm, '$1')

  // Ensure empty lines before headers (# Heading) so markdown block parser activates
  text = text.replace(/([^\n])\n(#+\s+)/g, '$1\n\n$2')

  // Ensure empty lines before table headers (| col1 | col2 |) so GFM table parser activates
  text = text.replace(/([^\n])\n(\|[^\n]+\|\n\|[-:\s|]+\|)/g, '$1\n\n$2')

  return text
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const processedContent = preprocessMarkdown(content)

  return (
    <div className="markdown-body text-sm text-[#ccc] leading-relaxed space-y-4">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-xl font-extrabold text-white mt-6 mb-3 border-b border-[#262626] pb-2 tracking-tight">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg font-bold text-white mt-5 mb-2.5 border-b border-[#1c1c1c] pb-1.5 tracking-tight">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base font-bold text-white mt-4 mb-2">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-sm font-bold text-white mt-3 mb-1.5">
              {children}
            </h4>
          ),
          p: ({ children }) => (
            <p className="mb-3 text-[#ccc] leading-relaxed">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-outside space-y-1.5 mb-4 ml-5 text-[#ccc]">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-outside space-y-1.5 mb-4 ml-5 text-[#ccc]">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-[#ccc] pl-1 leading-relaxed">
              {children}
            </li>
          ),
          strong: ({ children }) => (
            <strong className="font-bold text-white">
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="italic text-[#ddd]">
              {children}
            </em>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-violet-500/60 pl-4 py-1.5 my-3 text-[#aaa] italic bg-white/[0.02] rounded-r-lg">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-5 rounded-xl border border-[#262626] shadow-lg">
              <table className="w-full border-collapse text-left text-xs">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-[#141414] text-white font-bold border-b border-[#262626]">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-[#1c1c1c]">
              {children}
            </tbody>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-white/[0.03] transition-colors">
              {children}
            </tr>
          ),
          th: ({ children }) => (
            <th className="px-4 py-3 font-bold text-white uppercase tracking-wider text-[11px] text-[#aaa]">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-3 text-[#ccc] leading-relaxed">
              {children}
            </td>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-violet-400 hover:underline hover:text-violet-300 font-medium"
            >
              {children}
            </a>
          ),
          code: ({ children }) => (
            <code className="bg-[#181818] text-violet-300 px-1.5 py-0.5 rounded text-xs font-mono border border-[#282828]">
              {children}
            </code>
          ),
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  )
}
