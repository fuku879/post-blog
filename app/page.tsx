import { PostType } from "@/types";
import Image from "next/image";
import Link from "next/link";

async function fetchAllBlogs() {
    const res = await fetch("http://localhost:3001/api/blog", {
        cache: "no-store", //ssr
    });

    const data = await res.json();

    return data.posts;
}

export default async function Home() {
    const posts = await fetchAllBlogs();

    return (
        <main className="w-full h-full">
            <div className="md:w-2/4 sm:w-3/4 m-auto p-4 my-5 rounded-lg bg-blue-900 drop-shadow-xl">
                <h1 className="text-slate-200 text-center text-2xl font-extrabold">
                    ビジネス案書き込みサイト 📝
                </h1>
            </div>

            <div className="flex my-5">
                <Link
                    href={"/blog/add"}
                    className=" md:w-1/6 sm:w-2/4 text-center rounded-md p-2 m-auto bg-slate-300 font-semibold"
                >
                    ビジネス案作成
                </Link>
            </div>

            <div className="w-full flex flex-col justify-center items-center">
                {posts && posts.length > 0 ? (
                    posts.map((post: PostType) => (
                        <div
                            key={post.id}
                            className="w-3/4 p-4 rounded-md mx-3 my-2 bg-slate-500 flex flex-col justify-center"
                        >
                            <div className="flex items-center my-3">
                                <div className="mr-auto">
                                    <h2 className="mr-auto font-semibold">
                                        {post.title}
                                    </h2>
                                </div>
                                <Link
                                    href={`/blog/edit/${post.id}`}
                                    className="px-4 py-1 text-center text-xl bg-slate-900 rounded-md font-semibold text-slate-200"
                                >
                                    編集
                                </Link>
                            </div>

                            <div className="mr-auto my-1">
                                <blockquote className="font-bold text-slate-700">
                                    {new Date(post.date).toDateString()}
                                </blockquote>
                            </div>

                            <div className="mr-auto my-1">
                                <h2 className="text-slate-100">
                                    {post.description}
                                </h2>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>投稿はありません。</p> // 投稿がない場合や読み込み中の表示
                )}
            </div>
        </main>
    );
}
