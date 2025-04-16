import React, { useEffect } from 'react';
import zxcvbn from 'zxcvbn';

const PasswordStrengthMeter = ({ password, onStrengthChange }) => {
    const getStrengthColor = (score) => {
        switch (score) {
            case 0:
                return '#ff0000'; // Red
            case 1:
                return '#ff6b6b'; // Light Red
            case 2:
                return '#ffd93d'; // Yellow
            case 3:
                return '#6bff6b'; // Light Green
            case 4:
                return '#00ff00'; // Green
            default:
                return '#ff0000';
        }
    };

    const getStrengthText = (score) => {
        switch (score) {
            case 0:
                return 'Very Weak';
            case 1:
                return 'Weak';
            case 2:
                return 'Fair';
            case 3:
                return 'Good';
            case 4:
                return 'Strong';
            default:
                return 'Very Weak';
        }
    };

    useEffect(() => {
        if (password) {
            const result = zxcvbn(password);
            onStrengthChange(result.score);
        } else {
            onStrengthChange(0);
        }
    }, [password, onStrengthChange]);

    const result = password ? zxcvbn(password) : { score: 0 };
    const strengthColor = getStrengthColor(result.score);
    const strengthText = getStrengthText(result.score);

    return (
        <div className="password-strength-meter">
            <div className="strength-bar">
                {[0, 1, 2, 3, 4].map((index) => (
                    <div
                        key={index}
                        className="strength-segment"
                        style={{
                            backgroundColor: index <= result.score ? strengthColor : '#e0e0e0'
                        }}
                    />
                ))}
            </div>
            <div className="strength-text" style={{ color: strengthColor }}>
                {strengthText}
            </div>
            {result.feedback.suggestions.length > 0 && (
                <div className="strength-suggestions">
                    <p>Suggestions:</p>
                    <ul>
                        {result.feedback.suggestions.map((suggestion, index) => (
                            <li key={index}>{suggestion}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default PasswordStrengthMeter; 