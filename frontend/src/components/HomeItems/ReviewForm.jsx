import React, { useState } from 'react'
import Rating from './Rating'
import './ReviewForm.css'


const ReviewForm = (props) => {

  const [rating, setRating] = useState('')
  const [comment, setComment] = useState('')

  const stars = [1, 2, 3, 4, 5]


  const formSubmitHandler = (event) => {
    event.preventDefault();
    props.addReviewHandler(comment, rating)
    // Clear input fields
    setRating('')
    setComment('')
  }


  return (
    <div className="card">
      <div className="card-header text-white bg-secondary text-bold font-weight-bold">
        Add Seller Review
      </div>


      <form onSubmit={formSubmitHandler} className="add-review-form m-4">

        <div className="rating-box">

          <div className="form-group select-rating">
            <label htmlFor="rating">Rating</label>
            <select name="rating" id="rating" className="form-control"
              value={rating}
              onChange={event => setRating(event.target.value)}>
              <option value=""></option>
              {
                stars.map((star, idx) => <option key={idx} value={star}>{star} stars</option>)
              }
            </select>
          </div>

          <Rating value={rating} class="stars-box" />
        </div>


        <div className="form-group">
          <label htmlFor="comment">Comment</label>
          <textarea name="comment" id="comment" cols="30" rows="6" className="form-control"
            value={comment}
            onChange={event => setComment(event.target.value)}>
          </textarea>
        </div>

        <button type="submit" className="btn btn-primary">Submit</button>
      </form>

    </div>
  )

}

export default ReviewForm;
