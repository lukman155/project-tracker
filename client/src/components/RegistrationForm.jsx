import React, { useState } from 'react';
import './registrationForm.scss'

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
    role: '',
    lga: '',
    state: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
    <div className='header'>
      <h1>Register</h1>
    </div>
        <div className='dp-container'>
          <img alt='' src='person.png' className='dp'></img>
        </div>
      <label>
        Your Name:
        <input type="text" name="name" value={formData.name} onChange={handleChange} />
      </label>
      <label>
        Phone Number:
        <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
      </label>
      <label>
        Email:
        <input type="email" name="email" value={formData.email} onChange={handleChange} />
      </label>
      <label>
        Password:
        <input type="password" name="password" value={formData.password} onChange={handleChange} />
      </label>
      <label>
        Confirm Password:
        <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
      </label>
      <label>
        Present Address:
        <input type="text" name="address" value={formData.address} onChange={handleChange} />
      </label>
      <label>
        Role:
        <input type="text" name="role" value={formData.role} onChange={handleChange} />
      </label>
      <label>
        LGA:
        <input type="text" name="lga" value={formData.lga} onChange={handleChange} />
      </label>
      <label>
        State:
        <input type="text" name="state" value={formData.state} onChange={handleChange} />
      </label>
      <button className='submit-btn' type="submit">Register</button>
    </form>
  );
};

export default RegistrationForm;
