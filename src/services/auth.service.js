import createHttpError from "http-errors";
import validator from "validator";
import { UserModel } from "../models/index.js";

// env variables
const { DEFAULT_PICTURE, DEFAULT_STATUS } = process.env

export const createUser = async (userData) => {

    const { name, email, picture, status, password } = userData;

    // check if fields are empty
    if(!name || !email || !password) {
        throw createHttpError.BadRequest('Please fill all fields')
    }

    // check name length
    if( !validator.isLength(name, {
        min: 2,
        max: 16
    })) {
        throw createHttpError.BadRequest('Please make sure your name is between 2 and 16 characters')
    }

    // check status length
    if( status && status.length > 64 ) {
        throw createHttpError.BadRequest('Please make sure your status is less then 64 characters')
    }

    // check if email is valid
    if( !validator.isEmail(email) ) {
        throw createHttpError.BadRequest('Please make sure to provide a valid email address')
    }

    // check if user already exist
    const checkUserDB = await UserModel.findOne({ email });
    if( checkUserDB ) {
        throw createHttpError.Conflict('Please try again a different email address, this email already exist')
    }

    // check password length
    if( !validator.isLength(password, {
        min: 6,
        max: 128
    })) {
        throw createHttpError.BadRequest('Please make sure your password is between 2 and 16 characters')
    }

    const user = await new UserModel({
        name,
        email,
        picture: picture || DEFAULT_PICTURE,
        password,
        status: status || DEFAULT_STATUS,
        password
    }).save();

    return user;

}