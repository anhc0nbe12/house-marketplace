import {db} from '../firebase.config'
import {getDocs, collection, limit, orderBy, query} from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import SwiperCore, {Pagination, Scrollbar, A11y, Navigation} from 'swiper'
import {Swiper, SwiperSlide} from 'swiper/react'
import 'swiper/swiper-bundle.css'
import Spinner from './layout/Spinner'
SwiperCore.use([Pagination, Scrollbar, A11y, Navigation])

function Slider() {
   const navigate= useNavigate()
   const [loading, setLoading] = useState(true)
   const [listings, setListings] = useState(null)
   useEffect(()=>{
     const fetchListings = async () =>{
       const q = query(collection(db,'listings'),orderBy('timestamp','desc'), limit(5))
       const docSnap = await getDocs(q)
       let docs = []
       docSnap.forEach((doc) => {
         return docs.push({
            data:doc.data(),
            id: doc.id
         })
       })
       setListings(docs)
       setLoading(false)
     }
     fetchListings()
   },[])
   if (loading){
      return <Spinner />
   }
  return (
    <Swiper pagination={{clickable:true}} slidesPerView={1}>
      {listings.map(({id, data}) => (
         <SwiperSlide key={id} onClick={() => navigate(`/category/${data.type}/${id}`)}>
            <div style={{background:`url(${data.imgUrls[0]}) center no-repeat`, backgroundSize: 'cover', width:'100%',height:'40vh'}}>
            </div>
         </SwiperSlide>
      ))}
    </Swiper>
  )
}

export default Slider
