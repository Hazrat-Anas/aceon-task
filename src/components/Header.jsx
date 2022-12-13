import React from 'react'
import styles from './main.module.css'
function Header() {
    return (
        <div className="container-fluid border-bottom-header">
            <div className="d-flex  align-items-center justify-content-between py-3">
                <h1 className='fw-bold'>Logo</h1>

                <button className={`${styles.auth_button}`}>Logout</button>
            </div>
        </div>
    )
}

export default Header