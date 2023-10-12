import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import * as jose from 'jose';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const authorization = req.headers['authorization'] as string;
  const decodedJWT = jose.decodeJwt(authorization?.split(' ')[1]);

  if (!decodedJWT.email) {
    return res.status(401).json({
      errorMessage: 'Unauthorized request'
    });
  }

  const user = await prisma.user.findUnique({
    where: {
      email: decodedJWT.email.toString()
    },
    select: {
      first_name: true,
      last_name: true,
      phone: true,
      city: true,
      email: true
    }
  });

  return res.json({ user });
}
