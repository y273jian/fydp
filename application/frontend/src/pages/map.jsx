import React from 'react';
import moment from 'moment'
import { Map, Overlay, Marker } from 'pigeon-maps'
import { Container, Row, Col, Card, CardTitle, CardText } from 'reactstrap'
import { Link } from 'react-router-dom'
import BackButton from '../components/BackButton'
import axiosInstance from '../actions/axiosApi'
export default class MapPage extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      cameras: [],
      markers: []
    }

  }
  componentDidMount(){
    this.refreshList()
    
  }
  refreshList = () => {
    axiosInstance
      .get('/api/cameras')
      .then(res => {
        res.data = JSON.parse(JSON.stringify(res.data).replace(/null/g, '""'))
        console.log(res.data)
        this.setState({ cameras:res.data }, () => {
          this.createMarkers()
        })
        
      })
      .catch(err => console.log(err))
    
  }

  createMarkers = () => {
    const markers = this.state.cameras.map((camera, index) => {
      // console.log(camera)
      return ({
        name: 'camera'+index,
        latlng: [Number(camera.latitude), Number(camera.longitude)],
        camera_id: camera.camera_id,
        battery_level: camera.battery_level,
        last_active_time: moment(camera.last_active_time).format('YYYY-MM-DD hh:mm:ss a'),
        show: false
      })
    })
    this.setState({ markers:markers })
  }
  
  render() {
    // create an array with marker components
    
    const markers = this.state.markers

    const provider = (x, y, z) => {
      const s = String.fromCharCode(97 + ((x + y + z) % 3))
      return `https://${s}.tile.openstreetmap.org/${z}/${x}/${y}.png`
    }
    
    
    const handleMarkerClick = ({ event, payload, anchor }) => {
      console.log(`Marker #${payload} clicked at: `, anchor, event)
      markers[payload].show = !markers[payload].show
      this.setState({markers:markers})
      console.log('show', markers)
    }
    
    const PigeonMarkers = markers.map((marker, index) => (
      
      <Marker
        key={`marker_${marker.name}`}
        anchor={marker.latlng}
        payload={index}
        onClick={handleMarkerClick}
      />
    ));
    const PigeonOverlays = markers.map((marker, index) => (
      marker.show?<Overlay
        style={{zIndex: 1}} 
        key={`overlay_${marker.name}`}
        anchor={marker.latlng}
        payload={index}
        offset={[0, 0]}>
        <Card body style={{ width: 300 }}>
          <CardTitle tag='h6'>{marker.name}</CardTitle>
          <hr style={{ marginBottom: 5, marginTop: 0 }}/>
          <CardText style={{ fontSize: 13 }}>
            <b>Camera ID: </b>{marker.camera_id}<br/>
            <b>Location: </b>{`[${marker.latlng[0]}, ${marker.latlng[1]}]`}<br/>
            <Link to={{
              pathname: `/cameras/${marker.camera_id}`,
              state: {
                edit: false
              }
            }}>
              <i style={{ color:'grey' }}>Click for more detail</i>
            </Link>
          </CardText>

        </Card>
      </Overlay>:null
    ))

    return (
      <Container>
        <Row>
          <Col md='4' className='p-0'>
            <BackButton
              url='/'
              text='Back to Home'
            />
          </Col>
          <h3 className='col-md-4 text-center p-0'> Camera Locations </h3>
        </Row>
        <Row>
          <Col>
            <Map

              height={600}
              defaultCenter={[43.4653171, -80.5327216]}
              // defaultZoom={11}
              provider={provider}
            >
              {PigeonOverlays}
              {PigeonMarkers}
              
            </Map>
            
          </Col>
        </Row>
        
      </Container>
    );
  }
  
}