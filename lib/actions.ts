"use server";

import {auth} from "@/auth";
import {parseServerActionResponse} from "@/lib/utils";
import slugify from "slugify";
import {writeClient} from "@/sanity/lib/write-client";

import { signIn, signOut } from "@/auth";

export async function handleSignOut() {
    await signOut({ redirectTo: "/" });
}

export async function handleSignIn() {
    await signIn("google");
}


export const createPitch= async (
    state:any,
    form:FormData,
    pitch:string,
)=>{
    const session = await auth();

    if(!session) return parseServerActionResponse({ error:"Not Signed in", status:'ERROR'});

    const { title,description, category,link }=Object.fromEntries(
        Array.from(form).filter(([key])=>key!="pitch"),
    );
    const slug= slugify(title as string, { lower:true, strict: true});

    try{
        const startup ={
            title,
            description,
            category,
            image:link,
            slug:{
                _type:slug,
                current:slug,
            },
            author:{
                _type:"reference",
                _ref:session?.id,
            },
            pitch,
        };

        const result= await writeClient.create({_type: "startup", ...startup});

        return parseServerActionResponse({
            ...result,
            error:"",
            status:"SUCCESS",
        })

    }catch (error){
        console.log(error);
        return parseServerActionResponse(
            { error:JSON.stringify(error),
                status:'ERROR'});

    }
}


export const updatePitch = async (
    pitchId: string, // Pass the ID of the pitch to update
    state: any,
    form: FormData,
    pitch: string
) => {
    const session = await auth();

    if (!session) {
        return parseServerActionResponse({
            error: "Not Signed in",
            status: "ERROR",
        });
    }

    const { title, description, category, link } = Object.fromEntries(
        Array.from(form).filter(([key]) => key !== "pitch")
    );

    const slug = slugify(title as string, { lower: true, strict: true });

    try {
        const startup = {
            title,
            description,
            category,
            image: link,
            slug: {
                _type: "slug",
                current: slug,
            },
            pitch,
        };

        const result = await writeClient
            .patch(pitchId) // Specify the document to update
            .set(startup) // Set the new values
            .commit(); // Commit the update


        return parseServerActionResponse({
            ...result,
            error: "",
            status: "SUCCESS",
        });
    } catch (error) {
        console.log(error);
        return parseServerActionResponse({
            error: JSON.stringify(error),
            status: "ERROR",
        });
    }
};

interface UpdateUserState {
    name: string;
    username: string;
    image: string;
    bio: string;
}

export const updateUser = async (
    userId: string, // ID of the user to update
     // Typing for state
    form,
    // Form data containing updated values
) => {
    // Check authentication session
    const {name,
    username,
    bio,
    image,
    }=form;
    const session = await auth();
    if (!session) {
        return parseServerActionResponse({
            error: "Not Signed in",
            status: "ERROR",
        });
    }
    // Extract form data values

    try {
        // Construct the user object for updating
        const updatedUser = {
            name,
            username,
            bio,
            image,
        };

        // Update the user document in the database
        const result = await writeClient
            .patch(userId) // Specify the document to update
            .set(updatedUser) // Set the new values
            .commit(); // Commit the update

        // Return success response
        return parseServerActionResponse({
            ...result,
            error: "",
            status: "SUCCESS",
        });
    } catch (error) {
        console.error("Error updating user:", error);

        // Return error response
        return parseServerActionResponse({
            error: JSON.stringify(error),
            status: "ERROR",
        });
    }
};