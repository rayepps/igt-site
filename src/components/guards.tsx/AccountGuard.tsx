import { useRouter } from "next/router"
import { ReactNode, useEffect } from "react"
import { useAuth } from "src/hooks/useAuth"


export default function AccountGuard({
  redirect = '/login',
  children
}: {
  redirect?: string
  children: ReactNode
}) {
  const auth = useAuth()
  const router = useRouter()
  useEffect(() => {
    const token = auth.refresh()
    if (token) return
    router.push(redirect)
  }, [])
  return (<>{children}</>)
}
