import passport from 'passport';
import LocalStrategy from 'passport-local';
import { createUser } from './controllers/users.js';

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
