import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import Dashboard from "@/components/dashboard"

export default function Home() {
  const cookieStore = cookies()
  const token = cookieStore.get("auth_token")

  if (!token) {
    redirect("/login")
  }

  return <Dashboard />
}
