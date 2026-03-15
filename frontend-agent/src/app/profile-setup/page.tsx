"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { exchangeSocialToken, getToken, setUserInfo } from "@/lib/auth";
import { Sparkles, Loader2, ArrowRight, User, Briefcase, Building2 } from "lucide-react";

export default function ProfileSetupPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [name, setName] = useState("");
    const [occupation, setOccupation] = useState("");
    const [company, setCompany] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [initializing, setInitializing] = useState(true);

    useEffect(() => {
        if (status === "loading") return;

        const handleAuth = async () => {
            // If user has no session at all, redirect to login
            if (status === "unauthenticated") {
                const token = getToken();
                if (!token) {
                    router.push("/login");
                    return;
                }
                // Has a JWT token — check if profile exists
                const email = localStorage.getItem("servix_email");
                if (!email) { router.push("/login"); return; }
                await checkAndRedirect(email);
                return;
            }

            // NextAuth session exists (social login)
            if (session?.user?.email) {
                // Exchange social session for backend JWT
                const token = await exchangeSocialToken(session.user.email, session.user.name ?? undefined);
                if (!token) { setError("Failed to connect backend session."); setInitializing(false); return; }

                // Pre-fill name from OAuth provider
                if (session.user.name) setName(session.user.name);

                // Check if profile already set
                await checkAndRedirect(session.user.email);
            }
        };

        handleAuth();
    }, [status, session]);

    const checkAndRedirect = async (email: string) => {
        try {
            const res = await fetch(`http://${window.location.hostname}:8000/profile/${encodeURIComponent(email)}`);
            if (res.ok) {
                const profile = await res.json();
                if (profile && profile.name) {
                    // Profile complete — go to chat
                    setUserInfo(email, profile.name);
                    router.push("/chat");
                    return;
                }
            }
        } catch { }
        setInitializing(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        const email = session?.user?.email || localStorage.getItem("servix_email");
        if (!email) { setError("No email found. Please log in again."); setIsLoading(false); return; }

        try {
            const res = await fetch(`http://${window.location.hostname}:8000/profile`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_email: email, name, occupation, company }),
            });
            if (!res.ok) throw new Error("Failed to save profile.");
            setUserInfo(email, name);
            router.push("/chat");
        } catch (err: any) {
            setError(err.message || "An error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    if (initializing) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-[#E2FF00] animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-[#E2FF00] font-sans flex flex-col items-center justify-center p-6">
            <div className="fixed inset-0 opacity-20 pointer-events-none z-0" style={{ backgroundImage: "linear-gradient(#E2FF00 1px, transparent 1px), linear-gradient(90deg, #E2FF00 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

            <div className="w-full max-w-md relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-500">
                <div className="flex items-center gap-3 mb-10">
                    <div className="w-10 h-10 bg-[#E2FF00] flex items-center justify-center border-2 border-[#E2FF00]">
                        <Sparkles className="w-5 h-5 text-black" />
                    </div>
                    <span className="text-2xl font-black tracking-tighter uppercase italic text-white">SERVIX</span>
                </div>

                <div className="bg-[#111] border-4 border-[#E2FF00] p-8 md:p-10 shadow-[8px_8px_0px_#E2FF00]">
                    <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-2">Operative Profile</h1>
                    <p className="font-bold opacity-80 uppercase tracking-widest text-sm mb-8 text-white">Tell us about yourself to personalize your experience.</p>

                    {error && (
                        <div className="bg-red-500/10 border-2 border-red-500 text-red-500 p-4 mb-6 font-bold uppercase text-sm">[ERROR] {error}</div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white">
                                <User className="w-3 h-3" /> Full Name *
                            </label>
                            <input required value={name} onChange={(e) => setName(e.target.value)}
                                className="w-full bg-black border-2 border-white text-[#E2FF00] px-4 py-3 placeholder:text-white/30 focus:border-[#E2FF00] focus:ring-0 outline-none transition-colors font-mono"
                                placeholder="JOHN DOE" />
                        </div>

                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white">
                                <Briefcase className="w-3 h-3" /> Occupation
                            </label>
                            <input value={occupation} onChange={(e) => setOccupation(e.target.value)}
                                className="w-full bg-black border-2 border-white text-[#E2FF00] px-4 py-3 placeholder:text-white/30 focus:border-[#E2FF00] focus:ring-0 outline-none transition-colors font-mono"
                                placeholder="SOFTWARE ENGINEER" />
                        </div>

                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white">
                                <Building2 className="w-3 h-3" /> Company / Organization
                            </label>
                            <input value={company} onChange={(e) => setCompany(e.target.value)}
                                className="w-full bg-black border-2 border-white text-[#E2FF00] px-4 py-3 placeholder:text-white/30 focus:border-[#E2FF00] focus:ring-0 outline-none transition-colors font-mono"
                                placeholder="ACME CORP" />
                        </div>

                        <button type="submit" disabled={isLoading}
                            className="w-full bg-[#E2FF00] text-black border-2 border-black font-black uppercase tracking-widest py-4 px-6 hover:bg-white transition-all shadow-[4px_4px_0px_#ffffff] hover:shadow-[6px_6px_0px_#ffffff] active:translate-y-1 active:translate-x-1 active:shadow-none flex items-center justify-between group disabled:opacity-50 mt-6">
                            {isLoading ? (
                                <span className="flex items-center gap-2 w-full justify-center"><Loader2 className="w-5 h-5 animate-spin" /> Saving</span>
                            ) : (
                                <span className="flex items-center w-full justify-between">Enter the System <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" /></span>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
