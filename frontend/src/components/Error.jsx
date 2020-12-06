import React, { useState } from 'react';
import logo from '../img/PonyList-Text-alt.png';
import { useHistory } from "react-router-dom";

export default function Error() {
    let history = useHistory();

    const goToPreviousPath = () => {
        history.goBack()
    }

    return (
        <>
        <div class="jumbotron mt-5 mx-auto w-50 p-5">
            <a href="/home">
                <img src={logo} class="d-inline-block w-50" alt="" loading="lazy"/>
            </a>
            <h1 class="display-4">Error 404 - Page not found</h1>
            <p class="lead">Could not find the requested url: {window.location.pathname}</p>
            <hr class="my-4"/>
            <a class="btn btn-primary btn-lg" onClick={goToPreviousPath} href="#" role="button">Go back</a>
        </div>
        </>
    );
}