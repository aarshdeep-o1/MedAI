"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { 
  Activity, 
  Clock, 
  Users, 
  Ticket,
  Search,
  AlertCircle,
  CheckCircle2,
  Timer,
  ArrowRight
} from "lucide-react"
import { cn } from "@/lib/utils"

interface QueuePatient {
  id: string
  tokenNumber: string
  name: string
  department: string
  urgency: "critical" | "high" | "medium" | "low"
  position: number
  estimatedWait: number
  status: "waiting" | "in-progress" | "completed"
}

// Mock data
const mockQueueData: QueuePatient[] = [
  { id: "1", tokenNumber: "MED-1234", name: "Rahul Sharma", department: "Cardiology", urgency: "critical", position: 1, estimatedWait: 5, status: "in-progress" },
  { id: "2", tokenNumber: "MED-1235", name: "Priya Patel", department: "Emergency", urgency: "high", position: 2, estimatedWait: 12, status: "waiting" },
  { id: "3", tokenNumber: "MED-1236", name: "Amit Kumar", department: "General Medicine", urgency: "medium", position: 3, estimatedWait: 18, status: "waiting" },
  { id: "4", tokenNumber: "MED-1237", name: "Sneha Gupta", department: "Orthopedics", urgency: "low", position: 4, estimatedWait: 25, status: "waiting" },
  { id: "5", tokenNumber: "MED-1238", name: "Vikram Singh", department: "Neurology", urgency: "high", position: 5, estimatedWait: 32, status: "waiting" },
  { id: "6", tokenNumber: "MED-1239", name: "Anita Verma", department: "Pediatrics", urgency: "medium", position: 6, estimatedWait: 40, status: "waiting" },
]

const urgencyConfig = {
  critical: { label: "Critical", color: "bg-red-500", textColor: "text-red-500" },
  high: { label: "High", color: "bg-orange-500", textColor: "text-orange-500" },
  medium: { label: "Medium", color: "bg-yellow-500", textColor: "text-yellow-500" },
  low: { label: "Low", color: "bg-green-500", textColor: "text-green-500" },
}

export default function QueueStatusPage() {
  const [searchToken, setSearchToken] = useState("")
  const [selectedPatient, setSelectedPatient] = useState<QueuePatient | null>(null)
  const [queueData, setQueueData] = useState(mockQueueData)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const handleSearch = () => {
    const found = queueData.find(p => 
      p.tokenNumber.toLowerCase() === searchToken.toLowerCase()
    )
    setSelectedPatient(found || null)
  }

  const totalPatients = queueData.filter(p => p.status === "waiting").length
  const avgWaitTime = Math.round(queueData.reduce((acc, p) => acc + p.estimatedWait, 0) / queueData.length)

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container py-8 md:py-12">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <Activity className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-balance">
            Queue Status
          </h1>
          <p className="mt-2 text-muted-foreground text-pretty">
            Track your position in real-time and view estimated wait times
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Patients Waiting</p>
                  <p className="text-2xl font-bold">{totalPatients}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/20">
                  <Timer className="h-6 w-6 text-accent-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg Wait Time</p>
                  <p className="text-2xl font-bold">{avgWaitTime} min</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
                  <Clock className="h-6 w-6 text-secondary-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Current Time</p>
                  <p className="text-2xl font-bold font-mono">
                    {currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search Token */}
        <Card className="border-0 shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-primary" />
              Search Your Token
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Input
                placeholder="Enter token number (e.g., MED-1234)"
                value={searchToken}
                onChange={(e) => setSearchToken(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="h-12 text-base"
              />
              <Button onClick={handleSearch} className="h-12 px-6">
                <Search className="h-5 w-5 mr-2" />
                Search
              </Button>
            </div>

            {/* Search Result */}
            {selectedPatient && (
              <div className="mt-6 rounded-xl border-2 border-primary bg-primary/5 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold">
                      #{selectedPatient.position}
                    </div>
                    <div>
                      <p className="font-semibold text-lg">{selectedPatient.name}</p>
                      <p className="text-sm text-muted-foreground">{selectedPatient.tokenNumber}</p>
                    </div>
                  </div>
                  <Badge className={cn(
                    "text-white",
                    urgencyConfig[selectedPatient.urgency].color
                  )}>
                    {urgencyConfig[selectedPatient.urgency].label} Priority
                  </Badge>
                </div>
                
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-lg bg-card p-4 text-center">
                    <p className="text-sm text-muted-foreground">Department</p>
                    <p className="font-semibold">{selectedPatient.department}</p>
                  </div>
                  <div className="rounded-lg bg-card p-4 text-center">
                    <p className="text-sm text-muted-foreground">Est. Wait Time</p>
                    <p className="font-semibold">{selectedPatient.estimatedWait} min</p>
                  </div>
                  <div className="rounded-lg bg-card p-4 text-center">
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="font-semibold capitalize">{selectedPatient.status.replace("-", " ")}</p>
                  </div>
                </div>
              </div>
            )}

            {searchToken && !selectedPatient && (
              <div className="mt-6 rounded-xl border bg-destructive/10 p-6 text-center">
                <AlertCircle className="mx-auto h-8 w-8 text-destructive mb-2" />
                <p className="font-medium text-destructive">Token not found</p>
                <p className="text-sm text-muted-foreground">Please check your token number and try again</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Live Queue */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Live Queue
              <span className="ml-2 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {queueData.map((patient, index) => (
                <div
                  key={patient.id}
                  className={cn(
                    "flex items-center justify-between rounded-xl border p-4 transition-all",
                    patient.status === "in-progress" 
                      ? "border-primary bg-primary/5" 
                      : "bg-card hover:bg-secondary/50",
                    index === 0 && "ring-2 ring-primary ring-offset-2"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-lg font-bold text-sm",
                      patient.status === "in-progress" 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-secondary text-secondary-foreground"
                    )}>
                      #{patient.position}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{patient.name}</p>
                        {patient.status === "in-progress" && (
                          <Badge variant="outline" className="text-primary border-primary">
                            <ArrowRight className="h-3 w-3 mr-1" />
                            Now Serving
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {patient.tokenNumber} • {patient.department}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="hidden md:block text-right">
                      <p className="text-sm text-muted-foreground">Est. Wait</p>
                      <p className="font-semibold">{patient.estimatedWait} min</p>
                    </div>
                    <div className={cn(
                      "h-3 w-3 rounded-full",
                      urgencyConfig[patient.urgency].color
                    )} title={`${urgencyConfig[patient.urgency].label} Priority`} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
