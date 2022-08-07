import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { taskid } = req.query;
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
}
