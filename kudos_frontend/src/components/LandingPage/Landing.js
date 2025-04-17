import React, { useEffect, useState } from 'react'
import './Landing.css'
import { useNavigate } from 'react-router-dom'
import { useStateValue } from '../../provider/StateProvider'


function Landing() {
    const [{user}, dispatch] = useStateValue()

    const navigate = useNavigate()

    const handleNavigation = () => {
        if(user){
            navigate("/u/activity")
        }else{
            navigate("/login")
        }
    }

  return (
    <div>
        <div className='landing_container'>
            <div className='landing_comments'>
                <p className='landing_tagline'>Celebrate Every Contribution</p>
                <p className='landing_message'>Empower your team through appreciation and recognition !</p>
                <button className='landing_button' onClick={handleNavigation}>Get Started</button>
            </div>

        </div>

        <div className='landing_description'>
            <span>"</span>Recognize greatness with ease!
            This app lets you effortlessly send and track kudos within your team, making appreciation quick and seamless. With a simple interface and real-time updates, showing gratitude has never been easier. Foster a culture of recognition—one kudos at a time. Acknowledge, appreciate, and inspire—it’s that simple!
            <span>"</span>
        </div>
    </div>
  )
}

export default Landing