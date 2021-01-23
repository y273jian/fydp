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
          <Link to='/charts'>Charts</Link>
        </div>
        <div>
          <Link to='/cameras'> Cameras</Link>
        </div>
        <div>
          <Link to='/maps'>Map</Link>
        </div>
        <div>
          <Link to='/records'>Records</Link>
        </div>
        <div>
          <Link to='/gallery'>Gallery</Link>
        </div>
      </div>
    </Container>
  );
};

export default MainPage;