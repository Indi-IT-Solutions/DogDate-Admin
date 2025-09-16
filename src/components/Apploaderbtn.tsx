import React from 'react';
import pawLoader from '../assets/img/paw_loader_white.gif';

interface AppLoaderProps {
    className?: string;
    size?: number;
}

const AppLoaderbtn: React.FC<AppLoaderProps> = ({ className = '', size = 100 }) => {
    return (
        <div className={`d-flex justify-content-center align-items-center ${className}`}>
            <img
                src={pawLoader}
                alt="Loading..."
                style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    objectFit: 'contain'
                }}
            />
        </div>
    );
};

export default AppLoaderbtn;
