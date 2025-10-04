import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, BarChart3, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Navigation = () => {
  const { user, userRole, signOut } = useAuth();

  return (
    <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-lg bg-gradient-hero flex items-center justify-center">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-gold bg-clip-text text-transparent">
            iClaim
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              {userRole === "customer" && (
                <Link to="/customer">
                  <Button variant="ghost">My Claims</Button>
                </Link>
              )}
              {userRole === "agent" && (
                <Link to="/agent">
                  <Button variant="ghost">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Agent Portal
                  </Button>
                </Link>
              )}
              {userRole === "admin" && (
                <Link to="/admin">
                  <Button variant="ghost">Admin Dashboard</Button>
                </Link>
              )}
              {(userRole === "customer" || userRole === "agent") && (
                <Link to="/file-claim">
                  <Button className="bg-gradient-hero">File a Claim</Button>
                </Link>
              )}
              <Button variant="outline" onClick={signOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </>
          ) : (
            <Link to="/auth">
              <Button className="bg-gradient-hero">Sign In</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
