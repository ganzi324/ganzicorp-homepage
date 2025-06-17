import { ReactNode } from 'react'
import Header from './Header'
import Footer from './Footer'

interface MainLayoutProps {
  children: ReactNode
  className?: string
}

export default function MainLayout({ children, className = '' }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className={`flex-1 ${className}`}>
        {children}
      </main>
      <Footer />
    </div>
  )
} 