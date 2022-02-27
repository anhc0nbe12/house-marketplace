import { useState, useEffect, useRef } from 'react'
import { useNavigate,useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import Spinner from '../components/layout/Spinner'
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage'
import { v4 as uuidv4 } from 'uuid'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { db } from '../firebase.config'
import { serverTimestamp, doc, updateDoc,getDoc } from 'firebase/firestore'

function EditListing() {
  const navigate = useNavigate()
  const isMounted = useRef(true)
  const params = useParams()
  const [loading, setLoading] = useState(false)
  const [listing, setListing] = useState(null)
  //eslint-disable-next-line
  const [enableGeocoding, setEnableGeocoding] = useState(false)

  const [formData, setFormData] = useState({
    bathrooms: 1,
    bedrooms: 1,
    discountedPrice: 0,
    furnished: false,
    latitude: 0,
    longitude: 0,
    images: {},
    location: '',
    name: '',
    offer: true,
    parking: false,
    regularPrice: 1,
    type: 'sale',
  })
  const auth = getAuth()
  useEffect(()=>{
   if( listing){
      if(auth.currentUser.uid !== listing.userRef){
         navigate('/')
         toast('you cant edit that listing')
      }
   }
  //eslint-disable-next-line
  },[listing,navigate])  
  useEffect(() => {
    setLoading(true)
    const getListing = async () => {
      const docRef = doc(db, 'listings', params.listingId)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        setListing(docSnap.data())
        setFormData(docSnap.data())
      }
      setLoading(false)
    }
    getListing()
  }, [params.listingId])
  useEffect(() => {
    if (isMounted) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setFormData({
            ...formData,
            userRef: user.uid,
          })
        } else {
          navigate('/sign-in')
        }
      })
    }
    return () => {
      isMounted.current = false
    }
  //eslint-disable-next-line
  }, [isMounted, navigate])
  const {
    bathrooms,
    bedrooms,
    discountedPrice,
    furnished,
    latitude,
    longitude,
    images,
    location,
    name,
    offer,
    parking,
    regularPrice,
    type,
  } = formData
  const onChangeValue = (e) => {
    let bool = null
    if (e.target.value === 'true') {
      bool = true
    }
    if (e.target.value === 'false') {
      bool = false
    }
    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        images: e.target.files,
      }))
    }
    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: bool ?? e.target.value,
      }))
    }
  }
  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    if (discountedPrice >= regularPrice) {
      setLoading(false)
      toast.error(' Discounted Price must be less than Regular Price')
      return
    }
    if (images.length > 6) {
      setLoading(false)
      toast.error('You can only push 6 images ')
      return
    }
    let geolocation = {}
    if (enableGeocoding) {
      /*const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=AIzaSyCrJF40qKROzycco-y9jWJXX7DnBTwKXZc`
      )
       const data = await response.json() */
    } else {
      geolocation.latitude = latitude
      geolocation.longitude = longitude
    }

    const uploadImages = async (image) => {
      return new Promise((resolve, reject) => {
        const storage = getStorage()
        const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`
        const storageRef = ref(storage, 'images/' + fileName)
        const uploadTask = uploadBytesResumable(storageRef, image)
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            console.log('Upload is ' + progress + '% done')
            switch (snapshot.state) {
              case 'paused':
                console.log('Upload is paused')
                break
              case 'running':
                console.log('Upload is running')
                break
              default:
                break
            }
          },
          (error) => {
            reject(error)
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL)
            })
          }
        )
      })
    }
    const imgUrls = await Promise.all(
      [...images].map((image) => uploadImages(image))
    ).catch(() => {
      setLoading(false)
      toast.error('error')
      return
    })
    const formDataCopy = {
      ...formData,
      imgUrls: imgUrls,
      geolocation,
      timestamp: serverTimestamp(),
    }
    delete formDataCopy.images

    if (!offer) {
      delete formDataCopy.discountedPrice
    }
    const docRef = doc(db, 'listings', params.listingId)
    await updateDoc(docRef, formDataCopy)

    toast.success('updated listing success')
    setLoading(false)
    navigate(`/category/${formDataCopy.type}/${docRef.id}`)
  }
  if (loading) {
    return <Spinner />
  }
  return (
    <div className="mt-5">
      <header className="text-center fs-2">Create new Listing</header>
      <main className="" role="main">
        <form className="form-group text-dark d-grid gap-2" onSubmit={onSubmit}>
          <div className="d-flex flex-column">
            <p className=" fs-5">Select Type</p>
            <div className="d-flex gap-2 justify-content-start align-items-center">
              <button
                className={
                  type === 'sale'
                    ? 'btn-success btn rounded-pill border shadow-none w-25'
                    : 'btn-light btn rounded-pill border shadow-none w-25'
                }
                type="button"
                value="sale"
                id="type"
                onClick={onChangeValue}
              >
                Sale
              </button>

              <button
                className={
                  type === 'rent'
                    ? 'btn-success btn rounded-pill border shadow-none w-25'
                    : 'btn-light btn rounded-pill border shadow-none w-25'
                }
                type="button"
                value="rent"
                id="type"
                onClick={onChangeValue}
              >
                Rent
              </button>
            </div>
          </div>
          <div className="py-2">
            <label htmlFor="name" className="d-block">
              Name
            </label>
            <input
              id="name"
              type="text"
              className="form-control rounded-pill shadow-none bg-light w-75"
              value={name}
              onChange={onChangeValue}
              required
            />
          </div>
          <div className="d-flex justify-content-start align-items-center gap-2">
            <div className="d-flex flex-column">
              <label htmlFor="bedrooms">bedrooms</label>
              <input
                className="bg-light rounded-pill shadow-none ps-2"
                type="number"
                value={bedrooms}
                min={1}
                max={20}
                onChange={onChangeValue}
                id="bedrooms"
                required
              />
            </div>
            <div className="d-flex flex-column">
              <label htmlFor="bathrooms">bathrooms</label>
              <input
                className="bg-light rounded-pill shadow-none ps-2"
                type="number"
                value={bathrooms}
                onChange={onChangeValue}
                id="bathrooms"
                min={1}
                max={20}
                required
              />
            </div>
          </div>
          <div className="d-flex flex-column">
            <p className=" fs-5">Parking Spot</p>
            <div className="d-flex gap-2 justify-content-start align-items-center">
              <button
                className={
                  parking === true
                    ? 'btn-success btn rounded-pill border shadow-none w-25'
                    : 'btn-light btn rounded-pill border shadow-none w-25'
                }
                type="button"
                value="true"
                id="parking"
                onClick={onChangeValue}
              >
                Yes
              </button>

              <button
                className={
                  parking === false
                    ? 'btn-success btn rounded-pill border shadow-none w-25'
                    : 'btn-light btn rounded-pill border shadow-none w-25'
                }
                type="button"
                value="false"
                id="parking"
                onClick={onChangeValue}
              >
                No
              </button>
            </div>
          </div>
          <div className="d-flex flex-column">
            <p className=" fs-5">Furnished</p>
            <div className="d-flex gap-2 justify-content-start align-items-center">
              <button
                className={
                  furnished === true
                    ? 'btn-success btn rounded-pill border shadow-none w-25'
                    : 'btn-light btn rounded-pill border shadow-none w-25'
                }
                type="button"
                value="true"
                id="furnished"
                onClick={onChangeValue}
              >
                Yes
              </button>

              <button
                className={
                  furnished === false
                    ? 'btn-success btn rounded-pill border shadow-none w-25'
                    : 'btn-light btn rounded-pill border shadow-none w-25'
                }
                type="button"
                value="false"
                id="furnished"
                onClick={onChangeValue}
              >
                No
              </button>
            </div>
          </div>
          <div className="py-2">
            <label htmlFor="name" className="d-block">
              Address
            </label>
            <textarea
              id="location"
              type="text"
              className="form-control rounded-pill shadow-none bg-light w-75"
              value={location}
              onChange={onChangeValue}
              required
            />
          </div>
          {!enableGeocoding && (
            <div className="d-flex justify-content-start align-items-center gap-2 ">
              <div className="d-flex flex-column">
                <label htmlFor="latitude">latitude</label>
                <input
                  className="bg-light rounded-pill shadow-none ps-2 w-50"
                  type="number"
                  value={latitude}
                  onChange={onChangeValue}
                  id="latitude"
                  required
                />
              </div>
              <div className="d-flex flex-column">
                <label htmlFor="longitude">longitude</label>
                <input
                  className="bg-light rounded-pill shadow-none ps-2 w-50"
                  type="number"
                  value={longitude}
                  onChange={onChangeValue}
                  id="longitude"
                  required
                />
              </div>
            </div>
          )}
          <div className="d-flex flex-column">
            <p className=" fs-5">Offer</p>
            <div className="d-flex gap-2 justify-content-start align-items-center">
              <button
                className={
                  offer === true
                    ? 'btn-success btn rounded-pill border shadow-none w-25'
                    : 'btn-light btn rounded-pill border shadow-none w-25'
                }
                type="button"
                value="true"
                id="offer"
                onClick={onChangeValue}
              >
                Yes
              </button>

              <button
                className={
                  offer === false
                    ? 'btn-success btn rounded-pill border shadow-none w-25'
                    : 'btn-light btn rounded-pill border shadow-none w-25'
                }
                type="button"
                value="false"
                id="offer"
                onClick={onChangeValue}
              >
                No
              </button>
            </div>
            <div className="d-flex flex-column py-2">
              <label htmlFor="regularPrice">Regular Price</label>
              <input
                className="bg-light rounded-pill shadow-none ps-2 w-25"
                type="number"
                value={regularPrice}
                min={1}
                max={5000000}
                onChange={onChangeValue}
                id="regularPrice"
                required
              />
            </div>
            {offer && (
              <div className="d-flex flex-column py-2">
                <label htmlFor="discountedPrice">Discounted Price</label>
                <input
                  className="bg-light rounded-pill shadow-none ps-2 w-25"
                  type="number"
                  value={discountedPrice}
                  min={0}
                  max={5000000}
                  onChange={onChangeValue}
                  id="discountedPrice"
                  required
                />
              </div>
            )}
          </div>
          <input
            type="file"
            className="form-control rounded-pill bg-light shadow-none w-75 py-2"
            multiple
            required
            accept=".jpg,.png,.jpge"
            onChange={onChangeValue}
            max={6}
          />
          <div className="d-flex justify-content-center py-2">
            <button
              type="submit"
              className=" btn btn-success rounded-pill py-2 w-25"
            >
              Submit
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}

export default EditListing
