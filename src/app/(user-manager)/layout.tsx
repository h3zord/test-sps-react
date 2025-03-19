import { ReactNode } from 'react'
import { Header } from './components/header'

interface UserManagerProps {
  children: ReactNode
}

export default function UserManagerLayout({ children }: UserManagerProps) {
  return (
    <>
      <Header />
      {children}
    </>
  )
}
