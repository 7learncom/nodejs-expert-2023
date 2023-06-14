import passport from 'passport';
import { User } from "../../models/index.js";

export async function createUser({
    fullname,
    username,
    password,
}) {
    return await User.create({
        fullname,
        username,
        password,
    });
}

function returnCreatedUser(req, res) {
    res.status(201).send(`User "${req.user.fullname}" has been created.`);
}

export const signup = [
    passport.authenticate('signup', { session: false }),
    returnCreatedUser,
];
