'use client';
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { createPatientSchema, CreatePatientSchema } from "@/schemas/create-patient-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { CirclePlusIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { apiFetch } from "@/services/api";
import { AddressFields } from "@/components/common/AddressFields";

export default function CreatePatient() {

  const form = useForm<CreatePatientSchema>({
    resolver: zodResolver(createPatientSchema),
    defaultValues: {
      name: "",
      birth_date: "",
      gender: "",
      cpf: "",
      rg: "",
      email: "",
      phone_number: "",
      emergency_contact: "",
      address: {
        zip_code: "",
        street: "",
        number: "",
        complement: "",
        neighborhood: "",
        city: "",
        state: "",
      }

    }
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setError,
  } = form;

  async function onSubmit(data: CreatePatientSchema) {
    try {
      const result = await apiFetch('/patients', {
        method: 'POST',
        body: JSON.stringify(data)
      });

      if (!result.ok) {
        const errorData = await result.json();
        throw {
          errors: errorData.errors,
          message: errorData.message || "Erro ao adicionar paciente"
        };
      }
      reset();
      toast.success("Paciente adicionado com sucesso!");
    } catch (err) {
      const error = err as { errors?: Record<string, string>; message?: string };

      // Caso o back-end retorne um objeto com erros por campo
      const backendErrors = error.errors; // ex: { name: "Nome inválido", email: "Email duplicado" }
      if (backendErrors && typeof backendErrors === 'object') {
        Object.entries(backendErrors).forEach(([field, message]) => {
          setError(field as keyof CreatePatientSchema, {
            type: 'backend',
            message: message as string
          });
        });
      } else {
        // Erro geral (não associado a um campo)
        setError('root', {
          message: error.message || 'Erro inesperado'
        });
      }
    }

  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button  className="self-start hover:bg-primary/90">
          <CirclePlusIcon />
          <span>Adicionar Paciente</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full mx-auto sm:max-w-2/3 p-6 shadow-md no-scrollbar max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Cadastro de Novo Paciente</DialogTitle>
            <DialogDescription>
              Observe os campos obrigatórios.
              {errors?.root && (
                <div className='text-red-500 text-xs'>
                  {errors?.root.message}
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Dados Pessoais - 2 colunas */}

            <Field>
              <FieldLabel className="font-semibold text-gray-700">Nome Completo</FieldLabel>
              <Input {...register('name')} placeholder="informe o nome do paciente" className="focus-visible:ring-blue-500" />
              {errors?.name && (
                <div className='text-red-500 text-xs'>
                  {errors?.name.message}
                </div>
              )}
            </Field>

            <Field>
              <FieldLabel className="font-semibold text-gray-700">CPF</FieldLabel>
              <Input {...register('cpf')} placeholder="informe o CPF do paciente" className="focus-visible:ring-blue-500" />
              {errors?.cpf && (
                <div className='text-red-500 text-xs'>
                  {errors?.cpf.message}
                </div>
              )}
            </Field>

          </FieldGroup>
          <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field>
              <FieldLabel className="font-semibold text-gray-700">Data de Nascimento</FieldLabel>
              <Input {...register('birth_date')} type="date" className="focus-visible:ring-blue-500" />
              {errors?.birth_date && (
                <div className='text-red-500 text-xs'>
                  {errors?.birth_date.message}
                </div>
              )}
            </Field>

            <Field>
              <FieldLabel className="font-semibold text-gray-700">Gênero</FieldLabel>
              <Input aria-invalid={errors?.gender && true} {...register('gender')} placeholder="informe o gênero do paciente" className="focus-visible:ring-blue-500" />
              {errors?.gender && (
                <div className='text-red-500 text-xs'>
                  {errors?.gender.message}
                </div>
              )}
            </Field>
          </FieldGroup>
          <FieldGroup className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* Contato - 2 colunas */}

            <Field>
              <FieldLabel className="font-semibold text-gray-700">E-mail</FieldLabel>
              <Input {...register('email')} type="email" placeholder="informe o e-mail do paciente" />
              {errors?.email && (
                <div className='text-red-500 text-xs'>
                  {errors?.email.message}
                </div>
              )}
            </Field>

            <Field>
              <FieldLabel className="font-semibold text-gray-700">Telefone</FieldLabel>
              <Input {...register('phone_number')} placeholder="informe o telefone do paciente" className="focus-visible:ring-blue-500" />
              {errors?.phone_number && (
                <div className='text-red-500 text-xs'>
                  {errors?.phone_number.message}
                </div>
              )}
            </Field>

            <Field>
              <FieldLabel className="font-semibold text-gray-700">Contato de Emergência</FieldLabel>
              <Input {...register('emergency_contact')} placeholder="informe o contato de emergência do paciente" className="focus-visible:ring-blue-500" />
              {errors?.emergency_contact && (
                <div className='text-red-500 text-xs'>
                  {errors?.emergency_contact.message}
                </div>
              )}
            </Field>
          </FieldGroup>
          <AddressFields form={form} />
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button type="submit">Salvar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}