import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { useState } from 'react';

function App() {
  const URL = 'http://localhost:8000/'

  const [currentSptInput , setCurrentSptInput] = useState('');
  const [ytUrl, setYtUrl] = useState(''); 

  const SptToYT = async (spotifyUrl) => {
    const url = URL + spotifyUrl;
    console.log(url);
    let response = fetch(url, { method: 'GET' });
    response.then(
      (response) => {
        let js = response.json();
        js.then((result) => {console.log(result); setYtUrl(result.ytUrl)});
      }
    ).catch((error)=>{ console.log(error) });
  }


  const HandleOnSpotifySubmit = () => {
    let regex = /^https:.*?\/track\/(.*?)\?.*\b/
    let str = currentSptInput.match(regex);
    SptToYT(str[1]);
  }

  return (
    <>
      <Container fluid>
        <Row>
          <Col style={{ background: "rgb(105, 220, 114)", paddingTop: '10%', paddingBottom: '6%' }}>
            
              <Form>
                <Form.Control
                  placeholder="Spotify URL"
                  aria-label="Spotify URL"
                  aria-describedby="basic-addon2"
                  type='text'
                  onChange={(e) => { setCurrentSptInput(e.target.value) }}
                />
              </Form>
              

          </Col>
          <Col style={{ background: "rgb(234,52,35)", paddingTop: '10%', paddingBottom: '6%' }}>
              <Form id="YTURL">
                <Form.Control
                  placeholder="Youtube URL"
                  aria-label="Youtube URL"
                  aria-describedby="basic-addon2"
                  type='text'
                  value={ytUrl}
                />
              </Form>
          </Col>
        </Row>
        <Row>
          <Col ></Col>
          <Col style={{ textAlign: 'center' }}>
            <Button
              variant="dark"
              onClick={HandleOnSpotifySubmit}
            >
              Get Youtube URL for Spotify Track
            </Button>
          </Col>
          <Col ></Col>

        </Row>

      </Container>
    </>
  );
}

export default App;
