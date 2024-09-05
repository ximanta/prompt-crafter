'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowUpIcon, CopyIcon, RefreshCwIcon, SendIcon, WandIcon } from "lucide-react"
import axios from 'axios'

export function PromptEnhancer() {
  const [userPrompt, setUserPrompt] = useState("")
  const [enhancedPrompts, setEnhancedPrompts] = useState<string[]>([])
  const [assistantPrompt, setAssistantPrompt] = useState("")
  const [assistantResponse, setAssistantResponse] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const response = await axios.post('http://localhost:8000/enhance_prompt', { prompt: userPrompt })
      setEnhancedPrompts([response.data.enhanced_prompt])
    } catch (error) {
      console.error('Error enhancing prompt:', error)
      setEnhancedPrompts(['Error enhancing prompt. Please try again.'])
    }
    setIsLoading(false)
  }

  const handleSendToAssistant = (prompt: string) => {
    setAssistantPrompt(prompt)
    setAssistantResponse("This is a simulated response to: " + prompt)
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Panel */}
      <div className="w-1/3 p-4 bg-white shadow-md">
        <h1 className="text-2xl font-bold mb-2 flex items-center">
          <WandIcon className="mr-2" /> Prompt Crafter
        </h1>
        <h2 className="text-xl mb-2">I'll help you enhance your prompts.</h2>
        <p className="mb-4 text-gray-600">What are you generating today?</p>
        <div className="relative">
          <ScrollArea className="h-40 w-full rounded-md border">
            <textarea
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              placeholder="Enter your prompt here..."
              className={`w-full h-full p-2 resize-none focus:outline-none ${
                userPrompt ? "border-blue-500" : ""
              }`}
            />
          </ScrollArea>
          <div className="absolute bottom-2 right-2 flex space-x-2">
            <Button size="icon" onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? <RefreshCwIcon className="h-4 w-4 animate-spin" /> : <ArrowUpIcon className="h-4 w-4" />}
            </Button>
            <Button size="icon" variant="outline">
              <RefreshCwIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Middle Section */}
      <div className="w-1/3 p-4 bg-gray-50">
        <h2 className="text-xl font-bold mb-4">Enhanced Prompts</h2>
        {enhancedPrompts.map((prompt, index) => (
          <Card key={index} className="mb-4">
            <CardContent className="pt-6">
              <ScrollArea className="h-24">
                <p>{prompt}</p>
              </ScrollArea>
            </CardContent>
            <CardFooter className="justify-end space-x-2">
              <Button size="icon" variant="outline">
                <CopyIcon className="h-4 w-4" />
              </Button>
              <Button size="sm" onClick={() => handleSendToAssistant(prompt)}>
                <SendIcon className="h-4 w-4 mr-2" /> Send to Assistant
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Right Panel */}
      <div className="w-1/3 p-4 bg-white shadow-md">
        <h2 className="text-xl font-bold mb-4">Assistant</h2>
        {assistantPrompt && (
          <>
            <Card className="mb-4">
              <CardContent>
                <h3 className="font-bold mb-2">Enhanced Prompt:</h3>
                <ScrollArea className="h-24">
                  <p>{assistantPrompt}</p>
                </ScrollArea>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <h3 className="font-bold mb-2">Assistant Response:</h3>
                <ScrollArea className="h-40">
                  <p>{assistantResponse}</p>
                </ScrollArea>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}