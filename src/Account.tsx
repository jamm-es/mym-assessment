import { useContext, useState } from "react";
import AuthedContext from "./AuthedContext";

function Account() {
  const { setAuthed } = useContext(AuthedContext);
  const [useLogInPage, setUseLogInPage] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const toggleLogInPage = () => {
    setUseLogInPage(prev => !prev);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  }

  const logIn = () => {
    setAuthed(true);
  }

  const signUp = () => {

  }

  const authWithGoogle = () => {

  }

  return <div className='account w-100'>
    <div className='card'>
      <div className='card-body'>
        <h5 className='card-title'>{useLogInPage ? 'Log in' : 'Sign up'}</h5>
        <div>
          <div className='mb-4'>
            <label htmlFor='email' className='form-label'>Email address</label>
            <input value={email} onChange={e => setEmail(e.target.value)} type='email' className='form-control' id='email'/>
          </div>
          <div className='mb-4'>
            <label htmlFor='password' className='form-label'>Password</label>
            <input value={password} onChange={e => setPassword(e.target.value)} type='password' className='form-control' id='password'/>
          </div>
          {!useLogInPage && <div className='mb-4'>
            <label htmlFor='password' className='form-label'>Confirm password</label>
            <input value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} type='password' className='form-control' id='password'/>
          </div>}
          <button onClick={useLogInPage ? logIn : signUp} className='btn btn-primary'>
            {useLogInPage ? 'Log in' : 'Sign up'}
          </button>
        </div>
        <div className='d-flex align-items-center my-3'>
          <hr className='flex-grow-1 m-0'/>
          <p className='mx-3 my-0 lh-1 text-secondary'>or</p>
          <hr className='flex-grow-1 m-0'/>
        </div>
        <div className='d-flex justify-content-center'>
          <button onClick={authWithGoogle} className='btn btn-outline-secondary'>
            <i className="fa-brands fa-google me-2"></i>{useLogInPage ? 'Log in' : 'Sign up'} with Google
          </button>
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