import { z } from 'zod';
import { addressSchema } from './address-Schema';

export const createPatientSchema = z.object({
    name: z
        .string()
        .min(3, "O nome de usuário é obrigatório")
        .max(255, "O nome de usuário deve conter no máximo 255 caracteres"),
    birth_date: z
        .string()
        .max(10, "A data de nascimento deve conter no máximo 10 caracteres")
        .nullable(),
    gender: z
        .string()
        .min(1, "O gênero é obrigatório")
        .max(255, "O gênero deve conter no máximo 255 caracteres"),
    cpf: z
        .string()
        .min(11, "O CPF é obrigatório")
        .max(14, "O CPF deve conter no máximo 14 caracteres"),
    rg: z
        .string()
        .max(255, "O RG deve conter no máximo 255 caracteres")
        .nullable(),
    email: z
        .string()
        .max(255, "O e-mail deve conter no máximo 255 caracteres")
        .nullable(),
    phone_number: z
        .string()
        .max(255, "O número de telefone deve conter no máximo 255 caracteres")
        .nullable(),
    emergency_contact: z
        .string()
        .max(255, "O contato de emergência deve conter no máximo 255 caracteres")
        .nullable(),
    address: addressSchema,
   
});

export type CreatePatientSchema = z.infer<typeof createPatientSchema>