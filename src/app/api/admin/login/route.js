import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createHash } from 'crypto';

function tokenFor(password) {
  return createHash('sha256').update(password).digest('hex');
}

export async function POST(request) {
  const { password } = await request.json();

  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set('admin_session', tokenFor(password), {
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 60 * 60 * 8,
    path: '/',
  });

  return NextResponse.json({ success: true });
}
