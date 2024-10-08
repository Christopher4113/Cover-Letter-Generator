import React from 'react'
import './id.css';
const UserProfile = ({params}: any) => {
  return (
    <div className='centered-container'>
       <h1>Profile</h1>
       <hr />
       <p className='text-4xl'>Profile Page 
            <span>{params.id}</span>
       </p>
    </div>
  )
}

export default UserProfile