export interface CloudEvent<T = unknown> {
  type: string;
  data: T;
  [key: string]: unknown;
}

export interface Context {
  log: {
    info: (...args: unknown[]) => void;
    debug: (...args: unknown[]) => void;
    error: (...args: unknown[]) => void;
  };
  headers: Record<string, string | string[] | undefined>;
  method: string;
  url: string;
}
