import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient(/* {
    log: ["query", "info", "warn", "error"], // ログを出力
} */);

export async function main() {
    try {
        await prisma.$connect();
    } catch (err) {
        throw Error("failed to connect DB");
    }
}

//for getting all blogs in API
export const GET = async (req: Request, res: NextResponse) => {
    try {
        await main();
        const posts = await prisma.post.findMany();
        return NextResponse.json(
            { message: "Success", posts },
            { status: 200 }
        );
    } catch (err) {
        return NextResponse.json({ message: "Error", err }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
};

//for posting all blogs in API
export const post = async (req: Request, res: NextResponse) => {
    try {
        const { title, description } = await req.json();

        await main();
        const post = await prisma.post.create({ data: { title, description } });
        return NextResponse.json({ message: "Success", post }, { status: 201 });
    } catch (err) {
        return NextResponse.json({ message: "Error", err }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
};

/* export async function main() {
    try {
        await prisma.$connect();
    } catch (err) {
        throw Error("failed to connect DB");
    }
} */

export const POST = async (req: Request, res: NextResponse) => {
    try {
        const body = await req.text();

        if (!body) {
            return NextResponse.json(
                { message: "Error", error: "Request body is empty" },
                { status: 400 }
            );
        }

        const { title, description } = JSON.parse(body);

        if (!title || !description) {
            return NextResponse.json(
                { message: "Error", error: "Missing title or description" },
                { status: 400 }
            );
        }

        await main(); // Prisma接続

        // データベースにポストを作成
        const post = await prisma.post.create({ data: { title, description } });

        return NextResponse.json({ message: "Success", post }, { status: 201 });
    } catch (err) {
        // エラーハンドリングを強化: errがError型であるかどうかを確認
        if (err instanceof Error) {
            console.error("Error creating post:", err.message, err.stack);
        } else {
            console.error("Unexpected error:", err);
        }

        return NextResponse.json(
            {
                message: "Error",
                error: err instanceof Error ? err.message : "Unknown error",
            },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
};
