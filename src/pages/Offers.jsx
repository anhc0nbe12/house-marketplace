import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { db } from '../firebase.config'
import Spinner from '../components/layout/Spinner'
import {
  getDocs,
  collection,
  query,
  where,
  orderBy,
  limit,
  startAfter,
} from 'firebase/firestore'
import ListingItem from '../components/ListingItem'
import { toast } from 'react-toastify'

function Offers() {
  const params = useParams()
  const [lastFetchListings, setLastFetchListings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [listings, setListings] = useState(null)
  useEffect(() => {
    const getData = async () => {
      const collect = collection(db, 'listings')
      const q = query(
        collect,
        where('offer', '==', true),
        orderBy('timestamp', 'desc'),
        limit(2)
      )
      let docs = []
      const docSnap = await getDocs(q)
      const currentFetchListings = docSnap.docs[docSnap.docs.length - 1]
      setLastFetchListings(currentFetchListings)
      docSnap.forEach((doc) => {
        return docs.push({
          id: doc.id,
          data: doc.data(),
        })
      })
      setListings(docs)
      setLoading(false)
    }
    getData()
  }, [params.CategoryType])
  const onLoadMore = async () => {
    try {
      const collect = collection(db, 'listings')
      const q = query(
        collect,
        where('offer', '==', true),
        orderBy('timestamp', 'desc'),
        startAfter(lastFetchListings),
        limit(2)
      )
      let docs = []
      const docSnap = await getDocs(q)
      const currentFetchListings = docSnap.docs[docSnap.docs.length - 1]
      setLastFetchListings(currentFetchListings)
      docSnap.forEach((doc) => {
        return docs.push({
          id: doc.id,
          data: doc.data(),
        })
      })
      setListings((prevState) => [...prevState , ...docs])
      setLoading(false)
    } catch {
      toast.error('could not load more listings')
    }
  }
  return (
    <div className="mt-5">
      <header className="my-2 d-flex justify-content-center align-items-center">
        <h3 className="text-center"> Offers </h3>
      </header>
      <main className="d-flex flex-column" role="main">
        {loading ? (
          <Spinner />
        ) : listings && listings.length > 0 ? (
          <>
            <div className="row row-cols-lg-2 justify-content-evenly">
              {listings.map((list) => (
                <ListingItem key={list.id} id={list.id} data={list.data} />
              ))}
            </div>
            {lastFetchListings && (
              <div
                className="btn btn-outline-info rounded-pill my-4 w-50 align-self-center"
                onClick={onLoadMore}
              >
                Load More
              </div>
            )}
          </>
        ) : (
          <>there are no offers</>
        )}
      </main>
    </div>
  )
}

export default Offers
