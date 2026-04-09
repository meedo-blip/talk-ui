import { SpringUser, UserType } from "next-auth";

export const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET as string;

export function toSpringUser(user: any): SpringUser {
    return {
        id: user.id,
        provider: user.provider,
        providerAccountId: user.providerAccountId,
        email: user.email,
        details: {
            name: user.name,
            image: user.image,
        },
    };
}