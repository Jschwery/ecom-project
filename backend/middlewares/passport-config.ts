import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User";
import { error } from "console";

const usePassport = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT!,
        clientSecret: process.env.GOOGLE_SECRET!,
        callbackURL: "http://localhost:5000/api/auth/google/callback",
      },
      async function (
        token: string,
        tokenSecret: string,
        profile: any,
        done: (error: any, user?: any) => void
      ) {
        try {
          let user = await User.findOne({ googleID: profile.id });

          if (user) {
            return done(null, user);
          } else {
            const newUser = new User({
              googleID: profile.id,
              name: profile.displayName,
              isVerified: true,
              email: profile.emails[0].value,
              profilePicture:
                profile.photos && profile.photos.length > 0
                  ? profile.photos[0].value
                  : undefined,
            });

            newUser
              .save()
              .then((savedUser) => done(null, savedUser))
              .catch((err) => done(err));
          }
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  const serializeUser = (user: any, done: (err: any, id?: any) => void) => {
    done(null, user.id);
  };

  const deserializeUser = async (
    id: string,
    done: (err: any, user?: any) => void
  ) => {
    try {
      const foundUser = await User.findById(id);
      return done(null, foundUser);
    } catch (error) {
      return done(error);
    }
  };

  passport.serializeUser(serializeUser);
  passport.deserializeUser(deserializeUser);
};

export default usePassport;
