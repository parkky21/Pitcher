import React from 'react'
import StartupEditForm from "@/components/StartupEditForm";
import {client} from "@/sanity/lib/client";
import { STARTUPS_BY_ID_QUERY} from "@/lib/queries";

const Page = async ({params}:{params:Promise<{id:string}>}) => {
    const id =(await params).id;
    const post = await client.fetch(STARTUPS_BY_ID_QUERY,{id});

    return (
        <>
            <section className="pink_container !min-h-[230px]">
                <h1 className="heading">
                    Edit your Startup Details
                </h1>
            </section>
            <StartupEditForm post={post}/>
        </>
    )
}
export default Page
