import { useState, useEffect } from "react"
import { Button } from "@/components/agents/prompt-enhancer/ui/button"
import { Card, CardContent, CardFooter } from "@/components/agents/prompt-enhancer/ui/card"
import { RotateCcwIcon, WandIcon, Loader2 } from "lucide-react"
import { TopTooltip } from "./TopTooltip"

// Add props interface
interface UserPromptCardProps {
  userPrompt: string
  setUserPrompt: (prompt: string) => void
  handleStreamSubmit: () => void
  isLoading: boolean
  handleReset: () => void
  resetView: () => void // Add this new prop
}

// Update component to accept props
export function UserPromptCard({
  userPrompt,
  setUserPrompt,
  handleStreamSubmit,
  isLoading,
  handleReset,
  resetView // Add this new prop
}: UserPromptCardProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleStreamSubmit()
    }
  }

  return (
    <div className="w-1/2 p-4 bg-gray-50 relative">
   
      <Card className="flex flex-col" style={{ height: '250px', paddingTop: '20px' }}>
        <CardContent className="flex-grow">
          <textarea
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your prompt here..."
            className={`w-full h-full p-2 resize-none focus:outline-none ai-generated-font ${
              isLoading ? 'bg-gray-100 cursor-not-allowed' : ''
            }`}
            disabled={isLoading}
          />
        </CardContent>
        <CardFooter className="justify-end space-x-2">
          <TopTooltip title={"Enhance Prompt"}>
            <Button size="icon" onClick={handleStreamSubmit} disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <WandIcon className="h-4 w-4 text-purple-500" />}
            </Button>
          </TopTooltip>
          <TopTooltip title="Reset">
            <Button 
              size="icon" 
              variant="outline" 
              className="bg-black hover:bg-gray-800" 
              onClick={resetView} // Use the resetView function here
              disabled={isLoading}
            >
              <RotateCcwIcon className="h-4 w-4 text-white" />
            </Button>
          </TopTooltip>
        </CardFooter>
      </Card>
    </div>
  )
}