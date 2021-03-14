// import axios from 'axios';
import { Component } from 'react'
import { Container, Row, Col, Form, FormGroup, Label, Input, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import BackButton from '../components/BackButton'
import axiosInstance from '../actions/axiosApi'

class CameraDetailPage extends Component {
  constructor(props) {
    super(props);
    console.log(props)
    this.state = {
      camera: {},
      edit: this.props.location.state.edit,
      modal: false,
      delete: false,
      created: false,
    }
  }
  componentDidMount () {
    console.log(this.props)
    const { cameraId } = this.props.match.params
    if (this.state.delete===false) {
      this.refreshPage(cameraId)
    }
  }

  toggle = () => {
    console.log('toggle')
    this.setState({ modal: !this.state.modal });
  };

  handleChange = e => {
    let { name, value } = e.target;
    // console.log('name: ', name, 'value: ', value)
    if (e.target.type === 'checkbox') {
      value = e.target.checked;
      console.log(value)
    }
    const camera = { ...this.state.camera, [name]: value };
    this.setState({ camera });
  }

  handleSubmit = (camera) => {
    camera = JSON.parse(JSON.stringify(camera, function (key, value) {return (value === '') ? null : value}));

    console.log('handle submit camera: ', camera)
    if (camera.camera_id) {
      axiosInstance
        .put(`/api/cameras/${camera.camera_id}/`, camera)
        .then(() => this.refreshPage(camera.camera_id));
      return;
    }
    axiosInstance
      .post('/api/cameras/', camera)
      .then((res) => {
        console.log('POST res: ', res.data)
        this.setState({created: true})
        this.refreshPage(res.data.camera_id)
        
      });
  }

  handleDelete = camera => {
    console.log('handle delete', camera)
    axiosInstance
      .delete(`/api/cameras/${camera.camera_id}/`)
  }

  refreshPage = (cameraId) => {
    // console.log(this.state.edit)
    if (this.state.created) {
      this.props.history.push({
        pathname: `/cameras/${cameraId}/`,
        state: {
          edit: false
        }
      })
    }
    
    if (!this.state.edit) {
      axiosInstance
        .get(`/api/cameras/${cameraId}/`)
        .then(res => {
          res.data = JSON.parse(JSON.stringify(res.data).replace(/null/g, '""'))
          console.log(res.data)
          res.data.is_long_range = res.data.is_long_range==''?false:true
        
          this.setState({ camera:res.data })
        })
        .catch(err => console.log(err))
    }
    
  }

  renderDelete = (camera) => {
    console.log('render delete', camera)
    return (
      <Row>
        <Col className='text-center'><b>The camera with ID ({camera.camera_id}) is DELETED!</b></Col>
      </Row>
    )
  }

  renderDetails = (camera) => {
    // let camera = this.state.camera
    // camera.is_long_range = true
    // console.log(camera)
    return (
      // console.log('key',entry[0], 'value',entry[1])
      <Form>
        <FormGroup row>
          <Label md={{ size: 3, offset: 2}} className='text-right'><b>Camera Alias: </b></Label>
          {!this.state.edit ? (        
            <Col md='5' className='col-form-label'>{camera.camera_alias!=''?`${camera.camera_alias}`:'no name'}</Col>
          ) : (
            <Col md='5'>
              <Input 
                value={camera.camera_alias} 
                name='camera_alias'
                onChange={this.handleChange}
              />
            </Col>
          )}
        </FormGroup>
        <FormGroup row>
          <Label md={{ size: 3, offset: 2}} className='text-right'><b>Camera ID: </b></Label>
          {!this.state.edit ? (        
            <Col md='5' className='col-form-label'>{camera.camera_id!=''?`${camera.camera_id}`:'no record'}</Col>
          ) : (
            <Col md='5'>
              <Input 
                value={camera.camera_id} 
                name='camera_id'
                onChange={this.handleChange}
                disabled
              />
            </Col>
          )}
        </FormGroup>
        <FormGroup row>
          <Label md={{ size: 3, offset: 2}} className='text-right'><b>Serial No.: </b></Label>
          {!this.state.edit ? (        
            <Col md='5' className='col-form-label'>{camera.serial_number!=''?`${camera.serial_number}`:'no record'}</Col>
          ) : (
            <Col md='5'>
              <Input 
                value={camera.serial_number} 
                name='serial_number'
                onChange={this.handleChange}
              />
            </Col>
          )}
        </FormGroup>
        <FormGroup row>
          <Label md={{ size: 3, offset: 2}} className='text-right'><b>Bandwidth: </b></Label>
          {!this.state.edit ? (        
            <Col md='5' className='col-form-label'>{camera.bandwidth!=''?`${camera.bandwidth} Mbps`:'no record'}</Col>
          ) : (
            <Col md='5'>
              <Input
                type='number' 
                value={camera.bandwidth}
                name='bandwidth'
                onChange={this.handleChange}
                placeholder='Mbps'
              />
            </Col>
          )}
        </FormGroup>
        <FormGroup row>
          <Label md={{ size: 3, offset: 2}} className='text-right'><b>Bit Rate: </b></Label>
          {!this.state.edit ? (        
            <Col md='5' className='col-form-label'>{camera.bit_rate!=''?`${camera.bit_rate} bps`:'no record'}</Col>
          ) : (
            <Col md='5'>
              <Input 
                type='number'
                name='bit_rate'
                onChange={this.handleChange}
                value={camera.bit_rate} 
                placeholder='bps'
              />
            </Col>
          )}
        </FormGroup>
        <FormGroup row>
          <Label md={{ size: 3, offset: 2}} className='text-right'><b>Frequency Deviation: </b></Label>
          {!this.state.edit ? (        
            <Col md='5' className='col-form-label'>{camera.freq_deviation!=''?`${camera.freq_deviation} Hz`:'no record'}</Col>
          ) : (
            <Col md='5'>
              <Input 
                type='number'
                name='freq_deviation'
                onChange={this.handleChange}
                value={camera.freq_deviation} 
                placeholder='Hz'
              />
            </Col>
          )}
        </FormGroup>
        <FormGroup row>
          <Label md={{ size: 3, offset: 2}} className='text-right'><b>Is Long Range: </b></Label>
          {!this.state.edit ? (
            <Col md='5' className='col-form-label'>{camera.is_long_range!==''?`${camera.is_long_range?'Yes':'No'}`:'no record'}</Col>
          ) : (
            <Label md='5' for="is_long_range">
              <Col>
                <Input
                  type="checkbox"
                  name="is_long_range"
                  checked={camera.is_long_range}
                  onChange={this.handleChange}
                />
            Long Range
              </Col>
            </Label>
          )}
          
        </FormGroup>
        <FormGroup row>
          <Label md={{ size: 3, offset: 2}} className='text-right'><b>Altitude: </b></Label>
          {!this.state.edit ? (        
            <Col md='5' className='col-form-label'>{camera.altitude!=''?`${camera.altitude} m`:'no record'}</Col>
          ) : (
            <Col md='5'>
              <Input 
                type='number'
                name='altitude'
                onChange={this.handleChange}
                value={camera.altitude} 
                placeholder='m'
              />
            </Col>
          )}
        </FormGroup>
        <FormGroup row>
          <Label md={{ size: 3, offset: 2}} className='text-right'><b>Location: </b></Label>
          {!this.state.edit ? (
            <Col md='5' className='col-form-label'>{
              (camera.latitude != '' && camera.longitude != '' && 
              camera.latitude !== undefined && camera.longitude !== undefined ) ? (
                  `${(camera.latitude)>0?camera.latitude+' N':camera.latitude.substring(1)+' S'}, \
                  ${(camera.longitude)>0?camera.longitude+' E':camera.longitude.substring(1)+' W'}`
                ) : (
                  'no record'
                )
            }</Col>
          ) : (
            <Col md='5'>
              <Row className='m-0'>
                <Col md='6' style={{paddingLeft:0}}>
                  <FormGroup className='m-0'>
                    <Input
                      type='number'
                      name='latitude'
                      onChange={this.handleChange}
                      value={camera.latitude} 
                      placeholder='Latitude'
                    />
                  </FormGroup>
                </Col>
                <Col md='6' style={{paddingRight:0}}>
                  <FormGroup className='m-0'>
                    <Input 
                      type='number'
                      name='longitude'
                      onChange={this.handleChange}
                      value={camera.longitude} 
                      placeholder='Longitude'
                    />
                  </FormGroup>
                </Col>
              </Row>
            </Col>
          )}
        </FormGroup>
        <FormGroup row>
          <Label md={{ size: 3, offset: 2}} className='text-right'><b>Spread Factor: </b></Label>
          {!this.state.edit ? (        
            <Col md='5' className='col-form-label'>{camera.spread_factor!=''?`${camera.spread_factor}`:'no record'}</Col>
          ) : (
            <Col md='5'>
              <Input 
                type='number'
                name='spread_factor'
                onChange={this.handleChange}
                value={camera.spread_factor} 
                placeholder=''
              />
            </Col>
          )}
        </FormGroup>
        <FormGroup row>
          <Label md={{ size: 3, offset: 2}} className='text-right'><b>Transmit Power: </b></Label>
          {!this.state.edit ? (        
            <Col md='5' className='col-form-label'>{camera.transmit_power!=''?`${camera.transmit_power} dBm`:'no record'}</Col>
          ) : (
            <Col md='5'>
              <Input 
                type='number'
                name='transmit_power'
                onChange={this.handleChange}
                value={camera.transmit_power} 
                placeholder='dBm'
              />
            </Col>
          )}
        </FormGroup>
        <FormGroup row>
          <Label md={{ size: 3, offset: 2}} className='text-right'><b>Battery Level: </b></Label>
          {!this.state.edit ? (        
            <Col md='5' className='col-form-label'>{camera.battery_level!=''?`${camera.battery_level} %`:'no record'}</Col>
          ) : (
            <Col md='5'>
              <Input 
                type='number'
                name='battery_level'
                onChange={this.handleChange}
                value={camera.battery_level} 
                placeholder='%'
              />
            </Col>
          )}
        </FormGroup>
        
      </Form>
    )
      
  }

  render() {
    // const camera = this.props.location.state.camera
    // console.log(camera)
    let camera = this.state.camera
    return (
      <Container>
        <Row>
          <Col md='4' className='p-0'>
            <BackButton
              url='/cameras'
              text='Back to Camera List'
            />
          </Col>
          <Col md='4' className='p-0 text-center'><h4>Camera Detail</h4></Col>
          <Col md='4' className='p-0'></Col>
        </Row>
        <Container hidden={!this.state.delete}>
          {this.renderDelete(camera)}
        </Container>
      
        <Container hidden={this.state.delete}>
          {this.renderDetails(camera)}
          <Row>
            <Col md={{ size: 2, offset: 2 }}>
              <button 
                type="button" 
                className="btn btn-outline-danger"
                onClick={ () => this.setState({modal: true}) }
                disabled={ this.state.modal || this.state.edit }
              >
              Delete
              </button>
            </Col>
            <Col md={{ size: 4, offset: 2}} className='p-0 text-right'>
              {!this.state.edit ? (
                <button 
                  type="button" 
                  className="btn btn-outline-dark"
                  onClick={ () => this.setState({edit: true}) }
                  disabled={ this.state.edit }
                >
              Edit
                </button>
              ) : (
                <button 
                  type="button" 
                  className="btn btn-outline-primary"
                  onClick={ () => {
                    this.handleSubmit(camera)
                    this.setState({ edit: false })
                  } }
                  disabled={ !this.state.edit }
                >
              Save
                </button>)}
            </Col>
          </Row>
          {this.state.modal ? (
            <Modal
              isOpen={true}
              toggle={this.toggle}
            >
              <ModalHeader toggle={this.toggle}>Confirmation</ModalHeader>
              <ModalBody>
              Are you sure to delete the camera with ID: {this.state.camera.camera_id} ?
              </ModalBody>
              <ModalFooter>
                <button 
                  type="button" 
                  className="btn btn-outline-danger"
                  onClick={ () => {
                    this.handleDelete(camera)
                    this.setState({ delete: true, modal:false })
                  } }
                >
              Yes
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={ () => this.setState({modal: false}) }
                >
              No
                </button>
              </ModalFooter>
            </Modal>
          ) : null

          }
        </Container>
      </Container>
    )
  }
}

export default CameraDetailPage