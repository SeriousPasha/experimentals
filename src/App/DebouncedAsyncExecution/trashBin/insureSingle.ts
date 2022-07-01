import { ProcessCreator } from './types';

const nullProcess = Promise.resolve<unknown>(null);

export const insureSingle = (createProcess: ProcessCreator) => {
  let currentProcess = nullProcess;
  const decoratedCreateProcess = async (...args: unknown[]) => {
    if (currentProcess === nullProcess) {
      currentProcess = createProcess(...args);
    }

    let result;
    try {
      result = await currentProcess;
    } catch (error) {
      return await Promise.reject(error);
    } finally {
      currentProcess = nullProcess;
    }

    return Promise.resolve(result);
  };

  return decoratedCreateProcess;
};
