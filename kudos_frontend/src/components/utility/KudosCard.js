import React from 'react'
import "./KudosCard.css"
import { useStateValue } from '../../provider/StateProvider'


function KudosCard({data}) {
    const [{user}] = useStateValue()

    const sender = data.sender
    const receiver = data.receiver
    const rawDate = data.created_at;
    const formattedDate = new Date(rawDate).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });

    let isSender = false
    if(user && user.username === sender.username){
        isSender = true
    }

    const imagemap = {
        "hardwork" : require("../../images/trophy.png"),
        "overachiever": require("../../images/medal.png") ,
        "team player": require("../../images/medal.png") ,
        "innovative": require("../../images/star.png") , 
        "leadership": require("../../images/medal1.png")  ,
        "supportive": require("../../images/star.png")  ,
        "motivator": require("../../images/trophy.png") 
    }


  return (
    <div className='kudos_card_container'>

        <div className='kudos_headline_container'>
            <img
                className='kudos_image_container'
                src={imagemap[data.headline?.toLowerCase()]}
                alt={data.headline}
            />

            <div className='kudos_headline'>{data.headline}</div>
        </div>

        <p className='kudos_message'>{data.message}</p>


        <div className='kudos_description'>
            {isSender && <p className='kudos_hint_text'>You send a kudos to <b>{receiver.username}</b></p>}
            {!isSender && <p><b>{sender.username}</b> send a kudos to You !</p>}

            <div className='kudos_date'>{formattedDate}</div>
        </div>
    </div>
  )
}

export default KudosCard