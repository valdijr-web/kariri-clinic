"use client";

import React, { useMemo, useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import useSWR from "swr";
import { apiFetch } from "@/services/api";
import { parseAsInteger, useQueryState } from 'nuqs'
import qs from 'qs';
import { ArrowUp, ArrowUpDown, Trash2 } from "lucide-react";
import debounce from "lodash/debounce";
import { Button } from "@/components/ui/button";
import { useConfirm } from "@/hooks/use-confirm";
import { toast } from "sonner";
import { LaravelPaginator } from "@/types/pagination";


interface DataTableProps<TData, TValue> {
  url: string;
  urlDeleteBulk: string;
  columns: ColumnDef<TData, TValue>[];
  sortColumns?: string[];
  defaultSortBy?: string;
  defaultSortDirection?: "asc" | "desc";
  modelName: string;
}

export function DataTable<TData, TValue>({
  url,
  urlDeleteBulk,
  columns,
  sortColumns = [],
  defaultSortBy,
  defaultSortDirection,
  modelName,
}: DataTableProps<TData, TValue>) {

  const fetcher = (url: string): Promise<LaravelPaginator<TData>> => apiFetch(url, {
    method: 'GET',
  }).then((res) => res.json());

  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));

  const [perPage, setPerPage] = useQueryState("per_page", {
    defaultValue: "5",
  });
  const [sortBy, setSortBy] = useQueryState("sort_by", {
    defaultValue: defaultSortBy || ""
  });

  const [sortDirection, setSortDirection] = useQueryState("sort_direction", {
    defaultValue: defaultSortDirection || ""
  });

  const [q, setQ] = useQueryState("q", {
    defaultValue: ""
  });

  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>({
      id: false,
    })

  const [rowSelection, setRowSelection] = React.useState({})

  const { confirm, ConfirmDialog } = useConfirm();

  const { data, isLoading, mutate } = useSWR<LaravelPaginator<TData>>(
    `${url}?${qs.stringify({
      page,
      sort_by: sortBy,
      sort_direction: sortDirection,
      per_page: perPage,
      global_filter: q,
    })}`,
    fetcher,
  );

  const { items, metadata } = useMemo(() => {
    return {
      items: data?.data || [],
      metadata: {
        current_page: data?.current_page,
        last_page: data?.last_page,
        per_page: data?.per_page,
        from: data?.from,
        to: data?.to,
        total: data?.total,
      }
    }
  }, [data]);

  const pagesToRender = useMemo(() => {
    if (!metadata) {
      return []
    };

    const maxPagesToRender = 5;
    const pages = [];

    let startIndex = metadata?.current_page - 2;
    let endIndex = metadata?.current_page + 2;

    // total de páginas menor que o limite
    if (metadata.last_page <= maxPagesToRender) {
      startIndex = 1;
      endIndex = metadata.last_page;
    } else {
      // perto do início
      if (startIndex < 1) {
        startIndex = 1;
        endIndex = maxPagesToRender;
      }
      // perto do final
      if (endIndex > metadata.last_page) {
        startIndex = metadata.last_page - maxPagesToRender + 1
        endIndex = metadata.last_page
      }
    }
    for (let i = startIndex; i <= endIndex; i++) {
      pages.push(i);
    }
    return pages;
    // return Array.from(
    //   { length: endIndex - startIndex + 1 },
    //   (_, index) => startIndex + index
    // );

  }, [metadata]);

  const handleDeleteRow = (rowId: number, friendlyId) => {
    confirm({
      title: "Excluir registro",
      description: `Tem certeza que deseja excluir o registro ${friendlyId}?`,
      onConfirm: async () => {
        try {
          // Chamada real para sua API (substitua o alert)
          const response = await apiFetch(`${url}/${rowId}`, {
            method: "DELETE",
          });
          const data = await response.json();

          if (!response.ok) {
            console.log(data);
            throw new Error(data.error || "Erro ao excluir usuários!");
          }
          mutate();
          toast.success(data.message);

        } catch (error: any) {
          toast.error(data.message);
        }
      },
    });
  };

  const table = useReactTable({
    data: items,
    columns,
    state: {
      columnVisibility,
      rowSelection,
    },
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    // Define que o ID da linha para o React é o seu UUID técnico
    getRowId: (row) => row.id,
    onRowSelectionChange: setRowSelection,
    meta: {
      handleDeleteRow,
      refreshData: mutate,
    },
  });

  function handleUpdateSort(field: string) {
    setPage(1);
    setSortBy(field);
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  }

  function handleUpdatePerPage(limit: string) {
    setPage(1);
    setPerPage(limit);
  }

  function handleChangeSearche(e: React.ChangeEvent<HTMLInputElement>) {
    setPage(1);
    setQ(e.target.value);
  }

  // Função para lidar com o delete em massa
  // const handleDelete = () => {
  //   // Pegamos os dados originais das linhas selecionadas
  //   const selectedRows = table.getSelectedRowModel().rows;
  //   const idsToDelete = selectedRows.map((row: any) => row.original.id);

  //   if (idsToDelete.length === 0) return;

  //   // Adiciona aqui confirmação de excluir registros
  //   alert(
  //     `Atenção!\n\nVocê está prestes a deletar ${idsToDelete.length} registros.\n` +
  //     `IDs que seriam enviados para a API:\n${idsToDelete.join("\n")}`
  //   );

  //   // Após a ação, é boa prática limpar a seleção
  //   setRowSelection({});
  // };

  const handleDeleteSelected = () => {
    const selectedRows = table.getSelectedRowModel().rows;
    const idsToDelete = selectedRows.map((row: any) => row.original.id);
    if (idsToDelete.length === 0) return;

    confirm({
      title: "Confirmar exclusão em massa",
      description: `Você está prestes a deletar ${idsToDelete.length} ${modelName}. IDs: ${idsToDelete.join(", ")}. Essa ação não pode ser desfeita.`,
      confirmText: "Deletar",
      destructive: true,
      onConfirm: async () => {
        try {
          // Chamada real para sua API (substitua o alert)
          const response = await apiFetch(urlDeleteBulk, {
            method: "DELETE",
            body: JSON.stringify({ ids: idsToDelete }),
          });
          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || "Erro ao excluir usuários");
          }
          toast.success(data.message);
          setRowSelection({});
          mutate();

        } catch (error: any) {
          toast.error(data.message);
        }

      },
    });
  };



  const isFirstPage = page <= 1;
  const isLastPage = page >= (metadata.last_page ?? 1);

  return (
    <div className="grid gap-2">
      <ConfirmDialog />
      <div className="flex gap-2 justify-between">
        <div className="flex gap-2">
          <Input placeholder="Pesquisar por nome" className="w-52" defaultValue={q} onChange={debounce(handleChangeSearche, 500)} />
          <Select defaultValue="all">
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="CREDIT">Credit</SelectItem>
              <SelectItem value="DEBIT">Debit</SelectItem>
              <SelectItem value="TRANSFER">Transfer</SelectItem>
              <SelectItem value="PAYMENT">Payment</SelectItem>
            </SelectContent>
          </Select>
          {/* Botão de deletar */}
          {table.getFilteredSelectedRowModel().rows.length > 0 && (
            <Button variant="destructive" onClick={handleDeleteSelected}>
              <Trash2 className="h-4 w-4" />
              Deletar Selecionados ({table.getFilteredSelectedRowModel().rows.length})
            </Button>
          )}

          {/* <AlertDialog>
            <AlertDialogTrigger asChild>
              {table.getFilteredSelectedRowModel().rows.length > 0 && (
                <Button
                  variant="destructive"
                  className="flex gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Deletar Selecionados ({table.getFilteredSelectedRowModel().rows.length})
                </Button>

              )}
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your account
                  from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction>
                  <Button

                    onClick={() => {
                      handleDelete();
                    }}
                  >
                    Continue
                  </Button>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog> */}

        </div>
        <div>
          <Select defaultValue={perPage} onValueChange={handleUpdatePerPage}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione limite por página" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 linhas</SelectItem>
              <SelectItem value="10">10 linhas</SelectItem>
              <SelectItem value="20">20 linhas</SelectItem>
              <SelectItem value="50">50 linhas</SelectItem>
              <SelectItem value="100">100 linhas</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const isSortable = sortColumns.includes(header.id);
                  const isSorted = sortBy === header.id;
                  return (
                    <TableHead key={header.id}>
                      <div className={cn('flex items-center gap-0.5', {
                        'cursor-pointer hover:text-foreground': isSortable,
                        'text-foreground': isSorted
                      })}
                        onClick={isSortable ? () => handleUpdateSort(header.id) : undefined}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        {isSorted && <ArrowUp className={cn('ml-2 h-4 m-4', {
                          "rotate-180": sortDirection === "desc"
                        })} />}
                        {isSortable && !isSorted && <ArrowUpDown className="ml-2 h-4 w-4" />}

                      </div>
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {!isLoading &&
              table.getRowModel().rows?.length > 0 &&
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            {!isLoading && table.getRowModel().rows?.length <= 0 && (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Sem resultados.
                </TableCell>
              </TableRow>
            )}
            {isLoading && (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Carregando dados...
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {!isLoading && (
        <>
          <footer className="flex flex-col">
            <div className="w-full flex justify-between items-center gap-10">

              <p className="flex-1 text-sm font-bold">
                Página {metadata.current_page} de {metadata.last_page} com {metadata.total} resultados
              </p>
              <Pagination className="flex-1 justify-end">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      aria-disabled={isFirstPage}
                      className={isFirstPage ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      text="Primeira"
                      onClick={() => setPage(1)}
                    />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationPrevious
                      aria-disabled={isFirstPage}
                      className={isFirstPage ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      text="Anterior"
                      onClick={() => setPage(Number(page) - 1)}
                    />
                  </PaginationItem>
                  {pagesToRender?.map((_page) => (
                    <PaginationItem key={_page}>
                      <PaginationLink
                        onClick={() => setPage(_page)}
                        className={cn({
                          underline: page === _page,
                        }, "cursor-pointer")}
                      >
                        {_page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      aria-disabled={isLastPage}
                      className={isLastPage ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      text="Próxima"
                      onClick={() => setPage(Number(page) + 1)}
                    />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext
                      aria-disabled={isLastPage}
                      className={isLastPage ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      text="Última"
                      onClick={() => setPage(metadata.last_page)}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
            {table.getFilteredSelectedRowModel().rows.length > 0 && (
              <div className={cn('flex-1 text-sm text-muted-foreground')}>
                {table.getFilteredSelectedRowModel().rows.length} de{" "}
                {table.getFilteredRowModel().rows.length} linha(s) selecionada.
              </div>
            )}
          </footer>
        </>
      )}
    </div>
  )
}