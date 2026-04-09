'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter, usePathname } from 'next/navigation'
import { Menu, X, User, Search, Home, Newspaper, Layers, LogOut, LogIn, Globe, ChevronDown } from 'lucide-react'
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
  
  // For mobile bottom navigation - show only 4-5 most important items
  const mobileBottomNav = {
    bn: navigation.bn.slice(0, 4), // Show first 4 items on bottom bar
    en: navigation.en.slice(0, 4)
  }
  
  const navItems = navigation[lang] || navigation.bn
  const mobileNavItems = mobileBottomNav[lang] || mobileBottomNav.bn
  
  useEffect(() => {
    checkUser()
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
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
      console.error('Error checking user:', error)
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
      <header className={`bg-white shadow-md sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'shadow-lg' : ''
      }`}>
        <div className="container-custom">
          <div className="flex justify-between items-center py-3 md:py-4">
            {/* Logo */}
            <Link 
              href={`/${lang}`} 
              className="text-xl md:text-2xl lg:text-3xl font-bold text-red-600 hover:text-red-700 transition truncate flex-1"
            >
              {lang === 'bn' ? 'দৈনিক ক্রনিকল' : 'Daily Chronicle'}
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-gray-700 hover:text-red-600 transition whitespace-nowrap ${
                    pathname === item.href ? 'text-red-600 font-semibold' : ''
                  } ${lang === 'bn' ? 'font-bangla' : ''}`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
            
            {/* Desktop Right Section */}
            <div className="hidden lg:flex items-center space-x-3">
              <button className="tap-target p-2 hover:bg-gray-100 rounded-full transition">
                <Search size={20} />
              </button>
              <LanguageSwitcher currentLang={lang} />
              
              {!loading && (
                user ? (
                  <div className="relative group">
                    <button className="flex items-center space-x-2 tap-target p-2 hover:bg-gray-100 rounded-full transition">
                      <User size={20} />
                      <span className="text-sm hidden xl:inline">
                        {user.email?.split('@')[0]}
                      </span>
                    </button>
                    
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <div className="py-1">
                        <Link
                          href={`/${lang}/admin`}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                          onClick={closeMenu}
                        >
                          📊 {lang === 'bn' ? 'ড্যাশবোর্ড' : 'Dashboard'}
                        </Link>
                        <Link
                          href={`/${lang}/admin/new-article`}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                        >
                          ✍️ {lang === 'bn' ? 'নতুন আর্টিকেল' : 'New Article'}
                        </Link>
                        <hr className="my-1" />
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition"
                        >
                          🚪 {lang === 'bn' ? 'লগআউট' : 'Logout'}
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    href={`/${lang}/auth`}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition text-sm"
                  >
                    {lang === 'bn' ? 'সাইন ইন' : 'Sign In'}
                  </Link>
                )
              )}
            </div>
            
            {/* Mobile Right Section - Now with ALL options */}
            <div className="flex lg:hidden items-center gap-2">
              {/* Mobile Search Button */}
              <button className="tap-target p-2 hover:bg-gray-100 rounded-full transition">
                <Search size={20} />
              </button>
              
              {/* Mobile Language Switcher - NOW INCLUDED */}
              <LanguageSwitcher currentLang={lang} />
              
              {/* Mobile Sign In/User Button */}
              {!loading && (
                user ? (
                  <Link
                    href={`/${lang}/admin`}
                    className="tap-target p-2 hover:bg-gray-100 rounded-full transition"
                  >
                    <User size={20} className="text-red-600" />
                  </Link>
                ) : (
                  <Link
                    href={`/${lang}/auth`}
                    className="bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700 transition text-sm font-medium whitespace-nowrap"
                  >
                    {lang === 'bn' ? 'লগইন' : 'Login'}
                  </Link>
                )
              )}
              
              {/* Mobile Menu Button */}
              <button 
                className="tap-target p-2 hover:bg-gray-100 rounded-lg transition" 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Menu"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Mobile Bottom Navigation Bar - ADD THIS FOR BETTER MOBILE EXPERIENCE */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
        <div className="flex justify-around items-center px-2 py-2">
          {mobileNavItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition ${
                  isActive 
                    ? 'text-red-600' 
                    : 'text-gray-600 hover:text-red-600'
                }`}
              >
                <Icon size={20} />
                <span className="text-xs">{item.name}</span>
              </Link>
            )
          })}
          
          {/* More button to open full menu */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className="flex flex-col items-center gap-1 px-3 py-1 rounded-lg text-gray-600 hover:text-red-600 transition"
          >
            <Menu size={20} />
            <span className="text-xs">{lang === 'bn' ? 'আরও' : 'More'}</span>
          </button>
        </div>
      </div>
      
      {/* Mobile Slide-out Menu */}
      <div className={`fixed inset-0 z-40 lg:hidden transition-transform duration-300 ease-in-out ${
        isMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-black transition-opacity duration-300 ${
            isMenuOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'
          }`}
          onClick={closeMenu}
        />
        
        {/* Menu Panel */}
        <div className="relative w-4/5 max-w-sm h-full bg-white shadow-xl overflow-y-auto pb-20">
          {/* User Section - Mobile */}
          <div className="p-4 border-b bg-gradient-to-r from-red-50 to-orange-50">
            {!loading && user ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold">{user.email?.split('@')[0]}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  {lang === 'bn' ? 'সংবাদ পড়তে লগইন করুন' : 'Login to read news'}
                </p>
                <Link
                  href={`/${lang}/auth`}
                  className="block w-full text-center bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                  onClick={closeMenu}
                >
                  {lang === 'bn' ? 'সাইন ইন করুন' : 'Sign In'}
                </Link>
              </div>
            )}
          </div>
          
          {/* Navigation Links - ALL ITEMS */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg transition ${
                    pathname === item.href 
                      ? 'bg-red-50 text-red-600 font-semibold' 
                      : 'hover:bg-gray-100'
                  } ${lang === 'bn' ? 'font-bangla' : ''}`}
                  onClick={closeMenu}
                >
                  <Icon size={20} />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>
          
          {/* Admin Links for Mobile (only if logged in) */}
          {user && (
            <div className="p-4 border-t">
              <p className="text-xs text-gray-500 uppercase mb-2 tracking-wider">
                {lang === 'bn' ? 'প্রশাসনিক এলাকা' : 'Admin Area'}
              </p>
              <Link
                href={`/${lang}/admin`}
                className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-100 transition"
                onClick={closeMenu}
              >
                📊 {lang === 'bn' ? 'ড্যাশবোর্ড' : 'Dashboard'}
              </Link>
              <Link
                href={`/${lang}/admin/new-article`}
                className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-100 transition"
                onClick={closeMenu}
              >
                ✍️ {lang === 'bn' ? 'নতুন আর্টিকেল' : 'New Article'}
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-3 py-3 rounded-lg text-red-600 hover:bg-red-50 transition"
              >
                <LogOut size={20} />
                {lang === 'bn' ? 'লগআউট' : 'Logout'}
              </button>
            </div>
          )}
          
          {/* Language Switcher for Mobile */}
          <div className="p-4 border-t">
            <p className="text-xs text-gray-500 uppercase mb-2 tracking-wider">
              {lang === 'bn' ? 'ভাষা' : 'Language'}
            </p>
            <LanguageSwitcher currentLang={lang} />
          </div>
        </div>
      </div>
      
      {/* Add bottom padding to main content to account for bottom nav on mobile */}
      <style jsx global>{`
        @media (max-width: 1023px) {
          main {
            padding-bottom: 70px;
          }
        }
      `}</style>
    </>
  )
}