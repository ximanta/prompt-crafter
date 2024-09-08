import { useState, useRef, useEffect } from "react";

import { Button } from "@/components/agents/prompt-enhancer/ui/button";
import { Card, CardContent, CardFooter } from "@/components/agents/prompt-enhancer/ui/card";
import { RotateCcwIcon, WandIcon, Loader2 } from "lucide-react";
import { TopTooltip } from "./TopTooltip";

interface UserPromptCardProps {
  userPrompt: string;
  setUserPrompt: (prompt: string) => void;
  handleStreamSubmit: () => void;
  isLoading: boolean;
  handleReset: () => void;
  resetView: () => void;
}

export function UserPromptCard({
  userPrompt,
  setUserPrompt,
  handleStreamSubmit,
  isLoading,
 
  resetView,
}: UserPromptCardProps) {
  const textAreaRef = useRef<HTMLTextAreaElement>(null); // Reference for the textarea
  
  const [isLoadFocused, setIsLoadFocused] = useState(true); // Track load focus
  const [isUserFocused, setIsUserFocused] = useState(false); // Track user focus

  // Focus the textarea on load for cursor blinking without showing the border
  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.focus(); // Automatically focus the textarea on load
    }
    // Set timeout to remove the load focus after a small delay, allowing the user to interact
    const timer = setTimeout(() => setIsLoadFocused(false), 1000); // 1-second timeout

    return () => clearTimeout(timer); // Clean up timer on unmount
  }, []); // Empty dependency array to run only on mount

  const handleFocus = () => {
    if (!isLoadFocused) { // Only set user focus after load focus is done
      setIsUserFocused(true); // Mark that the user has clicked inside
    }
  };
  const handleReset = () => {
    setUserPrompt(''); // Clear the prompt content
    setIsLoadFocused(true); // Re-enable load focus behavior
    setIsUserFocused(false); // Reset user focus
    if (textAreaRef.current) {
      textAreaRef.current.focus(); // Focus the textarea to start cursor blinking
    }
    resetView(); // Call the resetView prop for parent handling
  };
  const handleBlur = () => {
    setIsUserFocused(false); // Update focus state when the textarea loses focus
  };

  return (
    <div className="bg-gray-900 p-6 space-y-6">
  <Card className="bg-gray-800 border-gray-700 flex flex-col justify-between" style={{ height: '250px' }}>
    <CardContent className="flex-grow">
      <textarea
        ref={textAreaRef}
        value={userPrompt}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={(e) => setUserPrompt(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleStreamSubmit();
          }
        }}
        placeholder="Type your prompt here..."
        style={{
          width: "100%",
          outline: "none",
          paddingTop: "1rem",
          border: isUserFocused ? "1px solid gray" : "none",
          resize: "none", // Prevent manual resizing of the textarea
        }}
        className={`mx-auto max-w-[700px] text-gray-400 bg-gray-800 h-full scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-gray-800 ${
          isLoading ? "cursor-not-allowed" : ""
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
          onClick={resetView}
          disabled={isLoading}
        >
          <RotateCcwIcon className="h-4 w-4 text-white" />
        </Button>
      </TopTooltip>
    </CardFooter>
  </Card>
</div>

  
  );
}
