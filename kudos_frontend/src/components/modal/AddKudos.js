import React, { useEffect, useState } from 'react'
import Modal from './Modal'
import ModalButton from './ModalButton'
import api from '../../api/apiUtility'
import httpInstance from '../../httpUtility'
import { useStateValue } from '../../provider/StateProvider'
import { useNavigate } from 'react-router-dom'

function AddKudos({handleClose}) {
    const [{user}, dispatch] = useStateValue()
    const navigate = useNavigate()
    
    const headlines = ["Hardwork", "Overachiever", "Team Player", "Innovative", "Leadership", "Supportive", "Motivator"]

    // States:
    const [loading, setLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState("")
    const [orgUser, setOrgUser] = useState("")
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [personID, setPersonID] = useState("")
    const [headline, setHeadline] = useState("Hardwork")
    const [message, setMessage] = useState("")

    const [username, setUsername] = useState("")

    const filteredUsers = Array.isArray(orgUser) && username ? 
        orgUser.filter(person =>
            person.username.toLowerCase().includes(username.toLowerCase())
        ) : [];

    const handleSelectUsername = (person) => {
        setUsername(person.username);
        setPersonID(person.id)
        setShowSuggestions(false);
        };

    const fetchUserInOrg = async () => {
        if (user){
            const payload = {
                "user_id" : user.id
            }
            const userList = await httpInstance.post(api.user_in_org(), payload)
                .then((res) => {
                    setOrgUser(res.data.users)
                })
                .catch((err) => {
                    dispatch({
                        type: "TOAST_MESSAGE",
                        toast: err?.response?.data ? err?.response?.data?.error : "API call failed !"
                      });
                })
            }
    }

    useEffect(() => {
        fetchUserInOrg()
    }, [user])
    

    const clearForm = () => {
        setErrorMsg("")
        setOrgUser("")
        setShowSuggestions(false)
        setPersonID("")
        setHeadline("Hardwork")
        setMessage("")
        setUsername("")
    }


    const handleSubmit = async () => {
        if (!user){
            navigate("/login")
            return
        }

        if (!personID || !username){
            setErrorMsg("Person name is required !")
            return
        }

        if (message.length <= 5){
            setErrorMsg("Provide some detailed message !")
            return
        }

        const payload = {
            sender: user.id,
            receiver: personID,
            headline: headline,
            message: message
        }

        setLoading(true)
        setErrorMsg("")

        const response = await httpInstance.post(api.create_kudos(), payload)
            .then((res) => {
                setLoading(false)
                clearForm()
                handleClose()
            })
            .catch((err) => {
                setErrorMsg(`Unable to cerate the kudos`)
                setLoading(false)
            })
    }

    
  return (
    <div>
        <Modal  title="Share the Kudos with colleagues" onClose={handleClose}>
            <div>
                <div className='form_section'>
                    <label>Name of Person: <span>(required)</span></label>
                    <input type="text" placeholder='Enter the name of person in your organization' 
                        value={username} 
                        onChange={(e) => {
                            setUsername(e.target.value);
                            setShowSuggestions(true);
                        }}
                    />
                </div>


                {showSuggestions && filteredUsers && filteredUsers.length > 0 && (
                    <div className="suggestions_list">
                        {filteredUsers.map((person) => (
                            <div key={"persons_effoijw"+person.id} className="suggestion_item" onClick={() => handleSelectUsername(person)}>
                                {person.username}
                            </div>
                        ))}
                    </div>
                )}


                <div className='form_section'>
                    <label>KUDOS TAG:</label>

                    <div className='round_tag_div'>
                        {headlines && 
                            headlines.map(event => (
                                <div className='round_tag' key={`headline-${event}`} onClick={() => setHeadline(event)}
                                    style={headline === event ? {backgroundColor: "#bbb"} : {}}
                                >
                                    <p>{event}</p>
                                </div>
                            ))
                        }
                    </div>
                </div>

                <div className='form_section'>
                    <label>Message: </label>
                    <textarea placeholder='Detail message you want to ask' value={message} onChange={(e) => setMessage(e.target.value)}></textarea>
                </div>

                <ModalButton onSubmit={() => handleSubmit()} onClose={() => handleClose()} isLoading={loading} errorMsg={errorMsg && errorMsg}></ModalButton>
            </div>

        </Modal>
    </div>
  )
}

export default AddKudos