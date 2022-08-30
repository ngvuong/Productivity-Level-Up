import prisma from '../../../../../lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userid } = req.query;
    const data = req.body;

    await prisma.settings.update({
      where: {
        userId: userid,
      },
      data,
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
