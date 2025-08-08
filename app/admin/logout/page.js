// app/admin/logout/page.js
'use server';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default async function LogoutPage() {
  const cookieStore = cookies();
  cookieStore.delete('admin_token'); // or your token name
  redirect('/login'); // or home
}
