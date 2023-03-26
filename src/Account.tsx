import { useContext, useEffect, useState } from "react";
import * as EmailValidator from 'email-validator';
import AuthedContext from "./AuthedContext";
import { GoogleLogin } from "@react-oauth/google";

function Account() {
  const { setAuthed } = useContext(AuthedContext);
  const [useLogInPage, setUseLogInPage] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // toggles between sign up and log in page
  const toggleLogInPage = () => {
    setUseLogInPage(prev => !prev);
    setEmail('');
    setEmailError('');
    setPassword('');
    setPasswordError('');
    setConfirmPassword('');
    setConfirmPasswordError('');
  }

  // handles API call to /api/login, and auths if it was successful - atherwise sets appropriate errors
  const logIn = () => {
    if(!EmailValidator.validate(email)) {
      return setEmailError('Invalid email');
    }
    else if(emailError !== '') {
      setEmailError('');
    }

    setIsLoading(true);
    console.log(isLoading);
    fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({
        email: email,
        password: password
      })
    })
      .then(res => res.text())
      .then(text => {
        setIsLoading(false);

        if(text === 'OK') {
          return setAuthed(true);
        }
        else if(text === 'Email does not exist') {
          return setEmailError('No account with this email exists');
        }
        else if(text === 'Wrong password') {
          return setPasswordError('Incorrect password');
        }
        else {
          return console.log(text);
        }
      })
  }

  // handles signup call to /api/signup - also auths if successful - atherwise sets appropriate errors
  const signUp = () => {
    if(!EmailValidator.validate(email)) {
      return setEmailError('Invalid email');
    }
    else if(emailError !== '') {
      setEmailError('');
    }

    if(password.length < 8) {
      return setPasswordError('Password must be at least 8 characters');
    }
    else if(passwordError !== '') {
      setPasswordError('');
    }

    if(password !== confirmPassword) {
      return setConfirmPasswordError('Passwords don\'t match');
    }
    else if(confirmPasswordError !== '') {
      setConfirmPasswordError('');
    }

    setIsLoading(true);
    fetch('/api/signup', {
      method: 'POST',
      body: JSON.stringify({
        email: email,
        password: password
      })
    })
      .then(res => res.text())
      .then(text => {
        setIsLoading(false);

        if(text === 'OK') {
          return setAuthed(true);
        }
        else if(text === 'Email already exists') {
          return setEmailError('Account with this email already exists');
        }
        else {
          return console.log(text);
        }
      })
  }

  return <div className='account w-100'>
    <div className='card mt-3'>
      <div className='card-body'>
        <h5 className='card-title'>{useLogInPage ? 'Log in' : 'Sign up'}</h5>
        <div>
          <div className='mb-4'>
            <label htmlFor='email' className='form-label'>Email address</label>
            <input value={email} onChange={e => setEmail(e.target.value)} type='email' className='form-control' id='email'/>
            {emailError !== '' && <p className='account-error mb-0 text-danger'>{emailError}</p>}
          </div>
          <div className='mb-4'>
            <label htmlFor='password' className='form-label'>Password</label>
            <input value={password} onChange={e => setPassword(e.target.value)} type='password' className='form-control' id='password'/>
            {passwordError !== '' && <p className='account-error mb-0 text-danger'>{passwordError}</p>}
          </div>
          {!useLogInPage && <div className='mb-4'>
            <label htmlFor='password' className='form-label'>Confirm password</label>
            <input value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} type='password' className='form-control' id='password'/>
            {confirmPasswordError !== '' && <p className='account-error mb-0 text-danger'>{confirmPasswordError}</p>}
          </div>}
          <button onClick={isLoading ? () => {} : useLogInPage ? logIn : signUp} className='btn btn-primary'>
            {useLogInPage ? 'Log in' : 'Sign up'} {isLoading && <i className="fa-solid fa-rotate spin ms-2" />}
          </button>
        </div>
        <div className='d-flex align-items-center my-3'>
          <hr className='flex-grow-1 m-0'/>
          <p className='mx-3 my-0 lh-1 text-secondary'>or</p>
          <hr className='flex-grow-1 m-0'/>
        </div>
        <div className='d-flex justify-content-center'>
          <GoogleLogin
            onSuccess={() => {
              setAuthed(true);
            }}
            onError={() => {
            }}
          />
        </div>
      </div>
    </div>
    <p onClick={toggleLogInPage} className='text-center mt-3' style={{ cursor: 'pointer' }}>
      <a className='text-decoration-underline text-white'>
        {useLogInPage ? 'Sign up' : 'Log in'} instead
      </a>
    </p>
  </div>
}

export default Account;