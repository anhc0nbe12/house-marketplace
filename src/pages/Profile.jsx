import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getAuth, updateProfile } from 'firebase/auth'
import {
  updateDoc,
  doc,
  getDocs,
  collection,
  query,
  limit,
  orderBy,
  where,
  deleteDoc,
  startAfter,
} from 'firebase/firestore'
import { db } from '../firebase.config'
import Spinner from '../components/layout/Spinner'
import { ReactComponent as KeyboardArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg'
import ListingItem from '../components/ListingItem'
import { motion } from 'framer-motion'

function Profile() {
  const [change, setChange] = useState(false)
  const [loading, setLoading] = useState(true)
  const [listings, setListings] = useState(null)
  const [lastFetchListings, setLastFetchListings] = useState(null)
  const auth = getAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  })
  const { name, email } = formData

  useEffect(() => {
    const fetchUserListings = async () => {
      const docRef = collection(db, 'listings')
      const q = query(
        docRef,
        where('userRef', '==', auth.currentUser.uid),
        orderBy('timestamp', 'desc'),
        limit(2)
      )
      let docs = []
      const docSnap = await getDocs(q)
      const currentFetchListing = docSnap.docs[docSnap.docs.length - 1]
      setLastFetchListings(currentFetchListing)
      docSnap.forEach((doc) => {
        return docs.push({
          id: doc.id,
          data: doc.data(),
        })
      })
      setListings(docs)
      setLoading(false)
    }
    fetchUserListings()
  }, [auth.currentUser.uid])
  const onLoadMore = async () => {
    try{
      const docRef = collection(db, 'listings')
      const q = query(
        docRef,
        where('userRef', '==', auth.currentUser.uid),
        orderBy('timestamp', 'desc'),
        startAfter(lastFetchListings),
        limit(2)
      )
      let docs = []
      const docSnap = await getDocs(q)
      const currentFetchListing = docSnap.docs[docSnap.docs.length - 1]
      setLastFetchListings(currentFetchListing)
      docSnap.forEach((doc) => {
        return docs.push({
          id: doc.id,
          data: doc.data(),
        })
      })
      setListings((prevState) => [...prevState, ...docs])
      setLoading(false)
    } catch{
      toast.error('could not load listings')
    }
  }
  const Logout = () => {
    auth.signOut()
    navigate('/')
  }

  const onChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    })
  }
  const onSubmit = async (e) => {
    setLoading(true)
    e.preventDefault()
    try {
      if (auth.currentUser.displayName !== name) {
        await updateProfile(auth.currentUser, {
          displayName: name,
        })

        const userRef = doc(db, 'users', auth.currentUser.uid)
        await updateDoc(userRef, {
          name,
        })
      }
    } catch (error) {
      toast.error('some thing goes wrong, try again!')
    }
    setLoading(false)
  }
  const onDelete = async (id) => {
    if (window.confirm('are you sure')) {
      const docRef = doc(db, 'listings', id)
      await deleteDoc(docRef)
      const updatedListings = listings.filter((listing) => listing.id !== id)
      setListings(updatedListings)
      toast.success('successfully deleted listings')
    }
  }
  const onEdit = (listingId) =>{
    navigate(`/edit-listing/${listingId}`)
  }
  if (loading) {
    return <Spinner />
  }
  return (
    <div className="mt-5">
      <header className="text-center my-2 d-flex justify-content-between align-items-center">
        <h5 className="fs-5">My Profile</h5>
        <div>
          <button
            type="button"
            className="btn btn-info rounded-pill p-1 mx-1"
            onClick={() => setChange((prevState) => !prevState)}
          >
            Change
          </button>
          <button
            type="button"
            className="btn btn-success rounded-pill p-1 mx-1 "
            onClick={Logout}
          >
            Logout
          </button>
        </div>
      </header>
      <main
        className="d-flex flex-column my-2"
        role="main"
      >
        <form className="form-group w-100" onSubmit={onSubmit}>
          <input
            type="text"
            className="form-control shadow-none rounded-pill my-1 "
            value={name}
            id="name"
            onChange={onChange}
            disabled={change ? false : true}
          />
          <input
            type="email"
            className="form-control shadow-none rounded-pill my-1"
            value={email}
            id="email"
            onChange={onChange}
            disabled={change ? false : true}
          />
          <button
            type="submit"
            className="btn btn-outline-info rounded-pill my-1"
            disabled={change ? false : true}
          >
            Done
          </button>
        </form>
        <Link
          className="rounded bg-light text-dark text-decoration-none w-100"
          to="/create-listing"
        >
          <div className="d-flex justify-content-between align-items-center">
            <p className="fs-3 my-auto p-1">Create a new Listing</p>
            <KeyboardArrowRightIcon />
          </div>
        </Link>

        <div
          className={`mt-4 row justify-content-center  ${
            listings.length > 1 && 'row-cols-md-2'
          } `}
        >
          {listings.map(({ id, data }) => (
            <motion.div
              key={id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.5 }}
            >
              <ListingItem id={id} data={data} onDelete={onDelete} onEdit={() => onEdit(id)} key={id}/>
            </motion.div>
          ))}
        </div>
        {lastFetchListings && (
          <button
            className="btn btn-outline-info rounded-pill my-4 w-25 text-center align-self-center"
            onClick={onLoadMore}
          >
            Load More
        </button>
        )}
      </main>
    </div>
  )
}

export default Profile
