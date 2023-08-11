import jwt from "jsonwebtoken";
import logger from "../configs/logger.config.js";

export const sign = ( payload, expiresIn, secret ) => {
    return new Promise(( resolve, reject ) => {
        jwt.sign( payload, secret, {
            expiresIn
        }, ( error, token ) => {
            if( error ) {
                logger.error( error )
                reject( error )
            } else {
                resolve( token )
            }
        })
    })
}

export const verify = ( token, secret ) => {
    return new Promise(( resolve, reject ) => {
        jwt.verify( token, secret, (error, payload) => {
            if( error ) {
                logger.error( error )
                resolve()
            } else {
                resolve( payload )
            }
        })
    })
}