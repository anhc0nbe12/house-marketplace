import { getAuth, sendPasswordResetEmail} from 'firebase/auth'
import {toast} from 'react-toastify'
import {useState} from 'react'
import {Link} from 'react-router-dom'
import { ReactComponent as KeyboardArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg'


function ForgotPassword() {
  const [email, setEmail] = useState('')
  const onChange = (e) => setEmail(e.target.value)
  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      const auth = getAuth()
      await sendPasswordResetEmail(auth, email)
      toast.success('Email was sent')
    } catch (error) {
      toast.error('Something goes wrong')
    }
  }
   return (
     <div className='mt-5'>
       <header className='text-center'>
          <h4 className='fs-5'>Reset Password</h4>
       </header>
       <main className='d-flex justify-content-center align-items-center flex-column'>
         <form className='form-group w-100 position-relative' onSubmit={onSubmit}>
          <input type="email" className='form-control rounded-pill shadow-none py-4' placeholder='Enter your email' onChange={onChange} value={email}/>
          <button type='submit' className='rounded-pill btn btn-success position-absolute top-50 end-0 translate-middle-y my-auto py-1 me-2'>
            <KeyboardArrowRightIcon/>
          </button>
         </form>
         <div className="text-center my-1">
            <small>
              Switch to Login
              <Link to={'/sign-in'} className="text-info text-decoration-none">
                {' '}
                Sign In{' '}
              </Link>
            </small>
          </div>
       </main>
     </div>
   )
 }
 
 export default ForgotPassword
 