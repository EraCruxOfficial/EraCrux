'use client'
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "./ui/button"
import { createAuthClient } from "better-auth/client"
import { toast } from "sonner"
import { Loader2, LogOutIcon } from "lucide-react"
const authClient = createAuthClient()


export function Logout() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  async function handleLogout() {
    setIsLoading(true)
    try {
      const result = await authClient.signOut()
      if ('error' in result && result.error) {
        toast.error(result.error.message || "An unknown error occurred.")
      } else {
        toast.success("Logged out successfully!")
        router.push("/login")
      }
    } catch (error) {
      const e = error as Error
      toast.error(e.message || "An unknown error occurred.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <Button onClick={handleLogout} disabled={isLoading}>
        {isLoading ? <Loader2 className="animate-spin mr-2" size={16} /> : "Logout"}
        <LogOutIcon className="ml-2" size={16} />
      </Button>
    </div>
  )
}