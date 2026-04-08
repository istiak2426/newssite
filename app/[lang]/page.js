'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Calendar, Eye, TrendingUp, Clock } from 'lucide-react'
import { format } from 'date-fns'
import { bn } from 'date-fns/locale'
import { supabase } from '@/lib/supabase'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function Home({ params: { lang } }) {
  const [featuredArticles, setFeaturedArticles] = useState([])
  const [latestArticles, setLatestArticles] = useState([])
  const [trendingArticles, setTrendingArticles] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    fetchArticles()
  }, [lang])
  
  async function fetchArticles() {
    setLoading(true)
    
    try {
      // Fetch featured articles
      const { data: featured } = await supabase
        .from('articles')
        .select('*')
        .eq('status', 'published')
        .eq('is_featured', true)
        .order('views', { ascending: false })
        .limit(3)
      
      // Fetch latest articles
      const { data: latest } = await supabase
        .from('articles')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(6)
      
      // Fetch trending articles
      const { data: trending } = await supabase
        .from('articles')
        .select('*')
        .eq('status', 'published')
        .order('views', { ascending: false })
        .limit(5)
      
      setFeaturedArticles(featured || [])
      setLatestArticles(latest || [])
      setTrendingArticles(trending || [])
      
    } catch (err) {
      console.error('Fetch error:', err)
    } finally {
      setLoading(false)
    }
  }
  
  const formatDate = (date) => {
    if (!date) return ''
    try {
      return format(new Date(date), 'PP', {
        locale: lang === 'bn' ? bn : undefined
      })
    } catch {
      return date
    }
  }
  
  const getLocalizedTitle = (article) => {
    if (lang === 'bn' && article.title_bn) return article.title_bn
    return article.title
  }
  
  const getLocalizedExcerpt = (article) => {
    if (lang === 'bn' && article.excerpt_bn) return article.excerpt_bn
    return article.excerpt
  }
  
  if (loading) return <LoadingSpinner />
  
  return (
    <div className="pb-16 md:pb-0">
      {/* Hero Section - Mobile Optimized */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-700 text-white py-8 md:py-16">
        <div className="container-custom">
          <h1 className="heading-1 text-center mb-6 md:mb-8">
            {lang === 'bn' ? 'সর্বশেষ সংবাদ ও বিশ্লেষণ' : 'Latest News & Analysis'}
          </h1>
          
          {featuredArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {featuredArticles.map((article, index) => (
                <Link href={`/${lang}/article/${article.id}`} key={article.id}>
                  <div className={`bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden hover:bg-white/20 transition ${
                    index === 0 ? 'md:col-span-2 md:row-span-2' : ''
                  }`}>
                    {article.featured_image && (
                      <div className={`${index === 0 ? 'h-56 md:h-64' : 'h-40 md:h-48'} overflow-hidden`}>
                        <img
                          src={article.featured_image}
                          alt={getLocalizedTitle(article)}
                          className="w-full h-full object-cover hover:scale-105 transition duration-300"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/600x400?text=No+Image'
                          }}
                        />
                      </div>
                    )}
                    <div className="p-3 md:p-4">
                      <span className="text-red-400 text-xs md:text-sm font-semibold">{article.category}</span>
                      <h2 className={`text-base md:text-xl font-bold mt-1 md:mt-2 mb-1 md:mb-2 line-clamp-2 ${lang === 'bn' ? 'font-bangla' : ''}`}>
                        {getLocalizedTitle(article)}
                      </h2>
                      <p className="text-gray-300 text-xs md:text-sm line-clamp-2 hidden sm:block">
                        {getLocalizedExcerpt(article)}
                      </p>
                      <div className="flex items-center gap-3 md:gap-4 mt-2 md:mt-3 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} className="md:w-4 md:h-4" />
                          {formatDate(article.published_at)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye size={12} className="md:w-4 md:h-4" />
                          {article.views || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400">{lang === 'bn' ? 'কোনো ফিচার্ড আর্টিকেল নেই' : 'No featured articles'}</p>
            </div>
          )}
        </div>
      </section>
      
      {/* Latest News Section */}
      <section className="container-custom py-8 md:py-12">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 md:mb-8">
          <h2 className="heading-2 border-l-4 border-red-600 pl-3 md:pl-4">
            {lang === 'bn' ? 'সর্বশেষ সংবাদ' : 'Latest News'}
          </h2>
          <div className="flex items-center gap-2 text-sm text-gray-500 mt-2 md:mt-0">
            <Clock size={14} />
            <span>{lang === 'bn' ? 'সর্বশেষ আপডেট' : 'Latest updates'}</span>
          </div>
        </div>
        
        {latestArticles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {latestArticles.map(article => (
              <article key={article.id} className="article-card group">
                {article.featured_image && (
                  <Link href={`/${lang}/article/${article.id}`}>
                    <div className="h-48 md:h-56 overflow-hidden">
                      <img
                        src={article.featured_image}
                        alt={getLocalizedTitle(article)}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/600x400?text=No+Image'
                        }}
                      />
                    </div>
                  </Link>
                )}
                <div className="p-3 md:p-4">
                  <Link href={`/${lang}/category/${article.category?.toLowerCase()}`}>
                    <span className="text-red-600 text-xs md:text-sm font-semibold hover:underline">
                      {article.category}
                    </span>
                  </Link>
                  <Link href={`/${lang}/article/${article.id}`}>
                    <h3 className={`text-base md:text-lg font-bold mt-1 md:mt-2 mb-1 md:mb-2 hover:text-red-600 transition line-clamp-2 ${lang === 'bn' ? 'font-bangla' : ''}`}>
                      {getLocalizedTitle(article)}
                    </h3>
                  </Link>
                  <p className="text-gray-600 text-xs md:text-sm mb-2 md:mb-3 line-clamp-2 hidden xs:block">
                    {getLocalizedExcerpt(article)}
                  </p>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>{article.author || 'Unknown'}</span>
                    <span>{formatDate(article.published_at)}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">{lang === 'bn' ? 'কোনো আর্টিকেল পাওয়া যায়নি' : 'No articles found'}</p>
            <Link href={`/${lang}/admin/new-article`} className="inline-block mt-4 text-red-600 hover:text-red-700">
              {lang === 'bn' ? 'প্রথম আর্টিকেল তৈরি করুন' : 'Create first article'}
            </Link>
          </div>
        )}
      </section>
      
      {/* Trending Section - Mobile Optimized */}
      {trendingArticles.length > 0 && (
        <section className="bg-gray-50 py-8 md:py-12">
          <div className="container-custom">
            <h2 className="heading-2 flex items-center gap-2 mb-6 md:mb-8">
              <TrendingUp className="text-red-600" size={24} />
              {lang === 'bn' ? 'ট্রেন্ডিং সংবাদ' : 'Trending News'}
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {trendingArticles.map((article, index) => (
                <Link href={`/${lang}/article/${article.id}`} key={article.id}>
                  <div className="flex items-start gap-3 p-3 bg-white rounded-lg hover:shadow-md transition">
                    <div className="text-2xl md:text-3xl font-bold text-red-600 min-w-[40px]">
                      #{index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-semibold text-sm md:text-base hover:text-red-600 transition line-clamp-2 ${lang === 'bn' ? 'font-bangla' : ''}`}>
                        {getLocalizedTitle(article)}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                        <Eye size={12} />
                        <span>{article.views || 0} {lang === 'bn' ? 'দর্শন' : 'views'}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}