import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/supabaseClient";

type UserRole = "customer" | "agent" | "admin";

export default function Auth() {
  const navigate = useNavigate();

  // State
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLogin, setIsLogin] = useState(true);
  const [selectedRole, setSelectedRole] = useState<UserRole>("customer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  // Fetch user role from user_roles table
  const fetchUserRole = async (userId: string) => {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .single();

  console.log("Fetched role data:", data, "Error:", error);

  if (error || !data) {
    console.warn("No role found for user:", error?.message);
    setUserRole(null);
  } else {
    setUserRole(data.role as UserRole);
  }
};

  // Load current user on mount
  useEffect(() => {
    
    const loadUser = async () => {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();
      console.log("Current user:", currentUser);
      setUser(currentUser);
      if (currentUser) await fetchUserRole(currentUser.id);
      setLoading(false);
    };

    loadUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        if (currentUser) await fetchUserRole(currentUser.id);
        else setUserRole(null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // Redirect based on role
  useEffect(() => {
    if (!loading && user && userRole) {
      if (userRole === "admin") navigate("/admin", { replace: true });
      else if (userRole === "agent") navigate("/agent", { replace: true });
      else navigate("/customer", { replace: true });
    }
  }, [user, userRole, loading, navigate]);

  // Sign up with role insertion and immediate login
  const signUp = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      });

      if (error) throw error;
      const newUser = data.user;
      if (!newUser) throw new Error("User not created");

      // Insert role
      const { error: insertError } = await supabase
        .from("user_roles")
        .insert([{ user_id: newUser.id, role: selectedRole }]);
      if (insertError) throw insertError;

      // Immediately sign in the user
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (loginError) throw loginError;

      // onAuthStateChange will handle the navigation
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Sign in
  // const signIn = async () => {
  //   setLoading(true);
  //   const { error } = await supabase.auth.signInWithPassword({ email, password });
  //   if (error) alert(error.message);
  //   setLoading(false);
  // };

  const signIn = async () => {
  try {
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    const user = data?.user;
    if (!user) throw new Error("Login failed — no user returned");

    // Fetch role immediately after login
    const { data: roleData, error: roleError } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (roleError || !roleData) {
      console.error("Role fetch failed:", roleError?.message);
      alert("Could not find a role for this account.");
      return;
    }

    const role = roleData.role as "customer" | "agent" | "admin";

    // Navigate based on role
    if (role === "admin") navigate("/admin", { replace: true });
    else if (role === "agent") navigate("/agent", { replace: true });
    else navigate("/customer", { replace: true });

  } catch (err: any) {
    alert(err.message);
  } finally {
    setLoading(false);
  }
};


  const handleAuth = () => {
    if (isLogin) signIn();
    else signUp();
  };

  if (loading) return <p className="text-center mt-20">Loading...</p>;

  return (
    <div className="flex h-screen items-center justify-center bg-white">
      <div className="w-full max-w-md rounded-lg border bg-white p-8 shadow">
        <h2 className="mb-2 text-center text-2xl font-semibold text-yellow-700">
          Insurance Claims Portal
        </h2>
        <p className="mb-6 text-center text-gray-500">
          {isLogin ? "Sign in to your account" : "Create an account"}
        </p>

        {/* Role tabs */}
        <div className="mb-6 grid grid-cols-3 gap-2">
          {(["customer", "agent", "admin"] as UserRole[]).map((role) => (
            <button
              key={role}
              className={`py-2 rounded border ${
                selectedRole === role
                  ? "bg-yellow-500 text-white"
                  : "bg-white text-gray-700"
              }`}
              onClick={() => setSelectedRole(role)}
            >
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </button>
          ))}
        </div>

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
