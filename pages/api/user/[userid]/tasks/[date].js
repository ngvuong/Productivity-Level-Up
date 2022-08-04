import prisma from '../../../../../lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userid, date } = req.query;

    const tasks = await prisma.task.findMany({
      where: {
        userId: userid,
        date,
      },
      include: {
        project: true,
        tags: true,
      },
      orderBy: [
        {
          completed: 'asc',
        },
        {
          priority: 'asc',
        },
      ],
    });

    return res.status(200).json(tasks);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
