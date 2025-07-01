export interface CloudEvent<T = unknown> {
  type: string;
  data: T;
  [key: string]: unknown;
}

export interface Context {
  log: {
    info: (message: string, metadata?: Record<string, any>) => Promise<void>;
    debug: (message: string, metadata?: Record<string, any>) => Promise<void>;
    error: (message: string, metadata?: Record<string, any>) => Promise<void>;
  };
  headers: Record<string, string | string[] | undefined>;
  method: string;
  url: string;
}
