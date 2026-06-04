// app/users/page.tsx
import { apiServerFetch } from "@/services/api-server";

import { TransactionsDataTable } from "./_components/transactions-datatable";
import { Button } from "@/components/ui/button";
import { CirclePlusIcon } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Kariri Clinic - Usuários",
    description: "Gestor de Clínicas",
};
export default async function UsersPage() {

    return (
        <div className="container mx-auto py-5 ">
            <div className="flex flex-col gap-5 mb-5">
                <h1 className="text-2xl font-bold ">Gestão de Usuários</h1>
                <Link href="/users/novo">
                    <Button className="self-start hover:bg-primary/90"  >
                        <CirclePlusIcon />
                        <span>Adicionar Usuário</span>
                    </Button>
                </Link>

            </div>
            <TransactionsDataTable />
        </div>
    );
}