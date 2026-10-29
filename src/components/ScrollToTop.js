import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
    // Extracts pathname property (key) from the location object
    const { pathname } = useLocation();

    // Automatically scroll to top when the pathname changes
    useEffect(() => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'instant', // 'instant' ensures it jumps immediately without a smooth scroll delay
        });
    }, [pathname]);

    return null;
};

export default ScrollToTop;