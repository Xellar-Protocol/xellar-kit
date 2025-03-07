import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { generateNonce } from "siwe";

type Session = {
  nonce: string;
};

export const GET = async () => {
  const cookieStorage = await cookies();
  const session = await getIronSession<Session>(cookieStorage, {
    cookieName: "xellar-kit-session",
    password: process.env.IRON_SESSION_PASSWORD as string,
  });

  session.nonce = generateNonce();
  await session.save();

  return NextResponse.json({ nonce: session.nonce });
};
