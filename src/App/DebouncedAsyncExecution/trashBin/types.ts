export type ProcessCreator = (...args: unknown[]) => Promise<unknown>;
export type ProcessCreatorCarrier = {
  current: ProcessCreator;
};
