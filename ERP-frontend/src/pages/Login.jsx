import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../features/auth/authSlice";
//import google from "../assets/google.svg";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { FiEye, FiEyeOff } from "react-icons/fi";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, user } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const loginPromise = dispatch(
      login({
        email,
        password,
      }),
    );

    toast.promise(loginPromise, {
      loading: "Signing you in...",
      success: (result) => {
        if (result.meta.requestStatus === "fulfilled") {
          if (remember) {
            localStorage.setItem("rememberMe", "true");
            localStorage.setItem("rememberEmail", email);
          } else {
            localStorage.removeItem("rememberMe");
            localStorage.removeItem("rememberEmail");
          }

          navigate("/dashboard");

          return "Welcome back!";
        }

        throw new Error("Login failed");
      },
      error: "Invalid email or password",
    });
  };

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  // Load remembered email
  useEffect(() => {
    const rememberMe = localStorage.getItem("rememberMe");
    const savedEmail = localStorage.getItem("rememberEmail");

    if (rememberMe && savedEmail) {
      setTimeout(() => {
        setEmail(savedEmail);
        setRemember(true);
      }, 0);
    }
  }, []);

  return (
    <div className="grid grid-cols-2 min-h-screen">
      {/* LEFT PANEL */}
      <div
        className="relative bg-gradient-to-b from-purple-700 to-indigo-800 
        flex items-center justify-center p-12 text-white
        rounded-r-[25px] shadow-[8px_0_25px_rgba(0,0,0,0.35)]"
      >
        <p className="text-center text-x leading-relaxed max-w-md">
          Re-imagining inventory management experience with advance data
          analytics for optimum performance
        </p>

        {/*<p className="absolute bottom-6 left-8 text-xs text-purple-200">
          © TheUnityWare 2024
        </p>*/}
      </div>

      {/* RIGHT PANEL */}
      <div className="flex items-center justify-center bg-gray-50 shadow-[-8px_0_20px_rgba(0,0,0,0.08)]">
        <div className="w-[420px]">
          <h1 className="text-3xl font-semibold mb-2">Welcome back</h1>

          <p className="text-gray-500 mb-6">
            Welcome back! Please enter your details.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* EMAIL */}
            <div>
              <label className="text-sm font-medium">Email</label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-sm font-medium">Password</label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />

                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </span>
              </div>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            {/* REMEMBER */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                Remember Me
              </label>

              <span
                onClick={() => navigate("/forgot-password")}
                className="text-purple-600 cursor-pointer"
              >
                Forgot password
              </span>
            </div>

            {/* SIGN IN */}
            <button  
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium transition"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>

            {/* GOOGLE */}
            {/*<button
              type="button"
              className="w-full border py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-100 transition"
            >
              <img src={google} alt="Google" className="w-5 h-5" />
              Sign in with Google
            </button>*/}

            {/* SIGN UP */}
            <p className="text-center text-sm text-gray-500 mt-6">
              Don’t have an account?
              <span
                onClick={() => navigate("/signup")}
                className="text-purple-600 cursor-pointer ml-1"
              >
                Sign up
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
