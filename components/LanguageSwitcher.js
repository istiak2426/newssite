'use client'

import { useRouter } from 'next/navigation'
import { Globe } from 'lucide-react'

export default function LanguageSwitcher({ currentLang }) {
  const router = useRouter()
  
  const switchLanguage = (newLang) => {
    const currentPath = window.location.pathname
    const newPath = currentPath.replace(`/${currentLang}`, `/${newLang}`)
    router.push(newPath)
  }
  
  return (
    <div className="relative group">
      <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition">
        <Globe size={18} />
        <span className="font-medium">{currentLang === 'bn' ? 'বাংলা' : 'English'}</span>
      </button>
      
      <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg hidden group-hover:block z-50">
        <button
          onClick={() => switchLanguage('bn')}
          className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded-t-lg font-bangla"
        >
          বাংলা
        </button>
        <button
          onClick={() => switchLanguage('en')}
          className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded-b-lg"
        >
          English
        </button>
      </div>
    </div>
  )
}