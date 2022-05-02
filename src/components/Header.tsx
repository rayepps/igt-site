import { useAuth } from 'src/hooks/useAuth'

export type HeaderLinks = 'trainings' | 'search-all' | 'about'

export default function Header() {
  const auth = useAuth()
  return (
    <div className="">
      <div className="flex flex-row justify-center">
        <div className="max-w-7xl w-full py-5">
          <img src="/full-logo.png" className="w-auto h-16" />
        </div>
      </div>
      <div className="bg-gray-800 flex flex-row justify-center py-2">
        <div className="max-w-7xl w-full flex flex-row items-center justify-between">
          <div>
            <a href="/" className="text-white hover:underline font-semibold inline-block mr-8">
              Home
            </a>
            <a href="/search" className="text-white hover:underline font-semibold inline-block mr-8">
              Search
            </a>
            <a href="https://idahoguntrader.store" className="text-white hover:underline font-semibold inline-block mr-8">
              Gun Trader Gear
            </a>
            <a href="/contact" className="text-white hover:underline font-semibold">
              Contact
            </a>
          </div>
          <div>
            {auth.isAuthenticated && (
              <>
                <a href="/account" className="text-white border-r border-gray-500 pr-4 hover:underline font-semibold inline-block mr-4">
                  My Account
                </a>
                <a href="/logout" className="text-white hover:underline font-semibold inline-block mr-8">
                  Logout
                </a>
              </>
            )}
            {!auth.isAuthenticated && (
              <>
                <a href="/login" className="text-white border-r border-gray-500 pr-4 hover:underline font-semibold inline-block mr-4">
                  Login
                </a>
                <a href="/signup" className="text-white hover:underline font-semibold inline-block mr-8">
                  Signup
                </a>
              </>
            )}
            <a href="/post" className="text-white hover:underline font-semibold inline-block bg-red-600 px-4 py-2">
              Add Listing
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
