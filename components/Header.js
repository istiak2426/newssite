'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter, usePathname } from 'next/navigation'
import { Menu, X, User, Search, Home, Newspaper, Layers, LogOut } from 'lucide-react'
import LanguageSwitcher from './LanguageSwitcher'
import { supabase } from '@/lib/supabase'

export default function Header({ propLang }) {
  const params = useParams()
  const router = useRouter()
  const pathname = usePathname()
  const lang = propLang || params?.lang || 'bn'

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [scrolled, setScrolled] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [hoverTimeout, setHoverTimeout] = useState(null)

  const navigation = {
    bn: [
      { name: 'হোম', href: `/${lang}`, icon: Home },
      { name: 'রাজনীতি', href: `/${lang}/category/politics`, icon: Newspaper },
      { name: 'প্রযুক্তি', href: `/${lang}/category/technology`, icon: Layers },
      { name: 'বাণিজ্য', href: `/${lang}/category/business`, icon: Newspaper },
      { name: 'খেলা', href: `/${lang}/category/sports`, icon: Newspaper },
      { name: 'বিনোদন', href: `/${lang}/category/entertainment`, icon: Newspaper },
    ],
    en: [
      { name: 'Home', href: `/${lang}`, icon: Home },
      { name: 'Politics', href: `/${lang}/category/politics`, icon: Newspaper },
      { name: 'Technology', href: `/${lang}/category/technology`, icon: Layers },
      { name: 'Business', href: `/${lang}/category/business`, icon: Newspaper },
      { name: 'Sports', href: `/${lang}/category/sports`, icon: Newspaper },
      { name: 'Entertainment', href: `/${lang}/category/entertainment`, icon: Newspaper },
    ]
  }

  const navItems = navigation[lang] || navigation.bn

  useEffect(() => {
    checkUser()

    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)

    document.body.style.overflow = isMenuOpen ? 'hidden' : 'unset'

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null)
        setLoading(false)
      }
    )

    return () => {
      subscription?.unsubscribe()
      window.removeEventListener('scroll', handleScroll)
      document.body.style.overflow = 'unset'
    }
  }, [isMenuOpen])

  async function checkUser() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    } catch (error) {
      console.error(error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setIsMenuOpen(false)
    router.push(`/${lang}`)
    router.refresh()
  }

  const closeMenu = () => setIsMenuOpen(false)

  return (
    <>
      <header className={`bg-white shadow-md sticky top-0 z-50 ${
        scrolled ? 'shadow-lg' : ''
      }`}>
        <div className="container-custom">
          <div className="flex justify-between items-center py-3 md:py-4">

            {/* Logo */}
            <Link 
              href={`/${lang}`} 
              className="text-xl md:text-2xl lg:text-3xl font-bold text-red-600"
            >
              {lang === 'bn' ? 'দৈনিক ক্রনিকল' : 'Daily Chronicle'}
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`hover:text-red-600 ${
                    pathname === item.href ? 'text-red-600 font-semibold' : ''
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Desktop Right */}
            <div className="hidden lg:flex items-center space-x-3">
              <Search size={20} />
              <LanguageSwitcher currentLang={lang} />

              {!loading && user ? (
                <div
                  className="relative"
                  onMouseEnter={() => {
                    if (hoverTimeout) clearTimeout(hoverTimeout)
                    setDropdownOpen(true)
                  }}
                  onMouseLeave={() => {
                    const timeout = setTimeout(() => {
                      setDropdownOpen(false)
                    }, 150)
                    setHoverTimeout(timeout)
                  }}
                >
                  <button className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-full">
                    <User size={20} />
                    <span>{user.email?.split('@')[0]}</span>
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white shadow-lg rounded-md z-50">
                      
                      <Link
                        href={`/${lang}/admin`}
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        📊 Dashboard
                      </Link>

                      <Link
                        href={`/${lang}/admin/new-article`}
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        ✍️ New Article
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                      >
                        🚪 Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href={`/${lang}/auth`}
                  className="bg-red-600 text-white px-4 py-2 rounded"
                >
                  Login
                </Link>
              )}
            </div>

            {/* Mobile */}
            <div className="lg:hidden flex items-center gap-2">
              <Search size={20} />

              <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 z-40 ${
        isMenuOpen ? 'translate-x-0' : '-translate-x-full'
      } transition`}>

        <div className="absolute inset-0 bg-black opacity-50" onClick={closeMenu} />

        <div className="relative w-4/5 bg-white h-full p-4">
          {navItems.map(item => (
            <Link key={item.name} href={item.href} onClick={closeMenu}>
              <div className="py-2">{item.name}</div>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}