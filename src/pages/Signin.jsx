import { ReactComponent as KeyboardArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg'
import { ReactComponent as VisibilityIcon } from '../assets/svg/visibilityIcon.svg'
import Oath from '../components/Oath'
import { toast } from 'react-toastify'
import { useState } from 'react'
import { FaUserAlt,FaLock } from 'react-icons/fa'
import { Link,useNavigate } from 'react-router-dom'

import {getAuth, signInWithEmailAndPassword} from 'firebase/auth'
function Signin() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const { email, password } = formData
  const onChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    })
  }
  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      const auth = getAuth()
      const userCredential = await signInWithEmailAndPassword(auth, email, password)

      if(userCredential.user){
        navigate('/')
      }
    } catch (error) {
      toast.error('Username or password is wrong')
    }
  }
  return (
    <div className='mt-5'>
      <header className="fs-3 text-center">
        <div className="pt-5 ">Welcome Back</div>
      </header>
      <main className="d-flex justify-content-center align-items-center">
        <form className="form-group w-100" onSubmit={onSubmit}>
          <div className="d-flex position-relative my-2">
            <span className="position-absolute top-50 start-0 translate-middle ms-4 fs-5">
              <FaUserAlt />
            </span>
            <input
              type="email"
              id="email"
              className="form-control shadow-none rounded-pill px-5"
              placeholder="Email"
              value={email}
              onChange={onChange}
            />
          </div>

          <div className="d-flex position-relative my-2">
            <span className="position-absolute top-50 start-0 translate-middle ms-4 fs-5">
              <FaLock />
            </span>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              className="form-control shadow-none rounded-pill px-5"
              placeholder="Password"
              value={password}
              onChange={onChange}
            />
            <span
              className="position-absolute top-50 end-0 translate-middle"
              onClick={() => setShowPassword((prevState) => !prevState)}
            >
              <VisibilityIcon />
            </span>
          </div>
          <div className="d-flex justify-content-end">
            <Link
              to={'/forgot-password'}
              className="text-success text-decoration-none"
            >
              {' '}
              forgot password?{' '}
            </Link>
          </div>
          <div className="d-flex justify-content-between align-items-center">
            <p className="my-auto ms-2">Sign In</p>
            <button className="btn btn-success rounded-pill px-5" type='submit'>
              <KeyboardArrowRightIcon />
            </button>
          </div>
          <Oath />
          <div className="text-center my-1">
            <small>
              Or Sign up for free
              <Link to={'/sign-up'} className="text-info text-decoration-none">
                {' '}
                Sign Up{' '}
              </Link>
            </small>
          </div>
        </form>
      </main>
    </div>
  )
}

export default Signin
