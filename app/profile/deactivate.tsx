"use client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export function DeactivateComponent() {
    const router = useRouter();
    const deactivateOperation = async () => {
        try {
            const r = await axios.delete("/api/member/deactivate");
            if (r.status === 200) {
                signOut({ redirect: true, callbackUrl: "/" });
            }
        } catch (error) {
            alert(
                "We're unable to delete this transaction. Please refresh the page again!"
            );
            router.refresh();
        }
    };
    return (
        <div className="space-y-1">
            <Label>Deactivate Account</Label>
            <Button
                type="button"
                variant={"destructive"}
                className="w-full"
                onClick={() => {
                    const v = confirm("Do you want to deactivate account?");
                    if (v) {
                        deactivateOperation();
                    }
                }}
            >
                Deactivate
            </Button>
        </div>
    );
}
