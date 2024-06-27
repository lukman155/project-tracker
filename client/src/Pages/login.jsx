import React, { useState } from 'react';
import './login.scss'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
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
    <section>

    <div className='header'>
      <h1>Login</h1>
    </div>
    
    <form onSubmit={handleSubmit}>

      <div className='dp-container'>
        <img alt='' src='person.png' className='dp'></img>
      </div>

      <label>
        Email:
        <input type="email" name="email" value={formData.email} onChange={handleChange} />
      </label>

      <label>
        Password:
        <input type="password" name="password" value={formData.password} onChange={handleChange} />
      </label>

      <button className='submit-btn' type="submit">Login</button>
    </form>
    <p>Don't have an account? <a href='/register'>Register</a></p>
    </section>
  );
};

export default Login;
