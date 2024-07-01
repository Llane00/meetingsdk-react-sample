import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import { KJUR } from 'jsrsasign'
import { inNumberArray, isBetween, isRequiredAllOrNone, validateRequest } from './validations.js';

import * as request from 'request'

dotenv.config()
const app = express()
const port = process.env.PORT || 4000

app.use(express.json(), cors())
app.options('*', cors())

const propValidations = {
  role: inNumberArray([0, 1]),
  expirationSeconds: isBetween(1800, 172800)
}

const schemaValidations = [isRequiredAllOrNone(['meetingNumber', 'role'])]

const coerceRequestBody = (body) => ({
  ...body,
  ...['role', 'expirationSeconds'].reduce(
    (acc, cur) => ({ ...acc, [cur]: typeof body[cur] === 'string' ? parseInt(body[cur]) : body[cur] }),
    {}
  )
})

app.post('/api/generateSignature', (req, res) => {
  const requestBody = coerceRequestBody(req.body)
  const validationErrors = validateRequest(requestBody, propValidations, schemaValidations)

  if (validationErrors.length > 0) {
    return res.status(400).json({ errors: validationErrors })
  }

  const { meetingNumber, role, expirationSeconds } = requestBody
  const iat = Math.floor(Date.now() / 1000)
  const exp = expirationSeconds ? iat + expirationSeconds : iat + 60 * 60 * 2
  const oHeader = { alg: 'HS256', typ: 'JWT' }

  const oPayload = {
    appKey: process.env.ZOOM_MEETING_SDK_KEY,
    sdkKey: process.env.ZOOM_MEETING_SDK_KEY,
    mn: meetingNumber,
    role,
    iat,
    exp,
    tokenExp: exp
  }

  const sHeader = JSON.stringify(oHeader)
  const sPayload = JSON.stringify(oPayload)
  const sdkJWT = KJUR.jws.JWS.sign('HS256', sHeader, sPayload, process.env.ZOOM_MEETING_SDK_SECRET)
  return res.json({ signature: sdkJWT })
})

const setting = {
  "oauth": {
    "client_id": "ud4z3dUtQrSQNtghuezvaQ",
    "redirect_url": "https://master-prawn-aware.ngrok-free.app/auth"
  },
};

app.get("/api/redirect", (req, res) => {
  // res.json(setting);
  const code = req.query.code;
  const appURL = req.query.state;

  // const url = `https://zoom.us/oauth/token?grant_type=authorization_code&code=${code}&redirect_uri=${setting.oauth.redirect_url}`;
  const url = `https://zoom.us/oauth/authorize?response_type=code&client_id=${setting.oauth.client_id}&redirect_uri=${setting.oauth.redirect_url}`
  console.log("GET_TOKEN_URL:", url);
  console.log("GET_TOKEN AUTH PARAM (ClientID):", setting.oauth.client_id);
  // if (!process.env.OAUTH_CLIENT_SECRET) {
  //   console.warn("GET_TOKEN AUTH PARAM (ClientSecret): NOT INITIALIZED!. Maybe config is not valid.");
  // } else {
  //   console.log("GET_TOKEN AUTH PARAM (ClientSecret): exists(hidden)");
  // }
  request
    .post(url, (error, response, body) => {
      // Parse response to JSON
      console.log("ERROR:", JSON.stringify(error));
      console.log("RESPONSE:", JSON.stringify(response));

      body = JSON.parse(body);
      const accessToken = body.access_token;
      const refreshToken = body.refresh_token;
      console.log(`access_token: ${accessToken}`);
      console.log(`refresh_token: ${refreshToken}`);

      const headers = {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      };

      // // set request headers
      // request.defaults({ headers: headers });

      request
        .get(`https://api.zoom.us/v2/users/me/token?type=zak`, (error, response, body) => {
          if (error) {
            console.log("API Response Error: ", error);
          } else {
            body = JSON.parse(body);
            // console.log("RESPONSE:", JSON.stringify(response));
            // console.log("ERROR:", JSON.stringify(error));
            const zak = body.token;
            console.log(`zak: ${zak}`);
            const redirectURL = `${appURL}?accessToken=${accessToken}&zak=${zak}`;
            res.redirect(redirectURL);
          }
        })
        .auth(null, null, true, body.access_token);
    })
    .auth(setting.oauth.client_id, process.env.OAUTH_CLIENT_SECRET);
});

app.listen(port, () => console.log(`Zoom Meeting SDK Auth Endpoint Sample Node.js, listening on port ${port}!`))
