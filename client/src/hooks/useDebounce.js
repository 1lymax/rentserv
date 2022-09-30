import {useCallback, useRef} from "react";

export const useDebounce = (callback, delay) => {
	const timer = useRef()

	return useCallback(() => {
		if (timer.current) {
			clearTimeout(timer.current)
		}
		timer.current = setTimeout(() => {
			callback()
		}, delay);

	}, [callback, delay]);


};