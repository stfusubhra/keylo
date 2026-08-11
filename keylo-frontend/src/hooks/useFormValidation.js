import { useState, useEffect } from 'react';

const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_REGEX = {
  hasUpperCase: /[A-Z]/,
  hasLowerCase: /[a-z]/,
  hasNumber: /\d/,
  hasSpecialChar: /[!@#$%^&*()_+{}[\]:;<>,.?~/-]/,
};

const PHONE_REGEX = /\+91[6-9]\d{9}/;

export default function useFormValidation(password, phone) {
  const [passwordValid, setPasswordValid] = useState({
    valid: false,
    feedback: '',
  });
  const [phoneValid, setPhoneValid] = useState({
    valid: false,
    feedback: '',
  });

  useEffect(() => {
    if (!password) return;

    let isValid = password.length >= PASSWORD_MIN_LENGTH;
    let feedback = '';

    if (password.length < PASSWORD_MIN_LENGTH) {
      isValid = false;
      feedback = `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`;
    } else if (!PASSWORD_REGEX.hasUpperCase.test(password)) {
      isValid = false;
      feedback = 'Add at least one uppercase letter.';
    } else if (!PASSWORD_REGEX.hasLowerCase.test(password)) {
      isValid = false;
      feedback = 'Add at least one lowercase letter.';
    } else if (!PASSWORD_REGEX.hasNumber.test(password)) {
      isValid = false;
      feedback = 'Add at least one number.';
    } else if (!PASSWORD_REGEX.hasSpecialChar.test(password)) {
      isValid = false;
      feedback = 'Add at least one special character.';
    } else {
      feedback = 'Password looks strong!';
    }

    setPasswordValid({ valid: isValid, feedback });
  }, [password]);

  useEffect(() => {
    if (!phone) return;

    const isValid = PHONE_REGEX.test(phone);
    const feedback = isValid ? 'Phone number looks good!' : 'Format: +91 followed by 10 digits (e.g., +919876543210).';
    setPhoneValid({ valid: isValid, feedback });
  }, [phone]);

  return { passwordValid, phoneValid };
}