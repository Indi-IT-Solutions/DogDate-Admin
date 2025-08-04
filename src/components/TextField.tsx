import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface TextFieldProps {
    id: string;
    label: string;
    type?: string;
    placeholder?: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
    error: string;
    touched: boolean;
}

const TextField = ({
    id,
    label,
    type = "text",
    placeholder,
    name,
    value,
    onChange,
    onBlur,
    error,
    touched
}: TextFieldProps) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword && showPassword ? "text" : type;

    return (
        <Form.Group className="mb-4 form-group">
            <Form.Label htmlFor={id}>{label}</Form.Label>
            <div className="position-relative">
                <Form.Control
                    id={id}
                    name={name}
                    type={inputType}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    isInvalid={touched && !!error}
                />
                {isPassword && (
                    <span
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ cursor: "pointer", position: "absolute", right: "10px", top: "50%", transform: `${touched && error ? "translateY(-100%)" : "translateY(-50%)"}` }}
                    >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                )}
                {touched && error && (
                    <Form.Control.Feedback type="invalid">
                        {error}
                    </Form.Control.Feedback>
                )}
            </div>
        </Form.Group>
    );
};

export default TextField;
