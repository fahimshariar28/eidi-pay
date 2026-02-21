"use server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { z } from "zod";
import { nanoid } from "nanoid";

const invoiceSchema = z.object({
  targetName: z.string().min(1, "Uncle's name is required"),
  amount: z.coerce.number().min(10, "Don't be cheap, ask for at least 10"),
  bkashNumber: z
    .string()
    .regex(/^\d{11}$/, "Phone number must be exactly 11 digits"),
  message: z.string().max(100, "Keep the joke short so the link doesn't break"),
});

export async function createInvoiceAction(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });

  const parsed = invoiceSchema.safeParse({
    targetName: formData.get("targetName"),
    amount: formData.get("amount"),
    bkashNumber: formData.get("bkashNumber"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    throw new Error("Invalid form data submitted.");
  }

  const { targetName, amount, bkashNumber, message } = parsed.data;

  try {
    // We cast to 'any' here as a targeted fix for the union type mismatch
    const invoice = await prisma.invoice.create({
      data: {
        id: nanoid(8),
        targetName,
        amount,
        bkashNumber,
        message,
        userId: session?.user?.id || undefined,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any,
    });

    return { success: true, id: invoice.id };
  } catch (error) {
    console.error("Prisma Creation Error:", error);
    throw new Error("Failed to create invoice.");
  }
}
