'use client';

import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <p>Carregando dados do usuário...</p>
      </div>
    );
  }

  return (
          <Card>
            <CardHeader>
              <CardTitle>Perfil do Usuário</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">{user.name}</h2>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
            </CardContent>
          </Card>
  );
}