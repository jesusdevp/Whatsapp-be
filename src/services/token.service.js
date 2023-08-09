import { sign } from "../utils/token.util.js";

export const generateToken = async (payload, expirexIn, secret) => {
    let token = await sign(payload, expirexIn, secret)

    return token;
} 