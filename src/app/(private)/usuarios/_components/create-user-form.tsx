'use client'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { CreateUserSchema, createUserSchema } from '@/schemas/create-user-schema';
import { apiFetch } from '@/services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { toast } from "sonner";

export default function CreateUserForm() {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
        setError,
    } = useForm<CreateUserSchema>({
        resolver: zodResolver(createUserSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        }
    });

    // const [error, setError] = useState();

    async function onSubmit(data: CreateUserSchema) {
        try {
            const result = await apiFetch('/users', {
                method: 'POST',
                body: JSON.stringify(data)
            });

            if (!result.ok) {
                const errorData = await result.json();
                throw {
                    errors: errorData.errors,
                    message: errorData.message || "Erro ao criar usuário"
                };
            }
            reset();
            toast.success("Usuário criado com sucesso!");
        } catch (err: any) {

            // Caso o back-end retorne um objeto com erros por campo
            const backendErrors = err.errors; // ex: { name: "Nome inválido", email: "Email duplicado" }
            if (backendErrors && typeof backendErrors === 'object') {
                Object.entries(backendErrors).forEach(([field, message]) => {
                    setError(field as keyof CreateUserSchema, {
                        type: 'backend',
                        message: message as string
                    });
                });
            } else {
                // Erro geral (não associado a um campo)
                setError('root', {
                    message: err.message || 'Erro inesperado'
                });
            }
        }

    }

    return (
        // Wrapper de Card do Shadcn para envelopar o formulário com Tailwind CSS
        <Card className="w-full">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold tracking-tight text-center">
                    Criar nova conta de usuário
                </CardTitle>
                <CardDescription className="text-center">
                    Insira os dados abaixo
                </CardDescription>
            </CardHeader>

            <CardContent>
                {errors?.root && (
                    <div className='text-red-500 text-xs'>
                        {errors?.root.message}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* CAMPO: NOME */}
                    <FieldGroup>
                        <Field>
                            <FieldLabel className="font-semibold text-gray-700">Nome Completo</FieldLabel>
                            <Input aria-invalid={errors?.name && true} {...register('name')} placeholder="Seu nome aqui" className="focus-visible:ring-blue-500" />
                            {errors?.name && (
                                <div className='text-red-500 text-xs'>
                                    {errors?.name.message}
                                </div>
                            )}

                        </Field>

                        {/* CAMPO: E-MAIL */}
                        <Field>
                            <FieldLabel className="font-semibold text-gray-700">E-mail</FieldLabel>
                            <Input {...register('email')} type="email" placeholder="exemplo@email.com" className="focus-visible:ring-blue-500" />
                            {errors?.email && (
                                <div className='text-red-500 text-xs'>
                                    {errors?.email.message}
                                </div>
                            )}
                        </Field>

                        {/* CAMPO: SENHA */}
                        <Field>
                            <FieldLabel className="font-semibold text-gray-700">Senha</FieldLabel>
                            <Input {...register('password')} type="password" placeholder="••••••••" className="focus-visible:ring-blue-500" />
                            {errors?.password && (
                                <div className='text-red-500 text-xs'>
                                    {errors?.password.message}
                                </div>
                            )}
                        </Field>
                    </FieldGroup>

                    <div className="flex w-full justify-end">
                        <Button type="submit" className="mt-4 w-full lg:w-auto" >
                            Criar Usuário
                        </Button>
                    </div>




                </form>

            </CardContent>
        </Card>
    );
};