import { ProcessCreator } from './types';
import { insureRowFinished } from './insureRowFinished';
import { nullProcessCreator } from './nullProcessCreator';

const nullProcess = Promise.resolve<unknown>(null);

export const debounce = (processCreator: ProcessCreator) => {
  const rowFinishedProcessCreatorCarrier = { current: nullProcessCreator };
  const decoratedProcessCreator = insureRowFinished(
    processCreator,
    rowFinishedProcessCreatorCarrier,
  );

  const rowFinishedProcessCreator = rowFinishedProcessCreatorCarrier.current;

  let rowFinishedProcess = nullProcess;
  let lastArgs: unknown[] = [];
  const refreshRowFinishedWatch = async () => {
    if (rowFinishedProcess !== nullProcess) {
      return;
    }

    try {
      rowFinishedProcess = rowFinishedProcessCreator();
      await rowFinishedProcess;
    } catch (error) {
      // error handle
    }

    rowFinishedProcess = nullProcess;

    // eslint-disable-next-line @typescript-eslint/no-use-before-define, @typescript-eslint/no-floating-promises
    callDebounced();
  };

  const callDebounced = () => {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define, @typescript-eslint/no-floating-promises
    debouncedProcessCreator(...lastArgs);
  };

  const debouncedProcessCreator = async (...args: unknown[]) => {
    lastArgs = args;

    const process = decoratedProcessCreator(...args);
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    refreshRowFinishedWatch();

    let result;
    try {
      result = await process;
    } catch (error) {
      return await Promise.reject(error);
    }

    return Promise.resolve(result);
  };

  return debouncedProcessCreator;
};
