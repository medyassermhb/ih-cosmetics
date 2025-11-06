import { createServer } from '@/lib/supabase-server'

export const metadata = {
  title: 'Gérer les Clients | IH Cosmetics',
}

// Helper to format the date
function formatDate(dateString: string | null) {
  if (!dateString) return 'Jamais'
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

// We have to define the type here since it's from a view
type AdminUser = {
  id: string
  email: string
  role: string
  full_name: string | null
  phone: string | null
  created_at: string
  last_sign_in_at: string | null
}

export default async function AdminClientsPage() {
  const supabase = createServer()

  // RLS (from Step 1) ensures only admins can run this
  const { data: clients, error } = await supabase
    .from('admin_users_view')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return <p className="text-red-500">Erreur: {error.message}</p>
  }

  const typedClients = clients as AdminUser[]

  return (
    <div>
      <h2 className="mb-6 text-2xl font-semibold">Tous les clients</h2>
      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Nom</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Téléphone</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Rôle</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Inscrit le</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Dernière visite</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white">
            {typedClients.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                  Aucun client trouvé.
                </td>
              </tr>
            )}
            {typedClients.map((client) => (
              <tr key={client.id} className="bg-white">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{client.full_name || '-'}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{client.email}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{client.phone || '-'}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    client.role === 'admin' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {client.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{formatDate(client.created_at)}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{formatDate(client.last_sign_in_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}