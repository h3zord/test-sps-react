'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/axios'
import { Button } from '@/components/ui/button'
import EditUserDialog from './edit-user-dialog'
import { toast } from 'sonner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface User {
  id: string
  name: string
  email: string
  type: 'admin' | 'user'
  createdAt: string
  updatedAt: string
}

export default function EditUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [openDialog, setOpenDialog] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  async function fetchUsers() {
    try {
      const response = await api.get('/users')
      setUsers(response.data.users)
    } catch (error) {
      console.error(error)
    }
  }

  function handleEditUser(user: User) {
    setSelectedUser(user)
    setOpenDialog(true)
  }

  async function handleDeleteUser(userId: string) {
    const confirmDelete = window.confirm(
      'Tem certeza que deseja excluir este usuário?',
    )

    if (confirmDelete) {
      try {
        await api.delete(`/users/delete/${userId}`)

        toast.success('Usuário deletado com sucesso!')

        fetchUsers()
      } catch (error) {
        console.error(error)
      }
    }
  }

  return (
    <div className="p-6 max-w-5xl mt-10 mx-auto bg-gray-950 text-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4 text-center text-gray-100">
        Gerenciar Usuários
      </h1>

      <div className="overflow-x-auto">
        <Table className="w-full border border-gray-50">
          <TableHeader className="bg-gray-800">
            <TableRow>
              <TableHead className="text-left text-gray-300">Nome</TableHead>
              <TableHead className="text-left text-gray-300">E-mail</TableHead>
              <TableHead className="text-left text-gray-300">Tipo</TableHead>
              <TableHead className="text-left text-gray-300">
                Criado em
              </TableHead>
              <TableHead className="text-left text-gray-300">Ações</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {users?.map((user) => (
              <TableRow key={user.id} className="border-b border-gray-700">
                <TableCell className="text-gray-100">{user.name}</TableCell>
                <TableCell className="text-gray-100">{user.email}</TableCell>
                <TableCell className="text-gray-100">{user.type}</TableCell>
                <TableCell className="text-gray-100">
                  {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                </TableCell>

                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      className="cursor-pointer"
                      variant="secondary"
                      onClick={() => handleEditUser(user)}
                    >
                      Editar
                    </Button>

                    <Button
                      className="cursor-pointer"
                      variant="destructive"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      Excluir
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <EditUserDialog
        open={openDialog}
        setOpen={setOpenDialog}
        user={selectedUser}
        fetchUsers={fetchUsers}
      />
    </div>
  )
}
