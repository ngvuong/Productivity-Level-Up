import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { taskid } = req.query;
    const { completed } = req.body;

    const task = await prisma.task.update({
      where: {
        id: taskid,
      },
      data: {
        completed,
      },
    });

    return res.status(200);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
