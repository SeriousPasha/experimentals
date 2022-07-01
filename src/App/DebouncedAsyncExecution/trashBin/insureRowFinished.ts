import { ProcessCreator, ProcessCreatorCarrier } from './types';

const nullProcess = Promise.resolve<unknown>(null);

// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const insureRowFinished = (
  processCreator: ProcessCreator,
  insureProcessRowFinishedCreator: ProcessCreatorCarrier,
) => {
  let process = nullProcess;
  let currentProcesses: Promise<unknown>[] = [];

  const decoratedProcessCreator = async (...args: unknown[]) => {
    process = processCreator(...args);

    currentProcesses.push(process);

    return process;
  };

  insureProcessRowFinishedCreator.current = async () => {
    let lastProcess;
    let allResults;

    do {
      lastProcess = process;

      // eslint-disable-next-line no-await-in-loop
      allResults = await Promise.allSettled(currentProcesses);
    } while (lastProcess !== process);

    currentProcesses = [];

    const lastResult = allResults.pop();

    if (lastResult === undefined) {
      return Promise.resolve(nullProcess);
    }

    if (lastResult.status === 'rejected') {
      return Promise.reject(lastResult.reason);
    }

    return Promise.resolve(lastResult.value);
  };

  return decoratedProcessCreator;
};
