"use client";
import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { createInvoiceAction } from "@/app/actions";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false); // Track auth state

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check if the user already has a session
        const session = await authClient.getSession();

        if (session?.data?.user) {
          console.log("Existing session found. Ready to go!");
          setIsAuthReady(true);
          return;
        }

        // If no session, perform the anonymous sign-in
        console.log("No session found. Attempting anonymous sign-in...");
        const res = await authClient.signIn.anonymous();

        if (res.error) {
          // If the error is 'already signed in', we can ignore it and proceed
          if (
            res.error.code ===
            "ANONYMOUS_USERS_CANNOT_SIGN_IN_AGAIN_ANONYMOUSLY"
          ) {
            setIsAuthReady(true);
            return;
          }
          console.error("Auth Error:", res.error);
          return;
        }

        setIsAuthReady(true);
      } catch (err) {
        console.error("Auth Engine Crash:", err);
      }
    };
    initAuth();
  }, []);

  async function handleSubmit(formData: FormData) {
    if (!isAuthReady) {
      alert("Hold on! Securing your session...");
      return;
    }

    setLoading(true);
    try {
      const res = await createInvoiceAction(formData);
      if (res?.success) {
        router.push(`/pay/${res.id}`);
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Something went wrong.";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-zinc-50 text-zinc-900">
      <motion.form
        action={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md space-y-5 border border-zinc-100"
      >
        <div className="text-center mb-6">
          <h1 className="text-3xl font-black tracking-tight">Claim Eidi 💸</h1>
          <p className="text-zinc-500 text-sm mt-2">
            Generate your official invoice
          </p>
        </div>

        <input
          name="targetName"
          placeholder="Sponsor's Name (Uncle, Boss, Friend)"
          required
          className="w-full p-4 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-black outline-none transition"
        />
        <input
          name="amount"
          type="number"
          placeholder="Target Amount (৳)"
          required
          className="w-full p-4 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-black outline-none transition"
        />
        <input
          name="bkashNumber"
          type="text"
          inputMode="numeric" // Shows the number pad on mobile
          placeholder="Your bKash / Nagad Number (11 digits)"
          required
          minLength={11}
          maxLength={11}
          pattern="\d{11}"
          className="w-full p-4 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-black outline-none transition"
        />
        <textarea
          name="message"
          placeholder="Reason for funding..."
          required
          maxLength={100}
          className="w-full p-4 border border-zinc-200 rounded-xl h-28 resize-none focus:ring-2 focus:ring-black outline-none transition"
        />

        {/* Disable button if auth isn't ready or form is loading */}
        <button
          disabled={loading || !isAuthReady}
          className="w-full bg-black text-white font-bold py-4 rounded-xl hover:bg-zinc-800 transition cursor-pointer disabled:opacity-50 h-14"
        >
          {!isAuthReady
            ? "Initializing..."
            : loading
              ? "Generating Link..."
              : "Generate Salami Link"}
        </button>
      </motion.form>
    </main>
  );
}
