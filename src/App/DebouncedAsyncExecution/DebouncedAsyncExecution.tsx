import React, { useEffect, useRef, useState } from 'react';

import { ProcessThrottler } from './ProcessThrottler';

export const DebouncedAsyncExecution = () => {
  const [processThrottler] = useState(() => {
    return new ProcessThrottler();
  });

  const [notification, setNotification] = useState('');
  const requestCountRef = useRef(0);
  const [requestCount, setRequestCount] = useState(requestCountRef.current);
  const callNextRequest = async () => {
    await processThrottler.invoke();
  };

  const claimForNotifyAfterFinish = async () => {
    await processThrottler.awaitProcessSequence();
    setNotification('Request sequence is finished');
  };

  const clear = () => {
    setNotification('');
  };

  useEffect(() => {
    processThrottler.onCountChange = (nextCount: number) => {
      setRequestCount(nextCount);
    };

    return () => {
      processThrottler.onCountChange = () => {};
    };
  }, [processThrottler]);

  return (
    <div>
      <h3>Debounced Async Execution</h3>
      <div>
        <button type="button" onClick={callNextRequest}>
          call next request
        </button>
        <button type="button" onClick={claimForNotifyAfterFinish}>
          claim for notify after finish
        </button>
        <br />
        <br />
        <button type="button" onClick={clear}>
          clear
        </button>
        <br />
        Request count: {String(requestCount)}
        <br />
        Notification: {notification}
      </div>
    </div>
  );
};
