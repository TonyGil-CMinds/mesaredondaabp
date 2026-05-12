import prisma from '@/lib/prisma';
import RegistrationWizard from './RegistrationWizard';

export default async function Home() {
  const grouped = await prisma.registration.groupBy({
    by: ['fecha'],
    _count: { fecha: true },
  });

  const countsByDate = { 19: 0, 20: 0, 21: 0 };
  for (const row of grouped) {
    countsByDate[row.fecha] = row._count.fecha;
  }

  return <RegistrationWizard countsByDate={countsByDate} />;
}
