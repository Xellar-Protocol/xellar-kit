import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { SiweMessage, SiweResponse } from "siwe";

type Session = {
  nonce: string;
  siwe: SiweResponse;
};

export const POST = async (req: NextRequest) => {
  try {
    const { message, signature } = await req.json();
    const siweMessage = new SiweMessage(message);
    const fields = await siweMessage.verify({ signature });

    const cookieStorage = await cookies();
    const session = await getIronSession<Session>(cookieStorage, {
      cookieName: "xellar-kit-session",
      password: process.env.IRON_SESSION_PASSWORD as string,
    });

    if (fields.data.nonce !== session.nonce) {
      return NextResponse.json({ message: "Invalid nonce." }, { status: 422 });
    }

    session.siwe = fields;
    await session.save();

    return NextResponse.json({ ok: true, session });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Invalid signature." }, { status: 422 });
  }
};
