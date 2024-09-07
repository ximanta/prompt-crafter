'use client'

import { useState } from 'react'
import Link from "next/link"
import { Button } from "@/components/landing/ui/button_landing"
import { Input } from "@/components/landing/ui/input_landing"
import { Sparkles, Code, PenTool, Zap, ChevronRight } from "lucide-react"
import { Pricing } from "./pricing"
import LoginButton from "./LoginButton"
import Profile from "@/components/common/user_profile"
import { useAuth0 } from "@auth0/auth0-react"
import LogoutButton from "./LogoutButton"


export function LandingPage() {
  const [currentView, setCurrentView] = useState('home')
  const { isAuthenticated, isLoading, logout, user } = useAuth0()

  


  const renderView = () => {
    switch(currentView) {
      case 'pricing':
        return <Pricing />
      default:
        return (
          <>
            <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-gray-900 to-gray-800">
              <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center space-y-4 text-center">
                  <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                      Unleash the Power of AI Agents
                    </h1>
                    <p className="mx-auto max-w-[700px] text-gray-400 md:text-xl">
                      RockGenie brings you a collection of specialized GenAI agents, each designed to excel at specific tasks.
                    </p>
                  </div>
                  <div className="space-x-4">
                    <Button className="bg-blue-500 text-white hover:bg-blue-600 transition-colors">Get Started</Button>
                    <Button variant="outline" className="text-blue-400 border-blue-400 hover:bg-blue-400/10 transition-colors">Learn More</Button>
                  </div>
                </div>
              </div>
            </section>
            <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-800">
              <div className="container px-4 md:px-6">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">Our AI Agents</h2>
                <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
                  <div className="flex flex-col items-center space-y-3 p-6 bg-gray-900 rounded-lg border border-gray-700 transition-transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20">
                    <Code className="h-12 w-12 text-blue-400" />
                    <h3 className="text-xl font-bold text-blue-400">CodeCrafter</h3>
                    <p className="text-center text-gray-400">Expert in generating and refactoring code across multiple languages.</p>
                  </div>
                  <div className="flex flex-col items-center space-y-3 p-6 bg-gray-900 rounded-lg border border-gray-700 transition-transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20">
                    <PenTool className="h-12 w-12 text-purple-400" />
                    <h3 className="text-xl font-bold text-purple-400">DesignDiva</h3>
                    <p className="text-center text-gray-400">Creates stunning visual designs and UI/UX concepts.</p>
                  </div>
                  <div className="flex flex-col items-center space-y-3 p-6 bg-gray-900 rounded-lg border border-gray-700 transition-transform hover:scale-105 hover:shadow-lg hover:shadow-pink-500/20">
                    <Zap className="h-12 w-12 text-pink-400" />
                    <h3 className="text-xl font-bold text-pink-400">DataWizard</h3>
                    <p className="text-center text-gray-400">Analyzes complex datasets and provides actionable insights.</p>
                  </div>
                </div>
              </div>
            </section>
            <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-900">
              <div className="container px-4 md:px-6">
                <div className="grid gap-10 px-10 md:gap-16 md:grid-cols-2">
                  <div className="space-y-4">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                      Experience the Future of AI Assistance
                    </h2>
                    <p className="text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                      Our GenAI agents are constantly learning and evolving, providing you with cutting-edge AI capabilities for your projects.
                    </p>
                    <Button className="inline-flex items-center bg-blue-500 text-white hover:bg-blue-600 transition-colors">
                      Try It Now
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="relative w-[300px] h-[300px] bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center animate-pulse">
                      <Sparkles className="h-24 w-24 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-blue-900 to-purple-900 text-white">
              <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                  <div className="space-y-2">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                      Ready to Rock with AI?
                    </h2>
                    <p className="mx-auto max-w-[600px] text-blue-200 md:text-xl">
                      Join RockGenie today and supercharge your projects with our specialized AI agents.
                    </p>
                  </div>
                  <div className="w-full max-w-sm space-y-2">
                    <form className="flex space-x-2">
                      <Input
                        className="max-w-lg flex-1 bg-white/10 text-white placeholder-blue-200"
                        placeholder="Enter your email"
                        type="email"
                      />
                      <Button className="bg-blue-500 text-white hover:bg-blue-600 transition-colors" type="submit">
                        Sign Up
                      </Button>
                    </form>
                    <p className="text-xs text-blue-200">
                      By signing up, you agree to our Terms & Conditions.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </>
        )
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b border-gray-800">
        <Link 
          className="flex items-center justify-center cursor-pointer" 
          href="#"
          onClick={() => setCurrentView('home')}
        >
          <Sparkles className="h-6 w-6 text-blue-400" />
          <span className="ml-2 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">RockGenie</span>
        </Link>
        <nav className="ml-auto flex items-center gap-4 sm:gap-6">
          <button 
            className="text-sm font-medium hover:text-blue-400 transition-colors cursor-pointer" 
            onClick={() => setCurrentView('home')}
          >
            Features
          </button>
          <button 
            className="text-sm font-medium hover:text-blue-400 transition-colors cursor-pointer" 
            onClick={() => setCurrentView('home')}
          >
            Agents
          </button>
          <button 
            className="text-sm font-medium hover:text-blue-400 transition-colors cursor-pointer" 
            onClick={() => setCurrentView('pricing')}
          >
            Pricing
          </button>
          <button className="text-sm font-medium hover:text-blue-400 transition-colors cursor-pointer">
            Contact
          </button>
          {isLoading && <div>Loading...</div>}
          {!isLoading && !isAuthenticated && <LoginButton />}
          {!isLoading && isAuthenticated && (
            <div>
              <p>Welcome, {user?.name}</p>
              <LogoutButton />
            </div>
          )}
        </nav>
      </header>
      <main className="flex-1">
        {renderView()}
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-gray-800">
        <p className="text-xs text-gray-400">© 2023 RockGenie. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:text-blue-400 transition-colors" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:text-blue-400 transition-colors" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}