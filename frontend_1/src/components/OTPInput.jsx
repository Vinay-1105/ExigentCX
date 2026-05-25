import React from "react";

const OTPInput = ({ otp, setOtp }) => {
  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  return (
    <div className="flex gap-2 justify-center mt-4">
      {otp.map((digit, i) => (
        <input
          key={i}
          id={`otp-${i}`}
          value={digit}
          onChange={(e) => handleChange(e.target.value, i)}
          maxLength="1"
          className="w-11 h-12 text-center text-lg font-semibold border border-gray-300 rounded-lg bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
        />
      ))}
    </div>
  );
};

export default OTPInput;