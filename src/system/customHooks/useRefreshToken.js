import axios from '../../api/axios';
import useAuth from "./useAuth";
import jwt_decode from "jwt-decode";
const useRefreshToken = () => {
    const { setAuth } = useAuth();

    const refresh = async () => {
        const response = await axios.get('/system/refresh/access', {
            withCredentials: true
        });
     
        var decodedToken = jwt_decode(response?.data.token);
            const access = decodedToken.jsonAccess;   
            const user = decodedToken.id;  

        setAuth(prev => {
            return {
                ...prev,
                decodedToken: decodedToken,
                access: access,
                user:   user
            }
        });
        
        return decodedToken;
    }
    return refresh;
};

export default useRefreshToken;