"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "next/navigation";

interface Invoice {
  id: string;
  amount: number;
  targetName: string;
  message: string;
  bkashNumber: string;
  status: string;
}

export default function PaymentPage() {
  const { id } = useParams();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [paid, setPaid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [txId, setTxId] = useState("");

  useEffect(() => {
    fetch(`/api/invoice/${id}`)
      .then((res) => {
        if (!res.ok) {
          window.location.href = "/";
          return;
        }
        return res.json();
      })
      .then((data: Invoice) => {
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
    setLoading(true);
    const generatedTxId = Math.random()
      .toString(36)
      .toUpperCase()
      .substring(2, 12);

    try {
      // Strictly update the database status to PAID
      await fetch(`/api/invoice/${id}/paid`, { method: "POST" });

      setTimeout(() => {
        setTxId(generatedTxId);
        setLoading(false);
        setPaid(true);
      }, 1500);
    } catch (err) {
      console.error("Payment Confirmation Error:", err);
      alert("Database sync failed. Try again.");
      setLoading(false);
    }
  };

  if (!invoice)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading Invoice...
      </div>
    );

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
            <div className="bg-black p-8 text-white text-center">
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

              {/* NEW: Dedicated bKash Number Copy Section */}
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
                    className="bg-zinc-900 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-zinc-700 transition"
                  >
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>

              <div className="p-4 bg-zinc-50 rounded-xl italic text-zinc-600 border border-zinc-100 text-sm">
                `{invoice.message}`
              </div>

              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full bg-[#E2136E] text-white font-bold py-4 rounded-xl hover:brightness-110 transition disabled:opacity-50"
              >
                {loading ? "Updating Status..." : "Confirm Payment"}
              </button>
            </div>
          </motion.div>
        ) : (
          /* Success Screen remains the same as image_88b244.png */
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-10 rounded-3xl shadow-2xl text-center max-w-md w-full border-t-8 border-green-500"
          >
            <div className="text-6xl mb-4 text-green-500">✅</div>
            <h2 className="text-2xl font-black italic uppercase">
              Salami Received!
            </h2>
            <p className="text-zinc-500 mt-2">
              ৳{invoice.amount} added to wallet.
            </p>
            <p className="mt-6 text-sm font-mono text-zinc-400 bg-zinc-50 p-2 rounded">
              TxID: {txId}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
