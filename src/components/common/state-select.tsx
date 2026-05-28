'use client'

import * as React from 'react'
import useSWR from 'swr'
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react'

import { cn } from '@/lib/utils'

import { Button } from '@/components/ui/button'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'

type IBGEState = {
    id: number
    sigla: string
    nome: string
}

type StateOption = {
    value: string
    label: string
}

type StateSelectProps = {
    value?: string
    onChange: (value: string) => void
    disabled?: boolean
    placeholder?: string
}

const fetcher = async (url: string): Promise<StateOption[]> => {
    const response = await fetch(url)

    if (!response.ok) {
        throw new Error('Erro ao carregar estados')
    }

    const data: IBGEState[] = await response.json()

    return data
        .sort((a, b) => a.nome.localeCompare(b.nome))
        .map((state) => ({
            value: state.sigla,
            label: `${state.nome} (${state.sigla})`,
        }))
}

export function StateSelect({
    value,
    onChange,
    disabled,
    placeholder = 'Selecione um estado',
}: StateSelectProps) {
    const [open, setOpen] = React.useState(false)

    const { data: states, isLoading } = useSWR<StateOption[]>(
        'https://servicodados.ibge.gov.br/api/v1/localidades/estados',
        fetcher,
        {
            revalidateOnFocus: false,
        }
    )

    const selectedState = states?.find((state) => state.value === value)

    return (
        <Popover open={open} onOpenChange={setOpen} modal>
            <PopoverTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    disabled={disabled || isLoading}
                    className="w-full justify-between"
                >
                    {isLoading ? (
                        <span className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Carregando estados...
                        </span>
                    ) : (
                        selectedState?.label ?? placeholder
                    )}

                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                <Command>
                    <CommandInput placeholder="Buscar estado..." />

                    <CommandList>
                        <CommandEmpty>
                            Nenhum estado encontrado.
                        </CommandEmpty>

                        <CommandGroup>
                            {states?.map((state) => (
                                <CommandItem
                                    key={state.value}
                                    value={`${state.label} ${state.value}`}
                                    onSelect={() => {
                                        onChange(state.value)
                                        setOpen(false)
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            'mr-2 h-4 w-4',
                                            value === state.value
                                                ? 'opacity-100'
                                                : 'opacity-0'
                                        )}
                                    />

                                    {state.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}