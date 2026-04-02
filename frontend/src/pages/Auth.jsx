import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [selectedRole, setSelectedRole] = useState("customer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  const API_URL = "http://localhost:8000/api/auth";

  const redirectUser = (role) => {
    if (role === "admin") navigate("/admin");
    else if (role === "agent") navigate("/agent");
    else navigate("/customer");
  };

  const storeSession = (user, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", user.role);
    localStorage.setItem("userId", user._id || user.id || "");
    localStorage.setItem("userName", user.name || "");
    localStorage.setItem("userEmail", user.email || "");
  };

  const signUp = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: fullName,
          email,
          password,
          role: selectedRole,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Sign up failed");

      storeSession(data.user, data.token);
      redirectUser(data.user.role);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      storeSession(data.user, data.token);
      redirectUser(data.user.role);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="w-full max-w-md rounded-lg border bg-white p-8 shadow">
        <h2 className="mb-2 text-center text-2xl font-semibold text-yellow-700">
          Insurance Claims Portal
        </h2>

        <p className="mb-6 text-center text-gray-500">
          {isLogin ? "Sign in to your account" : "Create an account"}
        </p>

        {!isLogin && (
          <div className="mb-6 grid grid-cols-3 gap-2">
            {["customer", "agent", "admin"].map((role) => (
              <button
                key={role}
                type="button"
                className={`rounded border py-2 ${
                  selectedRole === role
                    ? "bg-yellow-500 text-white"
                    : "bg-white text-gray-700"
                }`}
                onClick={() => setSelectedRole(role)}
              >
                {role}
              </button>
            ))}
          </div>
        )}

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
          type="button"
          onClick={isLogin ? signIn : signUp}
          disabled={loading}
          className="w-full rounded bg-yellow-500 py-2 font-medium text-white hover:bg-yellow-600"
        >
          {loading ? "Loading..." : isLogin ? "Sign In" : "Sign Up"}
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          {isLogin ? (
            <>
              Don&apos;t have an account?{" "}
              <button
                type="button"
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
                type="button"
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
