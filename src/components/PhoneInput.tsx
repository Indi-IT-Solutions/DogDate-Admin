import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
import { useState } from 'react';
import './PhoneInput.css'; // Custom styles (see below)

interface PhoneInputProps {
    placeholder?: string;
    value?: string;
    onChange?: (value: string) => void;
}

const PhoneInputComponent: React.FC<PhoneInputProps> = ({ placeholder = "Numéro de téléphone" }) => {
    const [value, setValue] = useState<string | undefined>();

    return (
        <div className="phone-input-wrapper">
            <PhoneInput
                international
                defaultCountry="US"
                placeholder={placeholder}
                value={value}
                onChange={setValue}
                className="custom-phone-input"
                withCountryCallingCode
                countryCallingCodeEditable={false}
                displayInitialValueAsLocalNumber
            />

        </div>
    );
};

export default PhoneInputComponent;
