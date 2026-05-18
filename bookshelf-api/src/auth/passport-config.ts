import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { findUserByEmail, createGoogleUser } from '../users.js';

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            callbackURL: process.env.GOOGLE_CALLBACK_URL!,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails?.[0]?.value;
                if (!email) return done(new Error('No email from Google'));

                let user = await findUserByEmail(email);
                if (!user) {
                    user = await createGoogleUser(email, profile.id);
                }
                done(null, user);
            } catch (err) {
                done(err as Error);
            }
        }
    )
);

export default passport;
