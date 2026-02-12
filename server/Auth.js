import * as client from "openid-client";
import { Strategy } from "openid-client/passport";
import passport from "passport";
import session from "express-session";
import memoize from "memoizee";

// 1. Google OIDC Configuration
const getOidcConfig = memoize(
  async () => {
    return await client.discovery(
      new URL("https://accounts.google.com"), 
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );
  },
  { maxAge: 3600 * 1000 }
);

// 2. Session Setup (RAM MODE)
export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  
  return session({
    secret: process.env.SESSION_SECRET || "default-dev-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: sessionTtl,
    },
  });
}

// 3. Helper Functions
function updateUserSession(user, tokens) {
  user.claims = tokens.claims();
  user.access_token = tokens.access_token;
  user.expires_at = user.claims?.exp;
}

// Memory-only user storage (No Database)
async function upsertUser(claims) {
  return true; 
}

// 4. Main Setup Function
export async function setupAuth(app) {
  app.set("trust proxy", 1);
  
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  const config = await getOidcConfig();

  const verify = async (tokens, verified) => {
    const user = {
       id: tokens.claims().sub,
       email: tokens.claims().email,
       firstName: tokens.claims().given_name,
       lastName: tokens.claims().family_name,
       picture: tokens.claims().picture
    };
    updateUserSession(user, tokens);
    await upsertUser(tokens.claims());
    verified(null, user);
  };

  const registeredStrategies = new Set();
  const ensureStrategy = (domain) => {
    const strategyName = `googleauth:${domain}`;
    if (!registeredStrategies.has(strategyName)) {
      const strategy = new Strategy(
        {
          client_id: process.env.GOOGLE_CLIENT_ID,
          name: strategyName,
          config,
          scope: "openid email profile", 
          callbackURL: `https://${domain}/api/callback`,
        },
        verify
      );
      passport.use(strategy);
      registeredStrategies.add(strategyName);
    }
  };

  passport.serializeUser((user, cb) => cb(null, user));
  passport.deserializeUser((user, cb) => cb(null, user));

  // --- Routes ---
  
  // 1. Login Route
  app.get("/api/login", (req, res, next) => {
    ensureStrategy(req.hostname);
    passport.authenticate(`googleauth:${req.hostname}`, {
      prompt: "login consent",
      scope: ["openid", "email", "profile"], 
    })(req, res, next);
  });

  // 2. Callback Route
  app.get("/api/callback", (req, res, next) => {
    ensureStrategy(req.hostname);
    passport.authenticate(`googleauth:${req.hostname}`, {
      successReturnToOrRedirect: "/",
      failureRedirect: "/api/login",
    })(req, res, next);
  });

  // 3. Logout Route
  app.get("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) { return next(err); }
      res.redirect("/");
    });
  });

  // 4. Get Current User (THIS WAS MISSING!)
  app.get("/api/auth/user", (req, res) => {
    if (req.isAuthenticated()) {
      res.json(req.user);
    } else {
      res.status(401).json(null);
    }
  });
}

export const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
};
