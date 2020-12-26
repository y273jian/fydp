import { Component } from 'react'
import {
  XYPlot, 
  VerticalGridLines, 
  HorizontalGridLines, 
  XAxis,
  YAxis,
  LineMarkSeries
} from 'react-vis'
import '../../node_modules/react-vis/dist/style.css';

import { Container, Row, } from 'reactstrap'
// import './styles.css';

export default class RecordsPage extends Component {
  
  render() {
    const data1 = [
      {x: 0, y: 8},
      {x: 1, y: 5},
      {x: 2, y: 4},
      {x: 3, y: 9},
      {x: 4, y: 1},
      {x: 5, y: 7},
      {x: 6, y: 6},
      {x: 7, y: 3},
      {x: 8, y: 2},
      {x: 9, y: 0}
    ];
    const data2 = [
      {x: 0, y: 8},
      {x: 1, y: 6},
      {x: 2, y: 9},
      {x: 3, y: 2},
      {x: 4, y: 3},
      {x: 5, y: 7},
      {x: 6, y: 10},
      {x: 7, y: 3},
      {x: 8, y: 8},
      {x: 9, y: 0}
    ];
    return (
      <div>
        <Container>
          <Row>
            <iframe src="http://localhost:4000/dashboard/snapshot/7G7GOfdcipDNubb0bDX0sa3oOi50235p" width="450" height="200" frameBorder="0"></iframe>
          </Row>
          <Row>
            <XYPlot height={300} width={300}>
              <VerticalGridLines />
              <HorizontalGridLines />
              <XAxis />
              <YAxis />
              <LineMarkSeries data={data1} style={{mark:{stroke: 'white'}}}/>
              <LineMarkSeries data={data2} style={{mark:{stroke: 'white'}}}/>
            </XYPlot>
          </Row>
        
        </Container>
        <style jsx>{`
        .rv-xy-plot {
          margin: auto
        }
        `}</style>
      </div>
      
    );
  }
  
}

