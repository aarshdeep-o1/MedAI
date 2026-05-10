"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  UserPlus, 
  Stethoscope, 
  Heart, 
  Brain, 
  Bone, 
  Eye,
  Baby,
  Activity,
  CheckCircle2,
  Clock,
  Ticket
} from "lucide-react"

const departments = [
  { value: "general", label: "General Medicine", icon: Stethoscope },
  { value: "cardiology", label: "Cardiology", icon: Heart },
  { value: "neurology", label: "Neurology", icon: Brain },
  { value: "orthopedics", label: "Orthopedics", icon: Bone },
  { value: "ophthalmology", label: "Ophthalmology", icon: Eye },
  { value: "pediatrics", label: "Pediatrics", icon: Baby },
  { value: "emergency", label: "Emergency", icon: Activity },
]

interface RegistrationResult {
  tokenNumber: string
  estimatedWait: string
  position: number
  department: string
}

export default function PatientRegistrationPage() {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    department: "",
    symptoms: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<RegistrationResult | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Mock response
    const deptLabel = departments.find(d => d.value === formData.department)?.label || formData.department
    setResult({
      tokenNumber: `MED-${Math.floor(1000 + Math.random() * 9000)}`,
      estimatedWait: `${Math.floor(10 + Math.random() * 30)} minutes`,
      position: Math.floor(1 + Math.random() * 10),
      department: deptLabel,
    })

    setIsSubmitting(false)
  }

  const resetForm = () => {
    setFormData({ name: "", age: "", department: "", symptoms: "" })
    setResult(null)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container py-8 md:py-12">
        <div className="mx-auto max-w-2xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <UserPlus className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-balance">
              Patient Registration
            </h1>
            <p className="mt-2 text-muted-foreground text-pretty">
              Register as a new patient and get your queue token instantly
            </p>
          </div>

          {!result ? (
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Enter Your Details</CardTitle>
                <CardDescription>
                  Fill in the form below to register and receive your queue position
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Field */}
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="h-12"
                    />
                  </div>

                  {/* Age Field */}
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="Enter your age"
                      min="0"
                      max="150"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      required
                      className="h-12"
                    />
                  </div>

                  {/* Department Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Select
                      value={formData.department}
                      onValueChange={(value) => setFormData({ ...formData, department: value })}
                      required
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => {
                          const Icon = dept.icon
                          return (
                            <SelectItem key={dept.value} value={dept.value}>
                              <div className="flex items-center gap-2">
                                <Icon className="h-4 w-4 text-primary" />
                                {dept.label}
                              </div>
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Symptoms Field */}
                  <div className="space-y-2">
                    <Label htmlFor="symptoms">Symptoms</Label>
                    <Textarea
                      id="symptoms"
                      placeholder="Describe your symptoms in detail..."
                      value={formData.symptoms}
                      onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                      required
                      className="min-h-[120px] resize-none"
                    />
                    <p className="text-xs text-muted-foreground">
                      Our AI will analyze your symptoms to determine urgency level
                    </p>
                  </div>

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    className="w-full h-12 text-base font-semibold"
                    disabled={isSubmitting || !formData.name || !formData.age || !formData.department || !formData.symptoms}
                  >
                    {isSubmitting ? (
                      <>
                        <Activity className="mr-2 h-5 w-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <UserPlus className="mr-2 h-5 w-5" />
                        Register Patient
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-0 shadow-lg overflow-hidden">
              <div className="bg-primary p-6 text-center text-primary-foreground">
                <CheckCircle2 className="mx-auto h-12 w-12 mb-3" />
                <h2 className="text-2xl font-bold">Registration Successful!</h2>
                <p className="text-primary-foreground/80 mt-1">
                  You have been added to the queue
                </p>
              </div>
              
              <CardContent className="p-6">
                <div className="grid gap-4 md:grid-cols-3">
                  {/* Token Number */}
                  <div className="rounded-xl bg-secondary p-4 text-center">
                    <Ticket className="mx-auto h-6 w-6 text-primary mb-2" />
                    <p className="text-sm text-muted-foreground">Token Number</p>
                    <p className="text-2xl font-bold text-foreground">{result.tokenNumber}</p>
                  </div>

                  {/* Position */}
                  <div className="rounded-xl bg-secondary p-4 text-center">
                    <Activity className="mx-auto h-6 w-6 text-primary mb-2" />
                    <p className="text-sm text-muted-foreground">Queue Position</p>
                    <p className="text-2xl font-bold text-foreground">#{result.position}</p>
                  </div>

                  {/* Wait Time */}
                  <div className="rounded-xl bg-secondary p-4 text-center">
                    <Clock className="mx-auto h-6 w-6 text-primary mb-2" />
                    <p className="text-sm text-muted-foreground">Est. Wait Time</p>
                    <p className="text-2xl font-bold text-foreground">{result.estimatedWait}</p>
                  </div>
                </div>

                <div className="mt-6 rounded-xl border bg-muted/50 p-4">
                  <p className="text-sm text-muted-foreground">Department</p>
                  <p className="font-semibold text-foreground">{result.department}</p>
                </div>

                <div className="mt-6 flex gap-3">
                  <Button variant="outline" onClick={resetForm} className="flex-1">
                    Register Another Patient
                  </Button>
                  <Button asChild className="flex-1">
                    <a href="/queue">View Queue Status</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
