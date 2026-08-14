"use client";
import { Loader2Icon, SparkleIcon } from "lucide-react";
import { Button } from "../ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "../ui/field";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { addProductAction } from "@/lib/products/product-actions";
import { useActionState } from "react";
import { cn } from "@/lib/utils";
import type { FormState } from "@/types";

const initialState: FormState = {
  success: false,
  error: {},
  message: "",
};
export default function ProductSubmitForm({}) {
  const [state, formAction, isPending] = useActionState(
    addProductAction,
    initialState,
  );
  const { success, error, message } = state;
  return (
    <form className="space-y-6" action={formAction}>
      {message && (
        <div
          className={cn(
            "p-4 rounded-lg border",
            success
              ? "bg-primary/10 border-primary text-primary"
              : " border-destructive/10 text-destructive",
          )}
          role="alert"
          aria-live="polite"
        >
          {message}
        </div>
      )}
      <FieldGroup className="mb-12">
        <Field>
          <FieldLabel htmlFor="name">Prodcut Name</FieldLabel>
          <Input
            id="name"
            name="name"
            placeholder="My Awesome Product"
            required
            onChange={() => {}}
          />
          <FieldError>{error?.name}</FieldError>
        </Field>

        {/*TODO: What if the user submits a slug that already exists?*/}
        <Field>
          <FieldLabel htmlFor="slug">Slug</FieldLabel>
          <Input
            id="slug"
            name="slug"
            placeholder="my-awesome-product"
            required
            onChange={() => {}}
          />
          <FieldDescription>
            URL-friendly version of the product name
          </FieldDescription>

          <FieldError>{error?.slug}</FieldError>
        </Field>

        <Field>
          <FieldLabel htmlFor="tagline">Tagline</FieldLabel>
          <Input
            id="tagline"
            name="tagline"
            placeholder="A brief, Catchy description"
            required
            onChange={() => {}}
          />

          <FieldError>{error?.tagline}</FieldError>
        </Field>

        <Field>
          <FieldLabel htmlFor="description">Description</FieldLabel>
          <Textarea
            id="description"
            name="description"
            placeholder="Tell us more about your product..."
            required
            onChange={() => {}}
          />

          <FieldError>{error?.description}</FieldError>
        </Field>

        <Field>
          <FieldLabel htmlFor="website">Website Url</FieldLabel>
          <Input
            id="websiteUrl"
            name="websiteUrl"
            placeholder="https://yourproduct.com"
            required
            onChange={() => {}}
          />
          <FieldDescription>
            Enter your product&apos;s website URL
          </FieldDescription>

          <FieldError>{error?.websiteUrl}</FieldError>
        </Field>

        <Field>
          <FieldLabel htmlFor="tags">Tags</FieldLabel>
          <Input
            id="tags"
            name="tags"
            placeholder="AI,SaaS,Productivity"
            required
            onChange={() => {}}
          />
          <FieldDescription>
            Comma-separated list of tags (e.g. AI,SaaS,Productivity)
          </FieldDescription>

          <FieldError>{error?.tags}</FieldError>
        </Field>
      </FieldGroup>

      <Button type="submit" size="lg" className="w-full">
        {isPending ? (
          <Loader2Icon className="size-4 animate-spin" />
        ) : (
          <>
            <SparkleIcon className="size-4" />
            Submit Product
          </>
        )}
      </Button>
    </form>
  );
}
