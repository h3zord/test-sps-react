'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function NavigationButtons() {
  const router = useRouter()

  function handleDashboard() {
    router.push('/dashboard')
  }

  function handleCreateUser() {
    router.push('/create-user')
  }

  function handleEditUser() {
    router.push('/edit-user')
  }

  return (
    <div className="flex justify-end p-4 gap-2">
      <Button
        onClick={handleDashboard}
        className="cursor-pointer"
        variant="default"
      >
        Dashboard
      </Button>

      <Button
        onClick={handleCreateUser}
        className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
      >
        Criar Usuário
      </Button>

      <Button
        onClick={handleEditUser}
        className="bg-green-600 hover:bg-green-700 cursor-pointer"
      >
        Editar Usuário
      </Button>
    </div>
  )
}
