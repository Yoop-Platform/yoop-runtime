import { Client } from "cassandra-driver";
import { v4 as uuidv4 } from "uuid";

const cassandraClient = new Client({
  contactPoints: ["cassandra.default.svc.cluster.local"],
  localDataCenter: "datacenter1",
  keyspace: "yoop_platform",
});

export interface LogEntry {
  tenant_id: string;
  level: "info" | "debug" | "error";
  message: string;
  metadata?: object;
  timestamp?: Date;
  source?: string;
}

export async function insertLog(log: LogEntry): Promise<void> {
  const {
    tenant_id,
    level,
    message,
    metadata = {},
    source = process.env.FUNCTION_IDENTIFIER || "unknown",
    timestamp = new Date(),
  } = log;

  const query = `
    INSERT INTO logs_by_tenant (tenant_id, timestamp, log_id, level, source, message, metadata)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [
    tenant_id,
    timestamp,
    uuidv4(),
    level,
    source,
    message,
    JSON.stringify(metadata),
  ];

  await cassandraClient.execute(query, params, { prepare: true });
}
