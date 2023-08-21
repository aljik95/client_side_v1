import React, { useState, useEffect,lazy,Suspense } from 'react';
import useAuth from "../customHooks/useAuth";
import module_icon from '../../public/system/images/dashboard/module-icon.png'
import group_icon from '../../public/system/images/dashboard/group-icon.png'
import item_icon from '../../public/system/images/dashboard/item-icon.png'
import $ from 'jquery';
import CustomizeIframe from './CustomizeIframe';
var ReactDOMServer = require('react-dom/server');




export default function SideBar()  {

    const { auth } = useAuth();
    const [accessLbl, setAccessLbl] = useState('');
    const [moduleSet, setModule] = useState([]);
    const [groupSet, setGroup] = useState([]);
    const [showHide, setShowHide] = useState(true);

    async function fetchData() {
        auth?.access['rows'].length > 0 ? setAccessLbl("My Access") : setAccessLbl("No Access");

        const modules = [...new Set(auth?.access['rows'].map(item => item.moddesc))];
        const groups = [...new Set(auth?.access['rows'].sort((a, b) => (a.itemtag > b.itemtag) ? 1 : -1).map(item => item.tagdesc))];
        setModule(modules);
        setGroup(groups);
    }

    // const LazyComponent =  lazy(() => import('../../HRIS/TranConfig/Municipality/Municipality'))
    // function DynamicItem() {
    //     return (
    //         <div>
    //             <Suspense fallback={<div>Loading...</div>}>
    //                 <LazyComponent />
    //             </Suspense>
    //         </div>
    //     ); 
    // }

    useEffect(() => {
        fetchData();
        const handleTabClose = (e) => {
            e.preventDefault();
            e.returnValue = "";
        };
        window.addEventListener('beforeunload', handleTabClose);
        return () => {
            window.removeEventListener('beforeunload', handleTabClose);
        };
    }, [])  
      
    // const handleClick =  event => {
    //     event.preventDefault();
    //     const val = event?.target?.value +'/' + event?.target?.title
    //     console.log(val);
    //     DynamicItem();
      
    //     const htmlString = ReactDOMServer.renderToStaticMarkup(<DynamicItem />);
    //     console.log(htmlString);
    //     $('.item-container').append(htmlString);       
    //   };
    
    return (
        <>
            {showHide ?
                <button className="flex text-4xl text-white items-center cursor-pointer fixed left-60 top-6 z-50"
                    onClick={() => setShowHide(!showHide)}>x
                </button> :
                (<svg
                    onClick={() => setShowHide(!showHide)}
                    className="fixed z-30 flex items-center cursor-pointer left-10 top-6"
                    fill="#2563EB"
                    viewBox="0 0 100 80"
                    width="40"
                    height="40">
                    <rect width="100" height="10"></rect>
                    <rect y="30" width="100" height="10"></rect>
                    <rect y="60" width="100" height="10"></rect>
                </svg>)}       
            <div className={`${showHide ? 'overflow-auto' : ''} top-0 left-0 w-1/4 bg-orange-500 text-white fixed h-full z-15 ease-in-out duration-300 ${showHide ? "translate-x-0 " : "-translate-x-24/25"}`}>
            <div className="bg-gray-800 sticky inset-x-0 top-0 h-12" ><h2 className='p-3 pl-3'>{accessLbl}</h2></div>        
                {auth?.access['rows'].length > 0 ?
                    (<div className='sys_module_container p-5 pl-5'>
                    {moduleSet.map((module,i) =>
                    
                      <div key={i} className='sys_module '><img className='mgi-icon' src={module_icon} alt="Module...."/>
                         <label htmlFor="handle1">{module}</label>
                      
                            {groupSet.map((module_group,i) => {
                                return <ul key={i} className='sys_group '><img className='mgi-icon' src={group_icon} alt="Module...."/>{module_group}      
                                  {auth?.access['rows'].map((module_item, i) => {
                                    if(module === module_item?.moddesc && module_group === module_item?.tagdesc)
                                    return <li key={i} className='sys_item'><button id={module_item?.item} className='sys-item' value={module_item?.link} title={module_item?.itmdesc}><img className='mgi-icon' src={item_icon} alt="Module...."/>{module_item?.itmdesc}</button></li> 
                                  }
                              )}
                                </ul> 
                            })}
                       </div>
                    )}
                  </div>) : null
                }</div>

        </>
    )
}