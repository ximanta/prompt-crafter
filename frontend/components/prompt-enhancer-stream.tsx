'use client'

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowUpIcon, CopyIcon, RefreshCwIcon, SendIcon, WandIcon } from "lucide-react"

export function PromptEnhancerStream() {
  const [userPrompt, setUserPrompt] = useState("")
  const [enhancedPrompt, setEnhancedPrompt] = useState<string>("") // Single string for cumulative streaming content
  const [assistantPrompt, setAssistantPrompt] = useState("")
  const [assistantResponse, setAssistantResponse] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const abortControllerRef = useRef<AbortController | null>(null)
  const [showAssistantResponse, setShowAssistantResponse] = useState(false)

  const handleStreamSubmit = async () => {
    setIsLoading(true)
    setEnhancedPrompt(""); // Clear previous content
    abortControllerRef.current = new AbortController()
    let buffer = ""; // Buffer to accumulate incomplete JSON
    let isFirstChunk = true; // Flag for handling the first chunk

    try {
      const response = await fetch("http://localhost:8000/enhance_prompt_stream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: userPrompt }),
        signal: abortControllerRef.current.signal,
      })

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { value, done } = await reader!.read()
        if (done) {
          console.log("Stream is done.")
          break
        }

        // Decode the chunk and accumulate it in the buffer
        const decodedChunk = decoder.decode(value, { stream: true })
        console.log("Decoded chunk:", decodedChunk)

        // Append chunk to buffer for processing
        buffer += decodedChunk

        // Clean up special characters like `\n`, `*`, etc.
        const sanitizedBuffer = buffer
          .replace(/[\n\r]+/g, " ") // Replace newlines and carriage returns with spaces
          .replace(/[*•-]+/g, "- ") // Replace bullet points (*, •, -) with a dash followed by a space
          .replace(/[\\]/g, "") // Remove any backslashes

        // For the first chunk, extract the "enhanced_prompt" and start streaming word-by-word
        if (isFirstChunk) {
          const jsonStart = sanitizedBuffer.indexOf("{")
          const jsonEnd = sanitizedBuffer.indexOf("}")
          if (jsonStart !== -1 && jsonEnd !== -1) {
            const jsonString = sanitizedBuffer.slice(jsonStart, jsonEnd + 1)
            try {
              console.log("Parsing first chunk JSON:", jsonString)
              const parsedData = JSON.parse(jsonString) // Parse JSON
              if (parsedData.enhanced_prompt) {
                isFirstChunk = false // Flag to stop processing as first chunk
                // Stream word-by-word
                const words = parsedData.enhanced_prompt.split(" ")
                for (const word of words) {
                  setEnhancedPrompt((prev) => prev + " " + word) // Append words one by one
                  await new Promise((resolve) => setTimeout(resolve, 50)) // Simulate word-by-word delay
                }
                buffer = buffer.slice(jsonEnd + 1) // Remove processed content
              }
            } catch (error) {
              console.log("Error parsing first chunk:", error)
            }
          }
        } else {
          // Stream subsequent chunks word-by-word
          const words = decodedChunk.split(" ")
          for (const word of words) {
            setEnhancedPrompt((prev) => prev + " " + word) // Append words one by one
            await new Promise((resolve) => setTimeout(resolve, 50)) // Simulate word-by-word delay
          }
        }

        // Check if the [DONE] signal was received
        if (decodedChunk.trim() === "[DONE]") {
          console.log("Received [DONE] signal.")
          break
        }
      }
   // Clean up any extra JSON markers after streaming is done
   setEnhancedPrompt((prev) =>
    prev.replace(/^{.*?"enhanced_prompt":\s?"?|"}\[DONE\]$/, "").trim()
  );
      // Clean up the "[DONE]" marker after streaming is done
      setEnhancedPrompt((prev) =>
        prev.replace(/\[DONE\]$/, "").trim() // Remove [DONE] from the end
      )
    } catch (error) {
      if (error.name === "AbortError") {
        console.log("Fetch aborted")
      } else {
        console.error("Error streaming prompt:", error)
        setEnhancedPrompt("Error enhancing prompt. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleStopStreaming = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
  }

  const handleSendToAssistant = (prompt: string) => {
    setAssistantPrompt(prompt)
    setAssistantResponse("This is a simulated response to: " + prompt)
    setShowAssistantResponse(true)
  }

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  return (
    <div className="flex flex-col h-screen w-full bg-gray-100">
      <div className="flex flex-1 w-full">
        {/* Left Panel */}
        <div className="w-1/2 p-4 bg-white shadow-md">
          <h1 className="text-2xl font-bold mb-2 flex items-center">
            <WandIcon className="mr-2" /> Prompt Crafter
          </h1>
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
              <Button size="icon" onClick={handleStreamSubmit} disabled={isLoading}>
                {isLoading ? <RefreshCwIcon className="h-4 w-4 animate-spin" /> : <WandIcon className="h-4 w-4 text-purple-500" />}
              </Button>
              <Button size="icon" variant="outline" onClick={() => {
                setUserPrompt("");
                setEnhancedPrompt("");
                setAssistantPrompt("");
                setAssistantResponse("");
                setIsLoading(false);
                setShowAssistantResponse(false);
              }}>
                <RefreshCwIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Right Panel (Enhanced Prompt) */}
        <div className="w-1/2 p-4 bg-gray-50">
         
          <Card className="mb-4 w-full">
            <CardContent className="pt-6">
              <ScrollArea className="h-48">
                <p className="text-gray-600 text-base font-italic">
                  {enhancedPrompt || "I will help enhance your prompt. You can submit the enhanced prompt and get the result."}
                </p>
              </ScrollArea>
            </CardContent>
            <CardFooter className="justify-end space-x-2">
              <Button size="icon" variant="outline">
                <CopyIcon className="h-4 w-4" />
              </Button>
              <Button size="sm" onClick={() => handleSendToAssistant(enhancedPrompt)}>
                <SendIcon className="h-4 w-4 mr-2" /> Send to Assistant
              </Button>
            </CardFooter>
          </Card>

          {/* Assistant Response */}
          {showAssistantResponse && (
            <Card className="mt-4 w-full">
              <CardContent>
              
                <ScrollArea className="h-24">
                  <p>{assistantResponse}</p>
                </ScrollArea>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
