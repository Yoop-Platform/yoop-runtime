import express, { Request, Response } from "express";
import { handle } from "./index";
import { CloudEvent, Context } from "./types";

const app = express();
app.use(express.json());

app.post("/", async (req: Request, res: Response) => {
  const context: Context = {
    log: {
      info: (...args) => console.log("[INFO]", ...args),
      debug: (...args) => console.debug("[DEBUG]", ...args),
      error: (...args) => console.error("[ERROR]", ...args),
    },
    headers: req.headers,
    method: req.method,
    url: req.url,
  };

  try {
    const event = req.body as CloudEvent;

    const result = await handle(context, event);
    res.status(200).json(result ? result : { status: "ok" });
  } catch (err) {
    context.log.error("Function error:", err);
    res.status(500).json({ error: (err as Error).message });
  }
});

const port = process.env.PORT ? parseInt(process.env.PORT) : 8081;
app.listen(port, () => {
  console.log(`🚀 Serverless function runner listening on port ${port}`);
});
