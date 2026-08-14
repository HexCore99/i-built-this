"use client";
import { CheckCircleIcon, CheckIcon, XCircleIcon } from "lucide-react";
import { Button } from "../ui/button";
import {
  approveProductAction,
  rejectProductAction,
} from "@/lib/admin/admin-actions";
import { ProductType } from "@/types";

export default function AdminActions({
  status,
  productId,
}: {
  status: string;
  productId: ProductType["id"];
}) {
  const handleApprove = async () => {
    await approveProductAction(productId);
  };

  const handleReject = async () => {
    await rejectProductAction(productId);
  };

  return (
    <div className="space-y-2">
      {status === "pending" && (
        <div className="mb-2 flex items-center gap-2">
          <Button
            variant="default"
            className="hover:cursor-pointer"
            onClick={handleApprove}
          >
            <CheckCircleIcon className="size-4" />
            Approve
          </Button>

          <Button
            variant="destructive"
            className="hover:cursor-pointer"
            onClick={handleReject}
          >
            <XCircleIcon className="size-4" />
            Reject
          </Button>
        </div>
      )}
    </div>
  );
}
