// import logo from './logo.svg';
import './App.css'
import CustomNavbar from './components/Navbar'
import MainPage from './pages'
import UsersPage from './pages/users'
import CamerasPage from './pages/cameras'
import CameraDetailPage from './pages/cameraDetail'
import Records from './pages/records'
import { Component } from 'react'
// import axios from 'axios'
// import moment from 'moment'
import {
  BrowserRouter as Router,
  // Switch,
  Route,
  // Link
} from 'react-router-dom'

import 'font-awesome/css/font-awesome.min.css'
// import { Navbar } from 'reactstrap'


// const cameraItems = [
//   {
//     camera_id: '3fa2c882-5b5e-4807-b14f-890a8d0ac7fd',
//     battery_level: 100,
//     setup_date: new Date('2020-10-10 11:11:00').toString(),
//     last_active_time: new Date('2020-11-10 12:00:00').toString()
//   },
//   {
//     camera_id: '22069def-2faf-479c-975b-2c243af3399a',
//     battery_level: 90,
//     setup_date: new Date('2020-10-11 12:00:00').toString(),
//     last_active_time: new Date('2020-12-12 12:10:00').toString()
//   }
// ]

class App extends Component {
  constructor(props) {
    super(props)
    // this.state = {
    //   cameraList: []
    // }
  }
  // componentDidMount(){
  //   this.refreshList();
  // }
  // refreshList = () => {
  //   axios
  //     .get('/api/cameras/')
  //     .then(res => {
  //       console.log(res)
  //       this.setState({ cameraList:res.data })
  //     })
  //     .catch(err => console.log(err))
  // }

  // renderItems = () => {
  //   const newItems = this.state.cameraList
  //   return newItems.map((item, index) => (
  //     <tr key={index}>
  //       <th scope='row' style={{verticalAlign: 'middle'}}>
  //         {index + 1}
  //       </th>
  //       <td>
  //         {item.camera_id}
  //       </td>
  //       <td>
  //         {item.battery_level}
  //       </td>
  //       <td>
  //         {moment(item.setup_date).format('YYYY-MM-DD hh:mm:ss')}
  //       </td>
  //       <td>
  //         {moment(item.last_active_time).format('YYYY-MM-DD hh:mm:ss')}
  //       </td>
  //       <td>
  //         <button
  //           onClick={() => this.editItem(item)}
  //           className="btn btn-secondary"
  //         >
  //           Edit
  //         </button>
  //       </td>
  //     </tr>
  //   ))
  // }

  // editItem = item => {
  //   this.setState({ activeItem: item, ifEdit: !this.state.ifEdit })
  // }
  render() {
    return (
      <div>
        <CustomNavbar/>
        <Router>
          <Route exact path="/" component={MainPage} />
          <Route exact path="/users" component={UsersPage} />
          <Route exact path="/cameras" component={CamerasPage} />
          <Route exact path="/cameras/:cameraId" component={CameraDetailPage} />
          <Route exact path="/records" component={Records}/>
          {/* <Link to='/cameras'></Link> */}
        </Router>
      </div>
        
    )
  }  
}
// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

export default App;
