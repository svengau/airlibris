import { Authenticator } from "remix-auth";
import { GoogleStrategy } from "remix-auth-google";

import { sessionStorage } from "~/services/session.server";

// Create an instance of the authenticator, pass a generic with what
// strategies will return and will store in the session
export let authenticator = new Authenticator<any>(sessionStorage);

const { GOOGLE_AUTH_CLIENT_ID, GOOGLE_AUTH_CLIENT_SECRET, SERVICE_URL } =
  process.env;

let googleStrategy = new GoogleStrategy(
  {
    clientID: GOOGLE_AUTH_CLIENT_ID!,
    clientSecret: GOOGLE_AUTH_CLIENT_SECRET!,
    callbackURL: SERVICE_URL + "/auth/google/callback",
  },
  async ({ accessToken, refreshToken, extraParams, profile }) => {
    return {
      googleId: profile.id,
      lastName: profile.name.familyName,
      firstName: profile.name.givenName,
      displayName: profile.displayName,
      email: profile.emails[0].value,
      imageUrl: profile.photos[0].value,
    };
  }
);

authenticator.use(googleStrategy);
