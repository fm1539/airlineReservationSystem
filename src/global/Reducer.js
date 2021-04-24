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
    window.location = path
}

async function aLogin(agentObj, path) {
    const response = await axios.post('http://localhost:8000/api/agent/login', agentObj)
    localStorage.setItem('agentObj', JSON.stringify(response.data.agentObj))
    window.location = path
}

async function sLogin(staffObj, path) {
    const response = await axios.post('http://localhost:8000/api/staff/login', staffObj)
    localStorage.setItem('staffObj', JSON.stringify(response.data.staffObj))
    window.location = path
}

const register = (registerEvent, path) => {
    axios.post('http://localhost:8000/api/customer/register', registerEvent).then( response => {
            if (response.data.status === "registered") window.location = path
            else alert('Username or Email already exists')
        }
    )
}

const aRegister = (registerEvent, path) => {
    axios.post('http://localhost:8000/api/agent/register', registerEvent).then( response => {
        console.log(response);
        if (response.data.status === "registered") window.location = path
        else alert('Username or Email already exists')
    })
}

const sRegister = (registerEvent, path) => {
    axios.post('http://localhost:8000/api/staff/register', registerEvent).then( response => {
        if (response.data.status === "registered") window.location = path
        else alert('Username or Email already exists')
    })
}

const checkLoggedIn = () => {
    if (JSON.parse(localStorage.getItem('custObj')) === null){
        return false
    }
    else{
        return true
    }
}

const aCheckLoggedIn = () => {
    if (JSON.parse(localStorage.getItem('agentObj')) === null){
        return false
    }
    else{
        return true
    }
}

const sCheckLoggedIn = () => {
    if (JSON.parse(localStorage.getItem('staffObj')) === null){
        return false
    }
    else{
        return true
    }
}

const logout = () => {
    localStorage.removeItem('custObj')
    window.location = '/'
}

const aLogout = () => {
    localStorage.removeItem('agentObj')
    window.location = '/agent'
}

const sLogout = () => {
    localStorage.removeItem('staffObj')
    window.location = '/staff'
}

export {login, aLogin, sLogin, logout, aLogout, sLogout, 
    checkLoggedIn, aCheckLoggedIn, sCheckLoggedIn, register, aRegister, sRegister}

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