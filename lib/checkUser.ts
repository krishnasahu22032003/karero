import { currentUser } from "@clerk/nextjs/server"
import { pg } from "./prisma"

export const CheckUser = async ()=>{

const user = await currentUser()

if(!user){
    return null 
}

try{

    await pg.user.findUnique({
        where:{
            clerkUserId:user.id
        }
    })

}catch(e){

}

}