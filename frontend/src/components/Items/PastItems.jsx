import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ProductsRepository } from '../api/ProductsRepository';

export class PastItems extends React.Component {
    state = {
        userId: this.props.id,
        pastItems: [],
        searchQuery: ''
    }
    
    productsRepository = new ProductsRepository();

    searchItem(input) {
        this.productsRepository.getSoldItems(this.props.id).then(pastItems => {
                this.setState({ pastItems });
                let filtered_products = this.state.pastItems.filter(item =>
                    item.ItemName.toLowerCase()
                    .replace(/\s+/g, '')
                    .includes(input.toLowerCase().replace(/\s+/g, ''))
                );
                if (filtered_products.length > 0) {
                    this.setState({ pastItems: filtered_products });
                } else {
                    this.setState({  pastItems: [] });
                }
        });
    }

    render(){
        if (typeof(this.state.pastItems) == 'undefined') {
            return <div>Loading Home...</div>;
        }

        return (
            <div className='container mt-4'>
                <div className='d-flex my-5'>
                    <input
                        placeholder='Find An Item by Name...'
                        className='form-control'
                        type='text'
                        value={this.state.searchItemName}
                        onChange={event =>
                            this.setState({
                                searchQuery:
                                    event.target.value,
                            })
                        }
                    />
                    <button
                        onClick={() => 
                            this.searchItem(
                                this.state.searchQuery
                            )
                        }
                        className='mx-4 px-4 btn btn-warning'
                    >
                        <i className='fas fa-search'></i>
                    </button>
                </div>
                {this.state.pastItems.length === 0 && (
                    <h2 className='text-center display-3'>
                        {this.state.userId === window.localStorage.getItem('id')
                            ? "You haven't"
                            : "This seller hasn't"}{' '}
                        sold any items...
                    </h2>
                )}
                <ul className='list-group'>
                    {this.state.pastItems.map(item => {
                        return (
                            <li
                                className='list-group-item d-flex row'
                                key={item.itemID}
                            >
                                <div className='d-flex flex-column col-5'>
                                    <Link
                                        style={{ color: 'black' }}
                                        to={`/products/${item.ItemID}`}
                                    >
                                        <h4>{item.ItemName}</h4>
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
                                <div className='col-7'>
                                    <span className='CurrentItems-Price badge badge-primary p-2'>
                                        ${item.ItemCost}
                                    </span>
                                    <p className='CurrentItems-Description mt-4'>
                                        {item.ItemDetails}
                                    </p>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>
        );
    }

    componentDidMount() {
        this.productsRepository.getSoldItems(this.props.id)
            .then(products => this.setState({ pastItems: products }));
    }
}

export default PastItems;