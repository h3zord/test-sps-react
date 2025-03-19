'use client'

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { api } from '@/lib/axios'
import { useRouter } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const createUserFormSchema = z.object({
  name: z.string().min(3, { message: 'Nome é obrigatório' }),
  email: z.string().email({ message: 'Email inválido' }),
  type: z.enum(['user', 'admin']).default('user'),
  password: z
    .string()
    .min(4, { message: 'Senha deve ter pelo menos 4 caracteres' }),
})

type CreateUserFormSchema = z.infer<typeof createUserFormSchema>

export default function AddUser() {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateUserFormSchema>({
    resolver: zodResolver(createUserFormSchema),
  })

  async function handleCreateUser(data: CreateUserFormSchema) {
    try {
      await api.post('/users/register', {
        name: data.name,
        email: data.email,
        type: data.type,
        password: data.password,
      })

      toast.success('Usuário adicionado com sucesso!')

      router.push('/dashboard')
    } catch (error) {
      toast.error('Erro ao adicionar usuário!')

      console.error(error)
    }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto mt-10 bg-gray-950 text-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4 text-center text-gray-100">
        Adicionar Novo Usuário
      </h1>

      <form className="space-y-4" onSubmit={handleSubmit(handleCreateUser)}>
        <div className="space-y-2">
          <Label htmlFor="name">Nome</Label>
          <Input
            id="name"
            type="text"
            className="w-full sm:w-[280px]"
            {...register('name')}
          />

          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            className="w-full sm:w-[280px]"
            {...register('email')}
          />

          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Tipo</Label>
          <Select {...register('type')} defaultValue="user">
            <SelectTrigger className="bg-gray-800 text-white border-gray-700">
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>

            <SelectContent className="bg-gray-800 text-white border-gray-700">
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>

          {errors.type && (
            <p className="text-red-500 text-sm">{errors.type.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            type="password"
            className="w-full sm:w-[280px]"
            {...register('password')}
          />

          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full cursor-pointer"
        >
          {isSubmitting ? 'Adicionando...' : 'Adicionar Usuário'}
        </Button>
      </form>
    </div>
  )
}
