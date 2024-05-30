import prisma from "../../../prisma";
import { UserType, UserRole } from "@prisma/client";

export async function findOrCreateUser(
  email: string,
  userType: UserType,
  displayName: string,
) {
  try {
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          displayName,
          email,
          password: "OAUTH_NO_PASSWORD",
          role: UserRole.USER,
          userType,
        },
      });
    }

    return user;
  } catch (error: unknown) {
    console.error("Error in findOrCreateUser:", error);
    throw error;
  }
}
