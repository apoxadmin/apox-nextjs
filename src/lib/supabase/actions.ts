'use server'

import { type CookieOptions, createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import createAdmin from '@/lib/supabase/admin'

export async function createClientCookie(cookieStore: ReturnType<typeof cookies>) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )
}

export async function signupUser(formData: any) {
    const supabase = createAdmin()

    let { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
    });

    if (error) {
        return Promise.reject(error);
    }

    const uid = data.user.id;
    let res = await supabase.from('users').insert({
        uid: uid,
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        pledgeTerm: formData.pledgeTerm
    })

    if (res.error) {
        console.log('hi')
        console.log(res.error);
        await supabase.auth.admin.deleteUser(uid)
    }
}