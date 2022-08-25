import prisma from '../../../../../lib/prisma';

export default async function handler(req, res) {
  const { userid } = req.query;

  if (req.method === 'GET') {
    try {
      const pomodoros = await prisma.pomo.findMany({
        where: {
          userId: userid,
        },
      });

      return res.status(200).json(pomodoros);
    } catch (error) {
      return res.status(500).json({ error: err.message });
    }
  } else if (req.method === 'POST') {
    try {
      const { date, duration } = req.body;
      const data = { userId: userid, date, duration };

      await prisma.pomo.create({
        data,
      });

      return res.status(200).json({ ok: true });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
