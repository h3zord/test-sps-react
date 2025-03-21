'use client'

import { Button } from '@/components/ui/button'
import { api } from '@/lib/axios'
import { usePathname, useRouter } from 'next/navigation'
import { FaUsers } from 'react-icons/fa'

export const Header = () => {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    try {
      await api.get('/users/logout')

      router.push('/login')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <header className="bg-gray-950 text-white p-8 flex justify-between">
      <div className="flex items-center gap-3">
        <FaUsers className="text-gray-300 text-2xl hover:text-gray-500 transition-colors" />
        <h1 className="text-2xl font-semibold text-white">Users Manager</h1>
      </div>

      {pathname !== '/login' && (
        <Button
          variant="secondary"
          className="cursor-pointer"
          onClick={handleLogout}
        >
          Logout
        </Button>
      )}
    </header>
  )
}
