"use server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { z } from "zod";
import { nanoid } from "nanoid"; // 1. Import nanoid for short viral URLs

const invoiceSchema = z.object({
  targetName: z.string().min(1, "Uncle's name is required"),
  amount: z.coerce.number().min(10, "Don't be cheap, ask for at least 10"),
  bkashNumber: z
    .string()
    .regex(/^\d{11}$/, "Phone number must be exactly 11 digits"),
  message: z.string().max(100, "Keep the joke short so the link doesn't break"),
});

export async function createInvoiceAction(formData: FormData) {
  // 2. FIX: Await the headers() function for Next.js 15 compatibility
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    throw new Error("No session found. Reload the page.");
  }

  const parsed = invoiceSchema.safeParse({
    targetName: formData.get("targetName"),
    amount: formData.get("amount"),
    bkashNumber: formData.get("bkashNumber"),
    message: formData.get("message"),
  });

  if (!parsed.success) throw new Error("Invalid form data submitted.");

  // 3. FIX: Manually inject the 8-character viral ID into Prisma
  const invoice = await prisma.invoice.create({
    data: {
      id: nanoid(8), // Short ID generation
      ...parsed.data,
      userId: session.user.id,
    },
  });

  return { success: true, id: invoice.id };
}
