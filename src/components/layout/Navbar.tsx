import { Link, useLocation } from 'react-router-dom'
import { useClerk, useUser } from '@clerk/clerk-react'
import {
  Menu,
  X,
  User,
  LogOut,
  Home,
  FileText,
  CreditCard,
  Phone,
  HelpCircle,
  ChevronDown,
} from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui'
import { cn } from '@/lib/utils'

const publicLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Us' },
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
]

const authLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/dashboard', label: 'Dashboard', icon: FileText },
  { href: '/loans', label: 'My Loans', icon: CreditCard },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [showMoreMenu, setShowMoreMenu] = useState(false)
  const { isSignedIn, user } = useUser()
  const { signOut } = useClerk()
  const location = useLocation()

  const handleSignOut = () => {
    signOut({ redirectUrl: '/' })
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-neutral-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-500">
              <span className="text-lg font-bold text-white">D</span>
            </div>
            <span className="text-xl font-bold text-neutral-900">DEPCO</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-1 lg:flex">
            {isSignedIn ? (
              // Authenticated navigation
              <>
                {authLinks.map((link) => {
                  const Icon = link.icon
                  const isActive = location.pathname === link.href
                  return (
                    <Link
                      key={link.href}
                      to={link.href}
                      className={cn(
                        'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-primary-50 text-primary-600'
                          : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {link.label}
                    </Link>
                  )
                })}
              </>
            ) : (
              // Public navigation
              <>
                {publicLinks.map((link) => {
                  const isActive = location.pathname === link.href
                  return (
                    <Link
                      key={link.href}
                      to={link.href}
                      className={cn(
                        'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-primary-50 text-primary-600'
                          : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                      )}
                    >
                      {link.label}
                    </Link>
                  )
                })}
              </>
            )}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden items-center gap-3 lg:flex">
            {isSignedIn ? (
              <>
                <div className="relative">
                  <button
                    onClick={() => setShowMoreMenu(!showMoreMenu)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                      <User className="h-4 w-4" />
                    </div>
                    <span>{user?.firstName || 'Account'}</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>

                  {showMoreMenu && (
                    <div className="absolute right-0 top-full mt-2 w-48 rounded-lg border border-neutral-200 bg-white py-2 shadow-lg">
                      <Link
                        to="/profile"
                        onClick={() => setShowMoreMenu(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                      >
                        <User className="h-4 w-4" />
                        My Profile
                      </Link>
                      <Link
                        to="/faq"
                        onClick={() => setShowMoreMenu(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                      >
                        <HelpCircle className="h-4 w-4" />
                        Help & FAQ
                      </Link>
                      <Link
                        to="/contact"
                        onClick={() => setShowMoreMenu(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                      >
                        <Phone className="h-4 w-4" />
                        Contact Us
                      </Link>
                      <hr className="my-2 border-neutral-200" />
                      <button
                        onClick={() => {
                          setShowMoreMenu(false)
                          handleSignOut()
                        }}
                        className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
                <Link to="/apply">
                  <Button size="sm">Apply Now</Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="rounded-lg p-2 text-neutral-600 hover:bg-neutral-100 lg:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="border-t border-neutral-200 py-4 lg:hidden">
            <div className="flex flex-col gap-1">
              {isSignedIn ? (
                <>
                  {authLinks.map((link) => {
                    const Icon = link.icon
                    const isActive = location.pathname === link.href
                    return (
                      <Link
                        key={link.href}
                        to={link.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors',
                          isActive
                            ? 'bg-primary-50 text-primary-600'
                            : 'text-neutral-600 hover:bg-neutral-100'
                        )}
                      >
                        <Icon className="h-5 w-5" />
                        {link.label}
                      </Link>
                    )
                  })}
                  <hr className="my-2 border-neutral-200" />
                  <Link
                    to="/apply"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 rounded-lg bg-primary-50 px-4 py-3 text-sm font-medium text-primary-600"
                  >
                    <CreditCard className="h-5 w-5" />
                    Apply for Loan
                  </Link>
                </>
              ) : (
                <>
                  {publicLinks.map((link) => {
                    const isActive = location.pathname === link.href
                    return (
                      <Link
                        key={link.href}
                        to={link.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          'rounded-lg px-4 py-3 text-sm font-medium transition-colors',
                          isActive
                            ? 'bg-primary-50 text-primary-600'
                            : 'text-neutral-600 hover:bg-neutral-100'
                        )}
                      >
                        {link.label}
                      </Link>
                    )
                  })}
                </>
              )}

              <hr className="my-2 border-neutral-200" />

              {isSignedIn ? (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-neutral-600 hover:bg-neutral-100"
                  >
                    <User className="h-5 w-5" />
                    My Profile
                  </Link>
                  <Link
                    to="/faq"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-neutral-600 hover:bg-neutral-100"
                  >
                    <HelpCircle className="h-5 w-5" />
                    Help & FAQ
                  </Link>
                  <button
                    onClick={() => {
                      setIsOpen(false)
                      handleSignOut()
                    }}
                    className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-5 w-5" />
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2 px-4 pt-2">
                  <Link to="/login" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/register" onClick={() => setIsOpen(false)}>
                    <Button className="w-full">Get Started</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
