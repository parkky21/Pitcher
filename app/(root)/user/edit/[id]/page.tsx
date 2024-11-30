import React from 'react'
import {auth} from "@/auth";
import {redirect} from "next/navigation";
import ProfileEdit, {userType} from "@/components/ProfileEdit";
import {client} from "@/sanity/lib/client";
import {AUTHOR_BY_SESSION_ID} from "@/lib/queries";


const Page = async ({params}:{params:Promise<{id:string}>}) => {

    const id =(await params).id;
    const session= await auth();
    const user = await client
        .withConfig({useCdn:false})
        .fetch(AUTHOR_BY_SESSION_ID, { id });

    if(session?.id!=id){redirect("/")}
    if (!user) {
        return <div>User not found</div>;
    }

    return (<>
            <section className="pink_container !min-h-[230px]">
                <h1 className="heading">
                    Edit your profile
                </h1>
            </section>

            <ProfileEdit id={id} user={user as userType}/>
        </>

    )
}
export default Page
