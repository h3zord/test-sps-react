'use client'

import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { api } from '@/lib/axios'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { z } from 'zod'
import { ErrorContainer } from '@/app/components/error-container'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface User {
  id: string
  name: string
  email: string
  password: string
  type: 'admin' | 'user'
}

export default function EditUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [openDialog, setOpenDialog] = useState(false)

  const editUserFormSchema = z.object({
    name: z.string().min(3, { message: 'Nome é obrigatório' }),
    email: z.string().email({ message: 'Email inválido' }),
    type: z.enum(['user', 'admin']).default('user'),
    password: z
      .string()
      .min(4, { message: 'Senha deve ter pelo menos 4 caracteres' }),
  })

  type EditUserFormSchema = z.infer<typeof editUserFormSchema>

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<EditUserFormSchema>({
    resolver: zodResolver(editUserFormSchema),
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  async function fetchUsers() {
    try {
      const response = await api.get('/users')

      setUsers(response.data.users)
    } catch (error) {
      console.error('Erro ao buscar usuários:', error)
    }
  }

  function handleEditUser(user: User) {
    setSelectedUser(user)

    reset({
      name: user.name,
      email: user.email,
      password: '',
      type: user.type,
    })

    setOpenDialog(true)
  }

  async function handleSaveChanges(data: EditUserFormSchema) {
    if (!selectedUser) return

    console.log(data)

    try {
      await api.put(`/users/edit/${selectedUser.id}`, data)
      setOpenDialog(false)

      toast.success('Usuário editado com sucesso!')

      fetchUsers()
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error)
    }
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
        console.error('Erro ao excluir usuário:', error)
      }
    }
  }

  return (
    <div className="p-6 max-w-5xl mt-10 mx-auto bg-gray-950 text-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Gerenciar Usuários
      </h1>

      <div className="overflow-x-auto">
        <Table className="w-full border border-gray-700">
          <TableHeader className="bg-gray-800">
            <TableRow>
              <TableHead className="text-left text-gray-300 ">Nome</TableHead>
              <TableHead className="text-left text-gray-300">Email</TableHead>
              <TableHead className="text-left text-gray-300">Tipo</TableHead>
              <TableHead className="text-left text-gray-300">Ações</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} className="border-b border-gray-700">
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.type}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      onClick={() => handleEditUser(user)}
                    >
                      Editar
                    </Button>
                    <Button
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

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="bg-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={handleSubmit(handleSaveChanges)}
            className="space-y-2"
          >
            <div>
              <Input
                placeholder="Nome"
                {...register('name')}
                className="bg-gray-700 text-white"
              />

              <ErrorContainer>
                {errors.name && errors.name.message}
              </ErrorContainer>
            </div>

            <div>
              <Input
                placeholder="Email"
                {...register('email')}
                className="bg-gray-700 text-white"
              />

              <ErrorContainer>
                {errors.email && errors.email.message}
              </ErrorContainer>
            </div>

            <div>
              <Input
                type="password"
                placeholder="Senha"
                {...register('password')}
                className="bg-gray-700 text-white"
              />

              <ErrorContainer>
                {errors.password && errors.password.message}
              </ErrorContainer>
            </div>

            <div>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="bg-gray-800 text-white border-gray-700">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>

                    <SelectContent className="bg-gray-800 text-white border-gray-700">
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />

              <ErrorContainer>
                {errors.type && errors.type.message}
              </ErrorContainer>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                className="cursor-pointer"
                type="button"
                onClick={() => setOpenDialog(false)}
              >
                Cancelar
              </Button>

              <Button
                className="cursor-pointer"
                type="submit"
                disabled={isSubmitting}
                variant="secondary"
              >
                {isSubmitting ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
