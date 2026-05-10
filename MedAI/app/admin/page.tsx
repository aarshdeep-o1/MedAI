"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  LayoutDashboard,
  Users,
  Clock,
  Activity,
  TrendingUp,
  Bell,
  CheckCircle2,
  PhoneCall,
  AlertTriangle,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Mock data for charts
const hourlyPatientData = [
  { hour: "8AM", patients: 12 },
  { hour: "9AM", patients: 25 },
  { hour: "10AM", patients: 38 },
  { hour: "11AM", patients: 45 },
  { hour: "12PM", patients: 32 },
  { hour: "1PM", patients: 28 },
  { hour: "2PM", patients: 42 },
  { hour: "3PM", patients: 35 },
  { hour: "4PM", patients: 48 },
  { hour: "5PM", patients: 30 },
]

const waitTimeData = [
  { day: "Mon", avgWait: 18 },
  { day: "Tue", avgWait: 22 },
  { day: "Wed", avgWait: 15 },
  { day: "Thu", avgWait: 28 },
  { day: "Fri", avgWait: 25 },
  { day: "Sat", avgWait: 12 },
  { day: "Sun", avgWait: 10 },
]

const departmentData = [
  { name: "General", value: 35, color: "#0d9488" },
  { name: "Cardiology", value: 25, color: "#f97316" },
  { name: "Orthopedics", value: 18, color: "#8b5cf6" },
  { name: "Neurology", value: 12, color: "#ec4899" },
  { name: "Pediatrics", value: 10, color: "#22c55e" },
]

const urgencyDistribution = [
  { level: "Critical", count: 8, color: "#ef4444" },
  { level: "High", count: 15, color: "#f97316" },
  { level: "Medium", count: 35, color: "#eab308" },
  { level: "Low", count: 42, color: "#22c55e" },
]

interface QueuePatient {
  id: string
  tokenNumber: string
  name: string
  department: string
  urgency: "critical" | "high" | "medium" | "low"
  waitTime: number
  status: "waiting" | "in-progress" | "completed"
}

const mockQueuePatients: QueuePatient[] = [
  { id: "1", tokenNumber: "MED-1234", name: "Rahul Sharma", department: "Cardiology", urgency: "critical", waitTime: 5, status: "in-progress" },
  { id: "2", tokenNumber: "MED-1235", name: "Priya Patel", department: "Emergency", urgency: "high", waitTime: 12, status: "waiting" },
  { id: "3", tokenNumber: "MED-1236", name: "Amit Kumar", department: "General", urgency: "medium", waitTime: 18, status: "waiting" },
  { id: "4", tokenNumber: "MED-1237", name: "Sneha Gupta", department: "Orthopedics", urgency: "low", waitTime: 25, status: "waiting" },
  { id: "5", tokenNumber: "MED-1238", name: "Vikram Singh", department: "Neurology", urgency: "high", waitTime: 8, status: "waiting" },
]

const urgencyConfig = {
  critical: { label: "Critical", color: "bg-red-500", textColor: "text-red-600" },
  high: { label: "High", color: "bg-orange-500", textColor: "text-orange-600" },
  medium: { label: "Medium", color: "bg-yellow-500", textColor: "text-yellow-600" },
  low: { label: "Low", color: "bg-green-500", textColor: "text-green-600" },
}

