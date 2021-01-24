// import logo from './logo.svg';
import './App.css'
import CustomNavbar from './components/Navbar'
import MainPage from './pages'
import LoginPage from './pages/login'
import UsersPage from './pages/users'
import CamerasPage from './pages/cameras'
import CameraDetailPage from './pages/cameraDetail'
import MapPage from './pages/map'
import ChartsPage from './pages/charts'
import RecordsPage from './pages/records'
import GalleryPage from './pages/gallery'
import { Component } from 'react'
// import axios from 'axios'
// import moment from 'moment'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  // Link
} from 'react-router-dom'

import 'font-awesome/css/font-awesome.min.css'


class App extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  

  render() {
    return (
      <div>
        <Router>
          <CustomNavbar/>
          <Switch>
            <Route exact path="/" render={() => {
              return (
                (localStorage.getItem('access_token')) ?
                  (<Redirect to="/home" />):
                  (<Redirect to="/login" />)
              )
            }}/>
            <Route exact path="/home"  component={MainPage} />
            <Route exact path="/login" component={LoginPage} />
            <Route exact path="/users" component={UsersPage} />
            <Route exact path="/cameras" component={CamerasPage} />
            <Route exact path="/cameras/:cameraId" component={CameraDetailPage} />
            <Route exact path="/charts" component={ChartsPage} />
            <Route exact path="/records" component={RecordsPage} />
            <Route exact path="/maps" component={MapPage} />
            <Route exact path="/gallery" component={GalleryPage} />
            <Route path="/gallery/:imageId" component={GalleryPage} />
          </Switch>
          {/* <Link to='/cameras'></Link> */}
        </Router>
      </div>
        
    )
  }  
}

export default App;
