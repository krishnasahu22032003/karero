import { currentUser } from "@clerk/nextjs/server"
import {prisma} from "./prisma"

export const CheckUser = async () => {

    const user = await currentUser()

    if (!user) {
        return null
    }

    try {

        const loggedInUser = await prisma.user.findUnique({
            where: {
                clerkUserId: user.id
            }
        })

        if (loggedInUser) {
            return loggedInUser;
        }

        const name = `${user.firstName} ${user.lastName}`;

        const newsuer = await prisma.user.create({
            data: {
                clerkUserId: user.id,
                name: name,
                imageUrl: user.imageUrl,
                email: user.emailAddresses[0].emailAddress
            }
        })
        return newsuer;
    } catch (e) {
        console.log((e as Error).message)
    }

}