"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useSidebar } from "@/components/sidebar-context"
import {
  LayoutDashboard,
  Users,
  Settings,
  FileText,
  BarChart3,
  Package,
  ChevronDown,
  ChevronRight,
} from "lucide-react"
import { useState, useEffect } from "react"

type MenuItem = {
  title: string
  href?: string
  icon: React.ComponentType<{ className?: string }>
  children?: Omit<MenuItem, "children">[]
}

const menuItems: MenuItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "IP",
    icon: Package,
    children: [
      {
        title: "Nhãn hiệu",
        href: "/trademarks",
        icon: FileText,
      },
      {
        title: "Kiểu dáng",
        href: "/industrial-designs",
        icon: FileText,
      },
      {
        title: "Sáng chế",
        href: "/patents",
        icon: FileText,
      },
    ],
  },
  {
    title: "Users",
    href: "/users",
    icon: Users,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { isCollapsed } = useSidebar()
  const [openMenus, setOpenMenus] = useState<string[]>([])

  // Auto-open parent menu if child is active
  useEffect(() => {
    menuItems.forEach((item) => {
      if (item.children) {
        const hasActiveChild = item.children.some((child) => child.href === pathname)
        if (hasActiveChild && !openMenus.includes(item.title)) {
          setOpenMenus((prev) => [...prev, item.title])
        }
      }
    })
  }, [pathname])

  const toggleMenu = (title: string) => {
    setOpenMenus((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title]
    )
  }

  return (
    <div
      className={cn(
        "flex h-full flex-col border-r bg-card transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className={cn("flex h-12 items-center border-b px-6", isCollapsed && "justify-center px-4")}>
        {!isCollapsed && <h1 className="text-2xl font-bold">Admin IP</h1>}
        {isCollapsed && (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span className="text-sm font-bold">IP</span>
          </div>
        )}
      </div>
      <ScrollArea className="flex-1 px-2 py-3">
        <nav className="flex flex-col gap-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            const hasChildren = item.children && item.children.length > 0
            const isOpen = openMenus.includes(item.title)

            return (
              <div key={item.title}>
                {hasChildren ? (
                  <>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full gap-3 cursor-pointer",
                        isCollapsed ? "justify-center px-2" : "justify-start"
                      )}
                      onClick={() => toggleMenu(item.title)}
                      title={isCollapsed ? item.title : undefined}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {!isCollapsed && (
                        <>
                          <span className="flex-1 text-left">{item.title}</span>
                          {isOpen ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </>
                      )}
                    </Button>
                    {!isCollapsed && isOpen && item.children && (
                      <div className="ml-4 mt-1 space-y-1">
                        {item.children.map((child) => {
                          const ChildIcon = child.icon
                          const isChildActive = pathname === child.href
                          return (
                            <Link key={child.href} href={child.href!}>
                              <Button
                                variant={isChildActive ? "secondary" : "ghost"}
                                className={cn(
                                  "w-full gap-3 cursor-pointer justify-start",
                                  isChildActive && "bg-secondary"
                                )}
                                size="sm"
                              >
                                <ChildIcon className="h-4 w-4 shrink-0" />
                                <span>{child.title}</span>
                              </Button>
                            </Link>
                          )
                        })}
                      </div>
                    )}
                  </>
                ) : (
                  <Link href={item.href!}>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className={cn(
                        "w-full gap-3 cursor-pointer",
                        isActive && "bg-secondary",
                        isCollapsed ? "justify-center px-2" : "justify-start"
                      )}
                      title={isCollapsed ? item.title : undefined}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </Button>
                  </Link>
                )}
              </div>
            )
          })}
        </nav>
      </ScrollArea>
    </div>
  )
}
