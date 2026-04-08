import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ 
      error: 'Missing environment variables',
      supabaseUrl: !!supabaseUrl,
      supabaseKey: !!supabaseKey
    }, { status: 500 })
  }
  
  const supabase = createClient(supabaseUrl, supabaseKey)
  
  // Test the connection
  const { data, error } = await supabase
    .from('articles')
    .select('count')
    .limit(1)
  
  if (error) {
    return NextResponse.json({ 
      error: error.message,
      details: error
    }, { status: 500 })
  }
  
  return NextResponse.json({ 
    success: true, 
    message: 'Database connected successfully',
    tables: 'articles table exists'
  })
}