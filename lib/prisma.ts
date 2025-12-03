import { PrismaClient } from "@prisma/client";

export const pg =  globalThis.prisma || new PrismaClient()

if(process.env.NODE_ENV !== "production"){
    globalThis.prisma = pg
}