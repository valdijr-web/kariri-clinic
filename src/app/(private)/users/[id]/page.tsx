import { UserDetails } from "@/app/(private)/users/_components/user-details";
import { apiServerFetch } from "@/services/api-server";
import { User } from "@/types/user";

async function getInitialUser(id: string): Promise<User | null> {
    try {
        const response = await apiServerFetch(`users/${id}`, {
            method: 'GET',
        });
        return response.json();
    } catch (error) {
        console.error("Falha ao buscar usuários no servidor:", error);
        return null; // Retornamos null para o Component Client assumir
    }

}

export default async function ViewUserPage({ params }: { params: Promise<{ id: string }> }) {
     const { id } = await params; // ✅ desembrulha a Promise
    const initialUser = await getInitialUser(id);

    return (
        <div className="container mx-auto py-10">
            {/* Passamos o ID e os dados iniciais (que podem ser null) */}
            <UserDetails userId={id} initialUser={initialUser} />
        </div>
    );
}