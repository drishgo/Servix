// JWT-based auth (email/password login)
export const setToken = (token: string) => {
    if (typeof window !== "undefined") {
        localStorage.setItem("servix_token", token);
    }
};

export const getToken = () => {
    if (typeof window !== "undefined") {
        return localStorage.getItem("servix_token");
    }
    return null;
};

export const clearToken = () => {
    if (typeof window !== "undefined") {
        localStorage.removeItem("servix_token");
        localStorage.removeItem("servix_email");
        localStorage.removeItem("servix_name");
    }
};

export const isAuthenticated = () => !!getToken();

// User info stored after login
export const setUserInfo = (email: string, name?: string) => {
    if (typeof window !== "undefined") {
        localStorage.setItem("servix_email", email);
        if (name) localStorage.setItem("servix_name", name);
    }
};

export const getUserInfo = () => {
    if (typeof window !== "undefined") {
        return {
            email: localStorage.getItem("servix_email") || "",
            name: localStorage.getItem("servix_name") || "",
        };
    }
    return { email: "", name: "" };
};

// Exchange a NextAuth social session for a backend JWT 
export const exchangeSocialToken = async (email: string, name?: string): Promise<string | null> => {
    try {
        const formData = new URLSearchParams();
        formData.append("email", email);
        if (name) formData.append("name", name);

        const res = await fetch(`http://${window.location.hostname}:8000/auth/social-token`, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: formData.toString(),
        });
        if (!res.ok) return null;
        const data = await res.json();
        setToken(data.access_token);
        setUserInfo(email, name);
        return data.access_token;
    } catch {
        return null;
    }
};
