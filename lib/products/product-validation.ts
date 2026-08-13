import { auth } from "@clerk/nextjs";
import { transform } from "next/dist/build/swc/generated-native";
import { Princess_Sofia } from "next/font/google";
import { z } from "zod";

export const productSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters" })
    .max(120, { message: "Name must be less than 120 characters" }),
  slug: z
    .string()
    .min(3, { message: "Slug must be at least 3 characters" })
    .max(140, { message: "Slug must be less than 140 characters" })
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message: "Slug must be lowercase alphanumeric with optional hyphens",
    }),
  tagline: z
    .string()
    .max(200, { message: "Tagline must be less than 200 characters" }),

  websiteUrl: z.string().min(1, { message: "website url is required" }),
  description: z.string().optional(),
  tags: z
    .string()
    .min(1, { message: "tags are required" })
    .transform((tags) =>
      tags.split(",").map((tag) => tag.trim().toLowerCase()),
    ),
});
