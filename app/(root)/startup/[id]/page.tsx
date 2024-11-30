import React, {Suspense} from 'react'
import {client} from "@/sanity/lib/client";
import {STARTUPS_BY_ID_QUERY} from "@/lib/queries";
import {notFound} from "next/navigation";
import {formatDate} from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import markdownit from "markdown-it";
import {Skeleton} from "@/components/ui/skeleton";
import View from "@/components/View";
import {auth} from "@/auth";
import {FilePenLine} from 'lucide-react';

const md = markdownit();
export const experimental_ppr = true;


const Page = async ({params}:{params:Promise<{id:string}>}) => {
    const id =(await params).id;
    const post = await client
        .withConfig({useCdn:false})
        .fetch(STARTUPS_BY_ID_QUERY,{id});
    const session = await auth();
    if(!post){return notFound()}

    const parsedContent = md.render(post?.pitch || '');

    return (
        <>
            <section className="pink_container !min-h-[230px]">

                <p className="tag">
                    {formatDate(post._createdAt)}
                </p>
                <h1 className="heading">{post.title}

                </h1>

                <p className="sub-heading !max-w-5xl">{post.description}</p>
            </section>

            <section className="section_container">
                <img src={post.image} alt="thumbnail" className="w-full h-auto rounded-xl"/>
                <div className="space-y-5 mt-10 max-w-4xl mx-auto">
                    <div className="flex-between gap-5">
                        <Link href={`/user/${post.author?._id}`} className="flex gap-2 items-center mb-3 ">
                            <Image src={post.author.image} alt="avatar"
                                   width={64} height={64}
                                   className="drop-shadow-lg rounded-full"/>
                            <div>
                                <p className="text-20-medium">
                                    {post.author.name}
                                </p>
                                <p className="text-16-medium !text-black-300">
                                    @{post.author.username}
                                </p>
                            </div>

                        </Link>

                        <p className="category-tag">
                            {post.category}
                        </p>
                    </div>

                    <h3 className="text-30-bold flex items-center">
                        Pitch Details
                        {
                            session?.id == post.author?._id && (
                                <Link href={`/startup/edit/${id}`}>
                                    <div className="ml-3 flex bg-pink-100 hover:bg-pink-300 rounded-full p-2"> {/* Adds some space between the text and the icon */}
                                        <FilePenLine className="size-6 "/>
                                    </div>
                                </Link>
                            )
                        }
                    </h3>

                    {parsedContent ? (
                        <article className="prose max-w-4xl font-work-sans break-all "
                                 dangerouslySetInnerHTML={{__html: parsedContent}}/>
                    ) : (
                        <p className="no-result">
                            No details provided
                        </p>

                    )}
                </div>
                <hr className="divider"/>
                {/*TODO:editor choice*/}

                <Suspense fallback={<Skeleton className="view_skeleton"/>}>
                    <View id={id}/>
                </Suspense>


            </section>
        </>
    )
}
export default Page
