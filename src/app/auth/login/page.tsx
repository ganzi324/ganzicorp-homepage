import { Metadata } from "next"
import MainLayout from "@/components/layout/MainLayout"
import LoginForm from "@/components/auth/LoginForm"

export const metadata: Metadata = {
  title: "로그인 | GanziCorp",
  description: "관리자 로그인 페이지",
}

export default function LoginPage() {
  return (
    <MainLayout>
      <section className="py-20 px-4 min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </section>
    </MainLayout>
  )
} 