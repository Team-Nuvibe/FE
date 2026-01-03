import { useNavigate } from "react-router-dom";
import IconQuickDrop from "../../assets/icons/icon_quickdrop.svg?react";

const QuickDropButton = () => {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate("/quickdrop")}
            className="w-[65px] h-[65px] bg-[var(--color-black)]/90 rounded-[40px] flex items-center justify-center z-50 transition-transform"
            aria-label="Quick Drop"
        >
            <IconQuickDrop className="w-full h-full" />
        </button>
    );
};

export default QuickDropButton;
