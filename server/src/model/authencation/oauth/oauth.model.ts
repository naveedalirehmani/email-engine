import prisma from "../../../prisma";
import { EmailProvider, UserRole, User } from "@prisma/client";

export async function findOrCreateUser(
  email: string,
  emailProvider: {
    provider: EmailProvider;
    access: string;
    // refresh: string;
  },
  displayName: string,
): Promise<User> {
  try {
    let user = await prisma.user.findUnique({
      where: { email },
      include: { profiles: true },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          displayName,
          email,
          password: "OAUTH_NO_PASSWORD",
          role: UserRole.USER,
          profiles: {
            create: [
              {
                accessToken: emailProvider.access,
                refreshToken: "emailProvider.refresh",
                provider: emailProvider.provider,
              },
            ],
          },
        },
        include: { profiles: true },
      });
    } else {
      const existingProfile = user.profiles.find(
        (profile) => profile.provider === emailProvider.provider,
      );

      if (existingProfile) {
        await prisma.profile.update({
          where: { id: existingProfile.id },
          data: {
            accessToken: emailProvider.access,
            refreshToken: "emailProvider.refresh",
            updatedAt: new Date(),
          },
        });
      } else {
        await prisma.profile.create({
          data: {
            userId: user.id,
            accessToken: emailProvider.access,
            refreshToken: "emailProvider.refresh",
            provider: emailProvider.provider,
          },
        });
      }

      user = await prisma.user.findUnique({
        where: { email },
        include: { profiles: true },
      });
    }

    // @ts-ignore return user without profiles
    const { _, ...userWithoutProfiles } = user;

    return userWithoutProfiles;
  } catch (error: unknown) {
    console.error("Error in findOrCreateUser:", error);
    throw error;
  }
}
