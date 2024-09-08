'use client'

import { useState, useEffect } from "react"
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
    isWaitingForStream, // Add this new value
    hasReceivedContent, // Add this new value
  } = useAIInteraction()

  const [showAssistantCard, setShowAssistantCard] = useState(false)
  const [isEnhancing, setIsEnhancing] = useState(false)

  // Modify this function to reset all states
  const resetView = () => {
    handleReset()
    setUserPrompt("")
    setShowAssistantCard(false)
    setIsEnhancing(false)
    setAssistantResponse("")
  }

  // Remove this useEffect hook
  // useEffect(() => {
  //   if (assistantResponse.length > 0) {
  //     setShowAssistantCard(true)
  //   }
  // }, [assistantResponse])

  const handleSubmitEnhancedPromptWrapper = () => {
    setShowAssistantCard(true)
    handleSubmitEnhancedPrompt()
  }

  const handleRegenerateResponse = () => {
    setAssistantResponse("")
    handleSubmitEnhancedPrompt()
  }

  const handleEnhancePromptWrapper = async () => {
    setIsEnhancing(true)
    await handleEnhancePrompt()
    setIsEnhancing(false)
  }

  return (
    <div className="w-[95.6vw] min-h-screen " >
        <div className="container px-4 md:px-6 lg:px-12 items-center justify-center flex flex-col" >
        <h1 className="text-3xl font-bold mb-2 flex items-center justify-center pt-10 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
          <WandIcon className="mr-2" /> I'm Prompt Genie - Your Prompt Engineer
        </h1>
        <p className="mx-auto max-w-[700px] text-gray-400 md:text-xl">What are you generating today?</p>
      </div>
      <div className="grid lg:grid-cols-12">
      <div className="lg:col-span-5  ml-6" >
          <UserPromptCard
            userPrompt={userPrompt}
            setUserPrompt={setUserPrompt}
            handleStreamSubmit={handleEnhancePromptWrapper}
            isLoading={isEnhancing}
            handleReset={handleReset}
            resetView={resetView} // Pass the new resetView function
          />
        </div>
      <div className="lg:col-span-7 mr-6" >
          <EnhancedPromptCard
            enhancedPrompt={enhancedPrompt}
            isStreamingComplete={isEnhancementComplete}
            handleSubmitEnhancedPrompt={handleSubmitEnhancedPromptWrapper}
            isWaitingForStream={isWaitingForStream} // Add this new prop
            hasReceivedContent={hasReceivedContent} // Add this prop
          />
        </div>     
      
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
          isVisible={showAssistantCard} // Add this prop
        />
      )}
      <ScrollToBottomButton /> 
   
     </div>
   )
}