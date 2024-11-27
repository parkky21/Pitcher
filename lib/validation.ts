import { z } from "zod";

export const formSchema = z.object({
    title: z.string().min(3).max(100),
    description: z.string().min(20).max(500),
    category: z.string().min(3).max(20),
    link: z
        .string()
        .url()
        .refine((url) => /\.(jpeg|jpg|png|gif|bmp|webp|svg)$/.test(url), {
            message: "The link must point to a valid image file (e.g., .jpg, .png).",
        }),
    pitch: z.string().min(10),
});