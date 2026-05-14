import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import sgMail from '@sendgrid/mail';

// ─── Configuración de reuniones ────────────────────────────────────────────
const ZOOM_LINKS = {
  19: "https://us02web.zoom.us/j/81662091984",
  20: "https://us02web.zoom.us/j/83947854387",
  21: "https://us02web.zoom.us/j/87052242955",
};

const DATE_LABELS = {
  19: "Martes 19 de Mayo, 11 AM COL",
  20: "Miércoles 20 de Mayo, 11 AM COL",
  21: "Jueves 21 de Mayo, 11 AM COL",
};
// ───────────────────────────────────────────────────────────────────────────

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendConfirmationEmail({ nombre, correo, fecha }) {
  await sgMail.send({
    to: correo,
    from: { email: "no-reply@cminds.co", name: "no-reply" },
    templateId: process.env.SENDGRID_TEMPLATE_ID,
    dynamicTemplateData: {
      usuario: nombre,
      fecha: DATE_LABELS[fecha],
      link: ZOOM_LINKS[fecha],
    },
  });
}

export async function POST(request) {
  try {
    const data = await request.json();

    const existing = await prisma.registration.findUnique({
      where: { correo: data.correo }
    });

    const isUpdate = !!existing;

    if (!isUpdate) {
      const dateCount = await prisma.registration.count({
        where: { fecha: data.activeDate },
      });
      if (dateCount >= 20) {
        return NextResponse.json({ success: false, error: 'capacity_full' }, { status: 409 });
      }
    }

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

    if (!isUpdate) {
      try {
        await sendConfirmationEmail({
          nombre: data.nombre,
          correo: data.correo,
          fecha: data.activeDate,
        });
      } catch (emailError) {
        console.error('SendGrid error:', emailError?.response?.body ?? emailError);
      }
    }

    return NextResponse.json({ success: true, registration, isUpdate });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ success: false, error: 'Registration failed' }, { status: 500 });
  }
}
