import { useState, useEffect } from "react"
import { Button } from "@/components/agents/prompt-enhancer/ui/button"
import { Card, CardContent, CardFooter } from "@/components/agents/prompt-enhancer/ui/card"
import { ScrollArea } from "@/components/agents/prompt-enhancer/ui/scroll-area"
import { CopyIcon, SendIcon } from "lucide-react"
import { TopTooltip } from "./TopTooltip"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface EnhancedPromptCardProps {
  enhancedPrompt: string
  isStreamingComplete: boolean
  handleSubmitEnhancedPrompt: () => void
  isWaitingForStream: boolean
  hasReceivedContent: boolean // Add this prop
}

export function EnhancedPromptCard({
  enhancedPrompt,
  isStreamingComplete,
  handleSubmitEnhancedPrompt,
  isWaitingForStream,
  hasReceivedContent // Add this prop
}: EnhancedPromptCardProps) {
  const [isCopied, setIsCopied] = useState(false)

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isCopied) {
      timer = setTimeout(() => setIsCopied(false), 2000)
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
    <div className="bg-gray-900 p-6 space-y-6">
      <Card className="bg-gray-800 border-gray-700 flex flex-col" style={{ height: '250px' }}>
        <CardContent className=" flex-grow overflow-hidden">
          <ScrollArea className="h-full">
            {isWaitingForStream ? (
              <div className="flex flex-col items-center justify-center h-full">
                <p className="text-lg font-semibold mb-2">Hang On!!</p>
                <div className="running-robot-container">
                  <svg width="100" height="100" viewBox="0 0 100 100" className="running-robot">
                    <g className="robot">
                      <circle cx="50" cy="30" r="20" fill="#4A5568" /> {/* Head */}
                      <rect x="30" y="50" width="40" height="30" rx="10" fill="#4A5568" /> {/* Body */}
                      <line x1="35" y1="80" x2="35" y2="95" stroke="#4A5568" strokeWidth="8" className="left-leg" /> {/* Left leg */}
                      <line x1="65" y1="80" x2="65" y2="95" stroke="#4A5568" strokeWidth="8" className="right-leg" /> {/* Right leg */}
                      <line x1="20" y1="60" x2="30" y2="60" stroke="#4A5568" strokeWidth="8" /> {/* Left arm */}
                      <line x1="70" y1="60" x2="80" y2="60" stroke="#4A5568" strokeWidth="8" /> {/* Right arm */}
                      <circle cx="45" cy="25" r="5" fill="white" /> {/* Left eye */}
                      <circle cx="55" cy="25" r="5" fill="white" /> {/* Right eye */}
                    </g>
                  </svg>
                </div>
              </div>
            ) : hasReceivedContent ? (
              <div className="text-gray-400 font-sans text-base leading-relaxed pt-4"> {/* Match styles here */}

              <ReactMarkdown 
                // className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none "
                remarkPlugins={[remarkGfm]}
              >
                {enhancedPrompt}
              </ReactMarkdown>
              </div>
            ) : (
<p className="text-center text-gray-400 pt-4">Let&apos;s create something amazing today!</p>

            )}
          </ScrollArea>
        </CardContent>
        <CardFooter className="justify-end p-2">
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