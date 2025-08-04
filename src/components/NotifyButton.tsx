
import { Button } from "react-bootstrap";


const NotifyButton = ({ buttonText }: { buttonText: string }) => {
    return (
        <Button
            variant="info"
        >
            <span style={{ color: "#fff", fontWeight: 500 }}>{buttonText}</span>
            <span
                className="iconSvg"
            >
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                    <path d="M8 0L6.59 1.41L12.17 7H0V9H12.17L6.59 14.59L8 16L16 8L8 0Z" fill="#007bff" />
                </svg>
            </span>
        </Button>
    );
};

export default NotifyButton;
