'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/axios'
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
  type: string
  createdAt: string
  updatedAt: string
}

export default function Dashboard() {
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await api.get('/users')

        setUsers(response.data.users)
      } catch (error) {
        console.error('Erro ao buscar usuários:', error)
      }
    }

    fetchUsers()
  }, [])

  return (
    <div className="p-6 max-w-5xl mx-auto mt-10 bg-gray-950 text-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4 text-center text-gray-100">
        Users Manager
      </h1>

      <div className="overflow-x-auto overflow-y-auto">
        <Table className="w-full border border-gray-700">
          <TableHeader className="bg-gray-900">
            <TableRow>
              <TableHead className="text-left text-gray-400">ID</TableHead>
              <TableHead className="text-left text-gray-400">Nome</TableHead>
              <TableHead className="text-left text-gray-400">Email</TableHead>
              <TableHead className="text-left text-gray-400">Tipo</TableHead>
              <TableHead className="text-left text-gray-400">
                Criado Em
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {users?.map((user) => (
              <TableRow key={user.id} className="border-b border-gray-700">
                <TableCell className="text-gray-300">{user.id}</TableCell>
                <TableCell className="text-gray-300">{user.name}</TableCell>
                <TableCell className="text-gray-300">{user.email}</TableCell>
                <TableCell className="text-gray-300">{user.type}</TableCell>
                <TableCell className="text-gray-300">
                  {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
