import {FcGoogle} from 'react-icons/fc'
import {useNavigate, useLocation} from 'react-router-dom'
import {toast} from 'react-toastify'
import {db} from '../firebase.config'
import {getAuth,GoogleAuthProvider,signInWithPopup } from 'firebase/auth'
import {doc, setDoc, getDoc, serverTimestamp} from 'firebase/firestore'

function Oath() {
   const navigate = useNavigate()
   const location = useLocation()
   const onClick = async () => {
      try {
         const auth = getAuth()
         const provider = new GoogleAuthProvider()
         const result = await signInWithPopup(auth, provider)
         const user = result.user

         const userRef = doc(db, 'users', user.uid)
         const docSnap = await getDoc(userRef)
         
         if(!docSnap.exists()){
            await setDoc(userRef, {
               name: user.displayName,
               email: user.email,
               timestamp: serverTimestamp()
            })
         }
         navigate('/')
      } catch (error) {
         toast.error('Something went wrong')
      }
   }
  return (
    <div className='text-center p-5 fs-1' >
       <p>Sign {location.pathname === '/sign-in' ? 'In': 'Up'}</p>
        <FcGoogle  onClick={onClick}/>
    </div>
  )
}

export default Oath
