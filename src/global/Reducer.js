import axios from 'axios'

async function login(custObj, path) {
    const response = await axios.post('http://localhost:8000/api/customer/login', custObj)
    // axios.post('http://localhost:8000/api/customer/login', custObj).then(response => {
    //     console.log(response);
    //     if (response.data.status == "logged"){
    //         console.log(response.data.custObj);
    //         localStorage.setItem('custObj', JSON.stringify(response.data.custObj))
    //     }
    // })
    localStorage.setItem('custObj', JSON.stringify(response.data.custObj))
    window.location = '/'
}

const checkLoggedIn = () => {
    if (JSON.parse(localStorage.getItem('custObj')) === null){
        return false
    }
    else{
        return true
    }
}

const logout = () => {
    localStorage.clear()
    window.location = '/'
}

// const Reducer = (state, action) => {
//     switch (action.type) {
//         case 'reLogin':
//             if (JSON.parse(localStorage.getItem('custObj')) == null){
//                 return {
//                     ...state
//                 }
//             }
//             else{
//             return {
//                 ...state,
//                 custObj: {
//                     email: JSON.parse(localStorage.getItem('custObj')).email
//                 }
//             }
//         }
//         case 'customerLogin':
//             let localCustObj = {}
//             axios.post('http://localhost:8000/api/customer/login', action.payload).then(response => {
//                 if (response.data.status == "logged"){
//                     console.log(action.payload);
//                     console.log(response.data.custObj);
//                     localStorage.setItem('custObj', JSON.stringify(response.data.custObj))
//                 }
//             })
//             console.log(JSON.parse(localStorage.getItem('custObj')));
//             return {
//                 ...state,
//                 custObj: {
//                     email: JSON.parse(localStorage.getItem('custObj')).email
//                 }
//             }
//         case 'customerLogout':
//             localStorage.clear()
//             return {
//                 ...state,
//                 custObj: {}
//             };
//         default:
//             return state;
//     }
// };

export {login, logout, checkLoggedIn}