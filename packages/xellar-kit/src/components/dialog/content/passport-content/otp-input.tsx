import { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

interface OTPInputProps {
  onComplete?: (value: string) => void;
  disabled?: boolean;
}

export function OTPInput({ onComplete, disabled = false }: OTPInputProps) {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
  const inputRefs = useRef<HTMLInputElement[]>([]);

  const handleChange = useCallback(
    (element: HTMLInputElement, index: number) => {
      const value = element.value;

      // Only allow numbers
      if (!/^\d*$/.test(value)) return;

      const newOtp = [...otp];
      newOtp[index] = value.substring(value.length - 1);
      setOtp(newOtp);

      // Move to next input if value is entered
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    },
    [otp]
  );

  useEffect(() => {
    const otpValue = otp.join('');
    if (otpValue.length === 6 && onComplete) {
      onComplete(otpValue);
    }
  }, [otp, onComplete]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
      // Move to previous input on backspace if current input is empty
      if (e.key === 'Backspace' && !otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    },
    [otp]
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pastedData = e.clipboardData.getData('text');
      if (!/^\d*$/.test(pastedData)) return;

      const otpArray = pastedData.slice(0, 6).split('');
      const newOtp = [...otp];

      otpArray.forEach((value, index) => {
        newOtp[index] = value;
      });

      setOtp(newOtp);

      // Focus last filled input
      const lastFilledIndex = Math.min(otpArray.length - 1, 5);
      inputRefs.current[lastFilledIndex]?.focus();
    },
    [otp]
  );

  return (
    <Container>
      {otp.map((_, index) => (
        <Input
          disabled={disabled}
          key={index}
          type="text"
          maxLength={1}
          ref={el => {
            if (el) inputRefs.current[index] = el;
          }}
          value={otp[index]}
          onChange={e => handleChange(e.target, index)}
          onKeyDown={e => handleKeyDown(e, index)}
          onPaste={handlePaste}
        />
      ))}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
  width: 100%;
`;

const Input = styled.input`
  width: 32px;
  height: 42px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.BORDER};
  background-color: transparent;
  color: ${({ theme }) => theme.colors.TEXT};
  text-align: center;
  font-size: 16px;
  font-weight: 600;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.PRIMARY};
  }

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;
