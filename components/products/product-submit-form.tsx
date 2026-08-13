"use client";
import { Loader2Icon, SparkleIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { addProductAction } from "@/lib/products/product-actions";
import { useActionState } from "react";
import { FormState } from "@base-ui/react";

const initialState = {
  success: false,
  error: {},
  message: "",
};
export default function ProductSubmitForm({}) {
  const [state, formAction, isPending] = useActionState<FormState>(
    addProductAction,
    initialState,
  );

  return (
    <form className="space-y-6" action={formAction}>
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
        </Field>

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
