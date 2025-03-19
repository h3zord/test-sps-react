import { ReactNode } from 'react'
import NavigationButtons from './components/navigation-buttons'

interface UserManagerProps {
  children: ReactNode
}

export default function UserManagerLayout({ children }: UserManagerProps) {
  return (
    <>
      <NavigationButtons />
      {children}
    </>
  )
}