export default function AdminDashboardPage() {
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [patients, setPatients] = useState(mockQueuePatients)

  const handleCallNext = (patientId: string) => {
    setPatients(prev => prev.map(p => ({
      ...p,
      status: p.id === patientId ? "in-progress" : (p.status === "in-progress" ? "waiting" : p.status)
    })))
  }

  const handleMarkComplete = (patientId: string) => {
    setPatients(prev => prev.map(p => ({
      ...p,
      status: p.id === patientId ? "completed" : p.status
    })))
  }

  const totalPatients = 156
  const avgWaitTime = 22
  const criticalCases = 8
  const completedToday = 124

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <LayoutDashboard className="h-8 w-8 text-primary" />
              Admin Dashboard
            </h1>
            <p className="mt-1 text-muted-foreground">
              Real-time hospital analytics and queue management
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4 mr-2" />
              Alerts
            </Button>
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="cardiology">Cardiology</SelectItem>
                <SelectItem value="orthopedics">Orthopedics</SelectItem>
                <SelectItem value="neurology">Neurology</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Patients Today</p>
                  <p className="text-3xl font-bold">{totalPatients}</p>
                  <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3" /> +12% from yesterday
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <Users className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Wait Time</p>
                  <p className="text-3xl font-bold">{avgWaitTime} min</p>
                  <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3" /> -5 min from avg
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/20">
                  <Clock className="h-6 w-6 text-accent-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md border-l-4 border-l-red-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Critical Cases</p>
                  <p className="text-3xl font-bold text-red-600">{criticalCases}</p>
                  <p className="text-xs text-muted-foreground mt-1">Requires attention</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed Today</p>
                  <p className="text-3xl font-bold">{completedToday}</p>
                  <p className="text-xs text-muted-foreground mt-1">79% completion rate</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="queue" className="space-y-6">
          <TabsList className="bg-secondary">
            <TabsTrigger value="queue">Queue Management</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Queue Management Tab */}
          <TabsContent value="queue" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Current Queue
                  <span className="ml-2 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                </CardTitle>
                <CardDescription>
                  Manage patient queue and call next patients
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {patients.filter(p => p.status !== "completed").map((patient) => (
                    <div
                      key={patient.id}
                      className={cn(
                        "flex items-center justify-between rounded-xl border p-4 transition-all",
                        patient.status === "in-progress" 
                          ? "border-primary bg-primary/5 ring-2 ring-primary ring-offset-2" 
                          : "bg-card hover:bg-secondary/50"
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "h-3 w-3 rounded-full",
                          urgencyConfig[patient.urgency].color
                        )} />
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold">{patient.name}</p>
                            <Badge variant="outline" className={urgencyConfig[patient.urgency].textColor}>
                              {urgencyConfig[patient.urgency].label}
                            </Badge>
                            {patient.status === "in-progress" && (
                              <Badge className="bg-primary">Now Serving</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {patient.tokenNumber} • {patient.department} • Waiting: {patient.waitTime} min
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {patient.status === "waiting" && (
                          <Button 
                            size="sm" 
                            onClick={() => handleCallNext(patient.id)}
                          >
                            <PhoneCall className="h-4 w-4 mr-1" />
                            Call Next
                          </Button>
                        )}
                        {patient.status === "in-progress" && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="text-green-600 border-green-600 hover:bg-green-50"
                            onClick={() => handleMarkComplete(patient.id)}
                          >
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            Mark Complete
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Patient Flow Chart */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Patient Flow (Hourly)</CardTitle>
                  <CardDescription>Number of patients per hour today</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      patients: {
                        label: "Patients",
                        color: "#0d9488",
                      },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={hourlyPatientData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="hour" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="patients" fill="#0d9488" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Wait Time Trend */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Average Wait Time Trend</CardTitle>
                  <CardDescription>Average waiting time per day this week</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      avgWait: {
                        label: "Avg Wait (min)",
                        color: "#f97316",
                      },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={waitTimeData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line 
                          type="monotone" 
                          dataKey="avgWait" 
                          stroke="#f97316" 
                          strokeWidth={3}
                          dot={{ fill: "#f97316", strokeWidth: 2 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Department Distribution */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Department Distribution</CardTitle>
                  <CardDescription>Patient distribution across departments</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      value: {
                        label: "Patients",
                      },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={departmentData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={2}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {departmentData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Urgency Distribution */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Urgency Distribution</CardTitle>
                  <CardDescription>Patients categorized by urgency level</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      count: {
                        label: "Patients",
                      },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={urgencyDistribution} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                        <XAxis type="number" />
                        <YAxis dataKey="level" type="category" width={80} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                          {urgencyDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
