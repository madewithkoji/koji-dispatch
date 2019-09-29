export interface Config {
  projectId: string;
  options?: ConfigOptions;
}

export interface ConfigOptions {
  shardName?: string|null;
  maxConnectionsPerShard?: number;
  [index: string]: any;
}

export const DefaultOptions: ConfigOptions = {
  maxConnectionsPerShard: 100,
};
