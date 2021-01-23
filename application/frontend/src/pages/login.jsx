import { Component } from 'react'
import { Container, Row, Col } from 'reactstrap'
import Login from '../components/Login'
import SignUp from '../components/SignUp'

export default class LoginPage extends Component {
  constructor(props) {
    super(props);
    console.log(props)
    this.state = {}
  }

  render() {
    return(
      <Container>
        <Row>
          <Col md={6} style={{borderRightStyle: 'solid', borderRightColor: 'lightgrey', borderRightWidth: 'thin'}}>
            <Login/>
          </Col>
          <Col md={6} style={{borderLeftStyle: 'solid', borderLeftColor: 'lightgrey', borderLeftWidth: 'thin'}}>
            <SignUp/>
          </Col>
        </Row>
      </Container>

    )}
}