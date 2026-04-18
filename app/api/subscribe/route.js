import { createSupabaseServer } from '@/lib/supabase/server'

export async function POST(req) {
  try {
    const { email } = await req.json()

    if (!email) {
      return Response.json({ error: 'Email required' }, { status: 400 })
    }

    const supabase = createSupabaseServer()

    const { error } = await supabase
      .from('subscribers')
      .insert([{ email }])

    if (error) {
      if (error.code === '23505') {
        return Response.json({ error: 'Already subscribed' }, { status: 409 })
      }
      throw error
    }

    return Response.json({ success: true })

  } catch (err) {
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}