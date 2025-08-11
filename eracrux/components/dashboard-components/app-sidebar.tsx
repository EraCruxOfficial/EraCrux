import { Calendar, Home, Inbox, Search, Settings } from "lucide-react"
import { NavUser } from "./nav-user"

import {
    IconCamera,
    IconChartBar,
    IconDashboard,
    IconDatabase,
    IconFileAi,
    IconFileDescription,
    IconFileWord,
    IconFolder,
    IconHelp,
    IconInnerShadowTop,
    IconListDetails,
    IconReport,
    IconSearch,
    IconSettings,
    IconUsers,
    IconGitBranch,
    IconCirclePlusFilled,
    IconMail
} from "@tabler/icons-react"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarFooter,
    SidebarHeader,
} from "@/components/ui/sidebar"
import { Logout } from "./logout"
import { Button } from "@react-email/components"


const data = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
    },
}
// Menu items.
const items = [
    {
        title: "Home",
        url: "/workspaces",
        icon: Home,
    },
    {
        title: "Integrations",
        url: "/workspaces/integration",
        icon: IconGitBranch,
    },
    {
        title: "Dashboard",
        url: "#",
        icon: IconDashboard,
    },
    {
        title: "Projects",
        url: "#",
        icon: IconFolder,
    },
    {
        title: "Team",
        url: "#",
        icon: IconUsers,
    },
]

interface User {
    name: string
    email: string
    image?: string
}

interface AppSidebarProps {
    user: {
        name: string
        email: string
        image?: string | null
    }
}

export function AppSidebar({ user }: AppSidebarProps) {
    const safeUser: User = {
        name: user.name,
        email: user.email,
        image: user.image ?? undefined, // normalize null to undefined
    }

    return (
        <Sidebar>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            className="data-[slot=sidebar-menu-button]:!p-1.5"
                        >
                            <a>
                                <img src="/icon.png" className="!size-5 rounded-sm" />
                                <span className="text-base font-semibold">EraCrux</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>

            </SidebarHeader>

            <SidebarContent>

                <SidebarGroup>
                    <SidebarMenu>
                        <SidebarMenuItem className="flex items-center gap-2">
                            <SidebarMenuButton
                                tooltip="Quick Create"
                                className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
                            >
                                <IconCirclePlusFilled />
                                <a href="/workspaces/upload"><span>Quick Create</span></a>
                            </SidebarMenuButton>

                        </SidebarMenuItem>
                    </SidebarMenu>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={safeUser} />
            </SidebarFooter>
        </Sidebar>
    )
}
