import { useState, useRef, useCallback } from "react"

export function useAIInteraction() {
  const [userPrompt, setUserPrompt] = useState("")
  const [enhancedPrompt, setEnhancedPrompt] = useState("")
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [isEnhancementComplete, setIsEnhancementComplete] = useState(false)
  const abortControllerRef = useRef<AbortController | null>(null)

  const [assistantResponse, setAssistantResponse] = useState('')
  const [isAssistantStreaming, setIsAssistantStreaming] = useState(false)
  const [isAssistantResponseCopied, setIsAssistantResponseCopied] = useState(false)
  const assistantAbortControllerRef = useRef<AbortController | null>(null)

  const [isCopied, setIsCopied] = useState(false)
  const [showAssistantResponse, setShowAssistantResponse] = useState(false)
  const [isWaitingForStream, setIsWaitingForStream] = useState(false)

  const [hasReceivedContent, setHasReceivedContent] = useState(false)
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const handleEnhancePrompt = useCallback(async () => {
    setIsEnhancing(true)
    setEnhancedPrompt("")
    setIsEnhancementComplete(false)
    setIsWaitingForStream(true)
    setHasReceivedContent(false) // Reset this when starting a new enhancement
    abortControllerRef.current = new AbortController()
    let buffer = ""
    let isFirstChunk = true

    try {
      console.log("API URL:", apiUrl);  // Debugging step

      const response = await fetch(`${apiUrl}/enhance_prompt_stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userPrompt }),
        signal: abortControllerRef.current.signal,
      })

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { value, done } = await reader!.read()
        if (done) break

        const decodedChunk = decoder.decode(value, { stream: true })
        buffer += decodedChunk

        if (isFirstChunk) {
          setIsWaitingForStream(false)
          const jsonStart = buffer.indexOf("{")
          const jsonEnd = buffer.lastIndexOf("}")
          if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
            const jsonString = buffer.slice(jsonStart, jsonEnd + 1)
            try {
              // Parse JSON while preserving newlines
              const parsedData = JSON.parse(jsonString.replace(/\n/g, "\\n"))
              if (parsedData.enhanced_prompt) {
                isFirstChunk = false
                setHasReceivedContent(true) // Set this to true when we start receiving content
                const words = parsedData.enhanced_prompt.split(" ")
                for (const word of words) {
                  setEnhancedPrompt((prev) => prev + " " + word)
                  await new Promise((resolve) => setTimeout(resolve, 50))
                }
                buffer = buffer.slice(jsonEnd + 1)
              }
            } catch (error) {
              console.error("Error parsing JSON:", error)
              console.log("Problematic JSON string:", jsonString)
              // Continue processing without breaking the loop
              isFirstChunk = false
            }
          }
        } else {
          setHasReceivedContent(true) // Set this to true for subsequent chunks as well
          const words = decodedChunk.split(" ")
          for (const word of words) {
            setEnhancedPrompt((prev) => prev + " " + word)
            await new Promise((resolve) => setTimeout(resolve, 10))
          }
        }

        if (decodedChunk.trim() === "[DONE]") break
      }

      setEnhancedPrompt((prev) =>
        prev.replace(/^{.*?"enhanced_prompt":\s?"?|"}\[DONE\]$/, "").trim()
      )
      setEnhancedPrompt((prev) => prev.replace(/\[DONE\]$/, "").trim())
      setIsEnhancementComplete(true)
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Error streaming prompt:", error)
        setEnhancedPrompt("Error enhancing prompt. Please try again.")
      }
    } finally {
      setIsEnhancing(false)
      setIsWaitingForStream(false)
    }
  }, [userPrompt])

  const handleSubmitEnhancedPrompt = useCallback(async () => {
    setAssistantResponse('')
    setIsAssistantStreaming(true)
    assistantAbortControllerRef.current = new AbortController()
    
    try {
      setShowAssistantResponse(true)
      
      const response = await fetch(`${apiUrl}/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: enhancedPrompt }),
        signal: assistantAbortControllerRef.current.signal,
      })

      if (!response.body) throw new Error('ReadableStream not supported')

      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { value, done } = await reader.read()
        if (done) break

        if (assistantAbortControllerRef.current.signal.aborted) {
          break
        }

        const chunkValue = decoder.decode(value)

        for (const char of chunkValue) {
          if (assistantAbortControllerRef.current.signal.aborted) {
            break
          }

          setAssistantResponse((prev) => prev + char)
          await new Promise((resolve) => setTimeout(resolve, 1))
        }
      }

      setAssistantResponse((prev) => prev.replace(/\[DONE\]$/, '').trim())
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error streaming response:', error)
        setAssistantResponse('Error: Unable to get response from assistant.')
      }
    } finally {
      setIsAssistantStreaming(false)
    }
  }, [enhancedPrompt])

  const handleStopAssistantStreaming = useCallback(() => {
    if (assistantAbortControllerRef.current) {
      assistantAbortControllerRef.current.abort()
      setIsAssistantStreaming(false)
    }
  }, [])

  const handleCopy = useCallback(() => {
    if (enhancedPrompt) {
      navigator.clipboard.writeText(enhancedPrompt)
        .then(() => {
          setIsCopied(true)
          setTimeout(() => setIsCopied(false), 2000)
        })
        .catch((err) => console.error('Failed to copy text: ', err))
    }
  }, [enhancedPrompt])

  const handleCopyAssistantResponse = useCallback(() => {
    if (assistantResponse) {
      navigator.clipboard.writeText(assistantResponse)
        .then(() => {
          setIsAssistantResponseCopied(true)
          setTimeout(() => setIsAssistantResponseCopied(false), 2000)
        })
        .catch((err) => console.error('Failed to copy text: ', err))
    }
  }, [assistantResponse])

  const handleReset = useCallback(() => {
    setUserPrompt("")
    setEnhancedPrompt("")
    setAssistantResponse("")
    setIsEnhancing(false)
    setIsEnhancementComplete(false)
    setIsAssistantStreaming(false)
    setIsAssistantResponseCopied(false)
    setIsCopied(false)
    setShowAssistantResponse(false)
    setHasReceivedContent(false) // Reset this when resetting
  }, [])

  return {
    userPrompt,
    setUserPrompt,
    enhancedPrompt,
    setEnhancedPrompt, // Add this line if it's not already included
    isEnhancing,
    isEnhancementComplete,
    handleEnhancePrompt,
    assistantResponse,
    setAssistantResponse, // Add this line
    isAssistantStreaming,
    handleSubmitEnhancedPrompt,
    handleStopAssistantStreaming,
    handleCopyAssistantResponse,
    isAssistantResponseCopied,
    handleReset,
    isWaitingForStream,
    hasReceivedContent,
  }
}