"use server";

import {currentUser} from "@clerk/nextjs/server";
import {StreamClient} from "@stream-io/node-sdk";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const apiSecret = process.env.STREAM_SECRET_KEY;

export const tokenProvider = async () => {
  const user = await currentUser();

  if (!user)
    throw Error("No User");
  if (!apiKey)
    throw Error("No API Key");
  if (!apiSecret)
    throw Error("No API Secret");

  const client = new StreamClient(apiKey, apiSecret);

  const exp = Math.round(new Date().getTime() / 1000) + 60 * 60;
  const issued = Math.floor(Date.now() / 1000) - 60;

  const token =
      client.generateUserToken({user_id : user.id, exp : exp, iat : issued});

  return token;
}