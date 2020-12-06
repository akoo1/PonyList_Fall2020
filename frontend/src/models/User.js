
export class User {
  constructor(id, name, password, onCampus, dorm, rating, products, reviews) {
    this.id = id;
    this.name = name;
    this.password = password;
    this.onCampus = onCampus;
    this.dorm = dorm;
    this.rating = rating;
    this.products = products;  // Prodcut objects
    this.reviews = reviews;    // UserReview objects
  }
}

export class Product {
  constructor(id, name, description, price, imageName) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.imageName = imageName;
  }
}

export class UserReview {
	constructor(userName, rating, comment, date) {
		this.userName = userName;
		this.rating = rating;   // Rating component
		this.comment = comment;
		this.date = date; 
	}
}
