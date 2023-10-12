import { NextResponse, NextRequest } from 'next/server';
import * as jose from 'jose';

export async function middleware(req: NextRequest) {
  const authorization = req.headers.get('authorization');

  if (!authorization) {
    return new NextResponse(
      JSON.stringify({
        errorMessage: 'Unauthorized request'
      }),
      { status: 401 }
    );
  }

  const jwtToken = authorization?.split(' ')[1];

  if (!jwtToken) {
    return new NextResponse(
      JSON.stringify({
        errorMessage: 'Unauthorized request'
      }),
      { status: 401 }
    );
  }

  const secret = new TextEncoder().encode(process.env.JWT_SECRET);

  try {
    await jose.jwtVerify(jwtToken, secret);
  } catch (err) {
    return new NextResponse(
      JSON.stringify({
        errorMessage: 'Unauthorized request'
      }),
      { status: 401 }
    );
  }
}

export const config = {
  matcher: ['/api/auth/me']
};
