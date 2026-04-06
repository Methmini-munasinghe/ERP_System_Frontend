import { useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../features/auth/authSlice"; // TEMP (replace with register later)
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { FiEye, FiEyeOff } from "react-icons/fi";

function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const { name, email, phone, password, confirmPassword } = formData;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const registerPromise = dispatch(
      register({
        name,
        email,     
        phone,
        password,
        confirmPassword,
      }),
    );

    toast.promise(registerPromise, {
      loading: "Creating your account...",
      success: (result) => {
        if (result.meta.requestStatus === "fulfilled") {
          navigate("/login");
          return "Account created successfully!";
        }
        throw new Error("Failed");
      },
      error: "Registration failed",
    });
  };

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

        <p className="absolute bottom-6 left-8 text-xs text-purple-200">
          © TheUnityWare 2024
        </p>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex items-center justify-center bg-gray-50 shadow-[-8px_0_20px_rgba(0,0,0,0.08)]">
        <div className="w-[420px]">
          <h1 className="text-3xl font-semibold mb-2">Create Account</h1>

          <p className="text-gray-500 mb-6">
            Please fill in your details to continue.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* NAME */}
            <div>
              <label className="text-sm font-medium">Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={name}
                onChange={handleChange}
                className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={email}
                onChange={handleChange}
                className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* PHONE */}
            <div>
              <label className="text-sm font-medium">Phone Number</label>
              <input
                type="text"
                name="phone"
                placeholder="Enter your phone number"
                value={phone}
                onChange={handleChange}
                className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-sm font-medium">Password</label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={handleChange}
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

            {/* CONFIRM PASSWORD */}
            <div>
              <label className="text-sm font-medium">Confirm Password</label>

              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={handleChange}
                className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium transition"
            >
              {loading ? "Creating..." : "Create Account"}
            </button>

            {/* SIGN IN LINK */}
            <p className="text-center text-sm text-gray-500 mt-6">
              Already have an account?
              <span
                onClick={() => navigate("/")}
                className="text-purple-600 cursor-pointer ml-1"
              >
                Sign in
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
