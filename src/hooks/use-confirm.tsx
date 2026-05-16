'use client'
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { useState, useCallback } from "react";

interface ConfirmOptions {
    title?: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    destructive?: boolean;
    onConfirm: () => void | Promise<void>;
}

export function useConfirm() {
    const [isOpen, setIsOpen] = useState(false);
    const [options, setOptions] = useState<ConfirmOptions | null>(null);

    const confirm = useCallback((opts: ConfirmOptions) => {
        setOptions(opts);
        setIsOpen(true);
    }, []);

    const close = useCallback(() => {
        setIsOpen(false);
        setOptions(null);
    });

    const ConfirmDialogComponent = useCallback(() => {
        if (!options) return null;
        return (
            <ConfirmDialog
                open={isOpen}
                onOpenChange={close}
                title={options.title}
                description={options.description}
                confirmText={options.confirmText}
                cancelText={options.cancelText}
                destructive={options.destructive}
                onConfirm={options.onConfirm}
            />
        );
    }, [isOpen, options, close]);

    return {confirm , close, ConfirmDialog: ConfirmDialogComponent}
}