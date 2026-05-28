import { z } from 'zod';

export const signUpFormSchema = z.object({
    name: z.string().min(1, "O nome de usuário é obrigatório").max(255, "O nome de usuário deve conter no máximo 255 caracteres"),
    trade_name: z.string().min(1, "O nome da empresa é obrigatório").max(255, "O nome da empresa deve conter no máximo 255 caracteres"),
    whatsapp_number: z.string().min(1, "O número de WhatsApp é obrigatório").max(20, "O número de WhatsApp deve conter no máximo 20 caracteres"),
    email: z.email("O e-mail é inválido").max(255, "O e-mail deve conter no máximo 255 caracteres"),
    password: z.string().min(6, "A senha deve conter pelo menos 6 caracteres").max(255, "A senha deve conter no máximo 255 caracteres"),
})

export type SignUpFormSchema = z.infer<typeof signUpFormSchema>;