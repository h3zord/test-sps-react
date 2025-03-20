import { ReactNode } from 'react'

interface ErrorContainerProps {
  children: ReactNode
}

export function ErrorContainer({ children }: ErrorContainerProps) {
  return (
    <div className="m-1 flex h-6 items-center justify-items-start text-xs text-red-600">
      {children}
    </div>
  )
}
