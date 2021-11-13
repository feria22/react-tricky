
import {useCallback,useEffect,useRef} from 'react'
import * as _ from 'lodash';
import { useIsMounted } from '.';


export default function useDebounce(callback:any, delay:number) {
  
  const options = { leading: true, trailing: false }; // add custom lodash options
  const isMounted = useIsMounted();
    const inputsRef = useRef({callback, delay}); // mutable ref like with useThrottle
    useEffect(() => { inputsRef.current = { callback, delay }; }); //also track cur. delay
    return useCallback(
      _.debounce((...args) => {
          // Debounce is an async callback. Cancel it, if in the meanwhile
          // (1) component has been unmounted 
          // (2) delay has changed
          
          if (inputsRef.current.delay === delay && isMounted())
            inputsRef.current.callback(...args);
        }, delay, options
      ),
      [delay,_.debounce]
    );
  }
