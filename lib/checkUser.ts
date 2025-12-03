import { currentUser } from "@clerk/nextjs/server"
import { pg } from "./prisma"

export const CheckUser = async () => {

    const user = await currentUser()

    if (!user) {
        return null
    }

    try {

        const loggedInUser = await pg.user.findUnique({
            where: {
                clerkUserId: user.id
            }
        })

        if (loggedInUser) {
            return loggedInUser;
        }

        const name = `${user.firstName} ${user.lastName}`;

        const newsuer = await pg.user.create({
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