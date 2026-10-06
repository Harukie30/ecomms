"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function registerUser(input: {
  name: string;
  email: string;
  password: string;
  role: "buyer" | "seller";
}) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) {
    return { error: "Email already registered." };
  }

  const passwordHash = await bcrypt.hash(input.password, 10);

  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      passwordHash,
      role: input.role,
    },
  });

  if (input.role === "seller") {
    await prisma.sellerProfile.create({
      data: {
        userId: user.id,
        displayName: input.name,
        bio: "",
      },
    });
  }

  return { success: true };
}
