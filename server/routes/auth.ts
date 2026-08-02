import express, { type Request, type Response } from "express";
import { auth } from "../lib/auth";
import { fromNodeHeaders } from "better-auth/node";

const router = express.Router();

router.post("/register", async (req: Request, res: Response) => {
  const { email, password, firstname, lastname } = req.body;
  const user = await auth.api.signUpEmail({
    body: {
      email: email,
      password: password,
      firstname: firstname,
      lastname: lastname,
      name: `${firstname} ${lastname}`,
    },
  });

  console.log("user created: ", user);

  res.json({ success: true, message: "User registered successfully" });
});

router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const session = await auth.api.signInEmail({
    body: {
      email: email,
      password: password,
    },
  });

  console.log("session created: ", session);

  res.json({
    success: true,
    message: "User logged in successfully",
    ...session,
  });
});

router.post("/logout", async (req: Request, res: Response) => {
  await auth.api.signOut({
    headers: fromNodeHeaders(req.headers),
  });

  res.json({ success: true, message: "User logged out successfully" });
});

export default router;
