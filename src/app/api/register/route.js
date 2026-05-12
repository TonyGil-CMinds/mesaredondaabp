import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request) {
  try {
    const data = await request.json();
    
    const existing = await prisma.registration.findUnique({
      where: { correo: data.correo }
    });
    
    const isUpdate = !!existing;

    const registration = await prisma.registration.upsert({
      where: { correo: data.correo },
      update: {
        nombre: data.nombre,
        apellido: data.apellido,
        organizacion: data.organizacion,
        rol: data.rol,
        fecha: data.activeDate,
      },
      create: {
        nombre: data.nombre,
        apellido: data.apellido,
        correo: data.correo,
        organizacion: data.organizacion,
        rol: data.rol,
        fecha: data.activeDate,
      },
    });
    return NextResponse.json({ success: true, registration, isUpdate });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ success: false, error: 'Registration failed' }, { status: 500 });
  }
}
