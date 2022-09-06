import prisma from '../../../../../lib/prisma';

export default async function handler(req, res) {
  const { userid } = req.query;

  if (req.method === 'GET') {
    try {
      const tasks = await prisma.task.findMany({
        where: { userId: userid },
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
          { date: 'desc' },
        ],
      });

      return res.status(200).json(tasks);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  } else if (req.method === 'POST') {
    try {
      const { data } = req.body;

      const existingTasks = await prisma.task.findMany({
        where: {
          name: data.name,
          date: data.date,
        },
      });

      if (existingTasks.length) {
        return res.status(409).json({ error: 'Task already exists' });
      }

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
