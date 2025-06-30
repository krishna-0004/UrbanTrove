import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuthContext } from "../context/AuthContext";
import "./login.css";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const { setUser } = useAuthContext();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm();

  const email = watch("email");
  const otp = watch("otp");

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setOtpSent(false);
    reset();
    setServerError("");
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setServerError("");

      if (!otpSent) {
        // Step 1: Send OTP
        await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/send-otp`, {
          email: data.email,
        });
        setOtpSent(true);
      } else {
        // Step 2: Verify OTP
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/auth/verify-otp`,
          { email: data.email, otp: data.otp },
          { withCredentials: true }
        );

        const user = res.data.user;
        setUser?.(user);

        if (user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      }
    } catch (err) {
      setServerError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`;
    if (user.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isLogin ? "Login" : "Register"}</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            type="email"
            placeholder="Enter your email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Enter a valid email",
              },
            })}
            disabled={otpSent}
          />
          {errors.email && <span className="error">{errors.email.message}</span>}

          {otpSent && (
            <>
              <input
                type="text"
                placeholder="Enter OTP"
                {...register("otp", {
                  required: "OTP is required",
                  minLength: {
                    value: 4,
                    message: "OTP must be at least 4 digits",
                  },
                })}
              />
              {errors.otp && <span className="error">{errors.otp.message}</span>}
            </>
          )}

          {serverError && <span className="error">{serverError}</span>}

          <button type="submit" disabled={loading}>
            {loading ? "Please wait..." : otpSent ? "Verify OTP" : "Send OTP"}
          </button>
        </form>

        <div className="divider">OR</div>

        <button className="google-btn" onClick={handleGoogleAuth}>
          <FcGoogle size={30} style={{ marginRight: "8px" }} />
          Continue with Google
        </button>

        <p onClick={toggleForm} style={{ cursor: "pointer" }}>
          {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
        </p>
      </div>
    </div>
  );
};

export default Login;
