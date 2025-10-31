"use client"

import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface SaveButtonProps {
    onSave: () => void;
}

export function SaveButton({ onSave }: SaveButtonProps) {
    return (
        <Button onClick={onSave} className="w-full">
            <Check className="mr-2 h-4 w-4" />
            Save Repeat Settings
        </Button>
    )
}
