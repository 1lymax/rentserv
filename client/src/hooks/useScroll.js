import {useEffect, useRef} from "react";

export const useScroll = (parentRef, childRef, callback, needObserve) => {
	const observer = useRef()

	useEffect(() => {
		const options = {
			root: parentRef.current,
			rootMargin: '0px',
			threshold: 0
		}

		if (needObserve) {
			observer.current = new IntersectionObserver(([target]) => {
				if (target.isIntersecting) {
					console.log('intersected')
					callback()
				}

			}, options);

			observer.current.observe(childRef.current)
		}

		return function () {
			observer.current && observer.current.unobserve(childRef.current)
		};
	}, [callback]);
};