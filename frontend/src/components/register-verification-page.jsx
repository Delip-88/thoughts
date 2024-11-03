"use client";

import React, { useState, useRef, useEffect } from "react";
import { ArrowLeft, Check } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import VERIFICATION_CODE from "@/graphql/mutations/verificationCodeGql";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import RESEND_CODE from "@/graphql/mutations/resendCodeGql";
import Loader from "./loader/Loader";

const Input = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <input
      className={`flex h-12 w-12 rounded-md border border-input bg-background px-3 py-2 text-lg text-center font-semibold ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

const Button = ({
  children,
  variant = "default",
  className = "",
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background";
  const variantStyles = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    outline: "border border-input hover:bg-accent hover:text-accent-foreground",
    link: "underline-offset-4 hover:underline text-primary",
  };
  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className} px-4 py-2`}
      {...props}
    >
      {children}
    </button>
  );
};

export function RegisterVerificationPageJsx() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || localStorage.getItem("register-email");
  const [verifyUser, { loading: verifyLoading }] =
    useMutation(VERIFICATION_CODE);
  const [resendCode, { loading: resendLoading }] = useMutation(RESEND_CODE);
  const [verificationCode, setVerificationCode] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const inputRefs = [
    useRef(),
    useRef(),
    useRef(),
    useRef(),
    useRef(),
    useRef(),
  ];
  const [error, setError] = useState("");
  const [count, setCount] = useState(20);
  const [resendMsg, setResendMsg] = useState(`Resend Code in ${count} sec`);

  const handleChange = (index, value) => {
    if (value.length <= 1 && /^[0-9]*$/.test(value)) {
      const newCode = [...verificationCode];
      newCode[index] = value;
      setVerificationCode(newCode);
      setError("");

      if (value && index < 5) {
        inputRefs[index + 1].current.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !verificationCode[index] && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = verificationCode.join("");
    if (code.length === 6) {
      try {
        const response = await verifyUser({ variables: { email, code } });
        const { token, user } = response.data?.verifyUser;
        if (token && user) {
          toast.success("Verification successful!");
          Cookies.set("authToken", token);
          localStorage.removeItem("register-email");
          setError(null);
          navigate("/Home");
        }
      } catch (err) {
        toast.error(err.graphQLErrors?.[0]?.message || "Verification failed.");
      }
    } else {
      setError("Please enter a valid 6-digit code");
    }
  };

  const handleResendCode = async () => {
    try {
      const response = await resendCode({
        variables: { email: localStorage.getItem("register-email") },
      });
      const { message, success } = response.data?.resendCode;
      if (success) {
        toast.info(message);
        setCount(20); // Reset countdown
      }
    } catch (err) {
      toast.error(
        err.graphQLErrors?.[0]?.message || "An unexpected error occurred."
      );
    }
  };

  useEffect(() => {
    if (count > 0) {
      const intervalId = setInterval(() => {
        setCount((prevCount) => prevCount - 1);
      }, 1000);
      return () => clearInterval(intervalId);
    } else {
      setResendMsg("Resend Code");
    }
  }, [count]);

  useEffect(() => {
    setResendMsg(`Resend Code in ${count} sec`);
  }, [count]);

  return (
    <div className="flex flex-col min-h-screen">
      {resendLoading && <Loader />}
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <a className="flex items-center justify-center" href="#">
          <ArrowLeft className="h-6 w-6 mr-2" />
          <span className="text-lg font-semibold">Back</span>
        </a>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Verify Your Account
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  We've sent a 6-digit verification code to your email. Enter
                  the code below to confirm your account.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-4">
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div className="flex justify-between max-w-xs mx-auto">
                    {verificationCode.map((digit, index) => (
                      <Input
                        key={index}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        ref={inputRefs[index]}
                        aria-label={`Digit ${index + 1}`}
                      />
                    ))}
                  </div>
                  {error && (
                    <p className="text-sm text-red-600" role="alert">
                      {error}
                    </p>
                  )}
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={verifyLoading}
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Verify Account
                  </Button>
                </form>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Didn't receive the code?{" "}
                  <button
                    onClick={handleResendCode}
                    disabled={resendLoading || count > 0}
                    className="text-primary hover:underline"
                  >
                    {count === 0 ? "Resend Code" : resendMsg}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2023 My Blog. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <a className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </a>
          <a className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </a>
        </nav>
      </footer>
    </div>
  );
}
