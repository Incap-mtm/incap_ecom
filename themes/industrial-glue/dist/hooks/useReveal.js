import { useState, useEffect, useRef } from 'react';
export const useReveal = () => {
    const [active, setActive] = useState(false);
    const ref = useRef(null);
    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setActive(true);
            }
        }, { threshold: 0.1 });
        if (ref.current)
            observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);
    return { ref, className: `reveal ${active ? 'active' : ''}` };
};
