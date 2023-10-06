import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User";
import { initializeUserProducts } from "../controllers/userController";
import dotenv from "dotenv";
dotenv.config();

const usePassport = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT!,
        clientSecret: process.env.GOOGLE_SECRET!,
        callbackURL: `${process.env.BACKEND_URL}/api/auth/google/callback`,
      },
      async function (
        token: string,
        tokenSecret: string,
        profile: any,
        done: (error: any, user?: any) => void
      ) {
        try {
          const shouldInitialize = process.env.NODE_ENV === "development";

          let user = await User.findOne({ googleID: profile.id });

          if (user) {
            return done(null, user);
          } else {
            const newUser = new User({
              googleID: profile.id,
              name: profile.displayName,
              isVerified: true,
              initialized: !shouldInitialize,
              email: profile.emails[0].value,
              profilePicture:
                profile.photos && profile.photos.length > 0
                  ? profile.photos[0].value
                  : undefined,
            });

            const savedUser = await newUser.save();

            if (shouldInitialize && !savedUser.initialized) {
              await initializeUserProducts(savedUser);
              savedUser.initialized = true;
              await savedUser.save();
            }

            return done(null, savedUser);
          }
        } catch (error) {
          done(error);
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
