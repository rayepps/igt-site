import Link from 'next/link'
import { useRouter } from 'next/router'

export default function AdminSidebar({}: {}) {
  const router = useRouter()
  const isRoute = {
    dashboard: router.pathname.startsWith('/hq/dashboard'),
    categories: router.pathname.startsWith('/hq/categories'),
    sponsors: router.pathname.startsWith('/hq/sponsors'),
    listings: router.pathname.startsWith('/hq/listings'),
    accounts: router.pathname.startsWith('/hq/accounts'),
    reports: router.pathname.startsWith('/hq/reports')
  }
  const classNames = {
    active: 'text-lg bg-red-500 rounded px-2 py-1 block text-white font-bold',
    notActive: 'text-lg hover:cursor-pointer px-2 py-1 block font-bold'
  }
  const classForState = (route: keyof typeof isRoute) => {
    return isRoute[route] ? classNames.active : classNames.notActive
  }
  return (
    <div className="max-w-20 w-64 p-4">
      <div className="mb-10">
        <Link href="/hq/dashboard" passHref>
          <a>
            <img src="/full-logo.png" className="w-full h-auto" />
          </a>
        </Link>
      </div>
      <div>
        <div className="mb-6">
          <Link href="/hq/dashboard" passHref>
            <a className={classForState('dashboard')}>Dashboard</a>
          </Link>
        </div>
      </div>
      <div>
        <span className="font-bold text-xs uppercase mb-2 inline-block">Content</span>
        <div className="mb-4">
          <Link href="/hq/categories" passHref>
            <a className={classForState('categories')}>Categories</a>
          </Link>
        </div>
        <div className="mb-4">
          <Link href="/hq/sponsors" passHref>
            <a className={classForState('sponsors')}>Sponsors</a>
          </Link>
        </div>
        <div className="mb-4">
          <Link href="/hq/accounts" passHref>
            <a className={classForState('accounts')}>Accounts</a>
          </Link>
        </div>
        <div className="mb-4">
          <Link href="/hq/listings" passHref>
            <a className={classForState('listings')}>Listings</a>
          </Link>
        </div>
        <div className="mb-4">
          <Link href="/hq/reports" passHref>
            <a className={classForState('reports')}>Reports</a>
          </Link>
        </div>
      </div>
    </div>
  )
}
