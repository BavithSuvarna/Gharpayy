import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.agent.upsert({
    where: { email: 'agent1@gharpayy.com' },
    update: {},
    create: {
      name: 'Ravi Kumar',
      email: 'agent1@gharpayy.com',
    },
  })
  
  await prisma.agent.upsert({
    where: { email: 'agent2@gharpayy.com' },
    update: {},
    create: {
      name: 'Priya Sharma',
      email: 'agent2@gharpayy.com',
    },
  })

  await prisma.agent.upsert({
    where: { email: 'agent3@gharpayy.com' },
    update: {},
    create: {
      name: 'Amit Patel',
      email: 'agent3@gharpayy.com',
    },
  })

  console.log('Seeded initial agents.')
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
