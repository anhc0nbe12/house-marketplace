import rentCategoryImage from '../assets/jpg/rentCategoryImage.jpg'
import sellCategoryImage from '../assets/jpg/sellCategoryImage.jpg'
import { Link } from 'react-router-dom'
import Slider from '../components/Slider'
function Explore() {

  return (
    <div className='mt-5'>
      <header className="text-center">
        <Slider />
      </header>
      <main className="row pt-3 row-cols-2">
        <div className="position-relative my-2">
          <Link to="category/sale">
            <img
              src={sellCategoryImage}
              alt=""
              className="w-100 mx-auto d-block category-img"
            />
            <p className="fs-4 position-absolute translate-middle bottom-0 start-50 text-info ">
              Sale House
            </p>
          </Link>
        </div>
        <div className="position-relative my-2">
          <Link to="category/rent">
            <img
              src={rentCategoryImage}
              alt=""
              className=" w-100 mx-auto d-block category-img"
            />
            <p className="fs-4 position-absolute translate-middle bottom-0 start-50 text-info">
              Rent House
            </p>
          </Link>
        </div>
      </main>
    </div>
  )
}

export default Explore
