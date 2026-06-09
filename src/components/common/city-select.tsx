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

type IBGECity = {
    id: number
    nome: string
}

type CityOption = {
    value: string
    label: string
}

type CitySelectProps = {
    state?: string

    value?: string
    onChange: (value: string) => void

    disabled?: boolean
    placeholder?: string
}

const fetcher = async (
    url: string
): Promise<CityOption[]> => {
    const response = await fetch(url)

    if (!response.ok) {
        throw new Error('Erro ao carregar cidades')
    }

    const data: IBGECity[] = await response.json()

    return data
        .sort((a, b) => a.nome.localeCompare(b.nome))
        .map((city) => ({
            value: city.nome,
            label: city.nome,
        }))
}

export function CitySelect({
    state,
    value,
    onChange,
    disabled,
    placeholder = 'Selecione uma cidade',
}: CitySelectProps) {
    const [open, setOpen] = React.useState(false)

    const shouldFetch = !!state

    const { data: cities, isLoading } = useSWR<CityOption[]>(
        shouldFetch
            ? `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${state}/municipios`
            : null,
        fetcher,
        {
            revalidateOnFocus: false,
        }
    )

    const selectedCity = cities?.find(
        (city) => city.value === value
    )

    return (
        <Popover open={open} onOpenChange={setOpen} modal>
            <PopoverTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    disabled={
                        disabled ||
                        !state ||
                        isLoading
                    }
                    className="w-full justify-between"
                >
                    {isLoading ? (
                        <span className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Carregando cidades...
                        </span>
                    ) : (
                        selectedCity?.label ??
                        (!state
                            ? 'Selecione um estado primeiro'
                            : placeholder)
                    )}

                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                <Command>
                    <CommandInput placeholder="Buscar cidade..." />

                    <CommandList
                        className="max-h-64 overflow-y-auto"
                        onWheel={(e) => e.stopPropagation()}
                    >
                        <CommandEmpty>
                            Nenhuma cidade encontrada.
                        </CommandEmpty>

                        <CommandGroup>
                            {cities?.map((city) => (
                                <CommandItem
                                    key={city.value}
                                    value={city.label}
                                    onSelect={() => {
                                        onChange(city.value)
                                        setOpen(false)
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            'mr-2 h-4 w-4',
                                            value === city.value
                                                ? 'opacity-100'
                                                : 'opacity-0'
                                        )}
                                    />

                                    {city.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}