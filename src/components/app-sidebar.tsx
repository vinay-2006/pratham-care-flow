import { Link, useRouterState } from "@tanstack/react-router";
import {
  Activity,
  Ambulance,
  Brain,
  ClipboardList,
  FileImage,
  FlaskConical,
  LayoutDashboard,
  ShieldAlert,
  Stethoscope,
  Upload,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const intake = [
  { title: "Emergency Intake", url: "/intake", icon: Ambulance },
  { title: "Evidence Upload", url: "/evidence", icon: Upload },
  { title: "Investigations", url: "/investigations", icon: ClipboardList },
];

const intelligence = [
  { title: "Risk Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Imaging Analysis", url: "/imaging", icon: FileImage },
  { title: "Differential", url: "/differential", icon: FlaskConical },
  { title: "Explainability", url: "/explainability", icon: Brain },
  { title: "Confidence Suppression", url: "/confidence", icon: ShieldAlert },
];

const review = [
  { title: "Doctor Review", url: "/review", icon: Stethoscope },
];

export function AppSidebar() {
  const currentPath = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (p: string) => currentPath === p;

  const renderGroup = (label: string, items: typeof intake) => (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.url}>
              <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                <Link to={item.url} className="flex items-center gap-2">
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Link to="/" className="flex items-center gap-2 px-2 py-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Activity className="h-4 w-4" />
          </div>
          <div className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden">
            <span className="font-display text-sm font-semibold tracking-tight">PRATHAM</span>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Clinical Intelligence
            </span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {renderGroup("Intake", intake)}
        {renderGroup("Intelligence", intelligence)}
        {renderGroup("Review", review)}
      </SidebarContent>
      <SidebarFooter>
        <div className="px-3 py-2 text-[10px] leading-snug text-muted-foreground group-data-[collapsible=icon]:hidden">
          Prototype — not for clinical use.
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
