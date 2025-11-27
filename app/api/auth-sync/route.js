import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { userId, emailAddress, firstName, lastName } = getAuth(request);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user exists in Neon
    let user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      // Create the user in Neon
      user = await prisma.user.create({
        data: {
          id: userId,
          name: `${firstName || "New"} ${lastName || "User"}`,
          email: emailAddress || "unknown@example.com",
          image: "",
          cart: {},
        },
      });
    }

    return NextResponse.json({ message: "User synced", user });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
