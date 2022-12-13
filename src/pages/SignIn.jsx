import React from 'react'
import Header from '../components/Header'
import SignInForm from '../components/SignInForm'

function SignIn() {
    return (
        <div className='d-flex full-page  flex-grow-1 flex-column'>
            <Header />
            <div className='d-flex justify-content-center bg-secondary align-items-center flex-grow-1 '>
                <SignInForm />
            </div>

        </div>


    )
}

export default SignIn