import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { db } from '../firebase.config'
import { getDoc, doc } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import Spinner from '../components/layout/Spinner'
import shareIcon from '../assets/svg/shareIcon.svg'

import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import SwiperCore, {Pagination, Scrollbar, A11y, Navigation} from 'swiper'
import {Swiper, SwiperSlide} from 'swiper/react'
import 'swiper/swiper-bundle.css'
SwiperCore.use([Navigation,Scrollbar,Pagination,A11y])

function Listing() {
  const params = useParams()
  const [loading, setLoading] = useState(true)
  const [listing, setListing] = useState({})
  const auth = getAuth()
  useEffect(() => {
    const fetchListing = async () => {
      const docRef = doc(db, 'listings', params.listingId)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        setListing(docSnap.data())
        setLoading(false)
      }
    }
    fetchListing()
  }, [params.listingId])

  const discountedPriceUSD = Number(listing.discountedPrice).toLocaleString(
    'en-US',
    {
      style: 'currency',
      currency: 'USD',
    }
  )
  const regularPriceUSD = Number(listing.regularPrice).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  })
  if (loading) {
    return <Spinner />
  }
  return (
    <div className='mt-5'>
      <main className="">
        <Swiper pagination={{clickable:true}} slidesPerView={1} >
          {listing.imgUrls.map((url, index) => (
            <SwiperSlide key={index} >
              <div style={{background: `url(${listing.imgUrls[index]}) center no-repeat`,backgroundSize:'cover',width:'100%', height:'45vh' }} >
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="d-grid ">
          <p className="text-primary fs-4">
            {listing.name} -{' '}
            {listing.offer ? discountedPriceUSD : regularPriceUSD}
          </p>
          <p className="text-dark-50">{listing.location}</p>
          <div className="d-flex justify-content-start gap-4">
            <p className="badge bg-success rounded-pill">
              For {listing.type === 'rent' ? 'Rent' : 'Sale'}
            </p>
            {listing.offer && (
              <p className="badge rounded-pill bg-primary text-white">
                ${listing.regularPrice - listing.discountedPrice} discount
              </p>
            )}
          </div>

          <p>
            {listing.bathrooms > 1
              ? `${listing.bathrooms} bathrooms`
              : `${listing.bathrooms} bathroom`}
          </p>
          <p>
            {listing.bedrooms > 1
              ? `${listing.bedrooms} bedrooms`
              : `${listing.bedrooms} bedroom`}
          </p>
          {listing.parking && <p> Parking Spot </p>}
        </div>
        <p className="text-primary fs-4">Location </p>
        <div className='w-100 ' style={{height:'50vh'}}>
        <MapContainer
          center={[
            Number(listing.geolocation.latitude),
            Number(listing.geolocation.longitude),
          ]}
          zoom={13}
          scrollWheelZoom={false}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker
            position={[
              Number(listing.geolocation.latitude),
              Number(listing.geolocation.longitude),
            ]}
          >
            <Popup>{listing.location}</Popup>
          </Marker>
        </MapContainer>
        </div>
        
        {listing.userRef !== auth.currentUser?.uid && (
          <div className="d-flex justify-content-center my-4">
            <Link
              to={`/contact/${listing.userRef}?listingName=${listing.name}`}
              className="btn btn-success rounded-pill"
            >
              Contact Landlord
            </Link>
          </div>
        )}

        <button
          className="position-fixed top-0 end-0 translate-middle-x mt-4 btn btn-outline-none shadow-none"
          onClick={() => {
            navigator.clipboard.writeText(window.location.href)
          }}
        >
          <img src={shareIcon} alt="" className="rounded-circle bg-light p-2" />
        </button>
      </main>
    </div>
  )
}

export default Listing
