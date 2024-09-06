import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { RotateCcwIcon, WandIcon, StopCircleIcon } from "lucide-react"
import { TopTooltip } from "./TopTooltip"

// Add props interface
interface UserPromptCardProps {
  userPrompt: string
  setUserPrompt: (prompt: string) => void
  handleStreamSubmit: () => void
  isLoading: boolean
  handleReset: () => void
}

// Update component to accept props
export function UserPromptCard({
  userPrompt,
  setUserPrompt,
  handleStreamSubmit,
  isLoading,
  handleReset
}: UserPromptCardProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (isSubmitting) {
      const timer = setTimeout(() => setIsSubmitting(false), 200)
      return () => clearTimeout(timer)
    }
  }, [isSubmitting])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      setIsSubmitting(true)
      handleStreamSubmit()
    }
  }

  return (
    <div className="w-1/2 p-4 bg-gray-50">
      <Card className="flex flex-col" style={{ height: '250px' }}>
 <CardContent className="flex-grow">
  <textarea
    value={userPrompt}
    onChange={(e) => setUserPrompt(e.target.value)}
    onKeyDown={handleKeyDown}
    placeholder="Type your prompt here..."
    className={`w-full h-full p-2 pt-7 resize-none focus:outline-none ai-generated-font transition-colors duration-200 ${
      isSubmitting ? 'bg-gray-200 cursor-not-allowed' : ''
    }`}
    disabled={isSubmitting} // Disable the textarea while submitting
  />
  {isSubmitting && (
    <p className="text-sm text-gray-500 mt-2">Submitting your prompt...</p>
  )}
</CardContent>

        <CardFooter className="justify-end space-x-2">
          <TopTooltip title={"Enhance Prompt"}>
            <Button size="icon" onClick={handleStreamSubmit}>
              {isLoading ? <StopCircleIcon className="h-4 w-4 text-red-500" /> : <WandIcon className="h-4 w-4 text-purple-500" />}
            </Button>
          </TopTooltip>
          <TopTooltip title="Reset">
            <Button size="icon" variant="outline"   
              className="bg-black hover:bg-gray-800" 
               onClick={handleReset}>
              <RotateCcwIcon className="h-4 w-4 text-white"/>
            </Button>
          </TopTooltip>
        </CardFooter>
      </Card>
    </div>
  )
}