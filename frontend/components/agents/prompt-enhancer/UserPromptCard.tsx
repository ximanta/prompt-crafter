import { useState, useEffect, useRef } from "react";

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
  handleReset,
  resetView,
}: UserPromptCardProps) {
  const textAreaRef = useRef<HTMLTextAreaElement>(null); // Reference for the textarea
  const [isFocused, setIsFocused] = useState(false); // Track focus state

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.focus(); // Automatically focus the textarea on load
    }
  }, []); // Empty dependency array to run only on mount

  const handleFocus = () => {
    setIsFocused(true); // Mark that the user has clicked inside
  };

  const handleBlur = () => {
    setIsFocused(false); // Update focus state when the textarea loses focus
  };

  return (
    <div className="bg-gray-900 p-6 space-y-6">
      <Card className="bg-gray-800 border-gray-700 flex flex-col" style={{ height: "250px" }}>
        <CardContent>
          <textarea
            ref={textAreaRef} // Attach the ref here
            value={userPrompt}
            onFocus={handleFocus} // Trigger when the user clicks inside the textarea
            onBlur={handleBlur} // Update focus state when the textarea loses focus
            onChange={(e) => setUserPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleStreamSubmit();
              }
            }}
            placeholder="Type your prompt here..." // Show placeholder initially until clicked or text entered
            style={{
              width: "100%",
              height: "175px",
              overflowY: "auto",
              outline: "none", // Remove outline on focus
              border: "1px solid gray", // Remove the blue border
            }}
            className={`mx-auto max-w-[700px] text-gray-400 bg-gray-800 border-gray-600 pt-4 ${
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
