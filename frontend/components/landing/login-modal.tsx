'use client'

import { useState } from 'react'
import { Button } from "@/components/landing/ui/button_login"
import { Input } from "@/components/landing/ui/input_login"
import { Label } from "@/components/landing/ui/label_login"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/landing/ui/dialog_login"
import { Github, Twitter, Facebook, User } from 'lucide-react'

export function LoginModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleContinue = () => {
    // Here you would typically send the OTP to the user's email
    // For this example, we'll just simulate it
    setOtpSent(true)
  }

  const handleSubmitOtp = () => {
    // Here you would typically verify the OTP
    // For this example, we'll just simulate a successful login
    setIsLoggedIn(true)
    setIsOpen(false)
  }

  if (isLoggedIn) {
    return (
      <Button className="bg-blue-500 text-white hover:bg-blue-600 transition-colors">
        <User className="w-5 h-5 mr-2" />
        My Account
      </Button>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-500 text-white hover:bg-blue-600 transition-colors">
          Login
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-gray-800 text-gray-100 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            {otpSent ? 'Enter OTP' : 'Login to RockGenie'}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {!otpSent ? (
            <>
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-gray-300">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="Enter your email" 
                  className="bg-gray-700 text-gray-100 border-gray-600 focus:border-blue-400"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <Button 
                className="w-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                onClick={handleContinue}
              >
                Continue
              </Button>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-600" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-gray-800 px-2 text-gray-400">Or continue with</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="w-full bg-gray-700 text-gray-100 border-gray-600 hover:bg-gray-600 hover:text-white">
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Google
                </Button>
                <Button variant="outline" className="w-full bg-gray-700 text-gray-100 border-gray-600 hover:bg-gray-600 hover:text-white">
                  <Github className="w-5 h-5 mr-2" />
                  Github
                </Button>
                <Button variant="outline" className="w-full bg-gray-700 text-gray-100 border-gray-600 hover:bg-gray-600 hover:text-white">
                  <Twitter className="w-5 h-5 mr-2" />
                  Twitter
                </Button>
                <Button variant="outline" className="w-full bg-gray-700 text-gray-100 border-gray-600 hover:bg-gray-600 hover:text-white">
                  <Facebook className="w-5 h-5 mr-2" />
                  Facebook
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="grid gap-2">
                <Label htmlFor="otp" className="text-gray-300">Enter OTP</Label>
                <Input 
                  id="otp" 
                  type="text" 
                  placeholder="Enter 6-digit OTP" 
                  className="bg-gray-700 text-gray-100 border-gray-600 focus:border-blue-400"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                />
              </div>
              <Button 
                className="w-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                onClick={handleSubmitOtp}
              >
                Submit
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}