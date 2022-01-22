import React from 'react'
import { Ripple } from 'react-css-spinners'

export default function Loader() {
    return (
        <div className='loader-class'>
            <Ripple color='#000000' size={60}/>
        </div>
    )
}
