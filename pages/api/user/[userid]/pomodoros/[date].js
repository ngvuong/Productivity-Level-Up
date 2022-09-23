import prisma from '../../../../../lib/prisma';

export default async function handler(req, res) {
  const { userid, date } = req.query;

  if (req.method === 'GET') {
    try {
      const where = { userId: userid, ...(date !== 'all' && { date }) };

      const pomodoros = await prisma.pomo.findMany({
        where,
        orderBy: [{ date: 'desc' }],
      });

      return res.status(200).json(pomodoros);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  } else if (req.method === 'POST') {
    try {
      const { body } = req;
      const data = { userId: userid, ...body };

      await prisma.pomo.create({
        data,
      });

      return res.status(200).json({ success: true });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
