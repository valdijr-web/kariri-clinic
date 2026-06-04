// components/users/user-details.tsx
"use client";

import { useState, useEffect, useTransition } from "react";
import { User } from "@/types/pagination";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Mail, Calendar, Hash, RefreshCcw, Pencil } from "lucide-react";
import Link from "next/link";
import { apiFetch } from "@/services/api";

interface UserDetailsProps {
    userId: string;
    initialUser: User | null;
}

export function UserDetails({ userId, initialUser }: UserDetailsProps) {
    const [user, setUser] = useState<User | null>(initialUser);
    const [loading, setLoading] = useState(!initialUser);
    const [isPending, startTransition] = useTransition();

    const fetchUser = async () => {
        setLoading(true);
        try {
            const response = await apiFetch(`/users/${userId}`);
            const data = await response.json();
            setUser(data);
        } catch (error) {
            console.error("Erro no fetch de cliente:", error);
        } finally {
            setLoading(false);
        }
    };

    // Lógica de tentativa automática se o servidor falhou
    useEffect(() => {
        if (!initialUser) {
            startTransition(() => {
                fetchUser();
            });
        }
    }, [initialUser, userId]);

    // Estado de carregamento inicial ou durante nova tentativa
    if (loading && !user) {
        return (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <RefreshCcw className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground font-medium">Buscando detalhes do usuário...</p>
            </div>
        );
    }

    // Fallback caso ambos (server e client) falhem
    if (!user) {
        return (
            <div className="text-center py-20">
                <p className="text-red-500 mb-4 font-semibold">Não foi possível carregar os dados.</p>
                <Button onClick={fetchUser} variant="outline" className="gap-2">
                    <RefreshCcw className="h-4 w-4" /> Tentar Novamente
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/users"><ChevronLeft className="h-4 w-4" /></Link>
                    </Button>
                    <h1 className="text-3xl font-bold tracking-tight">Ficha do Usuário</h1>
                </div>
                <Button asChild className="gap-2">
                    <Link href={`/users/${userId}/editar`}>
                        <Pencil className="h-4 w-4" />
                        Editar
                    </Link>
                </Button>
            </div>

            <Card className={loading ? "opacity-50 transition-opacity" : ""}>
                <CardHeader>
                    <CardTitle className="text-xl">{user.name}</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-6 sm:grid-cols-3">
                    <div className="flex items-start gap-3">
                        <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                            <p className="text-sm font-medium">E-mail</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <Hash className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                            <p className="text-sm font-medium">ID Interno</p>
                            <p className="text-sm text-muted-foreground">#{user.friendly_id}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                            <p className="text-sm font-medium">Cadastrado em</p>
                            <p className="text-sm text-muted-foreground">
                                {new Date(user.created_at).toLocaleDateString("pt-BR")}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}