"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const editBlog = async (
    title: string | undefined,
    description: string | undefined,
    id: number
) => {
    const res = await fetch(`http://localhost:3001/api/blog/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description, id }),
    });

    return res.json();
};

const getBlogById = async (id: number) => {
    const res = await fetch(`http://localhost:3001/api/blog/${id}`);
    const data = await res.json();
    return data.post;
};

const deleteBlog = async (id: number) => {
    const res = await fetch(`http://localhost:3001/api/blog/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    });

    return res.json();
};

const EditPost = ({
    params,
}: {
    params: { id: number } | Record<string, any>;
}) => {
    const router = useRouter();
    const titleRef = useRef<HTMLInputElement | null>(null);
    const descriptionRef = useRef<HTMLTextAreaElement | null>(null);

    // useStateでIDを管理
    const [id, setId] = useState<number | number>(Number);

    // 非同期で `params` を解決
    useEffect(() => {
        if (id) {
            const fetchParams = async () => {
                const resolvedParams = await params;
                setId(resolvedParams.id); // `setId` を呼び出す
            };
            fetchParams();
        }
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (id === null) {
            toast.error("ID が未解決です。");
            return;
        }
        toast.loading("編集中です。。。", { id: "1" });
        try {
            await editBlog(
                titleRef.current?.value,
                descriptionRef.current?.value,
                id // アンラップした id を使う
            );

            toast.success("edit success!!", { id: "1" });

            router.push("/");
            router.refresh();
        } catch (err) {
            toast.error("error !try again!!", { id: "1" });
        }
    };

    const handleDelete = async () => {
        await deleteBlog(id);
        /* toast.loading("processing delete..."); */

        router.push("/");
        router.refresh();
    };

    useEffect(() => {
        // if (id !== null) {
        getBlogById(id)
            .then((data) => {
                if (titleRef.current && descriptionRef.current) {
                    titleRef.current.value = data.title;
                    descriptionRef.current.value = data.description;
                }
            })
            .catch(() => {
                toast.success("データの取得完了。", {
                    id: "1",
                });
            });
        //}
        // 初期レンダー時のみ実行するため、依存配列を修正
    }, [id]);

    return (
        <>
            <Toaster />
            <div className="w-full m-auto flex my-4">
                <div className="flex flex-col justify-center items-center m-auto">
                    <p className="text-2xl text-slate-200 font-bold p-3">
                        ビジネス案考え中。。。 🚀
                    </p>
                    <form onSubmit={handleSubmit}>
                        <input
                            ref={titleRef}
                            placeholder="タイトルを入力"
                            type="text"
                            className="rounded-md px-4 w-full py-2 my-2"
                        />
                        <textarea
                            ref={descriptionRef}
                            placeholder="記事詳細を入力"
                            className="rounded-md px-4 py-2 w-full my-2"
                        ></textarea>
                        <button className="font-semibold px-4 py-2 shadow-xl bg-slate-200 rounded-lg m-auto hover:bg-slate-100">
                            更新
                        </button>
                        <button
                            onClick={handleDelete}
                            className="ml-2 font-semibold px-4 py-2 shadow-xl bg-red-400 rounded-lg m-auto hover:bg-slate-100"
                        >
                            削除
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default EditPost;
