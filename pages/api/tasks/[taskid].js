import prisma from '../../../lib/prisma';
import { format } from 'date-fns';

export default async function handler(req, res) {
  const { taskid } = req.query;

  if (req.method === 'PUT') {
    try {
      const data = req.body;

      if (data.date) {
        const existingTasks = await prisma.task.findMany({
          where: {
            name: data.name,
          },
        });

        const today = format(new Date(), 'yyyy-MM-dd');

        const task = existingTasks.find(
          (task) => task.id === taskid && task.date < today
        );

        if (task) return res.status(400).json({ error: 'Cannot modify date' });

        const isUnique = !existingTasks.some((task) => task.date === data.date);

        if (!isUnique) {
          return res.status(409).json({ error: 'Task already exists' });
        }
      }

      const newData = data.tags
        ? { ...data, tags: { set: data.tags.map((tag) => ({ id: tag })) } }
        : data;

      await prisma.task.update({
        where: {
          id: taskid,
        },
        data: {
          ...newData,
        },
      });

      return res.status(200).json({ message: 'Task successfully updated' });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  } else if (req.method === 'DELETE') {
    try {
      await prisma.task.delete({
        where: {
          id: taskid,
        },
      });

      return res.status(200).json({ message: 'Task successfully deleted' });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
