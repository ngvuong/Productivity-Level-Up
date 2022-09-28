import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { pomodoroid } = req.query;
    const { date } = req.body;
    const where = date && pomodoroid === 'date' ? { date } : { id: pomodoroid };

    await prisma.pomo.update({
      where,
      data: { claimed: true },
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
