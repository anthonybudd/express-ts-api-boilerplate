import * as fs from 'fs';
import passport from 'passport';
import bcrypt from 'bcrypt-nodejs';
import User from './../models/User';
import Group from './../models/Group';
import { Strategy as LocalStrategy } from 'passport-local';
import { ExtractJwt as ExtractJWT, Strategy as JWTStrategy } from 'passport-jwt';


passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email: string, password: string, cb: Function) => {

    const user = await User.unscoped().findOne({
        where: { email },
        include: [Group]
    });

    if (!user) return cb(null, false, { message: 'Incorrect email or password.' });

    console.log(user);
    return cb(null, false, { message: 'Incorrect email or password.' });

    // return bcrypt.compare(password, user.password, (err, compare) => {
    //     if (compare) {
    //         return cb(null, user, { message: 'Logged in successfully' });
    //     } else {
    //         return cb(null, false, { message: 'Incorrect email or password.' });
    //     }
    // });
}));


// const publicKeyPath = process.env.PUBLIC_KEY_PATH;
// passport.use(new JWTStrategy({
//     jwtFromRequest: ExtractJWT.fromExtractors([
//         ExtractJWT.fromAuthHeaderAsBearerToken(),
//         ExtractJWT.fromUrlQueryParameter('token'),
//     ]),
//     secretOrKey: fs.readFileSync(publicKeyPath, 'utf8'),
// }, (jwtPayload, cb) => cb(null, jwtPayload)));


export default passport;
