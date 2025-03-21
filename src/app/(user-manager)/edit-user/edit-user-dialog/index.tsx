'use client'

import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { api } from '@/lib/axios'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { z } from 'zod'
import { ErrorContainer } from '@/app/components/error-container'
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
  type: 'admin' | 'user'
  createdAt: string
  updatedAt: string
}

interface EditUserDialogProps {
  open: boolean
  setOpen: (open: boolean) => void
  user: User | null
  fetchUsers: () => void
}

const editUserFormSchema = z.object({
  name: z.string().min(3, { message: 'Digite um nome válido!' }),
  email: z.string().email({ message: 'Digite um e-mail válido!' }),
  type: z.enum(['user', 'admin']).default('user'),
  password: z
    .string()
    .min(4, { message: 'A senha deve ter pelo menos 4 caracteres!' }),
})

type EditUserFormSchema = z.infer<typeof editUserFormSchema>

export default function EditUserDialog({
  open,
  setOpen,
  user,
  fetchUsers,
}: EditUserDialogProps) {
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
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        password: '',
        type: user.type,
      })
    }
  }, [user, reset])

  async function handleSaveChanges(data: EditUserFormSchema) {
    if (!user) return

    try {
      await api.put(`/users/edit/${user.id}`, data)
      setOpen(false)

      toast.success('Usuário editado com sucesso!')

      fetchUsers()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-gray-800 text-white">
        <DialogHeader>
          <DialogTitle>Editar Usuário</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleSaveChanges)} className="space-y-2">
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
            <Button type="button" onClick={() => setOpen(false)}>
              Cancelar
            </Button>

            <Button type="submit" disabled={isSubmitting} variant="secondary">
              {isSubmitting ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
