import React, { useEffect, useState } from 'react';
import { Redirect, useParams } from 'react-router-dom';
import DetailNav from '../layout/DetailNav';
import axios from 'axios';
import { API_URL } from '../../api_url';
import OkayAlert from '../layout/OkayAlert';

const SellItem = () => {
    const [itemName, setItemName] = useState('');
    const [itemCost, setItemCost] = useState(0);
    const [itemDetails, setItemDetails] = useState('');
    const [condition, setCondition] = useState('Used');
    const [imageUrl, setImageUrl] = useState('');
    const [image2, setImage2] = useState('');
    const [image3, setImage3] = useState('');
    const [image4, setImage4] = useState('');
    const [posted, setPosted] = useState(false);
    const [okayAlert, setOkayAlert] = useState(false);
    const [okayMessage, setOkayMessage] = useState('');

    const handleItemName = e => {
        setItemName(e.target.value);
    };

    const handleItemCost = e => {
        setItemCost(e.target.value);
    };

    const handleItemDetails = e => {
        setItemDetails(e.target.value);
    };

    const handleImageUrl = e => {
        setImageUrl(e.target.value);
    };

    const handleImage2 = e => {
        setImage2(e.target.value);
    };

    const handleImage3 = e => {
        setImage3(e.target.value);
    };

    const handleImage4 = e => {
        setImage4(e.target.value);
    };

    const handleOkay = () => {
        setOkayMessage('');
        setOkayAlert(false);
    };

    const handleSubmit = async e => {
        e.preventDefault();
        if (itemName && itemCost > 0 && itemDetails && imageUrl) {
            let itemId;
            await axios
                .post(`${API_URL}/addItem`, {
                    SellerID: window.localStorage.getItem('id'),
                    ItemName: itemName,
                    ItemCost: itemCost,
                    ItemDetails: itemDetails,
                    Condition: condition,
                    ImageURL: imageUrl,
                })
                .then(res => {
                    itemId = res.data.data.insertId;
                    setOkayAlert(true);
                    setOkayMessage('Posted item successfully!');
                    setPosted(true);
                })
                .catch(err => console.log('here is the error', err));

            var config = {
                method: 'post',
                url: `${API_URL}/addImage`,
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            await axios
                .post(
                    `${API_URL}/addImage`,
                    {
                        ImageID: itemId,
                        ImageURL: imageUrl,
                    },
                    config
                )
                .then(res => console.log('good'))
                .catch(err => console.log(err));
            if (image2) {
                await axios
                    .post(
                        `${API_URL}/addImage`,
                        {
                            ImageID: itemId,
                            ImageURL: image2,
                        },
                        config
                    )
                    .then(res => console.log(res));
            }
            if (image3) {
                await axios.post(
                    `${API_URL}/addImage`,
                    {
                        ImageID: itemId,
                        ImageURL: image3,
                    },
                    config
                );
            }
            if (image4) {
                await axios.post(
                    `${API_URL}/addImage`,
                    {
                        ImageID: itemId,
                        ImageURL: image4,
                    },
                    config
                );
            }
        } else {
            setOkayAlert(true);
            setOkayMessage('Please Fill All Required Fields');
        }
    };

    return posted ? (
        <>
            <OkayAlert message={okayMessage} clicked={() => handleOkay()} />
            {!okayAlert && <Redirect to='/home' />}
        </>
    ) : (
        <div className='container mt-4'>
            {okayAlert && (
                <OkayAlert message={okayMessage} clicked={() => handleOkay()} />
            )}
            <DetailNav />
            <form>
                <div className='form-group d-flex flex-column'>
                    <label
                        className='mx-auto h3 display-4 text-center'
                        htmlFor='itemName'
                    >
                        Item You are Selling:
                    </label>
                    <input
                        onChange={handleItemName}
                        value={itemName}
                        className='form-control w-75 mx-auto text-center'
                        type='text'
                        name='itemName'
                        id='itemName'
                        required
                    />
                </div>
                <div className='form-group d-flex flex-column'>
                    <label className='mx-auto h3 display-4' htmlFor='itemName'>
                        Item Cost:
                    </label>
                    <input
                        onChange={handleItemCost}
                        className='form-control w-75 mx-auto text-center'
                        type='number'
                        value={itemCost}
                        pattern='(^\d+(\.|\,)\d{2}$)'
                        name='itemCost'
                        id='itemCost'
                        required
                    />
                </div>
                <div className='form-group d-flex flex-column'>
                    <h3 className='text-center display-4'>Item Details</h3>
                    <textarea
                        onChange={handleItemDetails}
                        value={itemDetails}
                        className='form-control w-75 mx-auto'
                        name='itemDetails'
                        id='itemDetails'
                        rows='4'
                        required
                    ></textarea>
                </div>

                <div className='form-group d-flex flex-column justify-content-center align-items-center'>
                    <h4 className='display-4'>Condition</h4>
                    <div className='form-check'>
                        <input
                            className='form-check-input'
                            onClick={e => setCondition('New')}
                            type='radio'
                            name='condition'
                            id='New'
                        />
                        <label className='form-check-label' htmlFor='New'>
                            New
                        </label>
                    </div>
                    <div className='form-check'>
                        <input
                            className='form-check-input'
                            defaultChecked
                            onClick={e => setCondition('Used')}
                            type='radio'
                            name='condition'
                            id='Used'
                        />
                        <label className='form-check-label' htmlFor='Used'>
                            Used
                        </label>
                    </div>
                </div>

                <div className='form-group d-flex flex-column'>
                    <label className='mx-auto h3 display-4' htmlFor='imageUrl'>
                        Image Url <small className='small'>(Main)</small>
                    </label>
                    <input
                        onChange={handleImageUrl}
                        value={imageUrl}
                        className='mx-auto form-control w-75'
                        type='text'
                        name='imageUrl'
                        id='imageUrl'
                        required
                    />
                </div>
                {imageUrl && (
                    <div className='text-center mb-4'>
                        <h4>How Your image will display on the front page:</h4>
                        <img
                            width='100px'
                            height='100px'
                            src={`${imageUrl}`}
                            alt='Product Image'
                        />
                    </div>
                )}

                <div className='form-group d-flex flex-column'>
                    <label className='mx-auto h6' htmlFor='imageUrl2'>
                        Image 2 (optional)
                    </label>
                    <input
                        onChange={handleImage2}
                        value={image2}
                        className='mx-auto form-control w-75'
                        type='text'
                        name='imageUrl2'
                        id='imageUrl2'
                        required
                    />
                </div>
                <div className='form-group d-flex flex-column'>
                    <label className='mx-auto h6' htmlFor='imageUrl3'>
                        Image 3 (optional)
                    </label>
                    <input
                        onChange={handleImage3}
                        value={image3}
                        className='mx-auto form-control w-75'
                        type='text'
                        name='imageUrl3'
                        id='imageUrl3'
                        required
                    />
                </div>
                <div className='form-group d-flex flex-column'>
                    <label className='mx-auto h6' htmlFor='imageUrl4'>
                        Image 4 (optional)
                    </label>
                    <input
                        onChange={handleImage4}
                        value={image4}
                        className='mx-auto form-control w-75'
                        type='text'
                        name='imageUrl4'
                        id='imageUrl4'
                        required
                    />
                </div>

                <button
                    className='btn btn-warning btn-block w-50 mx-auto mb-5'
                    onClick={handleSubmit}
                    type='submit'
                >
                    Post Item!
                </button>
                {/* <input type='file' name='imageUrl' id='imageUrl' /> */}
            </form>
        </div>
    );
};

export default SellItem;

/*
Integrate image selector perhaps...
app.post('/addItem', (req, res) => {
    connection.query(
        'INSERT INTO Items (SellerID, ItemName, ItemCost, ItemDetails, ImageURL) VALUES (?, ?, ?, ?, ?)',
        [
            req.body.SellerID,
            req.body.ItemName, // user input
            req.body.ItemCost, // user input
            req.body.ItemDetails, // user input
            req.body.ImageURL, // user input
        ],

        lsywh4ql
        https://api.cloudinary.com/v1_1/${cloudName}/upload
        duk1gvgwx

        











const url = "https://api.cloudinary.com/v1_1/demo/image/upload";
const form = document.querySelector("form");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const files = document.querySelector("[type=file]").files;
  const formData = new FormData();

  for (let i = 0; i < files.length; i++) {
    let file = files[i];
    formData.append("file", file);
    formData.append("upload_preset", "docs_upload_example_us_preset");

    fetch(url, {
      method: "POST",
      body: formData
    })
      .then((response) => {
        return response.text();
      })
      .then((data) => {
        document.getElementById("data").innerHTML += data;
      });
  }
});


*/
