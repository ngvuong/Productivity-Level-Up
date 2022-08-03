import prisma from '../../../../../lib/prisma';

export default async function handler(req, res) {
  const { userid } = req.query;

  if (req.method === 'GET') {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: userid,
        },
        select: {
          projects: {
            orderBy: {
              name: 'asc',
            },
          },
        },
      });

      return res.status(200).json(user.projects);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  } else if (req.method === 'POST') {
    try {
      const { name } = req.body;

      const user = await prisma.user.update({
        where: {
          id: userid,
        },
        data: {
          projects: {
            connectOrCreate: {
              where: {
                name,
              },
              create: {
                name,
              },
            },
          },
        },
        select: {
          projects: {
            where: {
              name,
            },
          },
        },
      });

      return res.status(200).json(user.projects[0]);
    } catch (err) {
      if (err.code === 'P2000') {
        return res
          .status(400)
          .json({ error: 'Project name cannot exceed 20 characters' });
      }

      return res.status(500).json({ error: err.message });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
