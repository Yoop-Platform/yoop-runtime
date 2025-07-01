import express, { Request, Response } from "express";
import { handle } from "./index";
import { CloudEvent, Context } from "./types";
import { insertLog } from "./utils/cassandra";

const app = express();
app.use(express.json());

app.get("/healthz", (_req, res) => {
  res.status(200).send("OK");
});

app.post("/", async (req: Request, res: Response) => {
  const tenantId = process.env.TENANT_ID;

  const logWrapper =
    (level: "info" | "debug" | "error") =>
    async (message: string, metadata: Record<string, any> = {}) => {
      await insertLog({
        tenant_id: tenantId!,
        level,
        message,
        metadata,
      });
    };

  const context: Context = {
    log: {
      info: logWrapper("info"),
      debug: logWrapper("debug"),
      error: logWrapper("error"),
    },
    headers: req.headers,
    method: req.method,
    url: req.url,
  };

  try {
    const event = req.body as CloudEvent;
    const result: any = await handle(context, event);
    res.status(200).json(result || { status: "ok" });
  } catch (err) {
    console.error("Function error:", err);
    res.status(500).json({ error: (err as Error).message });
  }
});

const port = process.env.PORT ? parseInt(process.env.PORT) : 3060;
app.listen(port, () => {
  console.log(`🚀 Serverless function runner listening on port ${port}`);
});
