import { sign, verify } from "../utils/token.util.js";

export const generateToken = async (payload, expirexIn, secret) => {
    let token = await sign(payload, expirexIn, secret)

    return token;
}

export const verifyToken = async (token, secret) => {
    let check = await verify(token, secret)

    return check;
}