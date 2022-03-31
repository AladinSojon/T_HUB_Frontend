import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const AccessDenied = () => {
    const location = useLocation();
    const [accessDeniedMessage, setAccessDeniedMessage] = useState([]);
    useEffect(() => {
        setAccessDeniedMessage(location.state.detail.message);
    }, [location]);
    
    return (
        <div>
            <h3 className='text-center'>{accessDeniedMessage}</h3>
        </div>
    )
}

export default AccessDenied;