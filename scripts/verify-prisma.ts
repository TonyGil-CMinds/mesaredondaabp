import 'dotenv/config'
import prisma from '../src/lib/prisma'

async function verify() {
  try {
    await prisma.registration.findFirst()
    console.log('✅ Connected')
  } catch (error) {
    console.error('Connection failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

verify()
