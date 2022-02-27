import { ReactComponent as ExploreIcon } from '../../assets/svg/exploreIcon.svg'
import { ReactComponent as OfferIcon } from '../../assets/svg/localOfferIcon.svg'
import { ReactComponent as PersonOutlineIcon } from '../../assets/svg/personOutlineIcon.svg'
import { useNavigate, useLocation } from 'react-router-dom'

function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()

  const pathMatchRoute = (route) => {
    if (route === location.pathname) {
      return true
    }
  }
  return (
    <footer>
      <div className="d-flex justify-content-evenly">
        <div
          className="d-flex flex-column justify-content-center align-items-center"
          onClick={() => navigate('/')}
        >
          <ExploreIcon
            fill={pathMatchRoute('/') ? '#2c2c2c' : '#8f8f8f'}
            width="36px"
            height="36px"
          />
          <p className={pathMatchRoute('/') ? 'p-active' : 'p-rmv-active'}>
            Explore
          </p>
        </div>
        <div
          className="d-flex flex-column justify-content-center align-items-center"
          onClick={() => navigate('/offers')}
        >
          <OfferIcon
            fill={pathMatchRoute('/offers') ? '#2c2c2c' : '#8f8f8f'}
            width="36px"
            height="36px"
          />
          <p
            className={pathMatchRoute('/offers') ? 'p-active' : 'p-rmv-active'}
          >
            Offer
          </p>
        </div>
        <div
          className="d-flex flex-column justify-content-center align-items-center"
          onClick={() => navigate('/profile')}
        >
          <PersonOutlineIcon
            fill={pathMatchRoute('/profile') ? '#2c2c2c' : '#8f8f8f'}
            width="36px"
            height="36px"
          />
          <p
            className={pathMatchRoute('/profile') ? 'p-active' : 'p-rmv-active'}
          >
            Profile
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Navbar
