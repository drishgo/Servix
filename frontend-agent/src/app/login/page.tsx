"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { setToken } from "@/lib/auth";
import { Sparkles, ArrowRight, Loader2 } from "lucide-react";

function GithubIcon() {
    return (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
        </svg>
    );
}

function GoogleIcon() {
    return (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
    );
}

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [socialLoading, setSocialLoading] = useState<string | null>(null);
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const formData = new URLSearchParams();
            formData.append("username", email);
            formData.append("password", password);

            const response = await fetch(`http://${window.location.hostname}:8000/login`, {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: formData.toString(),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "Failed to authenticate.");
            }

            const data = await response.json();
            setToken(data.access_token);
            router.push("/chat");
        } catch (err: any) {
            if (err.message === "Failed to fetch") {
                setError("Cannot reach server. Is the backend running on port 8000?");
            } else {
                setError(err.message || "An unexpected error occurred.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleSocialLogin = async (provider: string) => {
        setSocialLoading(provider);
        await signIn(provider, { callbackUrl: "/chat" });
        setSocialLoading(null);
    };

    return (
        <div className="min-h-screen bg-black text-[#E2FF00] font-sans flex flex-col items-center justify-center p-6 selection:bg-[#E2FF00] selection:text-black">
            <div
                className="fixed inset-0 opacity-20 pointer-events-none z-0"
                style={{
                    backgroundImage: "linear-gradient(#E2FF00 1px, transparent 1px), linear-gradient(90deg, #E2FF00 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                }}
            />

            <div className="w-full max-w-md relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-500">
                <Link href="/" className="inline-flex items-center gap-3 mb-10 group">
                    <div className="w-10 h-10 bg-[#E2FF00] flex items-center justify-center border-2 border-[#E2FF00] group-hover:rotate-12 transition-transform">
                        <Sparkles className="w-5 h-5 text-black" />
                    </div>
                    <span className="text-2xl font-black tracking-tighter uppercase italic text-white group-hover:text-[#E2FF00] transition-colors">SERVIX</span>
                </Link>

                <div className="bg-[#111] border-4 border-[#E2FF00] p-8 md:p-10 shadow-[8px_8px_0px_#E2FF00]">
                    <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-2">Initialize</h1>
                    <p className="font-bold opacity-80 uppercase tracking-widest text-sm mb-8 text-white">System Authorization Required.</p>

                    {/* Social Login Buttons */}
                    <div className="flex flex-col gap-3 mb-8">
                        <button
                            onClick={() => handleSocialLogin("github")}
                            disabled={!!socialLoading}
                            className="w-full flex items-center gap-4 px-5 py-3.5 bg-white text-black border-2 border-black font-bold uppercase tracking-widest hover:bg-[#E2FF00] transition-all shadow-[3px_3px_0px_#E2FF00] hover:shadow-[5px_5px_0px_#E2FF00] active:translate-y-1 active:translate-x-1 active:shadow-none disabled:opacity-50"
                        >
                            {socialLoading === "github" ? <Loader2 className="w-5 h-5 animate-spin" /> : <GithubIcon />}
                            <span>Continue with GitHub</span>
                        </button>
                        <button
                            onClick={() => handleSocialLogin("google")}
                            disabled={!!socialLoading}
                            className="w-full flex items-center gap-4 px-5 py-3.5 bg-white text-black border-2 border-black font-bold uppercase tracking-widest hover:bg-[#E2FF00] transition-all shadow-[3px_3px_0px_#E2FF00] hover:shadow-[5px_5px_0px_#E2FF00] active:translate-y-1 active:translate-x-1 active:shadow-none disabled:opacity-50"
                        >
                            {socialLoading === "google" ? <Loader2 className="w-5 h-5 animate-spin" /> : <GoogleIcon />}
                            <span>Continue with Google</span>
                        </button>
                    </div>

                    <div className="flex items-center gap-4 mb-8">
                        <div className="flex-1 h-[2px] bg-white/20" />
                        <span className="text-xs font-bold uppercase tracking-widest text-white/50">Or use email</span>
                        <div className="flex-1 h-[2px] bg-white/20" />
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border-2 border-red-500 text-red-500 p-4 mb-6 font-bold uppercase text-sm">
                            [ERROR] {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="block text-xs font-bold uppercase tracking-widest text-white">Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-black border-2 border-white text-[#E2FF00] px-4 py-3 placeholder:text-white/30 focus:border-[#E2FF00] focus:ring-0 outline-none transition-colors font-mono shadow-[4px_4px_0px_#ffffff] focus:shadow-[4px_4px_0px_#E2FF00]"
                                placeholder="OPERATIVE@SERVIX.AI"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-xs font-bold uppercase tracking-widest text-white">Password</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-black border-2 border-white text-[#E2FF00] px-4 py-3 placeholder:text-white/30 focus:border-[#E2FF00] focus:ring-0 outline-none transition-colors font-mono shadow-[4px_4px_0px_#ffffff] focus:shadow-[4px_4px_0px_#E2FF00]"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#E2FF00] text-black border-2 border-black font-black uppercase tracking-widest py-4 px-6 hover:bg-white transition-all shadow-[4px_4px_0px_#ffffff] hover:shadow-[6px_6px_0px_#ffffff] active:translate-y-1 active:translate-x-1 active:shadow-none flex items-center justify-between group disabled:opacity-50"
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2 w-full justify-center">
                                    <Loader2 className="w-5 h-5 animate-spin" /> Verifying
                                </span>
                            ) : (
                                <span className="flex items-center w-full justify-between">
                                    Authorize Access
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                                </span>
                            )}
                        </button>
                    </form>
                </div>

                <div className="mt-8 text-center text-sm font-bold uppercase tracking-widest text-white opacity-80">
                    Unregistered Operative?{" "}
                    <Link href="/register" className="text-[#E2FF00] hover:underline underline-offset-4">
                        Request Clearance
                    </Link>
                </div>
            </div>
        </div>
    );
}
