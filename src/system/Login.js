import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from '../api/axios';
import useAuth from './customHooks/useAuth';
import jwt_decode from "jwt-decode";
import "../public/css/System/login-user.css";
import login_avatar_logo from '../public/system/images/login/logo-test.jpg'

var CryptoJS = require("crypto-js");
const Login = () => {
    const { setAuth } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";
    const inp = useRef();

    const [user, setUser] = useState('');
    const [pass, setPass] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [loading, setLoading] = useState(false);
    
    async function hasSession(){
        try {
            const response = await axios.get('/system/login/login_index',
                {
                    withCredentials: true
                });
                response?.status===204 && navigate(from, { replace: true });
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        inp.current.focus();
        hasSession();  
    }, []);

    useEffect(() => {
        setErrMsg('');
    }, [user, pass]);

    useEffect(() =>{
  
    },[loading])

    const submitForm = async (e) => {
        e.preventDefault();
        setLoading(true);

        // encrypted data
        const secret = 'M@t1nd!ngP@ssw0rd';
        const data = [{ user,pass }]
        var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), secret).toString();
      
        try {
            const response = await axios.post('/system/login/login_user', JSON.stringify({ ciphertext }),
                {
                    headers: { 'Content-type': 'application/json' },
                    withCredentials: true
                });
        
            var decodedToken = jwt_decode(response?.data.token);
            const access = decodedToken.jsonAccess;   
            setAuth({ decodedToken, access, user });

            setUser('');
            setPass('');
            setErrMsg('');
            //navigate HOME page     
            navigate(from, { replace: true });

        } catch (error) {
         
            if (!error?.response) {
                setErrMsg('No Server Response');
            } else if(error?.response.status === 401) {
                setErrMsg(error?.response.data.message);
            } else if(error?.response.status === 403){
                setErrMsg(error?.response.data.message);
            }else{
                setErrMsg(error?.response.data.message);
            }
        }
        finally{
            setLoading(false); 
        }
    }

    return (
        <div className='wrapper fadeInDown'>
            <div id="formContent">
                <h2 id="sIN" className="active"> Sign In </h2>

                <div className="fadeIn first">
                    <img className="reg-img" src={login_avatar_logo} alt="login Logo...." />
                </div>

                <form className="Login-Form" onSubmit={submitForm}>
                        <input ref={inp} onChange={(e) => setUser(e.target.value)} value={user} type="text" id="username" className="fadeIn second" name="username" autoComplete="off" placeholder="Enter Username" required/>
                        <input onChange={(e) => setPass(e.target.value)} value={pass} type="password" id="password" className="fadeIn third" name="password" autoComplete="off" placeholder="Enter Password" required/><br></br>
                        {loading ? <div className="spinner">
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            </div> 
                        : null}
                            <br></br>
                        <label className="lblmsg">{errMsg}</label><br></br><br></br>
                        <input type="submit" className="fadeIn fourth pointer" value="Log In"></input>
                </form>
            </div>
        </div>
    )
}

export default Login