"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Github, LogIn } from "lucide-react";
import { Lora } from "next/font/google";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const LoginPage = () => {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = (e) => {
    e.preventDefault();
    signIn("google", { redirectTo: "/" });
  };

  const handleGithubLogin = (e) => {
    e.preventDefault();
    signIn("github", { redirectTo: "/" });
  };

  const handleCredentialsSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (isRegister) {
      if (!name || !email || !password) {
        toast.error("Please fill in all fields");
        setLoading(false);
        return;
      }
      if (password.length < 6) {
        toast.error("Password must be at least 6 characters long");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/v1/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to register");
        }

        toast.success("Account created successfully! Logging in...");

        const loginRes = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (loginRes?.error) {
          toast.error("Account created, but automatic login failed. Please login manually.");
          setIsRegister(false);
        } else {
          router.push("/");
          router.refresh();
        }
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    } else {
      if (!email || !password) {
        toast.error("Please fill in all fields");
        setLoading(false);
        return;
      }

      try {
        const res = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (res?.error) {
          toast.error("Invalid email or password");
        } else {
          toast.success("Logged in successfully!");
          router.push("/");
          router.refresh();
        }
      } catch (err) {
        toast.error("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="mt-24 flex flex-col items-center">
      <div className="w-full shadow-sm max-w-[600px] flex flex-col items-center gap-6 p-6 border rounded-lg bg-white dark:bg-neutral-900 border-stone-100 dark:border-neutral-800">
        <p className={`${lora.className} font-medium text-xl text-stone-800 dark:text-neutral-100`}>
          Join Somana Org.
        </p>

        {/* Social Logins */}
        <div className="flex flex-col gap-3 w-full max-w-[320px]">
          <button
            onClick={handleGoogleLogin}
            className="p-2 cursor-pointer w-full text-sm font-medium rounded-full border bg-stone-50 hover:bg-stone-100 flex items-center justify-center gap-2 text-stone-700 transition"
          >
            <LogIn size={16} />
            Continue with Google
          </button>

          <button
            onClick={handleGithubLogin}
            className="p-2 cursor-pointer w-full text-sm font-medium rounded-full border bg-stone-50 hover:bg-stone-100 flex items-center justify-center gap-2 text-stone-700 transition"
          >
            <Github size={16} />
            Continue with GitHub
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex py-2 items-center w-full max-w-[320px]">
          <div className="flex-grow border-t border-stone-200"></div>
          <span className="flex-shrink mx-4 text-stone-400 text-xs uppercase tracking-wider font-semibold">or</span>
          <div className="flex-grow border-t border-stone-200"></div>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleCredentialsSubmit} className="w-full max-w-[320px] flex flex-col gap-4">
          {isRegister && (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full mt-2 cursor-pointer">
            {loading ? "Please wait..." : isRegister ? "Create Account" : "Sign In"}
          </Button>
        </form>

        {/* Toggle Mode */}
        <button
          onClick={() => {
            setIsRegister(!isRegister);
            setEmail("");
            setPassword("");
            setName("");
          }}
          className="text-sm font-medium text-stone-600 hover:text-stone-800 underline cursor-pointer transition"
        >
          {isRegister
            ? "Already have an account? Sign in"
            : "Don't have an account? Create one"}
        </button>

        <p className="text-center font-medium text-xs text-stone-400 mt-6 max-w-[400px]">
          Click Login to agree to Somana’s{" "}
          <span className="underline">Terms of Service</span> and acknowledge
          that Somana’s <span className="underline">Privacy Policy</span> applies to you.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
