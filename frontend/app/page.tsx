import Image from "next/image";
import { PromptEnhancer } from "@/components/prompt-enhancer";
import { PromptEnhancerStream } from "@/components/prompt-enhancer-stream";
import { PromptEnhancerSocket } from "@/components/prompt_enhancer_socket";

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-between p-4">
      {/* <PromptEnhancer /> */}
      <PromptEnhancerStream />
      {/* <PromptEnhancerSocket /> */}
    </main>
  );
}
