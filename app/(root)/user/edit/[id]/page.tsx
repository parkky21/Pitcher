import React from 'react'
import {auth} from "@/auth";
import {redirect} from "next/navigation";
import ProfileEdit from "@/components/ProfileEdit";

const Page = async ({params}:{params:Promise<{id:string}>}) => {
    const id =(await params).id;
    const session= await auth();

    if(session?.id!=id){redirect("/")}

    return (<>
            <section className="pink_container !min-h-[230px]">
                <h1 className="heading">
                    Edit your profile
                </h1>
            </section>

            <ProfileEdit id={id}/>
        </>

    )
}
export default Page
