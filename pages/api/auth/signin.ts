import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import validator from 'validator';
import * as jose from 'jose';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { email, password } = req.body;
    const errors: string[] = [];

    const validationSchema = [
      {
        valid: validator.isEmail(email),
        errorMessage: 'Invalid email address'
      },
      {
        valid: validator.isStrongPassword(password),
        errorMessage: 'Password is not strong enough'
      }
    ];

    validationSchema.forEach(({ valid, errorMessage }) => {
      if (!valid) {
        errors.push(errorMessage);
      }
    });

    if (errors.length > 0) {
      return res.status(400).json({
        errorMessage: errors
      });
    }

    const userWithEmail = await prisma.user.findUnique({
      where: {
        email
      }
    });

    if (!userWithEmail) {
      return res.status(401).json({
        errorMessage: 'Email Address or Password is invalid'
      });
    }

    const isCorrectPassword = await bcrypt.compare(
      password,
      userWithEmail.password
    );

    if (!isCorrectPassword) {
      return res.status(401).json({
        errorMessage: 'Email Address or Password is invalid'
      });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    const token = await new jose.SignJWT({ email: email })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('24H')
      .sign(secret);

    return res.status(200).json({
      user: token
    });
  }
  return res.status(404).json('Unkown endpoint');
}
