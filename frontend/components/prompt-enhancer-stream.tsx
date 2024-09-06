'use client'

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowUpIcon, CopyIcon, RefreshCwIcon, SendIcon, WandIcon, CheckIcon } from "lucide-react"
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

export function PromptEnhancerStream() {
  const [userPrompt, setUserPrompt] = useState("")
  const [enhancedPrompt, setEnhancedPrompt] = useState<string>("") // Single string for cumulative streaming content
  const [assistantPrompt, setAssistantPrompt] = useState("")
  const [assistantResponse, setAssistantResponse] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const abortControllerRef = useRef<AbortController | null>(null)
  const [showAssistantResponse, setShowAssistantResponse] = useState(false)
  const [isStreamingComplete, setIsStreamingComplete] = useState(false)
  const [isCopied, setIsCopied] = useState(false);

  const handleStreamAssistantSubmit = async () => {
    const response = await fetch('/answer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt: enhancedPrompt }),
    });

    if (!response.body) {
      throw new Error('ReadableStream not supported in this browser.');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let done = false;

    // Clear the assistant response before starting a new stream
    setAssistantResponse('');

    while (!done) {
      const { value, done: streamDone } = await reader.read();
      done = streamDone;

      // Decode and append the incoming data chunk by chunk to `assistantResponse`
      const chunkValue = decoder.decode(value);
      setAssistantResponse((prev) => prev + chunkValue);
    }
  };
  const handleStreamSubmit = async () => {
    setIsLoading(true)
    setEnhancedPrompt(""); // Clear previous content
    setIsStreamingComplete(false) // Reset streaming status
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
            await new Promise((resolve) => setTimeout(resolve, 10)) // Simulate word-by-word delay
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
      setIsStreamingComplete(true)
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

   const handleSubmitEnhancedPrompt = async () => {
    try {
      setShowAssistantResponse(true); // Show the response area
      setAssistantResponse(''); // Clear previous response
  
      const response = await fetch("http://localhost:8000/answer", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: enhancedPrompt }),
      });
  
      if (!response.body) {
        throw new Error('ReadableStream not supported in this browser.');
      }
  
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
  
      // Stream the response character by character
      while (!done) {
        const { value, done: streamDone } = await reader.read();
        done = streamDone;
  
        // Decode the incoming chunk
        const chunkValue = decoder.decode(value);
        for (const char of chunkValue) {
          // Append each character one by one to give a streaming effect
          setAssistantResponse((prev) => prev + char);
          await new Promise((resolve) => setTimeout(resolve, 1)); // Optional delay for better user experience
        }
      }
    } catch (error) {
      console.error('Error streaming response:', error);
      setAssistantResponse('Error: Unable to get response from assistant.');
    }
  };

  const handleCopy = useCallback(() => {
    if (enhancedPrompt) {
      navigator.clipboard.writeText(enhancedPrompt)
        .then(() => {
          setIsCopied(true);
          setTimeout(() => {
            setIsCopied(false);
          }, 2000);
        })
        .catch((err) => {
          console.error('Failed to copy text: ', err);
        });
    } else {
      console.log("No enhanced prompt to copy");
    }
  }, [enhancedPrompt]);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  return (
    <div className="flex flex-col h-screen w-full bg-gray-100">
      <div className="w-full text-center mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center justify-center">
          <WandIcon className="mr-2" /> Prompt Crafter
        </h1>
        <p className="text-gray-600">What are you generating today?</p>
      </div>
      <div className="flex w-full mb-4">
        {/* Left Panel (User Prompt) */}
        <div className="w-1/2 p-4 bg-gray-50">

          <Card className="flex flex-col" style={{ height: '250px' }}>
            <CardContent className="flex-grow">
              <textarea
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                placeholder="Enter your prompt here..."
                className="w-full h-full p-2 resize-none focus:outline-none"
              />
            </CardContent>
            <CardFooter className="justify-end space-x-2">
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
            </CardFooter>
          </Card>
        </div>

        {/* Right Panel (Enhanced Prompt) */}
        <div className="w-1/2 p-4 bg-gray-50">
          <Card className="flex flex-col" style={{ height: '250px' }}>
            <CardContent className="pt-6 flex-grow overflow-hidden">
              <ScrollArea className="h-full">
                
                {enhancedPrompt ? (
                  // <p className="text-gray-600 text-base font-italic">
                  <ReactMarkdown 
                  className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none"
                  remarkPlugins={[remarkGfm]}
                  // rehypePlugins={[rehypeRaw]}
                >
                    {enhancedPrompt}
                    </ReactMarkdown>
                  // </p>
                ) : (
                  <p className="text-gray-400" style={{ color: '#9CA3AF' }}>I will help enhance your prompt. You can submit the enhanced prompt and get the result.</p>
                )}
              </ScrollArea>
            </CardContent>
            <CardFooter className="justify-end space-x-2">
              <Button 
                size="icon" 
                variant="outline" 
                onClick={handleCopy} 
                disabled={!isStreamingComplete || enhancedPrompt.length === 0}
              >
                {isCopied ? (
                  <span className="text-xs font-bold">Copied!</span>
                ) : (
                  <CopyIcon className="h-4 w-4" />
                )}
              </Button>
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
      </div>

      {/* Assistant Response (Below, Centered) */}
      {showAssistantResponse && (
        <div className="w-full px-4 flex justify-center">
          <Card className="w-3/4 flex flex-col" style={{ minHeight: '300px' }}>
            <CardContent className="flex-grow overflow-hidden">
              <ScrollArea className="h-full">
                <ReactMarkdown 
                  className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none"
                  remarkPlugins={[remarkGfm]}
                  // rehypePlugins={[rehypeRaw]}
                >
                  {assistantResponse}
                </ReactMarkdown>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
