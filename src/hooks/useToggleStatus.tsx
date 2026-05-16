// hooks/useToggleStatus.ts
'use client';
import useSWRMutation from 'swr/mutation';
import { toast } from 'sonner';
import { apiFetch } from '@/services/api';

async function fetcher(url: string, { arg }: { arg: { currentStatus: boolean } }) {
  const { currentStatus } = arg;
  const res = await apiFetch(`${url}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ is_active: !currentStatus }),
  });
  const data = await res.json();
  if (!res.ok) {
    const errorMessage = data?.error || 'Erro ao alterar status';
    throw new Error(errorMessage);
  }

  return data;
}

export function useToggleStatus(endpointUrl: string) {
  const { trigger, isMutating } = useSWRMutation(endpointUrl, fetcher);

  const toggleStatus = async (currentStatus: boolean) => {
    try {
      const result = await trigger({ currentStatus });
      const message = result?.message || 'Status alterado com sucesso';
      toast.success(message);
      return true;
    } catch (error: any) {
      // Se o erro também tiver uma mensagem vinda do backend
      console.log(error);
      const errorMessage = error?.message || 'Erro ao alterar statsus';
      toast.error(errorMessage);
      return false;
    }
  };

  return { toggleStatus, isLoading: isMutating };
}