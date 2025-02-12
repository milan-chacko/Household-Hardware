import axios from "axios";

const signin =async (user) =>{
    const result = await axios.post('http://localhost:5555/signin',user);
    return result;
};

const hasSignned =async() =>{
const result = await axios.get('/hassignned');
return result;
};

const signout = async () => {
    const res = await axios.get('http://localhost:5555/signout');
    return res;
}

export {signin, hasSignned, signout};
