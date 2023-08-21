import React, { useEffect, useState } from 'react'
import CustomizeIframe from './CustomizeIframe'

const IFrame = () => {
    const [link, setLink] = useState({});

    async function fetchData() {
        // You can await here
        const response = await import('../../HRIS/TranConfig/Municipality/Municipality')
        // ...
        setLink({Test: response?.default})
      }
    

    useEffect(() => {
        fetchData();
        console.log(li)
    },[])
 
  return (
    <div>
    </div>
  )
}

export default IFrame