'use client'

import { useTheme } from '../common/ThemeProvider'

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme()

  console.log('Current theme:', theme) // Add this line for debugging

  return (
    <button onClick={() => {
      toggleTheme()
      console.log('Theme toggled to:', theme === 'light' ? 'dark' : 'light') // Add this line for debugging
    }}>
      Toggle {theme === 'light' ? 'Dark' : 'Light'} Mode
    </button>
  )
}