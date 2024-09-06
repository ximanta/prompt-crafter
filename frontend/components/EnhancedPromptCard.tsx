import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CopyIcon, SendIcon } from "lucide-react"
import { TopTooltip } from "./TopTooltip"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface EnhancedPromptCardProps {
  enhancedPrompt: string
  isStreamingComplete: boolean
  handleSubmitEnhancedPrompt: () => void
}

export function EnhancedPromptCard({
  enhancedPrompt,
  isStreamingComplete,
  handleSubmitEnhancedPrompt
}: EnhancedPromptCardProps) {
  const [isCopied, setIsCopied] = useState(false)

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isCopied) {
      timer = setTimeout(() => setIsCopied(false), 2000) // Changed to 2 seconds for consistency
    }
    return () => clearTimeout(timer)
  }, [isCopied])

  const handleCopy = () => {
    if (enhancedPrompt) {
      navigator.clipboard.writeText(enhancedPrompt)
        .then(() => {
          setIsCopied(true)
        })
        .catch((err) => console.error('Failed to copy text: ', err))
    }
  }

  return (
    <div className="w-1/2 p-4 bg-gray-50">
      <Card className="flex flex-col h-[250px]">
        <CardContent className="pt-6 flex-grow overflow-hidden">
          <ScrollArea className="h-full ai-generated-font">
            {enhancedPrompt ? (
              <ReactMarkdown 
                className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none ai-generated-font"
                remarkPlugins={[remarkGfm]}
              >
                {enhancedPrompt}
              </ReactMarkdown>
            ) : (
              <p className="text-gray-400">Get ready to generate something exciting today!!</p>
            )}
          </ScrollArea>
        </CardContent>
        <CardFooter className="justify-end space-x-2">
          <TopTooltip title={isCopied ? "Copied!" : "Copy"}>
            <Button 
              size="icon" 
              variant="ghost"
              onClick={handleCopy} 
              disabled={!isStreamingComplete || enhancedPrompt.length === 0}
            >
              {isCopied ? (
                <span className="text-xs font-bold">✓</span>
              ) : (
                <CopyIcon className="h-4 w-4" />
              )}
            </Button>
          </TopTooltip>
          <Button 
            size="sm" 
            onClick={handleSubmitEnhancedPrompt}
            disabled={!isStreamingComplete || enhancedPrompt.length === 0}
          >
            <SendIcon className="h-4 w-4 mr-2" /> Send to Assistant
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}