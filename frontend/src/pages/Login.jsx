import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import "./login.css";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [otpSent, setOtpSent] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm();

  const email = watch("email");
  const otp = watch("otp");

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setOtpSent(false);
    reset(); // clear form
  };

  const onSubmit = (data) => {
    if (!otpSent) {
      console.log(`Sending OTP to ${data.email}`);
      setOtpSent(true);
    } else {
      console.log(`Verifying OTP ${data.otp} for ${data.email}`);
      // Verify OTP logic here
    }
  };

  const handleGoogleAuth = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`;
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

          <button type="submit">{otpSent ? "Verify OTP" : "Send OTP"}</button>
        </form>

        <div className="divider">OR</div>

        <button className="google-btn" onClick={handleGoogleAuth}>
          <FcGoogle size={30} style={{ marginRight: "8px" }} />
          Continue with Google
        </button>

        <p onClick={toggleForm}>
          {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
        </p>
      </div>
    </div>
  );
};

export default Login;
