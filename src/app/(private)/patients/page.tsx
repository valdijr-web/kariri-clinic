// app/users/page.tsx

import { TransactionsDataTable } from "./_components/transactions-datatable";
import { Button } from "@/components/ui/button";
import { CirclePlusIcon } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import CreatePatient from "./_components/create-patient";

export const metadata: Metadata = {
    title: "Kariri Clinic - Pacientes",
    description: "Gestor de Clínicas",
};
export default async function PatientsPage() {

    return (
        <div className="container mx-auto py-5 ">
            <div className="flex flex-col gap-5 mb-5">
                <h1 className="text-2xl font-bold ">Gestão de Pacientes</h1>
                <CreatePatient />

            </div>
            <TransactionsDataTable />
        </div>
    );
}