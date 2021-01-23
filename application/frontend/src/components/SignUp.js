/* eslint-disable no-useless-catch */
import { Component } from 'react'
import { 
  Form, 
  Label, 
  Input, 
  FormGroup, 
  Col,
  Row,
  Alert
} from 'reactstrap'

// import axios from 'axios'
import axiosInstance from '../actions/axiosApi'
class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '', 
      password: '', 
      email: '',
      err: {
        username: undefined,
        email: undefined,
        password: undefined
      }
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({[event.target.name]: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    axiosInstance.post('api/user/create/', {
      username: this.state.username,
      email: this.state.email,
      password: this.state.password
    }).then((res) => {
      this.setState({isSignedUp: true})
      return res.data
    }).catch(err => {
      if (err.response.status === 400){
        this.setState({err: err.response.data})
      } else {
        this.setState({isSignedUp: false, err: err.response.data})
      }
      
      throw err
    })

  }

  render() {
    return(
      <div>
        <h2>Sign Up</h2>
        <Form>
          <FormGroup>
            <Label for='username'>Username</Label>
            <Input type='text' name='username' id='username' value={this.state.username} onChange={this.handleChange} placeholder='UserName'/>
            <p style={{color: 'red'}}>{ this.state.err.username ? this.state.err.username : null}</p>
          </FormGroup>
          <FormGroup>
            <Label for='password'>email</Label>
            <Input type="email" name='email' id='email' value={this.state.email} onChange={this.handleChange} placeholder='Email' />
            <p style={{color: 'red'}}>{ this.state.err.email ? this.state.err.email : null}</p>
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
              Sign Up
            </button>
          </Col>
        </Form>
        <Row>
          {(this.state.isSignedUp===true)?(
            <Col>
              <Alert color='success'>{'You are signed up SUCCESSFULLY!'}</Alert>
            </Col>
          ):null}
          {(this.state.isSignedUp===false)?(
            <Col>
              <Alert color='danger'>{this.state.err}</Alert>
            </Col>
          ):null}
        </Row>
      </div>
    )
  }
}
export default SignUp
