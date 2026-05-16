'use client'

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SignUpFormSchema, signUpFormSchema } from '@/schemas/signup-schema';
import { apiFetch, refreshToken } from '@/services/api';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field';
import { cn } from '@/lib/utils';

export default function SignupForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<SignUpFormSchema>({
        resolver: zodResolver(signUpFormSchema)
    });

    const router = useRouter();
    const [error, setError] = useState();

    async function handleSignUp(data: SignUpFormSchema) {
        try {
            const result = await apiFetch('/signup', {
                method: 'POST',
                body: JSON.stringify(data),
            }, false); // false para não tentar refresh automático

            if (!result.ok) {
                const errorData = await result.json()
                setError(errorData.error);
                return;
            }
            await refreshToken();
            router.push('/');
        } catch (error) {
            alert('Erro ao criar conta');
            console.error(error);
        }
    }
    return (
        <form
            onSubmit={handleSubmit(handleSignUp)}
            className={cn("flex flex-col gap-6", className)} {...props}
        >

            <FieldGroup>
                <div className="flex flex-col items-center gap-1 text-center">
                    <h1 className="text-2xl font-bold">Crie sua conta</h1>
                    <p className="text-sm text-balance text-muted-foreground">
                        Insira suas informações abaixo para criar sua conta.
                    </p>
                </div>
                <div className='text-red-500 text-xs'>
                    {error}
                </div>
                <Field>
                    <FieldLabel htmlFor="name">Seu Nome Completo</FieldLabel>
                    <Input placeholder="Nome e Sobrenome" {...register('name')} />
                    {errors?.name && (
                        <div className='text-red-500 text-xs'>
                            {errors?.name.message}
                        </div>
                    )}
                </Field>

                <Field>
                    <FieldLabel htmlFor="name">Nome da Clínica/Consultório</FieldLabel>
                    <Input placeholder="Nome da Clínica" {...register('trade_name')} />
                    {errors?.trade_name && (
                        <div className='text-red-500 text-xs'>
                            {errors?.trade_name.message}
                        </div>
                    )}
                </Field>

                <Field>
                    <FieldLabel htmlFor="name">WhatsApp</FieldLabel>
                    <Input placeholder="(00) 0.0000-0000" {...register('whatsapp_number')} />
                    {errors?.whatsapp_number && (
                        <div className='text-red-500 text-xs'>
                            {errors?.whatsapp_number.message}
                        </div>
                    )}
                </Field>



                <Field>
                    <FieldLabel htmlFor="name">E-mail de conta</FieldLabel>
                    <Input placeholder="Insera seu E-mail" {...register('email')} />
                    {errors?.email && (
                        <div className='text-red-500 text-xs'>
                            {errors?.email.message}
                        </div>
                    )}
                </Field>

                <Field>
                    <Field>
                        <FieldLabel htmlFor="name">Digite sua Senha</FieldLabel>
                        <Input type='password' placeholder='******' {...register('password')} />
                        {errors?.password && (
                            <div className='text-red-500 text-xs'>
                                {errors?.password.message}
                            </div>
                        )}
                    </Field>
                    <FieldDescription>
                        Deve ter no mínimo 6 caracteres.
                    </FieldDescription>
                </Field>

                <Field>
                    <Button className='cursor-pointer' type="submit">Criar Conta</Button>
                    <FieldDescription className="text-center">
                        Já possui uma conta? <a href="/login">Entrar</a>
                    </FieldDescription>
                </Field>

            </FieldGroup>
            <FieldDescription className="px-6 text-center">
                Ao clicar em continuar, você concorda com nossos termos. <a href="#">Termos de Serviço</a>{" "}
                e <a href="#">Política de Privacidade</a>.
            </FieldDescription>
        </form>




    );
}
