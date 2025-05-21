import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "@/components/Logo";
import { 
  Layers, 
  Building2, 
  Tags, 
  ArrowRightLeft, 
  MessageSquare,
  LogOut 
} from "lucide-react";

const navItems = [
  { name: "Dashboard", path: "/dashboard", icon: <Layers className="h-5 w-5" /> },
  { name: "Empresas", path: "/empresas", icon: <Building2 className="h-5 w-5" /> },
  { name: "Categorias", path: "/categorias", icon: <Tags className="h-5 w-5" /> },
  { name: "Trocas", path: "/trocas", icon: <ArrowRightLeft className="h-5 w-5" /> },
  { name: "Comunicações", path: "/comunicacoes", icon: <MessageSquare className="h-5 w-5" /> },
];

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Sidebar */}
      <div className="md:w-64 bg-secondary flex-shrink-0">
        <div className="p-4 border-b border-secondary-foreground/10">
          <Link to="/dashboard">
            <Logo size="default" />
          </Link>
        </div>
        <nav className="p-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-secondary-foreground/10 ${
                  isActive ? "bg-secondary-foreground/10 text-white" : "text-secondary-foreground/80"
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b flex items-center px-6 bg-background">
          <h1
            className={`font-semibold ${
              location.pathname === "/dashboard" ? "text-2xl" : "text-xl"
            }`}
          >
            {navItems.find((item) => item.path === location.pathname)?.name || "TrueSwap"}
          </h1>
          <div className="ml-auto relative">
            <button
              className="p-2 rounded-full bg-accent w-10 h-10 flex items-center justify-center"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span className="font-medium text-sm">Adm</span>
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-background border border-secondary-foreground/10 rounded-md shadow-lg z-10">
                <button
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:text-red-700 flex items-center gap-2"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default AppLayout;