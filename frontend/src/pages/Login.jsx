import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuthContext } from "../context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./login.css";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const { setUser } = useAuthContext();
  const navigate = useNavigate();

  const handleGoogleAuth = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`;
  };

  return (
    <div className="auth-container fade-in">
      <ToastContainer position="top-right" autoClose={2000} theme="colored" />

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

          <button type="submit" disabled={loading}>
            {loading ? "Processing..." : otpSent ? "Verify OTP" : "Send OTP"}
          </button>
        </form>

        <div className="divider">OR</div>

        <button className="google-btn" onClick={handleGoogleAuth}>
          <FcGoogle size={30} style={{ marginRight: "8px" }} />
          Continue with Google
        </button>

        <p onClick={toggleForm}>
          {isLogin
            ? "Don't have an account? Register"
            : "Already have an account? Login"}
        </p>
      </div>
    </div>
  );
};

export default Login;
