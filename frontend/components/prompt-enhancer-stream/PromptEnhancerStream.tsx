'use client'

import { useState, useEffect, useRef } from "react"
import { WandIcon } from "lucide-react"
import { UserPromptCard } from "./UserPromptCard"
import { EnhancedPromptCard } from "./EnhancedPromptCard"
import { AssistantResponseCard } from "./AssistantResponseCard"
import { ScrollToBottomButton } from "./ScrollToBottomButton"
import { useAIInteraction } from "./useAIInteraction"

export function PromptEnhancerStream() {
  const {
    userPrompt,
    setUserPrompt,
    enhancedPrompt,
    isEnhancing,
    isEnhancementComplete,
    handleEnhancePrompt,
    assistantResponse,
    setAssistantResponse, // Make sure this is included
    isAssistantStreaming,
    handleSubmitEnhancedPrompt,
    handleStopAssistantStreaming,
    handleCopyAssistantResponse,
    isAssistantResponseCopied,
    handleReset,
  } = useAIInteraction()

  const [showAssistantCard, setShowAssistantCard] = useState(false)

  useEffect(() => {
    if (assistantResponse.length > 0) {
      setShowAssistantCard(true)
    }
  }, [assistantResponse])

  const handleRegenerateResponse = () => {
    setAssistantResponse("")
    handleSubmitEnhancedPrompt()
  }

  return (
    <div className="flex flex-col h-screen w-full bg-gray-100">
      <div className="w-full text-center mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center justify-center">
          <WandIcon className="mr-2" /> Prompt Crafter
        </h1>
        <p className="ai-generated-font">What are you generating today?</p>
      </div>
      <div className="flex w-full mb-4">
        <UserPromptCard
          userPrompt={userPrompt}
          setUserPrompt={setUserPrompt}
          handleStreamSubmit={handleEnhancePrompt}
          isLoading={isEnhancing}
          handleReset={handleReset}
        />
        <EnhancedPromptCard
          enhancedPrompt={enhancedPrompt}
          isStreamingComplete={isEnhancementComplete}
          handleSubmitEnhancedPrompt={handleSubmitEnhancedPrompt}
        />
      </div>
      {showAssistantCard && (
        <AssistantResponseCard
          assistantResponse={assistantResponse}
          isAssistantStreaming={isAssistantStreaming}
          handleStopAssistantStreaming={handleStopAssistantStreaming}
          handleSubmitEnhancedPrompt={handleRegenerateResponse}
          handleCopyAssistantResponse={handleCopyAssistantResponse}
          isAssistantResponseCopied={isAssistantResponseCopied}
          isStreamingComplete={isEnhancementComplete}
          enhancedPrompt={enhancedPrompt}
        />
      )}
      <ScrollToBottomButton />
    </div>
  )
}

