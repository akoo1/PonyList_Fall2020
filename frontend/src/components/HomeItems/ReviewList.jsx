import React from 'react'
import Rating from './Rating'

class ReviewList extends React.Component {

  dynamicDisplayReminder = () => {
    if (this.props.reviews.length > 0) {
      return {
        display: 'none'
      }
    }
  }

  render() {

    return (
      <div>
        <h3>Seller Reviews <span className="text-secondary">({ this.props.reviews.length })</span></h3>
        <p className="add-review-reminder" style={this.dynamicDisplayReminder()}>Be the first to add a review!</p>
        {
          this.props.reviews.map((review, idx) =>
            <article key={idx} className="card mb-4">
              <div className="card-header">
                <Rating value={ review.Rating } class="stars-box" />
              </div>
              <div className="card-body">
                <p className="text-secondary">{ review.Username }
                  <span className="float-right">{ new Date(review.Date).getFullYear() }-{ new Date(review.Date).getMonth() + 1 }-{ new Date(review.Date).getDate() }</span>
                </p>
                <p>"{ review.ReviewText }"</p>
              </div>
            </article>)
        }
      </div>
    )

  }
}

export default ReviewList
