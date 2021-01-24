/* eslint-disable no-useless-catch */
import { Component } from 'react'
import { 
  Form, 
  Label, 
  Input, 
  FormGroup, 
  Col,
  Row,
  Alert,
} from 'reactstrap'
import {
  Redirect
} from 'react-router-dom'
// import axios from 'axios'
import axiosInstance from '../actions/axiosApi'
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '', 
      password: '', 
      err: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({[event.target.name]: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    axiosInstance.post('api/token/obtain/', {
      username: this.state.username,
      password: this.state.password
    }).then((res) => {
      axiosInstance.defaults.headers['Authorization'] = 'JWT ' + res.data.access
      localStorage.setItem('access_token', res.data.access)
      localStorage.setItem('refresh_token', res.data.refresh)
      this.setState({isLoggedin: true})
      window.location.reload();
      return res.data
    }).catch(err => {
      console.log('err', err.response.data)
      this.setState({err: JSON.stringify(err.response.data)})
      throw err
    })

  }

  render() {
    if (this.state.isLoggedin === true) {
      return (<Redirect to="/home"></Redirect>)
    }
    return(
      <div>
        <h2>Login</h2>
        <Form>
          <FormGroup>
            <Label for='username'>Username</Label>
            <Input type='text' name='username' id='username' value={this.state.username} onChange={this.handleChange} placeholder='UserName'/>
            <p style={{color: 'red'}}>{ this.state.err.username ? this.state.err.username : null}</p>
          </FormGroup>
          <FormGroup>
            <Label for='password'>Password</Label>
            <Input type="password" name='password' id='password' value={this.state.password} onChange={this.handleChange} placeholder='Password' />
            <p style={{color: 'red'}}>{ this.state.err.password ? this.state.err.password : null}</p>
          </FormGroup>
          <Col className='text-right p-0'>
            <button 
              type="submit" 
              className="btn btn-secondary"
              onClick={ this.handleSubmit }
            >
              Login
            </button>
          </Col>
        </Form>
        <Row>
          {(this.state.err !== '')?(
            <Col>
              <Alert color='danger'>{this.state.err}</Alert>
            </Col>
          ):null}
        </Row>
      </div>
    )
  }
}
export default Login
