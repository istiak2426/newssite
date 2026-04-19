'use client'

import Link from 'next/link'
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react'
import { useState } from 'react'
import s from '../components/Footer.module.css'

export default function Footer({ lang = 'bn' }) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const content = {
    bn: {
      about: 'আমাদের সম্পর্কে',
      contact: 'যোগাযোগ',
      privacy: 'নীতি ও শর্ত',
      terms: 'শর্তাবলী',
      advertise: 'বিজ্ঞাপন',
      subscribe: 'নিউজলেটার',
      follow: 'অনুসরণ করুন',
      copyright: 'সর্বস্বত্ব সংরক্ষিত',
      emailPlaceholder: 'আপনার ইমেইল',
      success: 'সফলভাবে সাবস্ক্রাইব হয়েছে',
      error: 'সমস্যা হয়েছে',
      empty: 'ইমেইল দিন',
      invalid: 'সঠিক ইমেইল দিন',
      duplicate: 'এই ইমেইল ইতিমধ্যে সাবস্ক্রাইব করা হয়েছে',
      editor: 'প্রধান সম্পাদক - আরিফ মারজান',
      mobileApp: 'মোবাইল অ্যাপস ডাউনলোড করুন',
    },
    en: {
      about: 'About Us',
      contact: 'Contact',
      privacy: 'Privacy Policy',
      terms: 'Terms of Use',
      advertise: 'Advertise',
      subscribe: 'Newsletter',
      follow: 'Follow Us',
      copyright: 'All Rights Reserved',
      emailPlaceholder: 'Your email',
      success: 'Subscribed successfully',
      error: 'Something went wrong',
      empty: 'Enter email',
      invalid: 'Enter valid email',
      duplicate: 'Email already subscribed',
      editor: 'Chief Editor - Arif Marjan',
      mobileApp: 'Download Mobile App',
    }
  }

  const t = content[lang] || content.bn

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const handleSubscribe = async () => {
    const cleanEmail = email.trim()
    if (!cleanEmail) { alert(t.empty); return }
    if (!isValidEmail(cleanEmail)) { alert(t.invalid); return }
    try {
      setLoading(true)
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail }),
      })
      const data = await res.json()
      if (res.ok) { alert(t.success); setEmail('') }
      else { alert(res.status === 409 ? t.duplicate : (data.error || t.error)) }
    } catch { alert(t.error) }
    finally { setLoading(false) }
  }

  return (
    <footer className={s.footer}>
      <div className={s.inner}>

        {/* Top: Logo + Nav Links */}
        <div className={s.top}>
          <Link href="/" className={s.logo}>
            <span className={s.logoDot} />
            <span className={s.logoText}>
              {lang === 'bn' ? 'দৈনিক অভিমত' : 'Doinik Obhimot'}
            </span>
          </Link>
          <ul className={s.links}>
            <li><Link href="/about">{t.about}</Link></li>
            <li><Link href="/advertise">{t.advertise}</Link></li>
            <li><Link href="/contact">{t.contact}</Link></li>
            <li><Link href="/privacy-policy">{t.privacy}</Link></li>
            <li><Link href="/terms">{t.terms}</Link></li>
          </ul>
        </div>

        {/* Middle: Social + Contact / App Download */}
        <div className={s.mid}>
          <div className={s.left}>
            <div>
              <p className={s.socialLabel}>{t.follow}</p>
              <div className={s.social}>
                <a href="https://www.facebook.com/doinikovimot/" aria-label="Facebook"><Facebook size={16} /></a>
                <a href="#" aria-label="Twitter"><Twitter size={16} /></a>
                <a href="#" aria-label="Instagram"><Instagram size={16} /></a>
                <a href="#" aria-label="YouTube"><Youtube size={16} /></a>
              </div>
            </div>
            <div className={s.contact}>
              <span><Phone size={13} /> +8801748008483</span>
              <span><Mail size={13} /> doinikovimot@gmail.com</span>
              <span><MapPin size={13} /> Dhaka, Bangladesh</span>
            </div>
          </div>

          <div className={s.right}>
            <p className={s.appLabel}>{t.mobileApp}</p>
            <div className={s.apps}>
              <a href="#" className={s.appBtn}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                  <path d="M3.18 23.76c.3.17.65.2.98.07L13.86 12 3.18.17A1.1 1.1 0 0 0 3 .8v22.4c0 .2.06.4.18.56zM17.03 8.94l-2.35-1.36L3.95.14l10.7 10.7 2.38-1.9zM3.95 23.86l10.73-7.44-2.38-1.88L3.95 23.86zM20.4 10.44l-2.02-1.17-2.65 2.12 2.65 2.17 2.05-1.19a1.26 1.26 0 0 0-.03-1.93z"/>
                </svg>
                <div className={s.appStoreText}>
                  <span>GET IT ON</span>
                  <span>Google Play</span>
                </div>
              </a>
              <a href="#" className={s.appBtn}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <div className={s.appStoreText}>
                  <span>Download on the</span>
                  <span>App Store</span>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className={s.newsletter}>
          <label htmlFor="footer-email">{t.subscribe}:</label>
          <div className={s.newsletterForm}>
            <input
              id="footer-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.emailPlaceholder}
              onKeyDown={(e) => e.key === 'Enter' && !loading && handleSubscribe()}
            />
            <button onClick={() => !loading && handleSubscribe()} disabled={loading}>
              {loading ? (lang === 'bn' ? 'অপেক্ষা...' : 'Loading...') : t.subscribe}
            </button>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className={s.bottom}>
          <span>স্বত্ব &copy; ২০২৬ দৈনিক অভিমত &mdash; {t.copyright}</span>
          <span>{t.editor}</span>
        </div>

      </div>
    </footer>
  )
}
