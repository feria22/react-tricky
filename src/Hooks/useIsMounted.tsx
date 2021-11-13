
import {useRef,useEffect} from 'react';


export default function useIsMounted():()=>boolean {
    const isMountedRef = useRef(true);
    useEffect(() => {
      return () => {
        isMountedRef.current = false;
      };
    }, []);
    return () => isMountedRef.current;
  }