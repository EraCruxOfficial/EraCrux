import { ForgotPasswordForm } from "@/components/forms/forgot-password-form"

export default function LoginPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <img src="/icon.png" alt="" className="rounded-md"/>
          </div>
          <span className="bg-gradient-to-r from-gray-100 via-gray-300 to-gray-200 bg-clip-text text-xl font-bold text-transparent" style={{fontFamily:"Poppins, sans serif"}}>EraCrux</span>
        </a>
        <ForgotPasswordForm />
      </div>
    </div>
  )
}
