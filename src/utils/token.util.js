import jwt from "jsonwebtoken";
import logger from "../configs/logger.config.js";

export const sign = (payload, expiresIn, secret) => {
    return new Promise((resolve, reject) => {
        jwt.sign(payload, secret, {
            expiresIn
        }, (error, token) => {
            if(error) {
                logger.error(error)
                reject(error)
            } else {
                resolve(token)
            }
        })
    })
}