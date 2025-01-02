import { useEffect, useRef } from 'react';


export function useRenderCount() {
  const count = useRef<number>(1);
  useEffect(() => void(count.current++));

  return count.current;
}

export default useRenderCount;
