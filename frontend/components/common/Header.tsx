import Link from "next/link"
import { Sparkles } from "lucide-react"
import LoginButton from "../landing/LoginButton"
import LogoutButton from "../landing/LogoutButton"
import { useAuth0 } from "@auth0/auth0-react"

interface HeaderProps {
  setCurrentView?: (view: string) => void
  currentView?: string
}

export function Header({ setCurrentView, currentView }: HeaderProps) {
  const { isAuthenticated, isLoading, user } = useAuth0()

  return (
    <header className="px-4 lg:px-6 h-14 flex items-center border-b border-gray-800 bg-gray-900 text-gray-100">
      <Link 
        className="flex items-center justify-center cursor-pointer" 
        href="/"
        onClick={() => setCurrentView && setCurrentView('home')}
      >
        <Sparkles className="h-6 w-6 text-blue-400" />
        <span className="ml-2 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">RockGenie</span>
      </Link>
      <nav className="ml-auto flex items-center gap-4 sm:gap-6">
        <button 
          className={`text-sm font-medium hover:text-blue-400 transition-colors cursor-pointer ${currentView === 'home' ? 'text-blue-400' : ''}`}
          onClick={() => setCurrentView && setCurrentView('home')}
        >
          Features
        </button>
        <button 
          className={`text-sm font-medium hover:text-blue-400 transition-colors cursor-pointer ${currentView === 'agent' ? 'text-blue-400' : ''}`}
          onClick={() => setCurrentView && setCurrentView('agent')}
        >
          Agents
        </button>
        <button 
          className={`text-sm font-medium hover:text-blue-400 transition-colors cursor-pointer ${currentView === 'pricing' ? 'text-blue-400' : ''}`}
          onClick={() => setCurrentView && setCurrentView('pricing')}
        >
          Pricing
        </button>
        <button className="text-sm font-medium hover:text-blue-400 transition-colors cursor-pointer">
          Contact
        </button>
        {isLoading && <div>Loading...</div>}
        {!isLoading && !isAuthenticated && <LoginButton />}
        {!isLoading && isAuthenticated && (
          <div className="flex items-center gap-2">
            <span>Welcome, {user?.name}</span>
            <LogoutButton />
          </div>
        )}
      </nav>
    </header>
  )
}