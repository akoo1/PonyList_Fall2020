import axios from 'axios';
import { API_URL } from '../../api_url';

export class ProductsRepository {
  url = `${API_URL}`;

  config = {};

  // GET methods

  getProducts() {
    return new Promise((resolve, reject) => {
      axios
        .get(`${this.url}/items`, this.config)
        .then(res => resolve(res.data))
        .catch(err => {
          alert(err);
          reject();
        });
    });
  }
  getProduct(itemId) {
    return new Promise((resolve, reject) => {
      axios
        .get(`${this.url}/item/${itemId}`, this.config)
        .then(res => resolve(res.data))
        .catch(err => {
          alert(err);
          reject();
        });
    });
  }
  getUser(userId) {
    return new Promise((resolve, reject) => {
      axios
        .get(`${this.url}/user/${userId}`, this.config)
        .then(res => resolve(res.data))
        .catch(err => {
          alert(err);
          reject();
        });
    });
  }
  getUsers() {
    return new Promise((resolve, reject) => {
      axios
        .get(`${this.url}/users`, this.config)
        .then(res => resolve(res.data))
        .catch(err => {
          alert(err);
          reject();
        });
    });
  }
  getSellerReviews(sellerId) {
    return new Promise((resolve, reject) => {
      axios
        .get(`${this.url}/reviews/${sellerId}`, this.config)
        .then(res => resolve(res.data))
        .catch(err => {
          alert(err);
          reject();
        });
    });
  }
  getSellerRating(sellerId) {
    return new Promise((resolve, reject) => {
      axios
        .get(`${this.url}/userRating/${sellerId}`, this.config)
        .then(res => resolve(res.data))
        .catch(err => {
          alert(err);
          reject();
        });
    });
  }
  getImages(itemId) {
    return new Promise((resolve, reject) => {
      axios
        .get(`${this.url}/images/${itemId}`, this.config)
        .then(res => resolve(res.data))
        .catch(err => {
          alert(err);
          reject();
        });
    });
  }
  getListings(userId) {
    return new Promise((resolve, reject) => {
      axios
        .get(`${this.url}/userItems/${userId}`, this.config)
        .then(res => resolve(res.data.filter(item => item.IsSold != 1)))
        .catch(err => {
          alert(err);
          reject();
        });
    });
  }
  getSoldItems(userId) {
    return new Promise((resolve, reject) => {
      axios
        .get(`${this.url}/userItems/${userId}`, this.config)
        .then(res => resolve(res.data.filter(item => item.IsSold == 1)))
        .catch(err => {
          alert(err);
          reject();
        });
    });
  }
  getListingsCount(userId) {
    return new Promise((resolve, reject) => {
      axios
        .get(`${this.url}/userItems/${userId}`, this.config)
        .then(res =>
          resolve(res.data.filter(item => item.IsSold != 1).length)
        )
        .catch(err => {
          alert(err);
          reject();
        });
    });
  }
  getSoldItemsCount(userId) {
    return new Promise((resolve, reject) => {
      axios
        .get(`${this.url}/userItems/${userId}`, this.config)
        .then(res =>
          resolve(res.data.filter(item => item.IsSold == 1).length)
        )
        .catch(err => {
          alert(err);
          reject();
        });
    });
  }
  getFavorites(userId) {
    return new Promise((resolve, reject) => {
      axios
        .get(`${this.url}/favorites/${userId}`, this.config)
        .then(res => resolve(res.data))
        .catch(err => {
          alert(err);
          reject();
        });
    });
  }

  // POST methods

  addReview(review) {
    return new Promise((resolve, reject) => {
      axios
        .post(`${this.url}/addReview`, review, this.config)
        .then(res => resolve(res.data))
        .catch(err => {
          alert(err);
          reject();
        });
    });
  }
  addFavoriteItem(item) {
    return new Promise((resolve, reject) => {
      axios
        .post(`${this.url}/addFavorite`, item, this.config)
        .then(res => resolve(res.data))
        .catch(err => {
          alert(err);
          reject();
        });
    });
  }

  editListing(
    sellerId,
    updateItemName,
    updateItemPrice,
    updateItemDetails,
    updateCondition,
    updateItemImage,
    updateItemId
  ) {
    return new Promise((resolve, reject) => {
      axios
        .put(
          `${this.url}/updateItem`,
          {
            SellerID: sellerId,
            ItemName: updateItemName,
            ItemCost: updateItemPrice,
            ItemDetails: updateItemDetails,
            Condition: updateCondition,
            ImageURL: updateItemImage,
            ItemID: updateItemId,
          },
          this.config
        )
        .then(res => resolve(res.data))
        .catch(err => {
          alert(err);
          reject();
        });
    });
  }

  delete(itemId) {
    return new Promise((resolve, reject) => {
      axios
        .delete(`${this.url}/deleteItem/${itemId}`, this.config)
        .then(res => resolve(res.data))
        .catch(err => {
          alert(err);
          reject();
        });
    });
  }

  sellItem(userId, itemId) {
    axios.patch(`${this.url}/addSale/${userId}`).then(res => {
      axios.patch(`${this.url}/updateIsSold/${itemId}`);
    });
  }
}
