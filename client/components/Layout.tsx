import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  CheckSquare,
  Plus,
  Users,
  BarChart3,
  Settings,
  Menu,
  X,
  User,
  LogOut,
  Moon,
  Sun,
  Shield,
} from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
  userRole: "Admin" | "HO" | "FO";
  onLogout?: () => void;
}

export function Layout({ children, userRole, onLogout }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const location = useLocation();

  const adminNavItems = [
    { path: "/admin-dashboard", label: "Dashboard", icon: BarChart3 },
    { path: "/user-management", label: "User Management", icon: Users },
    { path: "/system-settings", label: "System Settings", icon: Settings },
    { path: "/audit-logs", label: "Audit Logs", icon: Shield },
  ];

  const hoNavItems = [
    { path: "/ho-dashboard", label: "Dashboard", icon: BarChart3 },
    { path: "/assign-task", label: "Assign Task", icon: Plus },
    { path: "/team", label: "Team", icon: Users },
    { path: "/settings", label: "Settings", icon: Settings },
  ];

  const foNavItems = [
    { path: "/fo-dashboard", label: "My Tasks", icon: CheckSquare },
    { path: "/notifications", label: "Notifications", icon: Bell },
    { path: "/settings", label: "Settings", icon: Settings },
  ];

  const navItems =
    userRole === "Admin"
      ? adminNavItems
      : userRole === "HO"
        ? hoNavItems
        : foNavItems;

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className={cn("min-h-screen bg-background flex", darkMode && "dark")}>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "flex-shrink-0 w-64 bg-sidebar h-screen transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-6 border-b border-sidebar-border">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                <CheckSquare className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-sidebar-foreground">
                  Task GST
                </h1>
                <p className="text-xs text-sidebar-foreground/60">
                  {userRole === "Admin"
                    ? "Administrator"
                    : userRole === "HO"
                      ? "Head Office"
                      : "Field Officer"}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50",
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                  {item.label === "Notifications" && (
                    <Badge className="ml-auto bg-destructive text-destructive-foreground">
                      3
                    </Badge>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User profile */}
          <div className="p-4 border-t border-sidebar-border">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-sidebar-foreground">
                  {userRole === "Admin"
                    ? "System Admin"
                    : userRole === "HO"
                      ? "John Smith"
                      : "Sarah Johnson"}
                </p>
                <p className="text-xs text-sidebar-foreground/60">
                  {userRole === "Admin"
                    ? "Administrator"
                    : userRole === "HO"
                      ? "Head Office Manager"
                      : "Field Officer"}
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={onLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top header */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                {location.pathname === "/admin-dashboard" && "Admin Dashboard"}
                {location.pathname === "/user-management" && "User Management"}
                {location.pathname === "/system-settings" && "System Settings"}
                {location.pathname === "/audit-logs" && "Audit Logs"}
                {location.pathname === "/ho-dashboard" && "Dashboard Overview"}
                {location.pathname === "/assign-task" && "Assign New Task"}
                {location.pathname === "/fo-dashboard" && "My Tasks"}
                {location.pathname.startsWith("/task/") && "Task Details"}
                {location.pathname.startsWith("/ho-task/") && "Task Management"}
                {location.pathname === "/team" && "Team Management"}
                {location.pathname === "/notifications" && "Notifications"}
                {location.pathname === "/settings" && "Settings"}
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={toggleDarkMode}>
              {darkMode ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-4 w-4" />
              <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center">
                3
              </Badge>
            </Button>
            <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-primary-foreground" />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
