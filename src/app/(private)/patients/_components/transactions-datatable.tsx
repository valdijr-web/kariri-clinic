"use client";

import { StatusSwitch } from "@/components/common/status-switch";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTable } from "@/components/common/datatable";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { Patient } from "@/types/patient";

export function TransactionsDataTable() {
  const router = useRouter(); // 3. Inicialize o router aqui

  // 4. Mova as colunas para dentro de um useMemo
  const columns = useMemo<ColumnDef<Patient>[]>(() => [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "friendly_id",
      header: "ID",
      accessorKey: "friendly_id",
    },
    {
      id: "name",
      header: "Nome",
      accessorKey: "name",
    },
    {
      id: "cpf",
      header: "CPF",
      accessorKey: "cpf",
    },
    {
      id: "phone_number",
      header: "Contato",
      accessorKey: "phone_number",
    },
    {
      id: "created_at",
      header: "Data de Cadastro",
      accessorKey: "created_at",
      cell: ({ row }) => {
        const date = new Date(row.getValue("created_at"));
        return new Intl.DateTimeFormat("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }).format(date);
      },
    },
    {
      id: "is_active",
      header: "Ativo",
      accessorKey: "is_active",
      cell: ({ row, table }) => {
        const user = row.original;
        const is_active = Boolean(user.is_active);
        const refreshData = table.options.meta?.refreshData; // pega a função
        return (
          <StatusSwitch
            active={is_active}
            endpointUrl={`/users/${user.id}/status`}
            onSuccess={refreshData}
          />
        );
      },
    },
    {
      id: "actions",
      cell: ({ row, table }) => {
        const patient = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Ações</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Ações</DropdownMenuLabel>

              <DropdownMenuItem onClick={() => router.push(`/patient/${patient.id}`)}>
                Ver Detalhes
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => table.options.meta?.handleDeleteRow(patient.id, patient.friendly_id)}
                variant="destructive"
              >
                <Trash2Icon />
                <span>Excluir</span>
              </DropdownMenuItem>

            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ], [router]);


  return <DataTable
    columns={columns}
    url="/patients"
    sortColumns={["friendly_id", "name", "cpf",  "phone_number", "created_at"]}
    urlDeleteBulk="/patients/bulk"
    modelName="Paciente"
  />;
}
