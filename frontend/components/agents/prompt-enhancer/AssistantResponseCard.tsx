import { useEffect, useState } from "react"
import { Button } from "@/components/agents/prompt-enhancer/ui/button"
import { Card, CardContent } from "@/components/agents/prompt-enhancer/ui/card"
import { ScrollArea } from "@/components/agents/prompt-enhancer/ui/scroll-area"
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
  isStreamingComplete: boolean
  enhancedPrompt: string
  isAssistantResponseCopied: boolean
  isVisible: boolean
}

export function AssistantResponseCard({ 
    assistantResponse, 
    isAssistantStreaming, 
    handleStopAssistantStreaming, 
    handleSubmitEnhancedPrompt, 
    handleCopyAssistantResponse, 
    isStreamingComplete, 
    enhancedPrompt, 
    isAssistantResponseCopied, 
    isVisible
  }: AssistantResponseCardProps) {
    const [isLocalCopied, setIsLocalCopied] = useState(false)
    const [dots, setDots] = useState<boolean[]>([false, false, false, false, false, false])

    const handleLocalCopy = () => {
      handleCopyAssistantResponse()
      setIsLocalCopied(true)
      setTimeout(() => setIsLocalCopied(false), 2000)
    }

    useEffect(() => {
      let interval: NodeJS.Timeout
      if (isAssistantStreaming && assistantResponse.length === 0) {
        let index = 0
        interval = setInterval(() => {
          setDots(prev => {
            const newDots = [...prev]
            newDots[index] = true
            index = (index + 1) % 6
            return newDots
          })
        }, 500)
      } else {
        setDots([false, false, false, false, false, false])
      }
      return () => clearInterval(interval)
    }, [isAssistantStreaming, assistantResponse])

    if (!isVisible) {
      return null
    }

    return (
      <div className="w-full px-4 flex ">
         <Card className="flex flex-col relative w-full" style={{ minHeight: '300px' }}>

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
              {assistantResponse ? (
                <ReactMarkdown 
                  className="prose markdown-content ai-generated-font"
                  remarkPlugins={[remarkGfm]}
                >
                  {assistantResponse}
                </ReactMarkdown>
              ) : (
                <div className="flex items-center">
                  <span className="font-semibold">Generating Content</span>
                  <div className="flex ml-2">
                    {dots.map((isActive, index) => (
                      <span 
                        key={index} 
                        className={`inline-block w-2 h-2 mx-0.5 ${isActive ? 'bg-gray-500' : 'bg-gray-200'}`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    )
  }