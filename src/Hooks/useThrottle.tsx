import {useCallback,useRef,useEffect} from 'react';
import * as _ from "lodash";

export default function useThrottle(callback:any, delay:number) {
    const options = { leading: true, trailing: false }; // pass custom lodash options
    const callbackRef = useRef(callback);
    // use mutable ref to make useCallback/throttle not depend on `cb` dep
    useEffect(() => { callbackRef.current = callback; });
    return useCallback(
        _.throttle((...args) => callbackRef.current(...args), delay, options),
        [delay]
    );
}