import moment from 'moment'
import { Component } from 'react'
import { 
  Container, 
  Row,
  Col, 
  Table 
} from 'reactstrap'
import {
  Link,
} from 'react-router-dom'

import axiosInstance from '../actions/axiosApi'
import BackButton from '../components/BackButton'
export default class RecordsPage extends Component {
  constructor(props) {
    super(props);
    console.log('constructor', props)
    this.state = {
      recordsList: [],
      date: '',
      camera: '',
    }
  }
  componentDidMount () {
    console.log(this.props.location.search)
    // console.log('history', this.props.location.state.from)
    this.setState({params: this.props.location.search}, () => {
      this.refreshList()
    })
  }
  refreshList = () => {
    axiosInstance
      .get(`/api/extracted_data/${this.props.location.search}`)
      .then(res => {
        res.data = JSON.parse(JSON.stringify(res.data).replace(/null/g, '""'))
        console.log(res.data)
        this.setState({ recordsList:res.data })
      })
      .catch(err => console.log(err))
  }

  renderItems = () => {
    const newItems = this.state.recordsList
    return newItems.map((item, index) => (
      <tr key={index}>
        <th scope='row' style={{verticalAlign: 'middle'}}>
          {index + 1}
        </th>
        <td>
          {item.type.name}
        </td>
        <td>
          {(item.corrected_data !== '') ? (
            item.corrected_data
          ) : (
            item.amount
          )}
        </td>
        <td>
          {item.image.taken_camera.camera_id}
        </td>
        <td>
          {moment(item.image.taken_time).format('YYYY-MM-DD hh:mm:ss')}
        </td>
        <td>
          <Link 
            to={`/gallery/${item.image.image_id}`}
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
          <h3 className='col-md-4 text-center p-0'> Records Information </h3>
        </Row>
        <Row>
          <div className="col-md-12 col-sm-10 mx-auto p-0">
            <Table bordered striped dark hover className='middleTable'>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Taken Camera ID</th>
                  <th>Taken Time</th>
                  <th>Image</th>
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