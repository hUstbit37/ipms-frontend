"use client"

import { Header } from "@/components/header"
import { BreadcrumbProvider, useBreadcrumbs } from "@/contexts/breadcrumb-context"
import { ReactNode } from "react"

type LayoutProps = {
  children: ReactNode
}

function LayoutContent({ children }: LayoutProps) {
  const { breadcrumbs } = useBreadcrumbs()
  
  return (
    <>
      <Header breadcrumbs={breadcrumbs} />
      <div className="p-4">
        {children}
      </div>
    </>
  )
}

export default function DashboardLayout({ children }: LayoutProps) {
  return (
    <BreadcrumbProvider>
      <LayoutContent>{children}</LayoutContent>
    </BreadcrumbProvider>
  )
}
