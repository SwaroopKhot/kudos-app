import React, {useState} from 'react'
import httpInstance from '../../httpUtility'
import "./Login.css"
import config from "../../config.json"
import { useNavigate } from 'react-router-dom'
import { useStateValue } from "../../provider/StateProvider";
import api from '../../api/apiUtility'


function Login() {

    const navigate = useNavigate()
    const [{ user }, dispatch] = useStateValue();


    // Form value States:
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [userName, setUserName] = useState("")
    const [organization, setOrganization] = useState("")

    const [isNewAccount, setIsNewAccount] = useState(false)


    // Signin Function:
    const handleSignin = async () => {

        if(email===""){
            dispatch({
                type: "TOAST_MESSAGE",
                toast: "Please provide email to login"
            });
            return

        } else if (password === "") {
            dispatch({
                type: "TOAST_MESSAGE",
                toast: "Password cannot be empty"
            });
            return
        }

        const payload = {
            email: email, 
            password: password,
        };

        const login = await httpInstance.post(api.login(), payload)
            .then((res) => {
                localStorage.setItem("access_token", res.data["access"]);
                localStorage.setItem("refresh_token", res.data["refresh"]);
                localStorage.setItem("user", JSON.stringify(res.data["user"]));

                dispatch({
                    type: "ADD_USER",
                    user: {
                        ...res.data["user"]
                    }
                })
                navigate("/u/activity")
            })
            .catch((err) => {
                if(err.response){
                    dispatch({
                        type: "TOAST_MESSAGE",
                        toast: err?.response?.data?.detail
                      });
                }
            })
    }

    // create new user:
    const createNewAccount = async () => {
        if(organization === ""){
            dispatch({
                type: "TOAST_MESSAGE",
                toast: "Organization name cannot be empty"
            });
            return 
        }
        if(userName === ""){
            dispatch({
                type: "TOAST_MESSAGE",
                toast: "Username cannot be empty"
            });
            return
        }
        else if(email===""){
            dispatch({
                type: "TOAST_MESSAGE",
                toast: "Email cannot be empty"
            });
            return
        } else if (password === "") {
            dispatch({
                type: "TOAST_MESSAGE",
                toast: "Password cannot be empty"
            });
            return
        }

        const payload = {
            "organization": organization,
            "username": userName,
            "email": email,  
            "password": password
        };

        const register = await httpInstance.post(api.create_user(), payload)
            .then((res) => {
                setIsNewAccount(false)
                dispatch({
                    type: "TOAST_MESSAGE",
                    toast: res.data['message']
                  });
                
            })
            .catch((err) => {
                if(err.response){
                    dispatch({
                        type: "TOAST_MESSAGE",
                        toast: err?.response?.data?.error
                      });
                }
            })
    }

    
  return (
    <div className='login_container'>
        <div className='login_welcome'>Welcome to <span>{config.title}</span></div>
        <p className='login_hint'>We will make sure to keep your data secure and safe, so just dive-in !</p>


        {isNewAccount ? 
            <div className='login_form_div'>

                <div className='login_form_content'>
                    <label for="organization" >Organization Name: </label>
                    <input id="organization" type="text" placeholder='Name of your Organization' value={organization} onChange={(e) => setOrganization(e.target.value)} />
                </div>

                <div className='login_form_content'>
                    <label for="username" >User Name: </label>
                    <input id="username" type="text" placeholder='Enter what username you want' value={userName} onChange={(e) => setUserName(e.target.value)} />
                </div>

                <div className='login_form_content'>
                    <label for="email" >Email: </label>
                    <input id="email" type="text" placeholder='Enter your email' value={email} onChange={(e) => setEmail(e.target.value)}/>
                </div>

                <div className='login_form_content'>
                    <label for="password">Password: </label>
                    <input id="password" type="password" placeholder='Enter accout password' value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>

                <button className='login_btn new_account' onClick={createNewAccount}>Create New Account</button>
               
            </div>
        :
            <div className='login_form_div'>
                <div className='login_form_content'>
                    <label for="email" >Email: </label>
                    <input id="email" type="text" placeholder='Enter you email' value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>

                <div className='login_form_content'>
                    <label for="password">Password: </label>
                    <input id="password" type="password" placeholder='Enter accout password' value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>

                <button className='login_btn' onClick={handleSignin}>Login</button>

                <button className='login_btn new_account' onClick={() => setIsNewAccount(true)}>Create New Account</button>
            </div>
        }

        <p className='login_agreement'>By signing-in you agree our terms and conditions*</p>
    </div>
  )
}

export default Login