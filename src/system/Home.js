import React, { useState, useEffect,lazy,Suspense } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from "./customHooks/useAuth";
import axios from '../api/axios';
import $ from 'jquery';
import '../public/css/System/home.css';
import '../public/css/System/system.css';
import SideBar from './component/SideBar';
import CustomizeIframe from './component/CustomizeIframe';
import Municipality from '../HRIS/TranConfig/Municipality/Municipality';


//import PageNotFound from "./components/PageNotFound/PageNotFound";
var ReactDOMServer = require('react-dom/server');

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/login";

  const { auth } = useAuth();
  const [userID, setUserID] = useState('');
  const [isOpen,setIsOpen] = useState(false);
  const [link, setLink] = useState({});

  function DynamicItem(link) {
    const Comp = lazy(() => import(`../${link.link}`));
    return (
      <div>
        <Suspense fallback={<div>Loading...</div>}>
          <Comp />
        </Suspense>
      </div>
    ); 
  }

  // async function DynamicItemSample(link) {
   
  //   const Comp = await import(`../${link.link}`).then((res) => res?.default).catch((err) => console.log(err));
  //   console.log(Comp)
  //   console.log(1)
  //   return (
  //         <Comp />
  //   ); 
  // }

  useEffect(() => {
    setUserID(auth?.user);
   // Create Item
    $(document).on('click','.sys-item',async (e) =>{
      e.preventDefault();
      const val = e?.target?.value +'/' + e?.target?.title
      setLink(val);
      setIsOpen(true);
        const Comp = await import(`../${val}`).then(res => res?.default).catch((err) => console.log(err));
        function Final(){
          return(
            <div><CustomizeIframe><Comp/></CustomizeIframe></div>
            );
        }
        console.log(Final)
        const htmlString = ReactDOMServer.renderToStaticMarkup(<Final/>);
       $('.item-container').append(htmlString)
    }) 

  },[])
  
  //Logout
  const logout = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/system/logout/logout_user', JSON.stringify({ userID }),
        {
          headers: { 'Content-type': 'application/json' },
          withCredentials: true
        });
      navigate(from, { replace: true });

    } catch (error) {

      if (!error?.response) {
        console.log('No Server Response');
      } else {
        console.log(error)
      }
    }
  }
  
  return (  
    <div className='flex flex-col items-center justify-center min-h-screen py-2'>
      <button onClickCapture={logout}>logout user</button>
      <SideBar />
      <div className='item-container h-screen w-5/6 h-96'>
        <h2>Menu Item</h2>
        {/* {isOpen &&<DynamicItemSample link={link}/>} */}
      </div>
    </div>
  )
}

export default Home