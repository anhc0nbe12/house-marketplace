import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import PrivateRoute from './components/PrivateRoute'
import Explore from './pages/Explore'
import Offers from './pages/Offers'
import Profile from './pages/Profile'
import ForgotPassword from './pages/ForgotPassword'
import Signin from './pages/Signin'
import Signup from './pages/Signup'
import Category from './pages/Category'
import CreateListing from './pages/CreateListing'
import Listing from './pages/Listing'
import Contact from './pages/Contact'
import EditListing from './pages/EditListing'

import Navbar from './components/layout/Navbar'
function App() {
  return (
    <>
      <Router>
        <div className="d-flex flex-column justify-content-between vh-100 container-md">
          <Routes>
            <Route path="/" element={<Explore />}/>
            <Route path="/offers" element={<Offers />}/>
            <Route path='/profile' element={<PrivateRoute />}>
              <Route path="/profile" element={<Profile />}/>
            </Route>
            <Route path='/create-listing' element={<CreateListing />} />
            <Route path='/edit-listing/:listingId' element={<EditListing />} />
            <Route path='/contact/:landLordId' element={< Contact />} />
            <Route path='/category/:CategoryType/:listingId' element={<Listing/>}/>
            <Route path='/category/:CategoryType' element={<Category/>}/>
            <Route path="/forgot-password" element={<ForgotPassword />}/>
            <Route path="/sign-up" element={<Signup />}/>
            <Route path="/sign-in" element={<Signin />}/>
          </Routes>
          <Navbar />
        </div>
      </Router>
      <ToastContainer />
    </>
  )
}

export default App

