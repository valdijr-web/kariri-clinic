'use client'
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import useSWR from 'swr';
import { useParams, useRouter } from 'next/navigation';

import { apiFetch } from '@/services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { toast } from "sonner";
import { User } from '@/types/user';
import { RefreshCcw, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

// Schema para edição (password é opcional)
const editUserSchema = z.object({
    name: z
        .string()
        .min(1, "O nome de usuário é obrigatório")
        .max(255, "O nome de usuário deve conter no máximo 255 caracteres"),
    email: z
        .email("Informe um e-mail válido")
        .max(255, "O e-mail deve conter no máximo 255 caracteres"),
    password: z.string()
        .min(8, "O campo senha deve conter no mínimo 8 caracteres")
        .optional()
        .or(z.literal(''))
});

export type EditUserSchema = z.infer<typeof editUserSchema>;

// Fetcher do SWR
const fetcher = (url: string) => apiFetch(url).then(res => res.json());

export default function EditUserForm() {
    const params = useParams();
    const router = useRouter();
    const userId = params.id as string;

    // SWR para buscar dados do usuário
    const { data: user, error, isLoading } = useSWR<User>(
        userId ? `/users/${userId}` : null,
        fetcher
    );

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError,
        reset,
    } = useForm<EditUserSchema>({
        resolver: zodResolver(editUserSchema),
        defaultValues: {
            name: user?.name || "",
            email: user?.email || "",
            password: "",
        }
    });

    // Atualizar valores do formulário quando os dados do usuário chegarem
    useEffect(() => {
        if (user) {
            reset({
                name: user.name,
                email: user.email,
                password: "",
            });
        }
    }, [user, reset]);

    async function onSubmit(data: EditUserSchema) {
        try {
            // Monta o payload, excluindo password se estiver vazio
            const payload: any = {
                name: data.name,
                email: data.email,
            };

            if (data.password) {
                payload.password = data.password;
            }

            const result = await apiFetch(`/users/${userId}`, {
                method: 'PUT',
                body: JSON.stringify(payload)
            });

            if (!result.ok) {
                const errorData = await result.json();
                throw {
                    errors: errorData.errors,
                    message: errorData.message || "Erro ao atualizar usuário"
                };
            }

            toast.success("Usuário atualizado com sucesso!");
            router.push(`/usuarios/${userId}`);
        } catch (err: any) {
            // Caso o back-end retorne um objeto com erros por campo
            const backendErrors = err.errors;
            if (backendErrors && typeof backendErrors === 'object') {
                Object.entries(backendErrors).forEach(([field, message]) => {
                    setError(field as keyof EditUserSchema, {
                        type: 'backend',
                        message: message as string
                    });
                });
            } else {
                // Erro geral
                setError('root', {
                    message: err.message || 'Erro inesperado'
                });
            }
        }
    }

    // Estado de carregamento inicial
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <RefreshCcw className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground font-medium">Carregando dados do usuário...</p>
            </div>
        );
    }

    // Erro ao buscar dados
    if (error || !user) {
        return (
            <Card className="w-full">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold tracking-tight text-center">
                        Erro ao Carregar
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                    <p className="text-red-500 font-semibold">Não foi possível carregar os dados do usuário.</p>
                    <Button asChild>
                        <Link href="/usuarios">
                            <ChevronLeft className="mr-2 h-4 w-4" />
                            Voltar para Usuários
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" asChild>
                    <Link href={`/usuarios/${userId}`}>
                        <ChevronLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <h1 className="text-3xl font-bold tracking-tight">Editar Usuário</h1>
            </div>

            <Card className="w-full">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold tracking-tight text-center">
                        Editar dados do usuário
                    </CardTitle>
                    <CardDescription className="text-center">
                        Atualize as informações abaixo (a senha é opcional)
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    {errors?.root && (
                        <div className='text-red-500 text-xs mb-4 p-3 bg-red-50 rounded'>
                            {errors?.root.message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* CAMPO: NOME */}
                        <FieldGroup>
                            <Field>
                                <FieldLabel className="font-semibold text-gray-700">Nome Completo</FieldLabel>
                                <Input
                                    aria-invalid={errors?.name ? true : false}
                                    {...register('name')}
                                    placeholder="Seu nome aqui"
                                    className="focus-visible:ring-blue-500"
                                />
                                {errors?.name && (
                                    <div className='text-red-500 text-xs'>
                                        {errors?.name.message}
                                    </div>
                                )}
                            </Field>

                            {/* CAMPO: E-MAIL */}
                            <Field>
                                <FieldLabel className="font-semibold text-gray-700">E-mail</FieldLabel>
                                <Input
                                    {...register('email')}
                                    type="email"
                                    placeholder="exemplo@email.com"
                                    className="focus-visible:ring-blue-500"
                                    aria-invalid={errors?.email ? true : false}
                                />
                                {errors?.email && (
                                    <div className='text-red-500 text-xs'>
                                        {errors?.email.message}
                                    </div>
                                )}
                            </Field>

                            {/* CAMPO: SENHA (OPCIONAL) */}
                            <Field>
                                <FieldLabel className="font-semibold text-gray-700">
                                    Nova Senha <span className="text-xs text-gray-500">(opcional)</span>
                                </FieldLabel>
                                <Input
                                    {...register('password')}
                                    type="password"
                                    placeholder="Deixe em branco para manter a senha atual"
                                    className="focus-visible:ring-blue-500"
                                    aria-invalid={errors?.password ? true : false}
                                />
                                {errors?.password && (
                                    <div className='text-red-500 text-xs'>
                                        {errors?.password.message}
                                    </div>
                                )}
                            </Field>
                        </FieldGroup>

                        <div className="flex w-full gap-3 justify-end pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.push(`/usuarios/${userId}`)}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="gap-2"
                            >
                                {isSubmitting && <RefreshCcw className="h-4 w-4 animate-spin" />}
                                {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
