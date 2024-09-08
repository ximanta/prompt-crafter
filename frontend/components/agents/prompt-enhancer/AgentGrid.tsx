'use client'

import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Search, ChevronRight, ChevronLeft, Rocket } from 'lucide-react'

const agents = [
  { 
    id: 1, 
    name: "Code Reviewer", 
    description: "I perform code review, improve efficiency and consistency by targeting areas like error detection, performance, and documentation. Using Gen AI, it identifies and resolves logical errors, runtime issues, exceptions, validation gaps, and security risks. This speeds up the review process, ensuring secure, optimized code while meeting development timelines. Ultimately, I help you to boost your productivity in training programs, fostering a more effective learning environment.", 
    tags: ["code review", "vulneravility check", "code optimize", "bug fix"], 
    image: "agent_profile_image/human_agent1.png",
    status: "just-released" 
  },
  { id: 2, 
    name: "Snap Scriptor",
     description: "I generate accurate, detailed descriptions of uploaded technical images, ensuring consistency and clarity. This reduces misunderstandings, enhances learner comprehension, and promotes uniform understanding, making me a valuable tool in reasearch, educational and training settings.", 
     tags: ["image to text", "image description"],
      image: "agent_profile_image/human-agent2.png", 
      status: "buzzing" },
  { id: 3, 
    name: "Prompt Engineer", 
    description: "I specialize in crafting and refining prompts to maximize the performance of Gen AI models. By carefully tuning inputs, I help generate precise, relevant, and optimized outputs for various use cases. My expertise ensures the AI delivers accurate responses, creative content, or actionable insights, making me an essential tool for improving model efficiency, minimizing errors, and driving better decision-making across applications.", 
    tags: ["prompt engineering", "chat"], 
    image: "agent_profile_image/human_agent3.png",  
    status: "most-popular" },
  { id: 4, 
    name: "Quiz Creator", 
    description: "I automate the creation of MCQ-based assessments, streamlining the process by allowing you to define a custom blueprint for each assessment. Once the blueprint is set, I generate objective and relevant assessment items automatically, ensuring consistency and alignment with your goals. I provide the flexibility to download these items in CSV format for easy integration with Quiz and Assessment Platforms. ", 
    tags: ["assessment", "mcq", "quiz", "test"], 
    image: "agent_profile_image/human-agent4.png", 
    status: "must-try" },
  { id: 5, name: "TextMaster", description: "Advanced text processing and generation with natural language understanding.", tags: ["text", "NLP"], image: "agent_profile_image/human-agent5.png", status: "buzzing" },
  { id: 6, name: "ImageGenius", description: "AI-powered image manipulation and generation.", tags: ["image", "editing"], image: "agent_profile_image/human-agent6.png", status: "coming-soon" },
  { id: 7, name: "AudioAlchemist", description: "Audio processing, generation, and analysis for various applications.", tags: ["audio", "music"], image: "agent_profile_image/human-agent6.png", status: "coming-soon" },
  { id: 8, name: "VideoVirtuoso", description: "AI-assisted video editing and content creation.", tags: ["video", "editing"], image: "agent_profile_image/human-agent7.png", status: "coming-soon" },
  { id: 9, name: "ChatMaster", description: "Advanced conversational AI for natural and engaging interactions.", tags: ["chat", "conversation"],image: "agent_profile_image/human-agent8.png", status: "coming-soon" },
]

const allTags = [...new Set(agents.flatMap(agent => agent.tags))]


const statusColors = {
  "just-released": "bg-green-500",
  "buzzing": "bg-red-500",
  "most-popular": "bg-purple-500",
  "must-try": "bg-blue-500",
  "coming-soon": "bg-gray-500",
}

const statusLabels = {
  "just-released": "Just Out",
  "buzzing": "Buzzing",
  "most-popular": "Top Pick",
  "must-try": "Must-Try",
  "coming-soon": "On Its Way",
}

interface AgentGridProps {
  onAgentLaunch: (agentId: number) => void;
}

