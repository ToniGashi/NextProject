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
    const { firstName, lastName, phone, city, email, password } = req.body;
    const errors: string[] = [];
    const userWithEmail = await prisma.user.findUnique({
      where: {
        email
      }
    });

    const validationSchema = [
      {
        valid: validator.isLength(firstName, {
          min: 1,
          max: 20
        }),
        errorMessage: 'Invalid first name'
      },
      {
        valid: validator.isLength(lastName, {
          min: 1,
          max: 20
        }),
        errorMessage: 'Invalid last name'
      },
      {
        valid: validator.isEmail(email),
        errorMessage: 'Invalid email address'
      },
      {
        valid: validator.isMobilePhone(phone),
        errorMessage: 'Invalid phone number'
      },
      {
        valid: validator.isLength(city, {
          min: 1,
          max: 30
        }),
        errorMessage: 'Invalid city'
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

    if (userWithEmail) {
      return res.status(400).json({
        errorMessage: 'Email address is associated with another user'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        first_name: firstName,
        last_name: lastName,
        city: city,
        phone: phone,
        email: email,
        password: hashedPassword
      }
    });

    return res.status(200).json({
      newUser: user
    });
  }
  return res.status(404).json('Unkown endpoint');
}
