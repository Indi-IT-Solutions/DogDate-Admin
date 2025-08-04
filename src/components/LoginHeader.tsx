import React from 'react';

interface LoginHeaderProps {
    title: string;
    title2?: string;
    description?: string;
}

const LoginHeader: React.FC<LoginHeaderProps> = ({ title, title2, description }) => {
    return (
        <div className="headlogin_div mb-4">
            <h2>
                {title} <span className="text-primary">{title2}</span>
            </h2>
            {description && <p>{description}</p>}
        </div>
    )
}

export default LoginHeader;
