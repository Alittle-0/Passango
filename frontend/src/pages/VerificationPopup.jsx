import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import '../styles/_verification-popup.scss';

const VerificationPopup = ({ email, onClose }) => {
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const inputRefs = useRef([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Focus the first input on mount
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, []);

    const handleInputChange = (index, value) => {
        if (value.length > 1) {
            value = value.slice(0, 1);
        }

        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        // Move to next input if a digit is entered
        if (value && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (index, e) => {
        // Handle backspace
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text');
        const digits = pastedData.replace(/\D/g, '').split('').slice(0, 6);
        
        if (digits.length === 6) {
            setCode(digits);
            inputRefs.current[5].focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const verificationCode = code.join('');
        
        if (verificationCode.length !== 6) {
            toast.error('Please enter the complete verification code');
            return;
        }

        try {
            setIsLoading(true);
            await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/verify-code`, {
                email,
                code: verificationCode
            });
            
            // Navigate to reset password page
            navigate('/reset-password', { 
                state: { 
                    email,
                    code: verificationCode 
                } 
            });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Invalid verification code');
        } finally {
            setIsLoading(false);
        }
    };

    const resendCode = async () => {
        try {
            setIsLoading(true);
            await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/forgot-password`, { email });
            toast.success('Verification code resent!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to resend code');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="verification-popup">
            <div className="verification-content">
                <button className="close-button" onClick={onClose}>×</button>
                <h2>Enter Verification Code</h2>
                <p>We've sent a 6-digit code to {email}</p>
                
                <form onSubmit={handleSubmit}>
                    <div className="verification-inputs">
                        {code.map((digit, index) => (
                            <input
                                key={index}
                                ref={el => inputRefs.current[index] = el}
                                type="text"
                                maxLength="1"
                                value={digit}
                                onChange={(e) => handleInputChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                onPaste={handlePaste}
                                disabled={isLoading}
                                pattern="[0-9]"
                                inputMode="numeric"
                                required
                            />
                        ))}
                    </div>

                    <button 
                        type="submit" 
                        className="verify-button"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Verifying...' : 'Verify Code'}
                    </button>
                </form>

                <div className="resend-code">
                    <p>Didn't receive the code?</p>
                    <button 
                        className="resend-button"
                        onClick={resendCode}
                        disabled={isLoading}
                    >
                        Resend Code
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VerificationPopup;