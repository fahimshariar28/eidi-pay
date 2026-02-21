"use client";
import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { createInvoiceAction } from "@/app/actions";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [generatedId, setGeneratedId] = useState("");

  const { data: session } = authClient.useSession();

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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    setLoading(true);
    try {
      const res = await createInvoiceAction(formData);
      if (res?.success) {
        const isRealUser = session && !session.user.isAnonymous;
        if (isRealUser) {
          router.push(`/pay/${res.id}`);
        } else {
          setGeneratedId(res.id);
          setShowAuthModal(true);
        }
      }
    } catch (err) {
      console.error("Submission Engine Failure:", err);
    } finally {
      setLoading(false); // Now this is guaranteed to run after the action
    }
  }
  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-zinc-50 text-zinc-900 relative">
      <motion.form
        onSubmit={handleSubmit}
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
          type="submit"
          disabled={loading || !isAuthReady}
          className="w-full bg-black text-white font-bold rounded-xl hover:bg-zinc-800 transition cursor-pointer disabled:opacity-50 h-14 relative flex items-center justify-center overflow-hidden"
        >
          <AnimatePresence mode="wait">
            {!isAuthReady ? (
              <motion.span
                key="initializing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                Initializing...
              </motion.span>
            ) : loading ? (
              <motion.div
                key="loading-state"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="flex items-center gap-2"
              >
                {/* CSS Spinner */}
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin cursor-not-allowed" />
                <span>Generating Link...</span>
              </motion.div>
            ) : (
              <motion.span
                key="default-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                Generate Salami Link
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </motion.form>
      <AnimatePresence>
        {showAuthModal && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-6 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="bg-white p-8 rounded-[2.5rem] max-w-sm w-full text-center shadow-2xl border border-zinc-200"
            >
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
                📈
              </div>
              <h2 className="text-2xl font-black mb-3">Track your Salami?</h2>
              <p className="text-zinc-500 text-sm leading-relaxed mb-8">
                Go beyond Ghost Mode. Log in now to track who paid, view total
                earnings, and manage your sponsors.
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => router.push("/login")}
                  className="w-full bg-[#E2136E] text-white py-4 rounded-2xl font-bold shadow-lg shadow-pink-200 hover:brightness-110 transition cursor-pointer"
                >
                  Login to Track
                </button>
                <button
                  onClick={() => router.push(`/pay/${generatedId}`)}
                  className="w-full bg-zinc-100 text-zinc-600 py-4 rounded-2xl font-bold hover:bg-zinc-200 transition cursor-pointer"
                >
                  Continue as Ghost
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