export function AgentGrid({ onAgentLaunch }: AgentGridProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [isTagPaneOpen, setIsTagPaneOpen] = useState(true)
  const [expandedAgentId, setExpandedAgentId] = useState<number | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<any>(null);

  const filteredAgents = agents.filter(agent => 
    (agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     agent.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
     agent.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))) &&
    (selectedTags.length === 0 || selectedTags.some(tag => agent.tags.includes(tag)))
  )

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  const launchAgent = (agentId: number) => {
    console.log(`Launching agent with ID: ${agentId}`)
    onAgentLaunch(agentId)
  }
 
  return (
    <div className="flex bg-gray-900 text-gray-100 p-6">
      <Collapsible
        open={isTagPaneOpen}
        onOpenChange={setIsTagPaneOpen}
        className={`transition-all duration-300 ease-in-out ${isTagPaneOpen ? 'w-48' : 'w-12'} mr-6`}
      >
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="mb-4 w-full justify-between">
            {isTagPaneOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            {isTagPaneOpen && "Filter By Tags"}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="space-y-2">
              {allTags.map(tag => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className="mr-2 mb-2 cursor-pointer"
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </ScrollArea>
        </CollapsibleContent>
      </Collapsible>
      <div className="flex-1">
        <div className="mb-6 flex justify-center">
          <div className="relative w-1/2">
            <Input
              type="text"
              placeholder="Search agents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-800 text-white border-gray-700 pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAgents.map((agent) => (
            <Card key={agent.id} className="bg-gray-800 border-gray-700 overflow-visible relative">
              <div className="absolute -top-3 left-0 z-10">
              <Badge className={`${statusColors[agent.status as keyof typeof statusColors]} text-white px-2 py-1 text-xs font-semibold rounded-full`}>
  {statusLabels[agent.status as keyof typeof statusLabels]}
</Badge>
              </div>
              <div className="w-12 h-12 mb-2 transform translate-y-7 mx-auto -mt-12 rounded-full overflow-hidden border-4 border-blue-500 relative z-20 bg-gray-800">
                <img
                  src={agent.image}
                  alt={agent.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="pt-4 pb-2">
  <h3 className="text-xl font-bold mb-2 text-center text-blue-300">{agent.name}</h3>
  
  <p className="text-gray-300 text-sm text-center">

    {expandedAgentId === agent.id ? agent.description : (
      <>
        {agent.description.slice(0, 100)}
        {agent.description.length > 100 && (
          <span
            className="text-blue-400 cursor-pointer"
            onClick={() => {
              setSelectedAgent(agent);
              setShowModal(true);
            }}
          >
            &nbsp;&nbsp;&nbsp;...more
          </span>
        )}
      </>
    )}
  </p>
  {showModal && selectedAgent && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white p-6 rounded-lg max-w-lg w-full z-60">
      {/* Display the correct agent image */}
      <img
        src={selectedAgent.image}
        alt={selectedAgent.name}
        className="w-24 h-24 mx-auto rounded-full mb-4 object-cover"
      />
      <h3 className="text-xl font-bold mb-4 text-center text-blue-300">{selectedAgent.name}</h3>
      <p className="text-gray-700 mb-6">{selectedAgent.description}</p>
      <Button className="w-full bg-blue-500 text-white" onClick={() => setShowModal(false)}>
        Close
      </Button>
    </div>
  </div>
)}
</CardContent>

              <CardFooter className="pb-4">
                <Button
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white transition-all duration-300 rounded-full py-2"
                  disabled={agent.status === "coming-soon"}
                  onClick={() => launchAgent(agent.id)}
                >
                  <span className="font-semibold mr-2">Launch</span>
                  <Rocket className="h-5 w-5 animate-bounce" />
                </Button>
                
              </CardFooter>
              <div className="mb-2 flex flex-wrap justify-left">
                  {agent.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="mr-1 mb-1">
                      {tag}
                    </Badge>
                  ))}
                </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}