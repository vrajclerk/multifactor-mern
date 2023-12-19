import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [verificationSuccess, setVerificationSuccess] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleRequestOTP = async () => {
    try {
      await axios.post('http://localhost:3001/request-otp', { email });
      alert('OTP requested successfully. Check your email.');
    } catch (error) {
      console.error('Error requesting OTP:', error.response.data);
      alert('Error requesting OTP. Please try again.');
    }
  };

  const handleVerifyOTP = async () => {
    try {
      await axios.post('http://localhost:3001/verify-otp', { email, otp });
      setVerificationSuccess(true);
    } catch (error) {
      console.error('Error verifying OTP:', error.response.data);
      alert('Invalid OTP. Please try again.');
    }
  };

  const renderContent = () => {
    if (verificationSuccess) {
      return <h2>Verification Successful! You are now logged in.</h2>;
    }

    return (
      <div>
        <h1>OTP Authentication</h1>
        <label>Email: </label>
        <input type="email" value={email} onChange={handleEmailChange} />
        <button onClick={handleRequestOTP}>Request OTP</button>

        <hr />

        <h2>Verify OTP</h2>
        <label>OTP: </label>
        <input type="text" value={otp} onChange={handleOtpChange} />
        <button onClick={handleVerifyOTP}>Verify OTP</button>
      </div>
    );
  };

  return <div>{renderContent()}</div>;
}



export default App;
