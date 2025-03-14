"use client";

import React, { useState} from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { userSchema} from "@/lib/validation";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import {useRouter} from "next/navigation";
import { updateUser } from "@/lib/actions";


export interface userType {
    _id:string,
    name:string,
    username:string,
    bio:string,
    image:string,
}

const ProfileEdit =({ id,user }: { id: string , user: userType }) => {
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [name, setName] = useState(user.name || "");
    const [username, setUsername] = useState(user.username || "");
    const [image, setImage] = useState(user.image || "");
    const [bio, setBio] = useState(user.bio || "");

    const { toast } = useToast();
    const router = useRouter();

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const formValues = {
                name:name.trim(),
                username:username.trim(),
                image:image,
                bio:bio,
            };

            await userSchema.parseAsync(formValues);

            const result = await updateUser(id, formValues);

            if (result.status === "SUCCESS") {
                toast({
                    title: "Success",
                    description: "Your profile has been updated successfully.",
                });

                router.push(`/user/${result._id}`); // Refresh the page or redirect as needed
            } else {
                throw new Error(result.error || "An unexpected error occurred.");
            }
        } catch (error) {
            if (error instanceof z.ZodError) {
                const fieldErrors = error.flatten().fieldErrors;
                setErrors(fieldErrors as unknown as Record<string, string>);

                toast({
                    title: "Validation Error",
                    description: "Please check your inputs and try again.",
                    variant: "destructive",
                });
            } else {
                toast({
                    title: "Error",
                    description: "An unexpected error has occurred.",
                    variant: "destructive",
                });
            }
        }
    };

    return (
        <form onSubmit={handleFormSubmit} className="startup-form">
            <div>
                <label htmlFor="name" className="startup-form_label">
                    Name
                </label>
                <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    name="name"
                    className="startup-form_input"
                    required
                    placeholder="Your Full Name"
                />
                {errors.name && <p className="startup-form_error">{errors.name}</p>}
            </div>

            <div>
                <label htmlFor="bio" className="startup-form_label">
                    Bio
                </label>
                <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    name="bio"
                    className="startup-form_textarea"
                    required
                    placeholder="Your Bio"
                />
                {errors.bio && <p className="startup-form_error">{errors.bio}</p>}
            </div>

            <div>
                <label htmlFor="username" className="startup-form_label">
                    Username
                </label>
                <Input
                    id="username"
                    name="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="startup-form_input"
                    required
                    placeholder="Your Username"
                />
                {errors.username && (
                    <p className="startup-form_error">{errors.username}</p>
                )}
            </div>

            <div>
                <label htmlFor="image" className="startup-form_label">
                    Image URL
                </label>
                <Input
                    id="image"
                    name="image"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="startup-form_input"
                    required
                    placeholder="Your Profile Image URL"
                />
                {errors.image && <p className="startup-form_error">{errors.image}</p>}
            </div>

            <Button type="submit" className="startup-form_btn text-white">
                Save Changes
                <Send className="ml-2" />
            </Button>
        </form>
    );
};

export default ProfileEdit;
