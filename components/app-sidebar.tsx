"use client"

import * as React from "react"
import {
  ArrowUpCircleIcon,
  BriefcaseIcon,
  DatabaseIcon,
  HelpCircleIcon,
  HomeIcon,
  FlaskConicalIcon,
  SettingsIcon,
  SearchIcon,
  PlusIcon,
} from "lucide-react"

import { NavMain } from '@/components/nav-main'
import { NavSecondary } from '@/components/nav-secondary'
import { NavUser } from '@/components/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  currentView?: string
  currentPath?: string
  onNavigate?: (path: string) => void
}

export function AppSidebar({ currentView = 'dashboard', currentPath = '/dashboard', onNavigate, ...props }: AppSidebarProps) {
  // Determine navigation items based on current path
  const mainNavItems = React.useMemo(() => {
    if (currentPath.startsWith('/chat/')) {
      // Chat navigation - show Discover and Create
      return [
        {
          title: "Discover",
          url: "/dashboard/discover",
          icon: SearchIcon,
          isActive: currentPath === '/dashboard/discover',
          onClick: () => onNavigate?.('/dashboard/discover'),
        },
        {
          title: "Create AI",
          url: "/dashboard/quick-create",
          icon: PlusIcon,
          isActive: false,
          onClick: () => onNavigate?.('/dashboard/quick-create'),
        },
      ]
    } else {
      // Dashboard navigation - show all dashboard items
      return [
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: HomeIcon,
          isActive: currentPath === '/dashboard',
          onClick: () => onNavigate?.('/dashboard'),
        },
        {
          title: "Projects",
          url: "/dashboard/projects",
          icon: BriefcaseIcon,
          isActive: currentPath === '/dashboard/projects' || currentPath.startsWith('/dashboard/projects/'),
          onClick: () => onNavigate?.('/dashboard/projects'),
        },
        {
          title: "Playground",
          url: "/dashboard/playground",
          icon: FlaskConicalIcon,
          isActive: currentPath === '/dashboard/playground',
          onClick: () => onNavigate?.('/dashboard/playground'),
        },
        {
          title: "Data Library",
          url: "/dashboard/data-library",
          icon: DatabaseIcon,
          isActive: currentPath === '/dashboard/data-library',
          onClick: () => onNavigate?.('/dashboard/data-library'),
        },
      ]
    }
  }, [currentPath, onNavigate])

  const data = {
    navMain: mainNavItems,
    navSecondary: [
      {
        title: "Settings",
        url: "/dashboard/settings",
        icon: SettingsIcon,
      },
      {
        title: "Help & Support",
        url: "/dashboard/help-support",
        icon: HelpCircleIcon,
      },
    ],
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <ArrowUpCircleIcon className="h-5 w-5" />
                <span className="text-base font-semibold">Thetails-Admin</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} onNavigate={onNavigate} />
        <NavSecondary items={data.navSecondary} className="mt-auto" onNavigate={onNavigate} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}