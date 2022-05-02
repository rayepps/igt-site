
import { useRouter } from "next/router"
import { ReactNode, useEffect } from "react"
import { useAuth } from "src/hooks/useAuth"

export default function AdminAccountGuard({
  redirect = '/hq/login',
  children
}: {
  redirect?: string
  children: ReactNode
}) {
  const auth = useAuth()
  const router = useRouter()
  useEffect(() => {
    console.log('auth: ', auth)
    const token = auth.refresh()
    if (token) return
    router.push(redirect)
  }, [])
  return (<>{children}</>)
}