import {useEffect, useRef} from "react";

export const useScroll = (parentRef, childRef, callback) => {
	const observer = useRef()

	useEffect(() => {
		const options = {
			rootMargin: '0px',
			threshold: 0
		}

		observer.current = new IntersectionObserver(([target]) => {
			console.log(target)
			if (target.isIntersecting) {
				console.log('intersected')
				callback()
			}

		}, options);

		observer.current.observe(childRef.current)

		return function () {
			console.log('return', observer.current)
			try {
				observer.current && observer.current.unobserve(childRef.current);
			} catch (e) {

			}

		};
	}, [callback]);
};