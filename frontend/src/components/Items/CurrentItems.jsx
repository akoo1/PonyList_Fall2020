import React, { useEffect, useState } from 'react';
import { AreYouSure } from '../layout/AreYouSure';
import { Link, useParams } from 'react-router-dom';
import Loader from '../layout/Loader';
import './CurrentItems.css';
import OkayAlert from '../layout/OkayAlert';
import axios from 'axios';
import { ProductsRepository } from '../api/ProductsRepository';
import { API_URL } from '../../api_url';

export class CurrentItems extends React.Component {
    state = {
        userId: this.props.id,
        items: [],
        loading: true,
        deletingItemId: null,
        updateItemId: null,
        okayPopup: false,
        okayMessage: '',
        updateItemImage: '',
        updateItemName: '',
        updateItemDetails: '',
        updateCondition: '',
        updateItemPrice: null,
        searchQuery: '',
    };

    productsRepository = new ProductsRepository();

    handleCancelEdit() {
        this.setState({
            updateItemId: null,
            updateItemImage: '',
            updateItemName: '',
            updateItemDetails: '',
            updateCondition: '',
            updateItemPrice: null,
        });
    }

    handleOkayClicked() {
        this.setState({
            okayPopup: false,
            okayMessage: '',
        });
    }

    handleConfirmEdit() {
        this.productsRepository
            .editListing(
                this.state.id,
                this.state.updateItemName,
                this.state.updateItemPrice,
                this.state.updateItemDetails,
                this.state.updateCondition,
                this.state.updateItemImage,
                this.state.updateItemId
            )
            .then(() => {
                this.setState({
                    updateItemId: null,
                    updateItemImage: '',
                    updateItemName: '',
                    updateItemDetails: '',
                    updateCondition: '',
                    updateItemPrice: null,
                    okayPopup: true,
                    okayMessage: 'Item Updated!',
                });
                this.productsRepository
                    .getListings(this.props.id)
                    .then(products => this.setState({ items: products }));
            });
    }

    handleSell(itemId) {
        this.productsRepository.sellItem(itemId);
        axios
            .patch(`${API_URL}/addSale/${window.localStorage.getItem('id')}`)
            .then(res => {
                axios.patch(`${API_URL}/updateIsSold/${itemId}`);
            })
            .then(() => {
                this.setState({
                    okayPopup: true,
                    okayMessage: 'Item has been sold!',
                });
            })
            .then(() => {
                this.productsRepository
                    .getListings(this.props.id)
                    .then(products => this.setState({ items: products }));
            });
    }

    handleEdit(itemId) {
        this.setState({ updateItemId: itemId });
        this.productsRepository.getProduct(itemId).then(item =>
            this.setState({
                updateItemImage: item[0].ImageURL,
                updateItemName: item[0].ItemName,
                updateItemPrice: item[0].ItemCost,
                updateItemDetails: item[0].ItemDetails,
                updateCondition: item[0].Condition,
            })
        );
    }

    handleDelete(itemId) {
        this.setState({
            deletingItemId: itemId,
        });
    }

    deleteItem(confirmed) {
        if (confirmed && this.state.deletingItemId) {
            this.productsRepository
                .delete(this.state.deletingItemId)
                .then(() => {
                    this.setState({
                        okayPopup: true,
                        okayMessage: 'Item deleted!',
                        deletingItemId: null,
                    });
                    this.productsRepository
                        .getListings(this.props.id)
                        .then(products => this.setState({ items: products }));
                });
        } else {
            this.setState({
                deletingItemId: null,
            });
        }
    }

    searchItem(input) {
        this.productsRepository.getListings(this.props.id).then(items => {
            this.setState({ items });
            let filtered_products = this.state.items.filter(item =>
                item.ItemName.toLowerCase()
                    .replace(/\s+/g, '')
                    .includes(input.toLowerCase().replace(/\s+/g, ''))
            );
            if (filtered_products.length > 0) {
                this.setState({ items: filtered_products });
            } else {
                this.setState({ items: [] });
            }
        });
    }

