import axios from 'axios';
import React, { useState } from 'react'
import { SignIn } from '../API_CALLS/signIn';
import { useNavigate } from 'react-router-dom';
import constants from '../constants';

import styles from './main.module.css';

function SignInForm() {

    const navigate = useNavigate();
    const [signinform, setSigninForm] = useState({
        username: "",
        password: ""
    })
    const handleFormChange = (e) => {
        const newData = { ...signinform };
        const { id, value } = e.target
        newData[id] = value;
        setSigninForm(newData);
    }
    const handleFormSubmit = (e) => {
        e.preventDefault();

        axios.post(`${constants.BASE_API_URL}/auth/login`, signinform).then((res) => {
            console.warn('response of api', res);
            localStorage.setItem('AccessToken', res.data.access_token);
            localStorage.setItem('RefreshToken', res.data.refresh_token);
            navigate('/home');
        }).catch(error => {
            console.log(error.res)
        })
    }

    return (
        <form onSubmit={(e) => handleFormSubmit(e)} className='container'>
            <div className="row justify-content-center">
                <div className="col-6 card sign-in-card">
                    <div className="card-body flex-column d-flex ">
                        <div className='my-3'>
                            <div className='d-flex flex-column'>
                                <label htmlFor="username">
                                    Email
                                </label>
                                <input onChange={(e) => handleFormChange(e)} value={signinform.username} type="text" id="username" />
                            </div>
                        </div>
                        <div className='my-3'>
                            <div className='d-flex flex-column'>
                                <label htmlFor="username">
                                    Password
                                </label>
                                <input onChange={(e) => handleFormChange(e)} value={signinform.password} type="password" id="password" />
                            </div>
                        </div>
                        <button className={`${styles.auth_button} align-self-start mt-4`}>
                            Login
                        </button>
                    </div>
                </div>
            </div>
        </form>
    )
}
export default SignInForm