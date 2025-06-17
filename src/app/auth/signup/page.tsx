import { Metadata } from "next"
import MainLayout from "@/components/layout/MainLayout"
import SignUpForm from "@/components/auth/SignUpForm"

export const metadata: Metadata = {
  title: "회원가입 | GanziCorp",
  description: "GanziCorp 계정을 만드세요.",
}

export default function SignUpPage() {
  return (
    <MainLayout>
      <section className="py-20 px-4 min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md">
          <SignUpForm redirectTo="/auth/login" />
        </div>
      </section>
    </MainLayout>
  )
} 