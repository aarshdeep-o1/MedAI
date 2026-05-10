"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  Activity, 
  Users, 
  MessageSquare, 
  LayoutDashboard,
  Stethoscope
} from "lucide-react"

const navItems = [
  {
    href: "/",
    label: "Register Patient",
    icon: Users,
  },
  {
    href: "/queue",
    label: "Queue Status",
    icon: Activity,
  },
  {
    href: "/admin",
    label: "Admin Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/chatbot",
    label: "AI Chatbot",
    icon: MessageSquare,
  },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Stethoscope className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            Medi<span className="text-primary">AI</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Mobile Navigation */}
        <nav className="md:hidden flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-center p-2 rounded-lg transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
                title={item.label}
              >
                <Icon className="h-5 w-5" />
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
