import { PrismaClient } from '@prisma/client';
import { QuestionLevel } from '@codern/internal';
import { Timestamp } from '@codern/shared';

const prisma = new PrismaClient();

const main = async (): Promise<void> => {
  const workspace = await prisma.workspace.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: 'Veclab',
      profilePath: 'https://cdn.discordapp.com/attachments/935377151765647402/935384123294486618/vectier2022-logo-white.png',
      ownerId: '1',
      createdAt: Timestamp.now(),
    },
  });

  console.log({ workspace });

  const workspaceParticipants = await prisma.workspaceParticipants.upsert({
    where: {
      workspaceId_userId: {
        workspaceId: 1,
        userId: '1',
      },
    },
    update: {},
    create: {
      workspaceId: 1,
      userId: '1',
      joinedAt: Timestamp.now(),
    },
  });

  console.log({ workspaceParticipants });

  const questions = await Promise.all([
    await prisma.question.upsert({
      where: { id: 1 },
      update: {},
      create: {
        id: 1,
        name: 'Keeratikorn Noodle',
        description: 'The hardest algorithm question in the software world',
        detailPath: '',
        memoryLimit: 1024,
        timeLimit: 100,
        level: QuestionLevel.HARD,
        workspaceId: 1,
        createdAt: Timestamp.now(),
      },
    }),
    await prisma.question.upsert({
      where: { id: 2 },
      update: {},
      create: {
        id: 2,
        name: 'Porama Chicken',
        description: 'The hardest algorithm question in the software world',
        detailPath: '',
        memoryLimit: 1024,
        timeLimit: 100,
        level: QuestionLevel.HARD,
        workspaceId: 1,
        createdAt: Timestamp.now(),
      },
    }),
  ]);

  console.log({ questions });
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
