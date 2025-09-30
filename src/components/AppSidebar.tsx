import { useState } from "react";
import { FileText, Upload, Users, LogOut, Menu } from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

export function AppSidebar() {
  const { state } = useSidebar();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const userItems = [
    { title: "Тексттер", url: "/sentences", icon: FileText },
  ];

  const adminItems = [
    { title: "Жаңы киргизүү", url: "/create-data", icon: Upload },
    { title: "Колдонуучулар", url: "/users", icon: Users },
  ];

  const isActive = (path: string) => location.pathname === path;
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="bg-dark-purple">
        <div className="p-4 border-b border-gray-500">
          {!collapsed && (
            <h2 className="text-lg font-semibold text-white">
              Тил корпусу
            </h2>
          )}
          {collapsed && (
            <Menu className="h-6 w-6 text-foreground mx-auto" />
          )}
        </div>

        <SidebarGroup className="text-white">
          <SidebarGroupContent>
            <SidebarMenu>
              {userItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="hover:bg-white/20 hover:text-white">
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-white/20 text-foreground"
                        }`
                      }
                    >
                      <item.icon className="h-5 w-5" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {user?.role === 'admin' && (
          <SidebarGroup className="text-white">
            <SidebarGroupContent>
              <SidebarMenu>
                {adminItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                   <SidebarMenuButton asChild className="hover:bg-white/20 hover:text-white">
                      <NavLink
                        to={item.url}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                            isActive
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-accent text-foreground"
                          }`
                        }
                      >
                        <item.icon className="h-5 w-5" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        <div className="mt-auto p-4 border-t border-gray-500">
          <div className={`mb-3 ${collapsed ? "text-center" : ""}`}>
            {!collapsed && (
              <div>
                <p className="text-md font-medium text-white">{user?.username}</p>
              </div>
            )}
          </div>
          <Button
            variant="outline"
            size={collapsed ? "icon" : "sm"}
            onClick={handleLogout}
            className="w-full bg-white/20 border-none text-white hover:bg-red-400/80 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            {!collapsed && <span className="ml-2">Чыгуу</span>}
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}