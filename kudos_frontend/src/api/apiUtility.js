
const baseurl = process.env.REACT_APP_BACKEND_URL


const api = { 
    login : () => { return `${baseurl}/api/token/`},
    create_user: () => { return `${baseurl}/api/user/create/`},
    fetch_kudos: (user_id, date, filter_type) => { return `${baseurl}/api/kudos/received/?user_id=${user_id}&date=${date}&filter_type=${filter_type}`},
    user_in_org : () => { return `${baseurl}/api/kudos/list_user_in_org/`},
    create_kudos: () => {return `${baseurl}/api/kudos/create`},
    kudos_quota: () => {return `${baseurl}/api/kudos/quota/`},
}

export default api