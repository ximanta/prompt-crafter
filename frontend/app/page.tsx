import { PromptEnhancerStream } from "@/components/agents/prompt-enhancer/PromptEnhancerStream";
import {LandingPage} from "@/components/landing/landing-page"

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-between p-4">
  
      {/* <PromptEnhancerStream /> */}
      <LandingPage />

    </main>
  );
}
