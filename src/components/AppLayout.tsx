import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Feather, LogOut, Coins, FileText, History, Sparkles, BookOpen, UserCircle, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navItems = [
    { to: "/dashboard", icon: Sparkles, label: "Workspace" },
    { to: "/story", icon: BookOpen, label: "Story" },
    { to: "/mindmap", icon: Brain, label: "Mindmap" },
    { to: "/documents", icon: FileText, label: "Documents" },
    { to: "/history", icon: History, label: "History" },
    { to: "/profile", icon: UserCircle, label: "Profile" },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card flex flex-col shrink-0 hidden lg:flex">
        <div className="p-5 border-b border-border">
          <Link to="/dashboard" className="flex items-center gap-2">
            <Feather className="h-6 w-6 text-primary" />
            <span className="text-lg font-display font-bold text-gradient-gold">NarrativeIQ</span>
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-border space-y-3">
          <Link to="/credits" className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted hover:bg-primary/10 transition-colors">
            <Coins className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">{user?.credits ?? 0} credits</span>
          </Link>
          <div className="flex items-center justify-between px-3">
            <span className="text-xs text-muted-foreground truncate">{user?.email}</span>
            <button onClick={handleLogout} className="text-muted-foreground hover:text-foreground">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-card border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Feather className="h-5 w-5 text-primary" />
          <span className="font-display font-bold text-gradient-gold">NarrativeIQ</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Coins className="h-3 w-3 text-primary" /> {user?.credits ?? 0}
          </span>
          <button onClick={handleLogout} className="text-muted-foreground">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border flex">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="flex-1 flex flex-col items-center gap-1 py-2.5 text-muted-foreground hover:text-primary transition-colors"
          >
            <item.icon className="h-4 w-4" />
            <span className="text-[10px]">{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Main */}
      <main className="flex-1 overflow-auto lg:pt-0 pt-14 pb-16 lg:pb-0">
        {children}
      </main>
    </div>
  );
}
