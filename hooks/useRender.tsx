import React, { useRef, useEffect } from 'react';



export function useRender(callback: (() => void), dependencies?: React.DependencyList): void {
  const isFirstRenderRef = useRef<boolean>(true);

  useEffect(() => {
    if(!isFirstRenderRef.current) return;
    isFirstRenderRef.current = false;

    callback();
  }, dependencies);
}

export default useRender;
