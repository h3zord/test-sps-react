import { ReactNode } from 'react'

interface ErrorContainerProps {
  children: ReactNode
}

export function ErrorContainer({ children }: ErrorContainerProps) {
  return (
    <div className="flex m-1 h-6 items-center text-xs text-red-600">
      {children}
    </div>
  )
}
