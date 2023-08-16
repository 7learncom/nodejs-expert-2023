import passport from 'passport';
import LocalStrategy from 'passport-local';
import passportJWT from 'passport-jwt';
import { createUser, getUser } from './controllers/users.js';

passport.use('signup', new LocalStrategy({
    passReqToCallback: true,
}, async (req, username, password, done) => {
    try {
        const user = await createUser({
            fullname: req.body.fullname,
            username,
            password,
        });

        done(null, user);
    } catch(error) {
        done(error);
    }
}));

passport.use('login', new LocalStrategy(async (username, password, done) => {
    const InvalidUserError = new Error('Invalid username or password');

    try {
        const user = await getUser({ username });

        if (!user) {
            done(InvalidUserError);
            return;
        }

        const hasValidPassword = user.isValidPassword(password);

        if (!hasValidPassword) {
            done(InvalidUserError);
            return;
        }

        done(null, user);
    } catch(error) {
        done(error);
    }
}));

passport.use(new passportJWT.Strategy({
    secretOrKey: process.env.JWT_SECRET,
    jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
}, (tokenPayload, done) => {
    try {
        done(null, tokenPayload.user);
    } catch(error) {
        done(error);
    }
}));
