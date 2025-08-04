import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";

const ScrollToTop = () => {
    const [showTopBtn, setShowTopBtn] = useState(false);
    useEffect(() => {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 400) {
                setShowTopBtn(true);
            } else {
                setShowTopBtn(false);
            }
        });
    }, []);
    const goToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };
    return (
        <div className="top-to-btm">
            {showTopBtn && (
                <Icon
                    className="icon-position icon-style"
                    icon="bxs:up-arrow"
                    onClick={goToTop}
                />
            )}
        </div>
    );
};
export default ScrollToTop;
