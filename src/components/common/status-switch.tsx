// components/StatusSwitch.tsx
import { Switch } from "@/components/ui/switch";
import { useToggleStatus } from "@/hooks/useToggleStatus";

interface StatusSwitchProps {
  active: boolean;
  endpointUrl: string;    // ex: "/users"
  onSuccess?: () => void;   // chamado após sucesso
}

export function StatusSwitch({ active, endpointUrl, onSuccess }: StatusSwitchProps) {
  const { toggleStatus, isLoading } = useToggleStatus(endpointUrl);

  const handleToggle = async () => {
    const success = await toggleStatus(active);
    if (success) onSuccess?.();
  };

  return <Switch checked={active} onCheckedChange={handleToggle} disabled={isLoading} />;
}