"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "next/navigation";
import LoadingInvoice from "@/components/LoadingInvoice";
import PaymentSuccess from "@/components/PaymentSuccess";
import Link from "next/link";

type TInvoice = {
  id: string;
  amount: number;
  targetName: string;
  message: string;
  bkashNumber: string;
  status: string;
  transactionId?: string;
};

export default function PaymentPage() {
  const { id } = useParams();
  const [invoice, setInvoice] = useState<TInvoice | null>(null);
  const [paid, setPaid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    fetch(`/api/invoice/${id}`)
      .then((res) => {
        if (!res.ok) {
          window.location.href = "/";
          return;
        }
        return res.json();
      })
      .then((data: TInvoice) => {
        if (data) {
          setInvoice(data);
          if (data.status === "PAID") {
            setPaid(true);
          }
        }
      });
  }, [id]);

  const handleCopy = async () => {
    if (invoice?.bkashNumber) {
      await navigator.clipboard.writeText(invoice.bkashNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset "Copied" text
    }
  };

  const handlePayment = async () => {
    setShowConfirm(false);
    setLoading(true);
    const generatedTxId = Math.random()
      .toString(36)
      .toUpperCase()
      .substring(2, 12);

    try {
      const response = await fetch(`/api/invoice/${id}/paid`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ txId: generatedTxId }),
      });

      if (!response.ok) throw new Error("Update failed");

      const updatedRes = await fetch(`/api/invoice/${id}`);
      const updatedData = await updatedRes.json();

      setInvoice(updatedData);

      setTimeout(() => {
        setPaid(true);
        setLoading(false);
      }, 1500);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Sync failed";
      alert(msg);
      setLoading(false);
    }
  };

  if (!invoice)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingInvoice />
      </div>
    );

  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const shareToSponsorWhatsApp = () => {
    const url = window.location.href;
    const message = `Assalamu Alaikum ${invoice?.targetName}, you have a new Eidi Invoice! 💸 Please check and approve it here: ${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
  };

  const shareToSponsorMessenger = () => {
    const url = window.location.href;
    // Facebook sharer is the most reliable way to push to Messenger on mobile
    window.open(
      `fb-messenger://share/?link=${encodeURIComponent(url)}`,
      "_blank",
    );
  };

  return (
    <main className="min-h-screen bg-zinc-100 flex items-center justify-center p-6 font-sans">
      <AnimatePresence mode="wait">
        {!paid ? (
          <motion.div
            key="receipt"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-zinc-200"
          >
            <div className="bg-[#E2136E] text-white p-8 text-center">
              <h2 className="text-sm uppercase tracking-widest opacity-70">
                Official Salami Invoice
              </h2>
              <div className="text-5xl font-black mt-2">৳{invoice.amount}</div>
            </div>

            <div className="p-8 space-y-5">
              <div className="flex justify-between border-b pb-3 border-dashed">
                <span className="text-zinc-500">Sponsor</span>
                <span className="font-bold text-zinc-900">
                  {invoice.targetName}
                </span>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase">
                  Send Money To (bKash/Nagad)
                </label>
                <div className="flex gap-2">
                  <input
                    readOnly
                    value={invoice.bkashNumber}
                    className="flex-1 bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 font-mono text-sm outline-none"
                  />
                  <button
                    onClick={handleCopy}
                    className={`bg-[#E2136E] text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-[#c00f5c] transition ${!copied && "cursor-pointer"} ${copied ? "bg-green-600 hover:bg-green-500" : ""}`}
                  >
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>

              <div className="p-4 bg-zinc-50 rounded-xl italic text-zinc-600 border border-zinc-100 text-sm">
                `{invoice.message}`
              </div>

              {!paid && (
                <div className="mt-6 p-5 bg-zinc-50 rounded-2xl border border-zinc-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                      Send to {invoice.targetName}
                    </p>
                    <button
                      onClick={copyLink}
                      className={`text-[10px] font-bold text-blue-600 uppercase hover:underline ${!linkCopied && "cursor-pointer"} ${linkCopied ? "text-green-600" : ""}`}
                    >
                      {linkCopied ? "✓ Link Copied" : "Copy Link"}
                    </button>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={shareToSponsorWhatsApp}
                      className="flex-1 bg-[#25D366] text-white py-3 rounded-xl font-bold text-sm shadow-sm hover:brightness-105 active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      WhatsApp
                    </button>

                    <button
                      onClick={shareToSponsorMessenger}
                      className="flex-1 bg-[#0084FF] text-white py-3 rounded-xl font-bold text-sm shadow-sm hover:brightness-105 active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      Messenger
                    </button>
                  </div>
                </div>
              )}

              <button
                onClick={() => setShowConfirm(true)}
                disabled={loading}
                className="w-full bg-[#E2136E] text-white font-bold py-4 rounded-xl hover:brightness-110 transition disabled:opacity-50 cursor-pointer"
              >
                {loading ? "Updating Status..." : "Confirm Payment"}
              </button>
            </div>
            <div className="mt-12 p-6 bg-[#E2136E]/5 border border-[#E2136E]/10 text-center">
              <p className="text-sm font-bold text-zinc-900 mb-4">
                Want to collect your own Salami? 🧧
              </p>
              <Link
                href="/"
                className="inline-block bg-[#E2136E] text-white px-8 py-4 rounded-full font-black uppercase tracking-widest text-xs hover:scale-105 transition"
              >
                Create Your Salami Link
              </Link>
            </div>
          </motion.div>
        ) : (
          <PaymentSuccess
            amount={invoice.amount}
            txId={invoice.transactionId}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white p-8 rounded-3xl max-w-sm w-full text-center shadow-2xl"
            >
              <h2 className="text-xl font-black mb-2">
                Did you send the money? 💸
              </h2>
              <p className="text-zinc-500 text-sm mb-6">
                Please ensure you have sent ৳{invoice.amount} to{" "}
                {invoice.bkashNumber} via bKash/Nagad before confirming.
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={handlePayment}
                  className="w-full bg-[#E2136E] text-white py-4 rounded-xl font-bold hover:brightness-110 transition cursor-pointer"
                >
                  Yes, I have sent it
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  className="w-full bg-zinc-100 text-zinc-500 py-4 rounded-xl font-bold hover:bg-zinc-200 transition cursor-pointer"
                >
                  No, go back
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
