import React from 'react'
import Rating from './Rating'
import './ReviewForm.css'

class ReviewForm extends React.Component {

  state = {
    name: '',
    rating: '',
    comment: ''
  }

  stars = [1, 2, 3, 4, 5]

  handleFormSubmit = (event) => {
    event.preventDefault();
    this.props.addReviewHandler(this.state.comment, this.state.rating);
    // Clear input fields
    this.setState({ 
      name: '',
      rating: '',
      comment: ''
     });
  }


  render() {
    return (
      <div className="card">
        <div className="card-header text-white bg-secondary text-bold font-weight-bold">
          Add Seller Review
        </div>


        <form onSubmit={this.handleFormSubmit} className="add-review-form m-4">

          <div className="rating-box">

            <div className="form-group select-rating">
              <label htmlFor="rating">Rating</label>
              <select name="rating" id="rating" className="form-control"
                value={this.state.rating}
                onChange={event => this.setState({ rating: event.target.value })}  >
                <option value=""></option>
                {
                  this.stars.map((star, idx) => <option key={idx} value={star}>{star} stars</option>)
                }
              </select>
            </div>

            <Rating value={this.state.rating} class="stars-box" />
          </div>


          <div className="form-group">
            <label htmlFor="comment">Comment</label>
            <textarea name="comment" id="comment" cols="30" rows="6" className="form-control"
              value={this.state.comment}
              onChange={event => this.setState({ comment: event.target.value })} >
            </textarea>
          </div>

          <button type="submit" className="btn btn-primary">Submit</button>
        </form>

      </div>
    )
  }
}

export default ReviewForm
