"use client";

import { StatusSwitch } from "@/components/common/status-switch";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTable } from "@/components/common/datatable";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { User } from "@/types/user";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

// const columns = [
//   {
//     id: "friendly_id",
//     header: "ID",
//     accessorKey: "friendly_id",
//   },
//   {
//     id: "name",
//     header: "Nome",
//     accessorKey: "name",
//   },
//   {
//     id: "email",
//     header: "Email",
//     accessorKey: "email",
//   },
//   {
//     id: "created_at",
//     header: "Data de Cadastro",
//     accessorKey: "created_at",
//     cell: ({ row }) => {
//       const date = new Date(row.getValue("created_at"));

//       return new Intl.DateTimeFormat("pt-BR", {
//         day: "2-digit",
//         month: "2-digit",
//         year: "numeric",
//         hour: "2-digit", // Opcional: adicione se quiser exibir hora
//         minute: "2-digit",
//       }).format(date);
//     },
//   },

//   {
//     id: "actions",
//     cell: ({ row }) => {
//       const user = row.original

//       return (
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant="ghost" className="h-8 w-8 p-0">
//               <span className="sr-only">Ações</span>
//               <MoreHorizontal className="h-4 w-4" />
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end">
//             <DropdownMenuLabel>Actions</DropdownMenuLabel>
//             <DropdownMenuItem
//               onClick={() => navigator.clipboard.writeText(user.id)}
//             >
//               Copiar Id
//             </DropdownMenuItem>
//             <DropdownMenuSeparator />
//             <DropdownMenuItem>
//                <Link href={`/usuarios/${user.id}`}>Ver Detalhes</Link>
//             </DropdownMenuItem>
//             <DropdownMenuItem>Editar</DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       )
//     },
//   },

// ];

export function TransactionsDataTable() {
  const router = useRouter(); // 3. Inicialize o router aqui

  // 4. Mova as colunas para dentro de um useMemo
  const columns = useMemo<ColumnDef<User>[]>(() => [
    {
      id: "id",
      header: "ID",
      accessorKey: "friendly_id",
    },
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
      id: "email",
      header: "Email",
      accessorKey: "email",
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
        const user = row.original;

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
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(user.id)}
              >
                Copiar Id Técnico
              </DropdownMenuItem>
              <DropdownMenuSeparator />

              {/* 5. Agora você pode usar o router.push diretamente no onClick */}
              <DropdownMenuItem  onClick={() => router.push(`/usuarios/${user.id}`)}>
                Ver Detalhes
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => table.options.meta?.handleDeleteRow(user.id, user.friendly_id)}
                className={cn("text-red-600 focus:text-red-600 cursor-pointer")}
              >
                Excluir
              </DropdownMenuItem>

            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ], [router]);


  return <DataTable
    columns={columns}
    url="/users"
    sortColumns={["friendly_id", "name", "email", "created_at"]}
    urlDeleteBulk="/users/bulk"
    modelName="Usuários"
  />;
}
