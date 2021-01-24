// import logo from './logo.svg';
import { Component } from 'react'
import { Container, Row, Col, Table } from 'reactstrap'
import moment from 'moment'
import { Link } from 'react-router-dom'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import BackButton from '../components/BackButton'
import axiosInstance from '../actions/axiosApi'
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

class CamerasPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      cameraList: []
    }
  }
  componentDidMount(){
    this.refreshList();
  }
  refreshList = () => {
    axiosInstance
      .get('/api/cameras/')
      .then(res => {
        res.data = JSON.parse(JSON.stringify(res.data).replace(/null/g, '""'))
        console.log(res.data)
        this.setState({ cameraList:res.data })
      })
      .catch(err => console.log(err))
  }
  renderItems = () => {
    const newItems = this.state.cameraList
    return newItems.map((item, index) => (
      <tr key={index}>
        <th scope='row' style={{verticalAlign: 'middle'}}>
          {index + 1}
        </th>
        <td>
          {item.camera_id}
        </td>
        <td>
          {item.battery_level}
        </td>
        <td>
          {moment(item.setup_date).format('YYYY-MM-DD hh:mm:ss')}
        </td>
        <td>
          {moment(item.last_active_time).format('YYYY-MM-DD hh:mm:ss')}
        </td>
        <td>
          <Link 
            to={{
              pathname: `/cameras/${item.camera_id}`,
              state: {
                edit: false
              }
            }}
          >
            <button type="button" className="btn btn-outline-light">View</button>
          </Link>
        </td>
      </tr>
    ))
  }

  render() {
    return (
      <Container>
        <Row>
          <Col md='4' className='p-0'>
            <BackButton
              url='/'
              text='Back to Home'
            />
          </Col>
          <h3 className='col-md-4 text-center p-0'> Camera Information </h3>
          <div className='col-md-4 text-right p-0'>
            <Link
              to={{
                pathname: '/cameras/create',
                state: {
                  edit: true
                }
              }}
            >
              <button type="button" className="btn btn-add">
                <FontAwesomeIcon icon={faPlus} />{' '}<b>Add</b>
              </button>
            </Link>
            
          </div>
        </Row>
        <Row>
          <div className="col-md-12 col-sm-10 mx-auto p-0">
            <Table bordered striped dark hover className='middleTable'>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Camera ID</th>
                  <th>Battery Level (%)</th>
                  <th>Setup Date</th>
                  <th>Last Active Time</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {this.renderItems()}
              </tbody>
            </Table>
          </div>
        </Row>
        
      </Container>
    )
  }  
}

export default CamerasPage
