import { useContext} from "react";
import AuthContext from "../sharedContext/AuthProvider";

const useAuth = () => {
    return useContext(AuthContext);
}
export default useAuth;

