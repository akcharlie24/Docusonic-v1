// TODO: write a cron job (every 5 sec update the sheet)
// TODO: ws server -> intermediate queue while doing batch updates (to update the db (content in the Sheet))
// TODO: frontend -> janky function
// tiptap / quilt / (bare-metal approach)

import express, { Request, Response } from "express";
import { prismaClient } from "@repo/prisma/client";
import bcrypt from "bcrypt";

const app = express();

app.post("/signup", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  // ad-hoc fast iteration

  bcrypt.hash(password, 10, async (_err, hashedPassword) => {
    try {
      const newUser = await prismaClient.user.create({
        data: {
          username,
          password: hashedPassword,
        },
      });

      res.status(200).json({ message: "User created" });
    } catch (e: any) {
      res.status(500).json({ message: "Could not create a user, try again" });
    }
  });
});

app.post("/signin", async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const user = await prismaClient.user.findFirst({
    where: {
      username: username,
    },
  });

  if (!user) {
    res.status(404).json({ message: "No user exists, try different usename" });
    return;
  }

  const savedPass = user.password;

  bcrypt.compare(savedPass, password, (err) => {
    if (err) {
      res.status(404).json({ message: "Wrong password please try again" });
      return;
    }

    res.status(200).json({ message: "Logged in" });
  });
});

app.post("/sheet", (req: Request, res: Response) => {});

// this is actually an event

app.put("/sheet", (req: Request, res: Response) => {});

app.get("/sheet", (req: Request, res: Response) => {});

app.get("/sheets", (req: Request, res: Response) => {});

app.listen(3000, () => {
  console.log("Server Started");
});
