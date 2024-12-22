import { NextResponse } from "next/server";
import { main } from "../route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

//for getting blog's detail in API
export const GET = async (req: Request, res: NextResponse) => {
    try {
        const id: number = parseInt(req.url.split("/blog/")[1]);
        await main();
        const post = await prisma.post.findFirst({ where: { id } });
        return NextResponse.json({ message: "Success", post }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ message: "Error", err }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
};

//for editing blog in API
export const PUT = async (req: Request, res: NextResponse) => {
    try {
        const id: number = parseInt(req.url.split("/blog/")[1]);

        const { title, description } = await req.json();

        await main();
        const post = await prisma.post.update({
            data: { title, description },
            where: { id },
        });
        return NextResponse.json({ message: "Success", post }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ message: "Error", err }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
};

//for deleting blog in API
export const DELETE = async (req: Request, res: NextResponse) => {
    try {
        const id: number = parseInt(req.url.split("/blog/")[1]);

        await main();
        const post = await prisma.post.delete({
            where: { id },
        });
        return NextResponse.json({ message: "Success", post }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ message: "Error", err }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
};
