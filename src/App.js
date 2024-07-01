import React from 'react';

import './App.css';
import { ZoomMtg } from '@zoom/meetingsdk';

ZoomMtg.preLoadWasm();
ZoomMtg.prepareWebSDK();

function App() {
  var authEndpoint = 'http://localhost:4000'
  var sdkKey = 'ud4z3dUtQrSQNtghuezvaQ'
  var meetingNumber = '84717806061'
  var passWord = 's0fjZg'
  var role = 0
  var userName = 'Llane00'
  var userEmail = 'llane@126.com'
  // var registrantToken = ''
  // var zakToken = ''
  var leaveUrl = 'http://localhost:3000'

  function getSignature(e) {
    e.preventDefault();

    fetch(`${authEndpoint}/api/generateSignature`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        meetingNumber: meetingNumber,
        role: role
      })
    }).then(res => res.json())
      .then(response => {
        // getAccessToken();
        startMeeting(response.signature)
      }).catch(error => {
        console.error(error)
      })
  }

  // function getAccessToken() {
  //   fetch(`${authEndpoint}/api/redirect`, {
  //     method: 'GET',
  //     headers: { 'Content-Type': 'application/json' }
  //   }).then(res => res.json())
  //     .then(response => {
  //       console.log(111111, response);
  //     }).catch(error => {
  //       console.error(error)
  //   })
  // }

  function startMeeting(signature) {
    document.getElementById('zmmtg-root').style.display = 'block'

    ZoomMtg.init({
      leaveUrl: leaveUrl,
      patchJsMedia: true,
      leaveOnPageUnload: true,
      success: (success) => {
        console.log('init success', success)
        console.log(111, {
          sdkKey: sdkKey,
          signature: signature,
          meetingNumber: meetingNumber,
          passWord: passWord,
          userName: userName,
          userEmail: userEmail,
        })

        try {
          ZoomMtg.join({
            sdkKey: sdkKey,
            signature: signature,
            meetingNumber: meetingNumber,
            passWord: passWord,
            userName: userName,
            // userEmail: userEmail,
            // tk: registrantToken,
            // zak: zakToken,
            success: (success) => {
              console.log('join success', success)
            },
            error: (error) => {
              console.log('join error', error)
            }
          })
        } catch (error) {
          console.log(2, error)
        }

        

      },
      error: (error) => {
        console.log('error', error)
      }
    })

  }

  return (
    <div className="App">
      <main>
        <h1>Zoom Meeting SDK Sample React</h1>

        <button onClick={getSignature}>Join Meeting</button>
      </main>
    </div>
  );
}

export default App;
