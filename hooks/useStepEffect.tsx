import React, { useRef, useEffect } from 'react';


export function useStepEffect(maxSteps: number = 2, callback: () => void, dependencies?: React.DependencyList): void {
  const renderedTimes = useRef<number>(0);

  useEffect(() => {
    if(renderedTimes.current >= maxSteps) return;
    
    callback();
    renderedTimes.current++;
  }, dependencies);
}

export default useStepEffect;
