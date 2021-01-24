/* eslint-disable no-unused-vars */
import {Component} from 'react'
import {
  XYPlot, 
  VerticalGridLines, 
  HorizontalGridLines, 
  XAxis,
  YAxis,
  VerticalBarSeries, // eslint-disable-line no-unused-vars
  LineMarkSeries, // eslint-disable-line no-unused-vars
  Hint,
  DiscreteColorLegend,
  ChartLabel
} from 'react-vis'
import '../../node_modules/react-vis/dist/style.css';
import moment from 'moment'
import { extendMoment } from 'moment-range'
import _ from 'lodash'
import { Container, Row, Col, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'
import BackButton from '../components/BackButton'
import axiosInstance from '../actions/axiosApi'


// import './styles.css';
const moment_extend = extendMoment(moment)
export default class ChartsPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      extracted_data: [],
      prevState: false,
      current_value_date: false,
      current_value_loc: false,
      selected_point_id: null,
      type: ''
    }
  }
  componentDidMount(){
    this.refreshList();
  }
  refreshList = () => {
    axiosInstance
      .get('/api/extracted_data/')
      .then(res => {
        res.data = JSON.parse(JSON.stringify(res.data).replace(/null/g, '""'))
        
        this.setState({ extracted_data: this.groupByType(res.data) })
      })
      .catch(err => console.log(err))
  }
  groupByType (rawData) {
    const groupByType = _.groupBy(rawData, (data) => {
      var type = data.type.name
      if (type === '') {
        type = 'unknown'
      }
      return type
    })
    this.setState({type: Object.keys(groupByType)[0]})
    return groupByType
  }

  processDate (groupByType) {
    let groupsByDate = {}
    
    for (const [key, value] of Object.entries(groupByType)) {
      let groupByDate= _.groupBy(value, (data) => {
        var taken_date = moment(data.image.taken_time).format('YYYY-MM-DD')
        return taken_date
      })
      const totals = _.map(groupByDate, (value, key) => {
        return {
          x: key,
          y: _.reduce(value, (total, o) => {
            if (o.corrected_data !== '') {
              return total + o.corrected_data
            } else {
              return total + o.amount
            }
          }, 0)
        }
      }).reverse().map((d,x)=> ({...d, id: 'date-'+key+x}))
      groupsByDate[key] = totals
    }
     
    return groupsByDate
  }
  
  processLoc (groupByType) {
    let groupsByLoc = {}
    for (const [key, value] of Object.entries(groupByType)) {
      // console.log(key, value)
      let groupByLoc= _.groupBy(value, (data) => {
        var taken_camera = data.image.taken_camera.camera_id
        return taken_camera
      })
      const totals = _.map(groupByLoc, (value, key) => {
        return {
          'camera id': key,
          y: _.reduce(value, (total, o) => {
            return total + o.amount
          }, 0)
        }
      }).reverse().map((d,x)=> ({...d, x: 'camera '+(x+1), id: 'loc-'+key+x}))
      groupsByLoc[key] = totals
    }

    // console.log('groupByLoc',groupsByLoc)

    return groupsByLoc
  }

  generate_range (totals) {
    const range = moment_extend.range(moment(totals[0]['x']), moment(totals[totals.length-1]['x']))
    const range_array = Array.from(range.by('day')).map(x => x.format('YYYY-MM-DD'))
    return range_array
  }

  renderDateChart = (data, SVGComponentGen) => {
    // console.log(data)
    let range_array 
    if(data[0]!==undefined) {
      range_array = this.generate_range(data)
    }
    const {yMin, yMax} = data.reduce((acc, row) => ({
      yMax: Math.max(acc.yMax, row.y+2),
      yMin: Math.min(acc.yMin, 0)
    }), {yMin: Infinity, yMax: -Infinity})
    let SVGComponent= SVGComponentGen
    SVGComponent.data = data
    return(
      <Container>
        <Row><Col className='text-center'><h6>Date vs. Sightings</h6></Col></Row>
        <Row>
          <Col md={{size: 9, offset: 1}}>
            <XYPlot
              onMouseLeave={() => this.setState({ selected_point_id: null, current_value_date: false})}
              height={300}
              width={700}
              margin={{bottom: 80}}
              xType='ordinal' 
              xDomain={range_array}
              yDomain={[yMin, yMax]}
            >
              <VerticalGridLines />
              <HorizontalGridLines />
              <XAxis tickLabelAngle={-45}/>
              <YAxis />
              <ChartLabel 
                text="Date"
                className="alt-x-label"
                includeMargin={false}
                xPercent={0.5}
                yPercent={1.4}
              />
              <VerticalBarSeries {...SVGComponent} />
              {this.state.current_value_date ? <Hint value={this.state.current_value_date} /> : null}
            </XYPlot>
          </Col>
          <Col md='2'>
            <DiscreteColorLegend items={['Deer']}/>
          </Col>
        </Row>
        
      </Container>
    )
        
  }

  renderLocChart = (data, SVGComponentGen) => {
    // console.log('renderLocChart', data)
    const {yMin, yMax} = data.reduce((acc, row) => ({
      yMax: Math.max(acc.yMax, row.y+2),
      yMin: Math.min(acc.yMin, 0)
    }), {yMin: Infinity, yMax: -Infinity})
    let SVGComponent= SVGComponentGen
    SVGComponent.data = data
    return(
      <Container>
        <Row><Col className='text-center'><h6>Location vs. Sightings</h6></Col></Row>
        <Row>
          <Col md={{size: 9, offset: 1}}>
            <XYPlot
              onMouseLeave={() => this.setState({ selected_point_id: null, current_value_loc: false})}
              height={300}
              width={700}
              margin={{bottom: 80}}
              xType='ordinal' 
              // xDomain={range_array}
              yDomain={[yMin, yMax]}
            >
              <VerticalGridLines />
              <HorizontalGridLines />
              <XAxis />
              <YAxis />
              <ChartLabel 
                text="Location"
                className="alt-x-label"
                includeMargin={false}
                xPercent={0.5}
                yPercent={1.3}
              />
              <VerticalBarSeries {...SVGComponent} />
              {this.state.current_value_loc ? <Hint value={this.state.current_value_loc} /> : null}
            </XYPlot>
          </Col>
          <Col md='2'>
            <DiscreteColorLegend items={[this.state.type]}/>
          </Col>
        </Row>
        
      </Container>
    )
        
  }

  toggle = () => this.setState({prevState: !this.state.prevState})

  render() {
    const groupByType = this.state.extracted_data
    const dateData = this.processDate(groupByType)
    const locData = this.processLoc(groupByType)
    const selectedPointId = this.state.selected_point_id
    const SVGComponentDate = {
      animation: true,
      sizeRange: [5, 15],
      colorType: 'literal',
      onNearestX: value => {
        this.setState({
          current_value_date:{
            x: value.x,
            y: value.y,
            id: value.id
          },
          selected_point_id:value.id,
        })
      },
      getColor: d => d.id === selectedPointId ? '#FF9833' : '#12939A',
      onValueClick: (datapoint)=>{
        // does something on click
        // you can access the value of the event
        // console.log('onValueClick', datapoint)
        this.props.history.push(`/records?date=${datapoint.x}&type=${this.state.type}`);
      }
    }
    let SVGComponentLoc = {
      animation: true,
      sizeRange: [5, 15],
      colorType: 'literal',
      barWidth: 0.5,
      onNearestX: value => {
        this.setState({
          current_value_loc:{
            x: value.x,
            y: value.y,
            id: value.id
          },
          selected_point_id:value.id,
        })
      },
      getColor: d => d.id === selectedPointId ? '#FF9833' : '#12939A',
      onValueClick: (datapoint)=>{
        // does something on click
        // you can access the value of the event
        // console.log('onValueClick', datapoint)
        this.props.history.push(`/records?camera=${datapoint['camera id']}&type=${this.state.type}`);
      }
    }

    return (
      <Container>
        <Row>
          <Col md='4' className='p-0'>
            <BackButton
              url='/'
              text='Back to Home' 
            />
          </Col>
          <h3 className='col-md-4 text-center p-0'> Sightings Charts </h3>
          <Col md='3' className='text-right'>
            <Dropdown isOpen={this.state.prevState} toggle={this.toggle}>
              <DropdownToggle caret>
                {this.state.type}
              </DropdownToggle>
              <DropdownMenu>
                {Object.keys(groupByType).map((key) => {
                  return (
                    <DropdownItem key={key} onClick={() => this.setState({type: key})}>
                      {key}
                    </DropdownItem>
                  )
                })}
              </DropdownMenu>
              
            </Dropdown>
          </Col>
        </Row>
        {(Object.keys(dateData).length) ? (
          this.renderDateChart(dateData[this.state.type], SVGComponentDate)
        ):null}
        {(Object.keys(locData).length) ? (
          this.renderLocChart(locData[this.state.type], SVGComponentLoc)
        ):null}
        
        <style jsx>{`
        .rv-xy-plot {
          margin: auto
        }
        .rv-hint {
          pointer-events: auto
        }
        
        `}</style>
      </Container>
      
    );
  }
  
}

