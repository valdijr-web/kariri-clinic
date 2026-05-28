'use client'

import React, { type FocusEvent } from 'react';
import { Controller, UseFormReturn } from 'react-hook-form'

import { Input } from '@/components/ui/input'
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { StateSelect } from './state-select';
// import { StateSelect } from '@/components/forms/selects/state-select';
import { CreatePatientSchema } from '@/schemas/create-patient-schema';
import { toast } from 'sonner';
import { apiFetch } from '@/services/api';
import { AddressSchema } from '@/schemas/address-Schema';
import { CitySelect } from './city-select';




type AddressFieldsProps = {
    form: UseFormReturn<CreatePatientSchema>
}

export function AddressFields({
    form,
}: AddressFieldsProps) {

    const selectedState = form.watch('address.state')

    const checkCEP = async (e: FocusEvent<HTMLInputElement>) => {
        const cep = e.target.value.replace(/\D/g, '');
        if (!cep) return;

        const result = await apiFetch(`/address/zipcode/${cep}`, {
            method: 'GET',
        });
        const data = await result.json();
        console.log(data);
        if (!result.ok) {
            data.errors?.zip_code?.map((msg: string) => {
                form.setError("address.zip_code", {
                    type: 'manual',
                    message: msg
                });
            });
            return;
        }
        form.setError("address.zip_code", {});

        form.setValue('address.street', data.street);
        form.setValue('address.neighborhood', data.neighborhood);
        form.setValue('address.state', data.state);
        form.setValue('address.city', data.city);
        
        form.setFocus('address.number');
    };

    const errors = form.formState.errors;

    React.useEffect(() => {
        form.setValue('address.city', '')
    }, [selectedState])

    return (
        <div>

            <FieldGroup className="grid grid-cols-1 md:grid-cols-4 gap-4">

                <Field className="md:col-span-1">
                    <FieldLabel className="font-semibold text-gray-700">CEP</FieldLabel>
                    <Input {...form.register('address.zip_code')}
                        placeholder="00000-000"
                        className="focus-visible:ring-blue-500"
                        onBlur={checkCEP}
                    />
                    {errors.address?.zip_code && (
                        <div className='text-red-500 text-xs'>
                            {errors.address.zip_code?.message}
                        </div>
                    )}
                </Field>


                <Field className="md:col-span-2">
                    <FieldLabel className="font-semibold text-gray-700">Rua</FieldLabel>
                    <Input {...form.register('address.street')} placeholder="Rua" className="focus-visible:ring-blue-500" />
                    {errors.address?.street && (
                        <div className='text-red-500 text-xs'>
                            {errors.address.street?.message}
                        </div>
                    )}
                </Field>

                <Field>
                    <FieldLabel className="font-semibold text-gray-700">Número</FieldLabel>
                    <Input {...form.register('address.number')} placeholder="Número" className="focus-visible:ring-blue-500" />
                    {errors.address?.number && (
                        <div className='text-red-500 text-xs'>
                            {errors.address.number?.message}
                        </div>
                    )}
                </Field>
            </FieldGroup>
            <FieldGroup className="grid grid-cols-2 md:grid-cols-2 gap-4">
                <Field>
                    <FieldLabel className="font-semibold text-gray-700">Complemento</FieldLabel>
                    <Input {...form.register('address.complement')} placeholder="Complemento" className="focus-visible:ring-blue-500" />
                    {errors.address?.complement && (
                        <div className='text-red-500 text-xs'>
                            {errors.address.complement?.message}
                        </div>
                    )}
                </Field>

                <Field>
                    <FieldLabel className="font-semibold text-gray-700">Bairro</FieldLabel>
                    <Input {...form.register('address.neighborhood')} placeholder="Bairro" className="focus-visible:ring-blue-500" />
                    {errors.address?.neighborhood && (
                        <div className='text-red-500 text-xs'>
                            {errors.address.neighborhood?.message}
                        </div>
                    )}
                </Field>

            </FieldGroup>
            <FieldGroup className="grid grid-cols-2 md:grid-cols-2 gap-4 py-2">
                <Field>
                    <FieldLabel className="font-semibold text-gray-700">Cidade</FieldLabel>
                    {/* <Input {...form.register('address.city')} placeholder="Cidade" className="focus-visible:ring-blue-500" />
                    {errors.address?.city && (
                        <div className='text-red-500 text-xs'>
                            {errors.address.city?.message}
                        </div>
                    )} */}
                    <Controller
                        name="address.city"
                        control={form.control}
                        render={({ field }) => (
                            <CitySelect
                                state={selectedState}
                                value={field.value ?? undefined}
                                onChange={field.onChange}
                            />
                        )}
                    />
                </Field>

                <Field>
                    <FieldLabel className="font-semibold text-gray-700">Estado</FieldLabel>
                    {/* Componente customizado */}
                    <Controller
                        name="address.state"
                        control={form.control}
                        render={({ field }) => (
                            <StateSelect
                                value={field.value ?? undefined}
                                onChange={field.onChange}
                            />
                        )}
                    />
                </Field>

            </FieldGroup>
        </div>
    )
}