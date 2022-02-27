function Spinner() {
  return (
    <div className="mw-100">
      <span className="invisible"></span>
      <div className="text-center p-2 position-fixed top-50 start-50 ">
        <div className="spinner-border text-dark" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    </div>
  )
}

export default Spinner
