import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CopyIcon, RefreshCwIcon } from "lucide-react"
import { FaStop } from "react-icons/fa6"
import { TopTooltip } from "./TopTooltip"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface AssistantResponseCardProps {
  assistantResponse: string
  isAssistantStreaming: boolean
  handleStopAssistantStreaming: () => void
  handleSubmitEnhancedPrompt: () => void
  handleCopyAssistantResponse: () => void
  isAssistantResponseCopied: boolean
  isStreamingComplete: boolean
  enhancedPrompt: string
}

export function AssistantResponseCard({ 
  assistantResponse, 
  isAssistantStreaming, 
  handleStopAssistantStreaming, 
  handleSubmitEnhancedPrompt, 
  handleCopyAssistantResponse, 
  isAssistantResponseCopied,
  isStreamingComplete, 
  enhancedPrompt 
}: AssistantResponseCardProps) {
  const [isLocalCopied, setIsLocalCopied] = useState(false)

  const handleLocalCopy = () => {
    handleCopyAssistantResponse()
    setIsLocalCopied(true)
    setTimeout(() => setIsLocalCopied(false), 2000)
  }

  return (
    <div className="w-full px-4 flex justify-center">
      <Card className="w-3/4 flex flex-col relative" style={{ minHeight: '300px' }}>
        <div className="absolute top-2 right-2 flex space-x-2">
          <TopTooltip title="Stop">
            <Button 
              size="icon" 
              variant="ghost" 
              className="rounded-full bg-black"
              onClick={handleStopAssistantStreaming}
              disabled={!isAssistantStreaming}
            >
              <FaStop className="h-4 w-4 text-white" />
            </Button>
          </TopTooltip>
          <TopTooltip title="Regenerate" placement="top">
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={handleSubmitEnhancedPrompt}
              disabled={!isStreamingComplete || enhancedPrompt.length === 0 || isAssistantStreaming}
            >
              <RefreshCwIcon className="h-4 w-4" />
            </Button>
          </TopTooltip>
          <TopTooltip title={isLocalCopied ? "Copied!" : "Copy"} placement="top">
            <span>
              <Button 
                size="icon" 
                variant="ghost"
                onClick={handleLocalCopy}
                disabled={isAssistantStreaming || assistantResponse.length === 0}
              >
                {isLocalCopied ? (
                  <span className="text-xs font-bold">✓</span>
                ) : (
                  <CopyIcon className="h-4 w-4" />
                )}
              </Button>
            </span>
          </TopTooltip>
        </div>
        <CardContent className="flex-grow overflow-hidden pt-8">
          <ScrollArea className="pt-4">
            <ReactMarkdown 
              className="ai-generated-font"
              remarkPlugins={[remarkGfm]}
            >
              {assistantResponse}
            </ReactMarkdown>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}