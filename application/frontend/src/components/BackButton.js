import { Link } from 'react-router-dom'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faCaretLeft } from '@fortawesome/free-solid-svg-icons'

const BackButton = (props) => {
  return (
    <Link to={`${props.url}`}>
      <button type="button" className="btn btn-back">
        <FontAwesomeIcon icon={faCaretLeft} />{' '}<b>{props.text}</b>
      </button>
    </Link>
  )
}


export default BackButton