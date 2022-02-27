import bedIcon from '../assets/svg/bedIcon.svg'
import bathtubIcon from '../assets/svg/bathtubIcon.svg'
import deleteIcon from '../assets/svg/deleteIcon.svg'
import { Link } from 'react-router-dom'
import editIcon from '../assets/svg/editIcon.svg'

function ListingItem({ id, data, onDelete, onEdit }) {
  const discountedPriceUSD = Number(data.discountedPrice).toLocaleString(
    'en-US',
    {
      style: 'currency',
      currency: 'USD',
    }
  )
  const regularPriceUSD = Number(data.regularPrice).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  })
  return (
    <div className="mb-2 position-relative ">
      <div className="row ">
        <div className="col-md-3 col-5 ">
          <Link to={`/category/${data.type}/${id}`}>
            <img
              src={data.imgUrls[0]}
              className="card-img-top listing-item-img"
              alt={data.name}
            />
          </Link>
        </div>
        <div className="col-md-9 col-7">
          <div className="card-body">
            <h5 className="card-title">{data.name}</h5>
            <p className="card-text">{data.location}</p>
            <small className="text-info">
              {data.offer
                ? data.type === 'rent'
                  ? discountedPriceUSD + ' / Month'
                  : regularPriceUSD
                : regularPriceUSD}
            </small>
            <div className="d-flex justify-content-around align-items-center">
              <div className="flex-md-row flex-column align-items-center justify-content-center gap-2">
                <div className="d-flex justify-content-center ">
                  <img
                    src={bathtubIcon}
                    alt="bathroom icon"
                    className="mx-auto "
                  />
                </div>
                <p className="fs-6">
                  {data.bathrooms > 1
                    ? `${data.bathrooms} Bathrooms`
                    : '1 Bathroom'}
                </p>
              </div>
              <div className="flex-md-row flex-column align-items-center justify-content-center   gap-2">
                <div className="d-flex justify-content-center ">
                  <img src={bedIcon} alt="bedroom icon" />
                </div>
                <p className="fs-6">
                  {data.bedrooms > 1
                    ? `${data.bedrooms} Bedrooms`
                    : '1 Bedroom'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {onEdit && (
        <div
          className="position-absolute translate-middle-x top-0 end-0 me-4"
          onClick={() => onEdit(id)}
        >
          <img src={editIcon} alt="edit Icon" />
        </div>
      )}  
      {onDelete && (
        <div
          className="position-absolute translate-middle-x top-0 end-0"
          onClick={() => onDelete(id)}
        >
          <img src={deleteIcon} alt="delete Icon" />
        </div>
      )}
      
    </div>
  )
}

export default ListingItem
