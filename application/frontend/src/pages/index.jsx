/*index.jsx*/
import React from 'react'
import { Container } from 'reactstrap'
import { Link } from 'react-router-dom'
//Functional Component 
const MainPage = () => {
  return (
    <Container>
      <h3 className='text-center'>Welcome to the Wildlife Monitoring System</h3>
      <h6>Home</h6>
      <div>
        <div>
          <Link to='/users'>Show List of Users</Link>
        </div>
        <div>
          <Link to='/records'>Show List of Records</Link>
        </div>
        <div>
          <Link to='/cameras'>Show List of Cameras</Link>
        </div>
      </div>
    </Container>
  );
};

export default MainPage;