import 'dotenv/config'
import prisma from '../src/lib/prisma'

async function main() {
  await prisma.registration.createMany({
    data: [
      {
        nombre: 'Alice',
        apellido: 'Smith',
        correo: 'alice@example.com',
        organizacion: 'Org A',
        rol: 'Manager',
        fecha: 19
      },
      {
        nombre: 'Bob',
        apellido: 'Jones',
        correo: 'bob@example.com',
        organizacion: 'Org B',
        rol: 'Developer',
        fecha: 20
      }
    ],
    skipDuplicates: true
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
