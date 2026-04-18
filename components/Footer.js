'use client'

import Link from 'next/link'
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, ChevronUp } from 'lucide-react'
import { useState } from 'react'

export default function Footer({ lang = 'bn' }) {

  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const content = {
    bn: {
      about: 'আমাদের সম্পর্কে',
      contact: 'যোগাযোগ',
      privacy: 'গোপনীয়তা নীতি',
      terms: 'শর্তাবলী',
      advertise: 'বিজ্ঞাপন',
      subscribe: 'সাবস্ক্রাইব',
      follow: 'আমাদের অনুসরণ করুন',
      copyright: 'সর্বস্বত্ব সংরক্ষিত',
      quickLinks: 'দ্রুত লিংক',
      contactUs: 'যোগাযোগ করুন',
      emailPlaceholder: 'আপনার ইমেইল',
      success: 'সফলভাবে সাবস্ক্রাইব হয়েছে',
      error: 'সমস্যা হয়েছে',
      empty: 'ইমেইল দিন',
      invalid: 'সঠিক ইমেইল দিন',
      duplicate: 'এই ইমেইল ইতিমধ্যে সাবস্ক্রাইব করা হয়েছে'
    },
    en: {
      about: 'About Us',
      contact: 'Contact',
      privacy: 'Privacy Policy',
      terms: 'Terms of Use',
      advertise: 'Advertise',
      subscribe: 'Subscribe',
      follow: 'Follow Us',
      copyright: 'All Rights Reserved',
      quickLinks: 'Quick Links',
      contactUs: 'Contact Us',
      emailPlaceholder: 'Your email',
      success: 'Subscribed successfully',
      error: 'Something went wrong',
      empty: 'Enter email',
      invalid: 'Enter valid email',
      duplicate: 'Email already subscribed'
    }
  }

  const t = content[lang] || content.bn

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleSubscribe = async () => {
    const cleanEmail = email.trim()

    if (!cleanEmail) {
      alert(t.empty)
      return
    }

    if (!isValidEmail(cleanEmail)) {
      alert(t.invalid)
      return
    }

    try {
      setLoading(true)

      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail }),
      })

      const data = await res.json()

      if (res.ok) {
        alert(t.success)
        setEmail('')
      } else {
        if (res.status === 409) {
          alert(t.duplicate)
        } else {
          alert(data.error || t.error)
        }
      }

    } catch (err) {
      alert(t.error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <footer className="bg-gray-900 text-white mt-8 md:mt-16">

      <button
        onClick={scrollToTop}
        className="fixed bottom-4 right-4 md:bottom-8 md:right-8 bg-red-600 text-white p-2 md:p-3 rounded-full shadow-lg hover:bg-red-700 transition z-40"
        aria-label="Scroll to top"
      >
        <ChevronUp size={20} className="md:w-6 md:h-6" />
      </button>

      <div className="container-custom py-8 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">

          {/* About */}
          <div>
            <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4">
              {lang === 'bn' ? 'দৈনিক অভিমত' : 'Doinik Obhimot'}
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              {lang === 'bn'
                ? 'সত্য ও নির্ভুল সংবাদে প্রতিশ্রুতিবদ্ধ। নির্ভেজাল সংবাদ সবার আগে।'
                : 'Committed to truth and accurate news. Unbiased news for everyone.'}
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-3 md:mb-4 text-sm md:text-base">{t.quickLinks}</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link href="/about" className="hover:text-white block py-1">{t.about}</Link></li>
              <li><Link href="/contact" className="hover:text-white block py-1">{t.contact}</Link></li>
              <li><Link href="/advertise" className="hover:text-white block py-1">{t.advertise}</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-white block py-1">{t.privacy}</Link></li>
              <li><Link href="/terms" className="hover:text-white block py-1">{t.terms}</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-3 md:mb-4 text-sm md:text-base">{t.contactUs}</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li className="flex items-center gap-2"><Phone size={14} /> +8801748008483</li>
              <li className="flex items-center gap-2"><Mail size={14} /> doinikovimot@gmail.com</li>
              <li className="flex items-center gap-2"><MapPin size={14} /> Dhaka, Bangladesh</li>
            </ul>
          </div>

          {/* Social + Subscribe */}
          <div>
            <h4 className="font-semibold mb-3 md:mb-4 text-sm md:text-base">{t.follow}</h4>

            <div className="flex space-x-3 md:space-x-4 mb-4 md:mb-6">
              <a href="https://www.facebook.com/doinikovimot/" className="hover:text-blue-400"><Facebook size={18} /></a>
              <a href="#" className="hover:text-blue-400"><Twitter size={18} /></a>
              <a href="#" className="hover:text-pink-500"><Instagram size={18} /></a>
              <a href="#" className="hover:text-red-600"><Youtube size={18} /></a>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                if (!loading) handleSubscribe()
              }}
              className="flex flex-col sm:flex-row gap-2"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.emailPlaceholder}
                className="flex-1 px-3 py-2 rounded-lg text-gray-900 text-sm"
              />

              <button
                type="submit"
                disabled={loading}
                className={`px-3 md:px-4 py-2 rounded-lg text-sm transition 
                  ${loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}
              >
                {loading ? (lang === 'bn' ? 'অপেক্ষা করুন...' : 'Loading...') : t.subscribe}
              </button>
            </form>
          </div>

        </div>

        <div className="border-t border-gray-800 mt-6 md:mt-8 pt-6 md:pt-8 text-center text-gray-400 text-xs md:text-sm">
          <p>&copy; 2026 Doinik Obhimot. {t.copyright}</p>
        </div>
      </div>
    </footer>
  )
}