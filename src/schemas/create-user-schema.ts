import { z } from 'zod';

export const createUserSchema = z.object({
    name: z
        .string()
        .min(1, "O nome de usuário é obrigatório")
        .max(255, "O nome de usuário deve conter no máximo 255 caracteres"),
    email: z
        .email("Informe um e-mail válido")
        .max(255, "O e-mail deve conter no máximo 255 caracteres"),
    password: z
        .string()
        .min(6, "A senha deve ter pelo menos 6 caracters")
});

export type CreateUserSchema = z.infer<typeof createUserSchema>