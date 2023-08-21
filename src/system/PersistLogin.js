import { Outlet } from "react-router-dom";
import React, { useState,useEffect } from "react";
import useRefreshToken from "./customHooks/useRefreshToken"
import useAuth from "./customHooks/useAuth";

const PersistLogin = () => {
    const { auth } = useAuth();
    const [loading,setLoading] = useState(true);
    const refresh = useRefreshToken();

    useEffect(() =>{
        const alertUser = (e) => {
            e.preventDefault();
            e.returnValue = "";
          };
          
        window.addEventListener("beforeunload", alertUser);
        return () => {
        const validateRToken =  async() => {
            try {
                await refresh();
            } catch (error) {
                console.log(error)
            }
            finally{
                setLoading(false);
            }
        }

        !auth?.accToken ? validateRToken() : setLoading(false);
        window.removeEventListener("beforeunload", alertUser);
    };
        
    },[])
    
    //use only for debug
    // useEffect(() => {
    //     console.log(loading)// check state
    //     console.log(auth)// check token
    // },[loading])

    return(
        <>
            {loading ?
                <p>Loading...</p> :
                <Outlet />}
        </>
    )
}

export default PersistLogin;