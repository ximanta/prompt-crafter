import { useState, useEffect, useRef } from "react"

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
  
  <div className="bg-gray-900 p-6 space-y-6">
  <Card className="bg-gray-800 border-gray-700 flex flex-col" style={{ height: '250px' }}>
    <CardContent>
      <textarea
        value={userPrompt}
        onChange={(e) => setUserPrompt(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your prompt here..."
        style={{ width: '100%', height: '175px', overflowY: 'auto' }}
        className={`mx-auto max-w-[700px] text-gray-400 bg-gray-800 border-gray-600 focus:border-blue-400 pt-4 ${
          isLoading ? 'cursor-not-allowed' : ''
        }`} // Only apply 'cursor-not-allowed' without changing background color
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
          onClick={resetView} 
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