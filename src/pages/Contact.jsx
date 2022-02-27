import { useSearchParams, useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { db } from '../firebase.config'
import { toast } from 'react-toastify'
import { getDoc, doc } from 'firebase/firestore'
import Spinner from '../components/layout/Spinner'

function Contact() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState('')
  const params = useParams()
  const navigate = useNavigate()
  //eslint-disable-next-line
  const [searchParams, setSearchParams] = useSearchParams('')
  useEffect(() => {
    const fetchUser = async () => {
      const docRef = doc(db, 'users', params.landLordId)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        setUser(docSnap.data())
      }else{
        navigate('/')
        toast.error('Not found')
      }
    }
    fetchUser()
    setLoading(false)
  }, [params.landLordId, navigate])
  const onchange = (e) => {
    setMessage(e.target.value)
  }
  if (loading) {
    return <Spinner />
  }
  return (
    <main className="d-grid mt-5">
      <h3>Contact Landlord</h3>
      <p>Contact {user?.name}</p>
      <label htmlFor="message">Message</label>
      <textarea
        className="form-control shadow-none rounded-3"
        name="message"
        id="message"
        value={message}
        onChange={onchange}
        cols="30"
        rows="10"
      ></textarea>
      <a href={`mailto:${user?.email}?subject=${searchParams.get('listingName')}&body=${message}`} className='btn btn-success rounded-pill mt-2'>Send email</a>
    </main>
  )
}

export default Contact
