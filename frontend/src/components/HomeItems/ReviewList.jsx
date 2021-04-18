import React from 'react'
import Rating from './Rating'

const ReviewList = (props) => {

  let reviews = (
    props.reviews.map((review, idx) =>
      <article key={idx} className="card mb-4">
        <div className="card-header">
          <Rating value={review.Rating} class="stars-box" />
        </div>
        <div className="card-body">
          <p className="text-secondary">{review.Username}
            <span className="float-right">{new Date(review.Date).getFullYear()}-{new Date(review.Date).getMonth() + 1}-{new Date(review.Date).getDate()}</span>
          </p>
          <p>"{review.ReviewText}"</p>
        </div>
      </article>)
  )

  return (
    <div>
      <h3>Seller Reviews <span className="text-secondary">({props.reviews.length})</span></h3>
      {
        reviews.length > 0 
        ? reviews
        : <p className="add-review-reminder">Be the first to add a review!</p>
      }
    </div>
  )
}


export default ReviewList
