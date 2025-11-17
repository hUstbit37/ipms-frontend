"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
	LayoutDashboard,
	Settings,
	Users,
	BarChart3,
	FolderKanban,
	ChevronLeft,
	ChevronRight,
	FileText,
	Calendar,
	Database,
	MessageSquare,
	Shield,
	HelpCircle,
	LogIn,
	AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/sidebar-context"

const sidebarGroups = [
	{
		title: "Platform",
		items: [
			{
				title: "Dashboard",
				href: "/",
				icon: LayoutDashboard,
				badge: null,
			},
		],
	},
	{
		title: "SHTT",
		items: [
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
];

interface SidebarProps {
	onMobileClose?: () => void;
}

export function Sidebar({ onMobileClose }: SidebarProps) {
	const pathname = usePathname();
	// const [isCollapsed, setIsCollapsed] = useState(false);
  const { isCollapsed } = useSidebar()

	const handleLinkClick = () => {
		if (onMobileClose) {
			onMobileClose();
		}
	};

	return (
		<div
			className={cn(
				"flex h-full flex-col border-r bg-card shadow-sm transition-all duration-300",
				isCollapsed ? "w-16" : "w-72",
			)}
		>
			{/* Logo */}
			<div className={cn(
				"flex h-12 items-center border-b justify-between",
				isCollapsed ? "px-4" : "px-6"
			)}>
				{!isCollapsed && (
					<Link href="/" className="flex items-center gap-3 group">
						<div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
							<LayoutDashboard className="w-4 h-4 text-primary-foreground" />
						</div>
						<span className="text-xl font-bold group-hover:text-primary transition-colors">
							Admin IP
						</span>
					</Link>
				)}
				{isCollapsed && (
					<Link href="/" className="mx-auto">
						<div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
							<LayoutDashboard className="w-4 h-4 text-primary-foreground" />
						</div>
					</Link>
				)}
				{/* <Button
					variant="ghost"
					size="icon"
					className="h-8 w-8 hover:bg-muted"
					onClick={() => setIsCollapsed(!isCollapsed)}
				>
					{isCollapsed ? (
						<ChevronRight className="h-4 w-4" />
					) : (
						<ChevronLeft className="h-4 w-4" />
					)}
				</Button> */}
			</div>

			{/* Navigation Groups */}
			<nav className={cn(
				"flex-1 space-y-6",
				isCollapsed ? "p-2" : "p-4"
			)}>
				{sidebarGroups.map((group) => (
					<div key={group.title} className="space-y-3">
						{/* Group Title */}
						{!isCollapsed && (
							<h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-3">
								{group.title}
							</h3>
						)}

						{/* Group Items */}
						<div className="space-y-2">
							{group.items.map((item) => {
								const isActive = pathname === item.href;
								const Icon = item.icon;

								return (
									<Link
										key={item.href}
										href={item.href}
										onClick={handleLinkClick}
										className={cn(
											"group flex items-center gap-3 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-muted",
											isActive
												? "bg-primary text-primary-foreground shadow-md hover:bg-primary/90"
												: "text-muted-foreground hover:text-foreground",
											isCollapsed ? "justify-center px-3 py-3" : "px-2 py-2",
										)}
										title={isCollapsed ? item.title : undefined}
									>
										<Icon
											className={cn(
												"transition-all duration-200 shrink-0",
												isCollapsed ? "h-5 w-5" : "h-4 w-4",
												isActive && "text-primary-foreground",
											)}
										/>
										{!isCollapsed && (
											<span className="group-hover:translate-x-0.5 transition-transform duration-200">
												{item.title}
											</span>
										)}
									</Link>
								);
							})}
						</div>
					</div>
				))}
			</nav>
		</div>
	);
}