'use client'

import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { api } from '@/lib/axios'
import { useRouter } from 'next/navigation'
import { ErrorContainer } from '@/app/components/error-container'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { isAxiosError } from 'axios'

const createUserFormSchema = z.object({
  name: z.string().min(3, { message: 'Digite um nome válido!' }),
  email: z.string().email({ message: 'Digite um e-mail válido!' }),
  type: z.enum(['user', 'admin']).default('user'),
  password: z
    .string()
    .min(4, { message: 'A senha deve ter pelo menos 4 caracteres!' }),
})

type CreateUserFormSchema = z.infer<typeof createUserFormSchema>

export default function AddUser() {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    control,
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
      if (isAxiosError(error)) {
        const code = error.response?.data.error

        const emailAlreadyRegistered =
          code.includes('User') && code.includes('already exists')

        if (emailAlreadyRegistered) {
          console.error(error)

          return toast.error('E-mail já cadastrado no banco de dados!')
        }
      }

      toast.error('Erro ao adicionar usuário!')

      console.error(error)
    }
  }

  return (
    <div className="p-6 max-w-[22rem] mx-auto mt-2 bg-gray-950 text-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4 text-center text-gray-100">
        Adicionar Novo Usuário
      </h1>

      <form className="space-y-2" onSubmit={handleSubmit(handleCreateUser)}>
        <div className="space-y-2">
          <Label htmlFor="name">Nome</Label>
          <Input id="name" type="text" {...register('name')} />

          <ErrorContainer>{errors.name && errors.name.message}</ErrorContainer>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register('email')} />

          <ErrorContainer>
            {errors.email && errors.email.message}
          </ErrorContainer>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Senha</Label>
          <Input id="password" type="password" {...register('password')} />

          <ErrorContainer>
            {errors.password && errors.password.message}
          </ErrorContainer>
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Tipo</Label>
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue="user">
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

          <ErrorContainer>{errors.type && errors.type.message}</ErrorContainer>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full cursor-pointer"
          variant="secondary"
        >
          {isSubmitting ? 'Adicionando...' : 'Adicionar Usuário'}
        </Button>
      </form>
    </div>
  )
}
