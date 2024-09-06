import { PromptEnhancerStream } from "@/components/PromptEnhancerStream";
export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-between p-4">
      {/* <PromptEnhancer /> */}
      <PromptEnhancerStream />
      {/* <PromptEnhancerSocket /> */}
    </main>
  );
}
