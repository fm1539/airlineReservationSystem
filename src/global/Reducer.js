import axios from 'axios'

const Reducer = (state, action) => {
    switch (action.type) {
        case 'example':
            return {
                ...state,
                custObj: {
                    userObj: 'isfaroshir@gmail.com'
                }
            }
        case 'customerLogin':
            let localCustObj = {}
            axios.post('http://localhost:8000/api/customer/login', action.payload).then(response => {
                if (response.data.status == "logged"){
                    console.log(action.payload);
                    console.log(response.data.custObj);
                    localCustObj = response.data.custObj
                    localStorage.setItem('custObj', JSON.stringify(response.data.custObj))
                }
            })
            console.log(JSON.parse(localStorage.getItem('custObj')));
            return {
                ...state,
                custObj: {
                    email: JSON.parse(localStorage.getItem('custObj')).email
                }
            }
        case 'customerlogout':
            return {
                ...state,
                custObj: {}
            };
        default:
            return state;
    }
};

export default Reducer;