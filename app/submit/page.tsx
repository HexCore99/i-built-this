import SectionHeader from "@/components/common/section-header";
import { SparklesIcon } from "lucide-react";
import ProductSubmitForm from "@/components/products/product-submit-form";

export default function SubmitPage() {
  return (
    <section className="py-20">
      <div className="wrapper">
        <SectionHeader
          title="Submit your Product"
          icon={SparklesIcon}
          description="Share your creation with the community. Your submission will be reviewed before going to live."
        />
        <div className="max-w-2xl mx-auto">
          <ProductSubmitForm />
        </div>
      </div>
    </section>
  );
}
