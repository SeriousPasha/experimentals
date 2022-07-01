const nullProcess = Promise.resolve<unknown>(null);

type CountChangeHandler = (nextCount: number) => void;

class ProcessThrottler {
  onCountChange: CountChangeHandler = () => {};

  requestCount = 0;

  currentProcess = nullProcess;

  nextProcess = nullProcess;

  processSequence = nullProcess;

  incrementCount() {
    this.requestCount += 1;
    this.onCountChange(this.requestCount);
  }

  // todo: you can put it as a pram to this class
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  callAPIMock(...args: unknown[]) {
    return new Promise<{}>((resolve) => {
      setTimeout(() => {
        resolve({});
      }, 2000 + Math.round(Math.random() * 2000));
    });
  }

  tryToCallAPIMock(...args: unknown[]) {
    // todo: consider try catch
    // eslint-disable-next-line consistent-return
    const nextProcess = this.currentProcess.then(async () => {
      if (nextProcess === this.nextProcess) {
        this.currentProcess = this.callAPIMock(...args);

        const result = await this.currentProcess;
        this.incrementCount();

        return result;
      }

      return null;
    });

    this.nextProcess = nextProcess;
  }

  awaitProcessSequence = async () => {
    if (this.processSequence === nullProcess) {
      // eslint-disable-next-line @typescript-eslint/no-misused-promises,no-async-promise-executor
      this.processSequence = new Promise(async (resolve) => {
        let nextProcess;
        let lastResult;

        do {
          nextProcess = this.nextProcess;

          // eslint-disable-next-line no-await-in-loop
          lastResult = await this.nextProcess;
        } while (nextProcess !== this.nextProcess);

        resolve(lastResult);
      });
    }

    // todo: use try/catch here
    const result = await this.processSequence;

    this.processSequence = nullProcess;

    return result;
  };

  async invoke(...args: unknown[]) {
    this.tryToCallAPIMock(...args);

    const result = await this.awaitProcessSequence();

    return result;
  }
}

export { ProcessThrottler };
