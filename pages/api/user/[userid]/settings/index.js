import prisma from '../../../../../lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userid } = req.query;
    const update = req.body;

    await prisma.settings.update({
      where: {
        userId: userid,
      },
      data: update,
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