    render() {
        if (typeof this.state.items == 'undefined') {
            return <div>Loading Home...</div>;
        }

        return (
            <>
                {this.state.okayPopup && (
                    <OkayAlert
                        clicked={click => this.handleOkayClicked()}
                        message={this.state.okayMessage}
                    />
                )}
                <div className='container mt-4'>
                    {this.state.deletingItemId && (
                        <AreYouSure
                            message='Are you sure you want to delete this item?'
                            theyAreSure={response => this.deleteItem(response)}
                        />
                    )}
                    {this.loading ? (
                        <Loader />
                    ) : (
                        <>
                            <div className='d-flex my-5'>
                                {this.state.userId ==
                                    parseInt(
                                        window.localStorage.getItem('id')
                                    ) && (
                                    <Link
                                        className='mx-4 px-4 w-50 btn btn-primary'
                                        to={`/sellItems/${this.state.id}`}
                                    >
                                        {' '}
                                        Creat a new listing!{' '}
                                    </Link>
                                )}
                                <input
                                    id='searchQuery'
                                    placeholder='Find An Item by Name...'
                                    className='form-control'
                                    type='text'
                                    onChange={event =>
                                        this.setState({
                                            searchQuery: event.target.value,
                                        })
                                    }
                                />
                                <button
                                    onClick={() =>
                                        this.searchItem(this.state.searchQuery)
                                    }
                                    className='mx-4 px-4 btn btn-warning'
                                >
                                    <i className='fas fa-search'></i>
                                </button>
                            </div>

                            {this.state.items.length === 0 && (
                                <h2 className='display-3 mt-5 text-center'>
                                    No items to show...
                                </h2>
                            )}
                            <ul className='list-group'>
                                {this.state.updateItemId
                                    ? this.state.items
                                          .filter(
                                              item =>
                                                  item.ItemID ===
                                                  this.state.updateItemId
                                          )
                                          .map(item => (
                                              <form
                                                  className='list-group-item d-flex row'
                                                  key={item.itemID}
                                              >
                                                  <div className='d-flex flex-column col-5 p-0'>
                                                      <input
                                                          className='h5 p-0 w-100'
                                                          type='text'
                                                          onChange={e =>
                                                              this.setState({
                                                                  updateItemName:
                                                                      e.target
                                                                          .value,
                                                              })
                                                          }
                                                          value={
                                                              this.state
                                                                  .updateItemName
                                                          }
                                                      />
                                                      <img
                                                          style={{
                                                              width: '100px',
                                                              height: '100px',
                                                          }}
                                                          src={
                                                              this.state
                                                                  .updateItemImage
                                                          }
                                                          alt={
                                                              this.state
                                                                  .updateItemName
                                                          }
                                                      />
                                                      <h6 className='mt-4'>
                                                          New Image Url:
                                                      </h6>
                                                      <input
                                                          onChange={e =>
                                                              this.setState({
                                                                  updateItemImage:
                                                                      e.target
                                                                          .value,
                                                              })
                                                          }
                                                          type='text'
                                                          value={
                                                              this.state
                                                                  .updateItemImage
                                                          }
                                                      />
                                                  </div>
                                                  <div className='col-7'>
                                                      $
                                                      <input
                                                          type='number'
                                                          pattern='(^\d+(\.|\,)\d{2}$)'
                                                          value={`${this.state.updateItemPrice}`}
                                                          onChange={e =>
                                                              this.setState({
                                                                  updateItemPrice:
                                                                      e.target
                                                                          .value,
                                                              })
                                                          }
                                                          className='Edit-Price bg-primary rounded text-center w-50'
                                                      />
                                                      <select
                                                          value={
                                                              this.state
                                                                  .updateCondition
                                                          }
                                                          onChange={e =>
                                                              this.setState({
                                                                  updateCondition:
                                                                      e.target
                                                                          .value,
                                                              })
                                                          }
                                                          name='condition'
                                                          id='condition'
                                                      >
                                                          <option value='Used'>
                                                              Used
                                                          </option>
                                                          <option value='New'>
                                                              New
                                                          </option>
                                                      </select>
                                                      <textarea
                                                          value={
                                                              this.state
                                                                  .updateItemDetails
                                                          }
                                                          onChange={e =>
                                                              this.setState({
                                                                  updateItemDetails:
                                                                      e.target
                                                                          .value,
                                                              })
                                                          }
                                                          className='CurrentItems-Description mt-4 h-50 w-100'
                                                      >
                                                          {item.ItemDetails}
                                                      </textarea>
                                                  </div>
                                              </form>
                                          ))
                                    : this.state.items.map(item => {
                                          return (
                                              <li
                                                  className='list-group-item d-flex row'
                                                  key={item.itemID}
                                              >
                                                  <div className='d-flex flex-column col-5'>
                                                      <Link
                                                          style={{
                                                              color: 'black',
                                                          }}
                                                          to={`/products/${item.ItemID}`}
                                                      >
                                                          <h4>
                                                              {item.ItemName}
                                                          </h4>
                                                      </Link>
                                                      <img
                                                          style={{
                                                              width: '100px',
                                                              height: '100px',
                                                          }}
                                                          src={item.ImageURL}
                                                          alt={item.ItemName}
                                                      />
                                                  </div>
                                                  <div className='col-5'>
                                                      <span className='CurrentItems-Price badge badge-primary p-2'>
                                                          ${item.ItemCost}
                                                      </span>
                                                      <p className='CurrentItems-Description mt-4'>
                                                          {item.ItemDetails}
                                                      </p>
                                                  </div>
                                                  <div className='col-2 d-flex justify-content-center align-items-center'>
                                                      {window.localStorage.getItem(
                                                          'id'
                                                      ) ==
                                                          this.state.userId && (
                                                          <>
                                                              <button
                                                                  onClick={e => {
                                                                      this.handleEdit(
                                                                          item.ItemID
                                                                      );
                                                                  }}
                                                                  className='mx-1'
                                                              >
                                                                  <i className='mx-2 fas fa-pencil-alt'></i>
                                                              </button>
                                                              <button
                                                                  onClick={e => {
                                                                      this.handleDelete(
                                                                          item.ItemID
                                                                      );
                                                                  }}
                                                                  className='mx-1'
                                                              >
                                                                  <i className='mx-2 fas fa-trash-alt'></i>
                                                              </button>
                                                          </>
                                                      )}
                                                  </div>

                                                  {window.localStorage.getItem(
                                                      'id'
                                                  ) == this.state.userId && (
                                                      <div className='mx-auto'>
                                                          <button
                                                              onClick={e => {
                                                                  this.handleSell(
                                                                      item.ItemID
                                                                  );
                                                              }}
                                                              className='mx-2 my-3 btn btn-primary'
                                                          >
                                                              Mark Item as Sold
                                                          </button>

                                                          <Link
                                                              className='btn btn-primary mx-2'
                                                              to={`/favorites/${item.ItemID}`}
                                                          >
                                                              See Interested
                                                              Buyers
                                                          </Link>
                                                      </div>
                                                  )}
                                              </li>
                                          );
                                      })}
                            </ul>
                            {this.state.updateItemId && (
                                <div className='mt-3 d-flex justify-content-center align-items-center'>
                                    <button
                                        onClick={() => this.handleConfirmEdit()}
                                        className='mx-2 Confirm-Edit btn'
                                    >
                                        Confirm
                                    </button>
                                    <button
                                        onClick={() => this.handleCancelEdit()}
                                        className='mx-2 Cancel-Edit btn'
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </>
        );
    }

    componentDidMount() {
        this.productsRepository
            .getListings(this.props.id)
            .then(products =>
                this.setState({ items: products, id: this.props.id })
            );
    }
}
