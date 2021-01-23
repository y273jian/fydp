import _ from 'lodash'
import { Component } from 'react'
import ImageGallery from 'react-image-gallery'
import { 
  Container,
  Row,
  Col,
} from 'reactstrap'


import BackButton from '../components/BackButton'
import axiosInstance from '../actions/axiosApi'
// const images = [
//   {
//     original: '/images/deer01.jpg',
//     // thumbnail: 'https://picsum.photos/id/1018/250/150/',
//   },
//   {
//     original: '/images/deer02.jpg',
//     // thumbnail: 'https://picsum.photos/id/1015/250/150/',
//   },
//   {
//     original: '/images/deer03.jpg',
//     // thumbnail: 'https://picsum.photos/id/1019/250/150/',
//   },
// ];

export default class GalleryPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      imageList: [],
      image_id: ''
    }
  }
  componentDidMount(){
    const { imageId } = this.props.match.params
    console.log('imageId', imageId)
    this.refreshList(imageId);
  }
  refreshList = (imageId) => {
    console.log('refreshList')
    if (imageId === undefined) {
      imageId = ''
    }

    axiosInstance
      .get(`/api/images/${imageId}`)
      .then(res => {
        res.data = JSON.parse(JSON.stringify(res.data).replace(/null/g, '""'))
        console.log(res.data)
        this.setState({ imageList:res.data })
      })
      .catch(err => console.log(err))
  }
  reduceList = () => {
    let list = []
    if (!Array.isArray(this.state.imageList)) {
      console.log('is not array')
      list.push(this.state.imageList)
    } else {
      console.log('is array')
      list = this.state.imageList
    }
    let reduce = _.reduce(list, (result, entry) => {
      let item = {}
      if (entry.file_path !== '') {
        item['original'] = entry.file_path
        console.log('entry.file_path', entry)
        // item['originalAlt'] = entry.image_id
        result.push(item)
        console.log('original', item['original'])
      }
      return result
      
    }, [])
    return reduce
  }
  render() {
    const images = this.reduceList()
    return (
      <Container>
        <Row>
          <Col md='4' className='p-0'>
            <BackButton
              url='/'
              text='Back to Home'
            />
          </Col>
          <h3 className='col-md-4 text-center p-0'> Gallery </h3>
          
        </Row>
        <Row>
          <Col>
            <ImageGallery items={images} showThumbnails={false} />
          </Col>
        </Row>
      </Container>
    )
  }
}