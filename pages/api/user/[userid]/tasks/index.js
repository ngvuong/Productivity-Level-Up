import prisma from '../../../../../lib/prisma';

export default async function handler(req, res) {
  const { userid } = req.query;

  if (req.method === 'GET') {
    const tasks = await prisma.task.findMany({
      where: {
        userId: userid,
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
  } else if (req.method === 'POST') {
    try {
      const { data } = req.body;
      const newData = data.tags
        ? { ...data, tags: { connect: data.tags.map((tag) => ({ id: tag })) } }
        : data;

      const task = await prisma.task.create({
        data: { ...newData, userId: userid },
      });

      return res.status(200).json(task);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
