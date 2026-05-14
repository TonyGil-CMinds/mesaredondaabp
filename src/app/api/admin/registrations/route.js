import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createHash } from 'crypto';
import prisma from '@/lib/prisma';

function tokenFor(password) {
  return createHash('sha256').update(password).digest('hex');
}

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session')?.value;
  const expected = tokenFor(process.env.ADMIN_PASSWORD);

  if (!session || session !== expected) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const registrations = await prisma.registration.findMany({
    orderBy: { createdAt: 'asc' },
  });

  return NextResponse.json({ registrations });
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_session');
  return NextResponse.json({ success: true });
}
