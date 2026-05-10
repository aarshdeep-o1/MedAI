"use client"

import { useState, useRef, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  MessageSquare,
  Send,
  Bot,
  User,
  Sparkles,
  Calendar,
  Stethoscope,
  Heart,
  Clock,
  AlertCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  intent?: string
  department?: string
  urgency?: number
}

const quickActions = [
  { label: "Book Appointment", icon: Calendar, prompt: "I want to book an appointment" },
  { label: "Check Symptoms", icon: Stethoscope, prompt: "I have some symptoms I want to check" },
  { label: "Mental Health Support", icon: Heart, prompt: "I need mental health support" },
  { label: "Queue Status", icon: Clock, prompt: "What is my queue status?" },
]

// Simulated AI responses
const getAIResponse = (message: string): { content: string; intent?: string; department?: string; urgency?: number } => {
  const lowerMessage = message.toLowerCase()
  
  if (lowerMessage.includes("appointment") || lowerMessage.includes("book")) {
    return {
      content: "I can help you book an appointment. Which department would you like to visit?\n\n• General Medicine\n• Cardiology\n• Orthopedics\n• Neurology\n• Pediatrics\n\nPlease tell me your preferred department and date.",
      intent: "appointment",
      department: "General",
    }
  }
  
  if (lowerMessage.includes("chest pain") || lowerMessage.includes("heart")) {
    return {
      content: "I understand you're experiencing chest pain. This could be a serious symptom that requires immediate attention.\n\n**Urgency Level: HIGH**\n\nI recommend:\n1. If severe, please visit our Emergency Department immediately\n2. If mild, I can register you for Cardiology with priority status\n\nWould you like me to register you now?",
      intent: "symptom",
      department: "Cardiology",
      urgency: 9,
    }
  }
  
  if (lowerMessage.includes("headache") || lowerMessage.includes("head pain")) {
    return {
      content: "I see you're experiencing headache. Let me ask a few questions to better assess your condition:\n\n1. How long have you had this headache?\n2. Is it accompanied by nausea or sensitivity to light?\n3. Rate your pain from 1-10\n\nBased on your answers, I'll recommend the appropriate department.",
      intent: "symptom",
      department: "Neurology",
      urgency: 4,
    }
  }
  
  if (lowerMessage.includes("anxious") || lowerMessage.includes("stress") || lowerMessage.includes("mental") || lowerMessage.includes("depress")) {
    return {
      content: "I hear you, and I want you to know that it's completely okay to seek help. Your mental health is just as important as your physical health.\n\n**You're not alone in this.**\n\nOur hospital offers:\n• Confidential counseling sessions\n• Stress management programs\n• Support groups\n\nWould you like me to book a consultation with our mental health specialist? All conversations are completely confidential.",
      intent: "mental_health",
      department: "Psychology",
      urgency: 6,
    }
  }
  
  if (lowerMessage.includes("queue") || lowerMessage.includes("status") || lowerMessage.includes("wait")) {
    return {
      content: "I can help you check your queue status. Please provide your token number (e.g., MED-1234), and I'll give you real-time updates on your position and estimated wait time.",
      intent: "queue_status",
    }
  }
  
  if (lowerMessage.includes("fever") || lowerMessage.includes("cold") || lowerMessage.includes("cough")) {
    return {
      content: "I understand you're experiencing fever/cold symptoms. These are common but should be monitored.\n\n**Recommended Department: General Medicine**\n\nCan you tell me:\n1. Your current temperature (if known)\n2. How many days have you had these symptoms?\n3. Any other symptoms like body ache?\n\nBased on this, I'll assess the urgency and help you register.",
      intent: "symptom",
      department: "General Medicine",
      urgency: 5,
    }
  }
  
  return {
    content: "Hello! I'm MediAI, your healthcare assistant. I can help you with:\n\n• **Booking appointments** - Schedule visits with any department\n• **Symptom checking** - Describe your symptoms and I'll assess urgency\n• **Mental health support** - Confidential support and counseling\n• **Queue status** - Check your position in the queue\n\nHow can I assist you today?",
    intent: "greeting",
  }
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm MediAI, your AI healthcare assistant. I can help you with booking appointments, checking symptoms, mental health support, and more.\n\nHow can I assist you today?",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate AI thinking time
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000))

    const response = getAIResponse(inputValue)
    
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: response.content,
      timestamp: new Date(),
      intent: response.intent,
      department: response.department,
      urgency: response.urgency,
    }

    setMessages((prev) => [...prev, assistantMessage])
    setIsTyping(false)
    inputRef.current?.focus()
  }

  const handleQuickAction = (prompt: string) => {
    setInputValue(prompt)
    inputRef.current?.focus()
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container py-8 md:py-12">
        <div className="mx-auto max-w-3xl">
          {/* Header */}
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <MessageSquare className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-balance">
              AI Healthcare Assistant
            </h1>
            <p className="mt-2 text-muted-foreground text-pretty">
              Chat with MediAI for appointments, symptom checking, and support
            </p>
          </div>

          {/* Quick Actions */}
          <div className="mb-4 flex flex-wrap gap-2 justify-center">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <Button
                  key={action.label}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAction(action.prompt)}
                  className="gap-2"
                >
                  <Icon className="h-4 w-4 text-primary" />
                  {action.label}
                </Button>
              )
            })}
          </div>

          {/* Chat Container */}
          <Card className="border-0 shadow-lg overflow-hidden">
            <CardHeader className="bg-primary/5 border-b">
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <Bot className="h-5 w-5 text-primary-foreground" />
                </div>
                MediAI
                <Badge variant="outline" className="ml-2 text-xs">
                  <Sparkles className="h-3 w-3 mr-1" />
                  AI Powered
                </Badge>
              </CardTitle>
            </CardHeader>

            <CardContent className="p-0">
              {/* Messages */}
              <ScrollArea className="h-[400px] p-4 chat-scrollbar" ref={scrollRef}>
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "flex gap-3",
                        message.role === "user" ? "justify-end" : "justify-start"
                      )}
                    >
                      {message.role === "assistant" && (
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary">
                          <Bot className="h-5 w-5 text-primary-foreground" />
                        </div>
                      )}
                      
                      <div
                        className={cn(
                          "max-w-[80%] rounded-2xl px-4 py-3",
                          message.role === "user"
                            ? "bg-primary text-primary-foreground rounded-br-md"
                            : "bg-secondary text-secondary-foreground rounded-bl-md"
                        )}
                      >
                        <div className="whitespace-pre-wrap text-sm leading-relaxed">
                          {message.content.split('\n').map((line, i) => (
                            <p key={i} className={cn(
                              line.startsWith('**') && line.endsWith('**') && "font-semibold",
                              line.startsWith('•') && "ml-2"
                            )}>
                              {line.replace(/\*\*/g, '')}
                            </p>
                          ))}
                        </div>
                        
                        {/* Intent badges */}
                        {message.intent && message.role === "assistant" && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {message.department && (
                              <Badge variant="outline" className="text-xs bg-background">
                                <Stethoscope className="h-3 w-3 mr-1" />
                                {message.department}
                              </Badge>
                            )}
                            {message.urgency && (
                              <Badge 
                                variant="outline" 
                                className={cn(
                                  "text-xs bg-background",
                                  message.urgency >= 8 && "border-red-500 text-red-600",
                                  message.urgency >= 5 && message.urgency < 8 && "border-orange-500 text-orange-600",
                                  message.urgency < 5 && "border-green-500 text-green-600"
                                )}
                              >
                                <AlertCircle className="h-3 w-3 mr-1" />
                                Urgency: {message.urgency}/10
                              </Badge>
                            )}
                          </div>
                        )}
                        
                        <p className={cn(
                          "text-xs mt-2",
                          message.role === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                        )}>
                          {message.timestamp.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>

                      {message.role === "user" && (
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary">
                          <User className="h-5 w-5 text-secondary-foreground" />
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="flex gap-3 justify-start">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary">
                        <Bot className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <div className="bg-secondary rounded-2xl rounded-bl-md px-4 py-3">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                          <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                          <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Input Area */}
              <div className="border-t p-4 bg-card">
                <div className="flex gap-3">
                  <Input
                    ref={inputRef}
                    placeholder="Type your message..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                    className="h-12 text-base"
                    disabled={isTyping}
                  />
                  <Button 
                    onClick={handleSend} 
                    className="h-12 px-6"
                    disabled={!inputValue.trim() || isTyping}
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  MediAI provides general guidance only. For emergencies, please call 108 or visit the nearest hospital.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
