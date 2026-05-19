'use client'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogMedia,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Info, Siren, TriangleAlert } from "lucide-react";

// 1. Tipamos estritamente as opções para evitar erros de digitação (ex: "dangeer")
export type DialogVariant = "danger" | "warning" | "info";
interface ConfirmDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title?: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    variant?: DialogVariant;
    onConfirm: () => void | Promise<void>;
    destructive?: boolean;
}

// 2. Criamos um mapa de estilos e ícones centralizado
const variantConfig = {
    danger: {
        Icon: Siren,
        iconClass: "text-red-500",
        bgClass: "bg-destructive/10",
        buttonVariant: "destructive" as const,
    },
    warning: {
        Icon: TriangleAlert,
        iconClass: "text-amber-500",
        bgClass: "bg-amber-500/10",
        buttonVariant: "default" as const, // Ou uma variante amarela caso tenha no seu tema
    },
    info: {
        Icon: Info,
        iconClass: "text-blue-500",
        bgClass: "bg-blue-500/10",
        buttonVariant: "default" as const,
    },
};

export function ConfirmDialog({
    open,
    onOpenChange,
    title = "Tem certeza?",
    description = "Essa ação não pode ser desfeita.",
    confirmText = "Continuar",
    cancelText = "Cancelar",
    variant = "warning",
    onConfirm,
    destructive = true,
}: ConfirmDialogProps) {
    const handleConfirm = async () => {
        await onConfirm();
        onOpenChange(false);
    };

    // Resgata a configuração com base na variante atual
    const { Icon, iconClass, bgClass, buttonVariant } = variantConfig[variant];

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogMedia className={bgClass}>
                        <Icon className={iconClass} size={24} />
                    </AlertDialogMedia>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>{cancelText}</AlertDialogCancel>
                    <AlertDialogAction onClick={handleConfirm} variant={buttonVariant}>
                        {confirmText}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};