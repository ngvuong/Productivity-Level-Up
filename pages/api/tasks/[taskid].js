import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  const { taskid } = req.query;

  if (req.method === 'PUT') {
    try {
      const { data } = req.body;

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
