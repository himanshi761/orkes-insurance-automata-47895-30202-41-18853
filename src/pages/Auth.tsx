import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

type UserRole = "customer" | "agent" | "admin";

export default function AuthPage() {
  const navigate = useNavigate();
  const { user, userRole, loading, signUp, signIn } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [selectedRole, setSelectedRole] = useState<UserRole>("customer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  console.log({ user, userRole, loading });
  // ✅ Proper redirect based on user role
  useEffect(() => {
    if (!loading && user && userRole) {
      console.log("✅ Redirecting user with role:", userRole);

      if (userRole === "admin") {
        navigate("/admin");
      } else if (userRole === "agent") {
        navigate("/agent");
      } else {
        navigate("/customer");
      }
    }
  }, [user, userRole, loading, navigate]);

  const handleAuth = async () => {
    if (isLogin) {
      const { error } = await signIn(email, password);
      if (error) alert(error.message);
    } else {
      const { error } = await signUp(email, password, fullName, selectedRole);
      if (error) alert(error.message);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-white">
      <div className="w-full max-w-md rounded-lg border bg-white p-8 shadow">
        <h2 className="mb-2 text-center text-2xl font-semibold text-yellow-700">
          Insurance Claims Portal
        </h2>
        <p className="mb-6 text-center text-gray-500">
          {isLogin ? "Sign in to your account" : "Create an account"}
        </p>

        {/* ✅ Always visible role tabs */}
        <Tabs
          defaultValue={selectedRole}
          className="mb-6"
          onValueChange={(v) => setSelectedRole(v as UserRole)}
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="customer">Customer</TabsTrigger>
            <TabsTrigger value="agent">Agent</TabsTrigger>
            <TabsTrigger value="admin">Admin</TabsTrigger>
          </TabsList>
        </Tabs>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-3 w-full rounded border p-2"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-3 w-full rounded border p-2"
        />

        {!isLogin && (
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="mb-3 w-full rounded border p-2"
          />
        )}

        <button
          onClick={handleAuth}
          className="w-full rounded bg-yellow-500 py-2 font-medium text-white hover:bg-yellow-600"
        >
          {isLogin ? "Sign In" : "Sign Up"}
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          {isLogin ? (
            <>
              Don’t have an account?{" "}
              <button
                onClick={() => setIsLogin(false)}
                className="font-semibold text-yellow-600"
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={() => setIsLogin(true)}
                className="font-semibold text-yellow-600"
              >
                Sign in
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}