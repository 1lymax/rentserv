import {useEffect, useRef} from "react";

export const useScroll = (parentRef, childRef, callback) => {
	const observer = useRef()

	useEffect(() => {
		const options = {
			rootMargin: '0px',
			threshold: 0
		}

		observer.current = new IntersectionObserver(([target]) => {
			if (target.isIntersecting) {
				callback()
			}

		}, options);

		observer.current.observe(childRef.current)

		return function () {
			try {
				// eslint-disable-next-line
				observer.current && observer.current.unobserve(childRef.current);
			} catch (e) {

			}

		};
		// eslint-disable-next-line
	}, [callback]);
};