import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import sgMail from '@sendgrid/mail';

// ─── Configuración de reuniones ────────────────────────────────────────────
const ZOOM_LINKS = {
  19: "https://calendar.google.com/calendar/event?action=TEMPLATE&tmeid=MmZ2Yjl1aHBtbzltN2ZuNjBhc3QwOGZycWEgY19lN2Y2MmIzNWM5YWFkYzM2YmM4NzI2ZTQ4MzdjYzI4ODM5ZGIzNWRlM2RhMWJlNGVhYzEyOGNjMDY5ZmM4MzM1QGc&tmsrc=c_e7f62b35c9aadc36bc8726e4837cc28839db35de3da1be4eac128cc069fc8335%40group.calendar.google.com",
  20: "https://calendar.google.com/calendar/event?action=TEMPLATE&tmeid=MTdudWxmYmcyZTdiOGk4bWZuN3FuNGt1ZHAgY19lN2Y2MmIzNWM5YWFkYzM2YmM4NzI2ZTQ4MzdjYzI4ODM5ZGIzNWRlM2RhMWJlNGVhYzEyOGNjMDY5ZmM4MzM1QGc&tmsrc=c_e7f62b35c9aadc36bc8726e4837cc28839db35de3da1be4eac128cc069fc8335%40group.calendar.google.com",
  21: "https://calendar.google.com/calendar/event?action=TEMPLATE&tmeid=NHBkdm43dWtnbnFsMmplM3JrMG04dXZqY3UgY19lN2Y2MmIzNWM5YWFkYzM2YmM4NzI2ZTQ4MzdjYzI4ODM5ZGIzNWRlM2RhMWJlNGVhYzEyOGNjMDY5ZmM4MzM1QGc&tmsrc=c_e7f62b35c9aadc36bc8726e4837cc28839db35de3da1be4eac128cc069fc8335%40group.calendar.google.com",
};

const DATE_LABELS = {
  19: "Martes 19 de Mayo, 10 AM (MX) / 11 AM (COL)",
  20: "Miércoles 20 de Mayo, 10 AM (MX) / 11 AM (COL)",
  21: "Jueves 21 de Mayo, 10 AM (MX) / 11 AM (COL)",
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
