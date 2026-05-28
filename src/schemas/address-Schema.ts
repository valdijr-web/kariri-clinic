import z from "zod";

export const addressSchema = z.object({
    zip_code: z
        .string()
        .max(255, "O CEP deve conter no máximo 255 caracteres")
        .nullable(),
    street: z
        .string()
        .max(255, "A rua deve conter no máximo 255 caracteres")
        .nullable(),
    number: z
        .string()
        .max(255, "O número do endereço deve conter no máximo 255 caracteres")
        .nullable(),
    complement: z
        .string()
        .max(255, "O complemento deve conter no máximo 255 caracteres")
        .nullable(),
    neighborhood: z
        .string()
        .max(255, "O bairro deve conter no máximo 255 caracteres")
        .nullable(),
    city: z
        .string()
        .max(255, "A cidade deve conter no máximo 255 caracteres")
        .nullable(),
    state: z
        .string()
        .min(2, "O estado deve conter no mínimo 2 caracteres")
        .max(255, "O estado deve conter no máximo 255 caracteres")
        // .nullable(),
});

export type AddressSchema = z.infer<typeof addressSchema>