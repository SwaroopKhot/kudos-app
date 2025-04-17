import React, { useEffect, useState } from 'react'
import "./Home.css"
import { IoAddSharp } from "react-icons/io5";
import WeekNavigator from './utility/WeekNavigator';
import httpInstance from '../httpUtility';
import api from '../api/apiUtility';
import { useStateValue } from '../provider/StateProvider';
import { format } from "date-fns";
import KudosCard from './utility/KudosCard';
import AddKudos from './modal/AddKudos';
import LoadingIcon from './Loader/LoadingIcon';

function Home() {
    const [{user}, dispatch] = useStateValue()
    const [showKudoModal, setShowKudosModal] = useState(false)

    // All States:
    const [activeTab, setActiveTab] = useState("Kudos Sent")
    const [activeDate, setActiveDate] = useState(format(new Date(), "yyyy-MM-dd"));
    const [kudos, setKudos] = useState()
    const [kudosQuota, setKudosQuota] = useState("0")
    const [kudosLoading, setKudosLoading] = useState(false)

    const validateQuota = () => {
        if(kudosQuota && kudosQuota!==0){
            setShowKudosModal(true)
        } else {
            dispatch({
                type: "TOAST_MESSAGE",
                toast: "It seems you have utilized your this week's Kudos !"
              });
        }
    }
    const option = [{
        name: "Create Kudos",
            onClick: () => validateQuota() ,
            icon: <IoAddSharp size={13} />,
            hint: "Share kudos with your colleagues"
    }]

    const kudosTabs = ["Kudos Sent" , "Kudos Received"]

    useEffect(() => {
        if(user){
            fetchKudos()
            fetchKudosQuota()
        }
        
    }, [user, activeTab, showKudoModal])

    // API:
    const fetchKudos = async (date=null) => {
        setKudosLoading(true)
        const user_id = user.id
        let filter_type = "received"
        if(activeTab === "Kudos Sent"){
            filter_type = "sent"
        }
        if(!date){
            date = activeDate
        }

        const kudos = await httpInstance.get(api.fetch_kudos(user_id, date, filter_type))
            .then((res) => {
                setKudos(res.data)
                setKudosLoading(false)
            })
            .catch((err) => {
                dispatch({
                    type: "TOAST_MESSAGE",
                    toast: err?.response?.data ? err?.response?.data?.error : "API call failed !"
                  });
                setKudosLoading(false)
            })
    }

    const fetchKudosQuota = async () => {
        if(user){

            const payload = {
                user_id : user.id
            }

            const kudosQuota = await httpInstance.post(api.kudos_quota(), payload)
            .then((res) => {
                console.log("KUDOS: ", res.data)
                setKudosQuota(res.data["kudos_left"])
            })
            .catch((err) => {
                dispatch({
                    type: "TOAST_MESSAGE",
                    toast: err?.response?.data ? err?.response?.data?.error : "API call failed !"
                  });
            })
        }
    }

    // Functions:
    const handleWeekChange = (date) => {
        setActiveDate(date)
        fetchKudos(date)
    }


  return (
    <div style={{margin: "10px"}}>
        <div className='home_card_container'>
            {option && option.map((card, index) => (
                <div className='home_card_view' key={`cards-${index}`} onClick={() => card.onClick()}>
                    <div className='home_card_header'>
                        <p className='home_card_header_text'>{card.name}</p>
                        <p className='home_card_header_icon'>{card.icon}</p>
                    </div>

                    <p className='home_card_header_hint'>{card.hint}</p>
                </div>
                ))   
            }
        </div>
        <br />

        <div className='home_kudos_container'>
            <div className='home_kudos_tabs'>
                {kudosTabs && kudosTabs.map((tab, index) => (
                    <div key={`tab-${index}`} onClick={() => setActiveTab(tab)} 
                        style={activeTab === tab ? { borderBottom: "3px solid rgb(116, 116, 255)", color: "black" } : null}
                    >
                        {tab}
                    </div>
                ))}
            </div>
            <div><WeekNavigator onWeekChange={(e) => handleWeekChange(e) }/></div>
        </div>

        <div className='linebreaker'></div>

        <div className='kudos_quota_message'>Kudos Quota: {kudosQuota}/3</div>
                
        {kudosLoading && <LoadingIcon loader={kudosLoading} />}
        {kudos && !kudosLoading && 
            <div className='kudos_card_view'>
                {kudos && kudos.map((data, index) => (
                    <KudosCard data={data} key={`kudoCards-${index}`}/>
                ))}
            </div> 
        }

        {kudos && !kudosLoading && kudos.length===0 && <p className='kudos_not_found'>No kudos found !</p>}

        {showKudoModal && <AddKudos handleClose={() => setShowKudosModal(false)} />}
    </div>
  )
}

export default Home