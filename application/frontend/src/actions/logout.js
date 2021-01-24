import axiosInstance from './axiosApi'

const handleLogout = () => {
  console.log(localStorage.getItem('refresh_token'))
  axiosInstance.post('/api/blacklist/', {
    'refresh_token': localStorage.getItem('refresh_token')
  }).then(()=>{
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    axiosInstance.defaults.headers['Authorization'] = null
    window.location.href='/'
  }).catch(err => {
    console.log(JSON.stringify(err.response.data))
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    axiosInstance.defaults.headers['Authorization'] = null
    window.location.href='/'
    throw err
  })
}


export default handleLogout