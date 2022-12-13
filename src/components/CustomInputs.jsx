import React from 'react'
const CustomInput = (props) => {
    const { Label, id, Type, formik } = props

    return (
        <div className='d-flex flex-column'>
            <label htmlFor={id}>
                {Label}
            </label>
            <input value={formik.values[id]} type={Type} id={id}  {...formik.getFieldProps(`'${id}'`)} />
            {formik.touched[id] && formik.errors[id] ? (
                <div className='text-danger'>{formik.errors[id]}</div>
            ) : null}
        </div>
    )
}
export { CustomInput }