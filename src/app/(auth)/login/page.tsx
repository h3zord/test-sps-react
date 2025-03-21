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
import { ErrorContainer } from '@/app/components/error-container'

const loginFormSchema = z.object({
  email: z.string().email({ message: 'Digite um e-mail válido!' }),
  password: z.string().min(4, { message: 'Digite uma senha válida!' }),
})

type LoginForm = z.infer<typeof loginFormSchema>

export default function Login() {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginFormSchema),
  })

  async function handleSignIn(data: LoginForm) {
    try {
      await api.post('/users/authenticate', {
        email: data.email,
        password: data.password,
      })

      router.push('/dashboard')
    } catch (error) {
      console.error(error)

      toast.error('Credenciais inválidas!')
    }
  }

  return (
    <>
      <div className="p-8 max-w-[25rem] mt-20 mx-auto">
        <div className="flex  flex-col justify-center gap-6">
          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-2xl font-semibold">Acessar painel</h1>
            <p className="text-sm text-muted-foreground">
              Bem-vindo ao Users Manager! Entre com sua conta e gerencie seus
              usuários facilmente.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit(handleSignIn)}>
            <div className="space-y-2">
              <Label htmlFor="email">Seu e-mail</Label>
              <Input id="email" type="email" {...register('email')} />

              <ErrorContainer>
                {errors.email && errors.email.message}
              </ErrorContainer>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Sua senha</Label>
              <Input id="password" type="password" {...register('password')} />

              <ErrorContainer>
                {errors.password && errors.password.message}
              </ErrorContainer>
            </div>

            <Button
              disabled={isSubmitting}
              className="w-full cursor-pointer"
              type="submit"
            >
              Acessar painel
            </Button>
          </form>
        </div>
      </div>
    </>
  )
}
