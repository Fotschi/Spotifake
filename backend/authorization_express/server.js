// const express = require('express'); // for commonjs module system only
import express from 'express';
import helmet from 'helmet';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {v4 as uuidv4} from 'uuid';
import swaggerUi from 'swagger-ui-express';
import errorHandling from './middleware/errorHandling.js';
import logging from './middleware/logging.js';
import { router as ordersRouterV1 } from './routes/v1/orderRoute.js';
import openapiSpecification from './generateOpenAPI.js'

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';

// initialize swaggerUI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));

// --- In-memory "database" for demo purposes ---
const users = [
  // password: "password123" (hashed)
  { id: 'u1', username: 'alice', passwordHash: bcrypt.hashSync('password123', 8), scopes: ['read'] },
  { id: 'u2', username: 'bob',   passwordHash: bcrypt.hashSync('hunter2', 8), scopes: ['read','write'] }
];

// static API keys (in real app keep secret & store securely)
const apiKeys = new Set(['demo-api-key-1', 'demo-api-key-2']);

function findUserByUsername(username) {
  // array.find sucht nach einem Element im Array
  // und möchte als Parameter eine Funktion, die aufgrund eines
  // Elements entscheidet, ob es den Suchkriterien entspricht.
  // Man nennt Funktionen die als Prüfkriterium eingesetzt werden
  // Predicate -> Eine Funktion, die ein Element entgegennimmt und einen Wahrheitswert (true/false) zurückgibt.
  /*
  die arrow-function
  user => user.username === username

  ist dasselbe wie:
  function hasUserUsername(user) {
    if (user.username === username) {
      return true;
    }
    return false
  }
  */

  // return users.find(hasUserUsername);
  return users.find(user => user.username == username);
}

function findUserById(id) {
  return users.find(user => user.id == id);
}

// testbar via
// - browser: http://alice:password123@localhost:3000/auth/basic/private
// - curl: curl http://localhost:3000/auth/basic/private -u alice:password123
function basicAuth(request, response, next) {
  console.log(request.headers);

  const headerValue = request.headers['authorization'];

  if (!headerValue || !headerValue.startsWith('Basic ')) {
      return response
        .status(401)
        .set('WWW-Authenticate', 'Basic realm="User Visible Realm"')
        .json({ error: 'Missing Basic auth' });
  }

  const [, base64] = headerValue.split(' ');  // headerValue z.B. 'Basic YWxpY2U6cGFzc3dvcmQxMjM='
  const decoded = Buffer.from(base64, 'base64').toString('utf8');
  const [username, password] = decoded.split(':');
  if (!username || !password) {
    return response
      .status(400)
      .json({ error: 'Invalid Basic auth format' });
  }

  const user = findUserByUsername(username);
  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    return response
      .status(401)
      .json({ error: 'Invalid credentials' });
  }

  // setze auth information (methode basic und user-objekt)
  request.auth = { method: 'basic', user: user };


  next(); // call next middleware-function
}

// testbar via
// - browser: ohne extension nicht möglich
// - curl: curl http://localhost:3000/auth/apikey/private -H x-api-key:demo-api-key-2
function apiKeyAuth(request, response, next) {
  const key = request.headers['x-api-key'];
  if (!key || !apiKeys.has(key)) {
    return response
           .status(401)
           .json({ error: 'Invalid or missing API Key' });
  }
  // no user associated in this demo, but we set a pseudo-user
  request.auth = { method: 'apikey', key, user: { id: 'apikey-user', username: 'apikey' } };
  next();
}

// testbar via
// - browser: ohne Extension bzw. LoginPage nicht möglich.
// - curl: 
//   - curl -X POST http://localhost:3000/auth/jwt/login -d "username=alice&password=password123" 
//   - curl -X GET http://localhost:3000/auth/jwt/private -H "Authorization: Bearer eyJ...yqU"
function jwtAuth(request, response, next) {
  const header = request.headers['authorization'];
  if (!header || !header.startsWith('Bearer ')) {
    return response.status(401).json({ error: 'Missing JWT' });
  }
  const token = header.split(' ')[1];

  jwt.verify(token, JWT_SECRET, (error, payload) => {
    if (error) {
      return response.status(401).json({ error: 'Invalid JWT', details: error.message });
    }

    // payload contains at least: sub (userId), username, scopes...
    const user = findUserById(payload.sub);
    request.auth = { method: 'jwt', user, payload };
    next();
  });
}

// use middleware-functions
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(errorHandling);
app.use(logging);
//app.use(basicAuth); // basic-auth soll nicht für alle endpunkte eingesetzt werden

app.use('/api/v1/orders', ordersRouterV1);

app.use(helmet());


// BASIC AUTH
// ungeschützter Endpunkt (keine Authorization-Header notwendig)
app.get('/auth/basic/public', (request, response) => {
  response
    .status(200)
    .send(`Hello MEDT-Team from Basic-Auth-Endpoint`);
});

// geschützter Endpunkt durch Authorization-Header Basic (middleware-function als 2. Parameter)
app.get('/auth/basic/private', basicAuth, (request, response) => {
  // ausgabe der auth-information (gesetzt von der middleware-function)  
  console.log(request.auth);

  response
    .status(200)
    .send(`Hello ${request.auth.user.username} from Basic-Auth-Endpoint`);
});

// API KEY AUTH
// ungeschützter Endpunkt (keine x-api-key-Header notwendig)
app.get('/auth/apikey/public', (request, response) => {
  response
    .status(200)
    .send(`Hello MEDT-Team from Api-Key-Auth-Endpoint`);
});

// geschützter Endpunkt durch x-api-key-Header (middleware-function als 2. Parameter)
app.get('/auth/apikey/private', apiKeyAuth, (request, response) => {
  // ausgabe der auth-information (gesetzt von der middleware-function)  
  console.log(request.auth);

  response
    .status(200)
    .send(`Hello ${request.auth.user.username} from Api-Key-Auth-Endpoint`);
});

// JWT AUTH (Json Web Token)
// login endpoint to obtain a token
app.post('/auth/jwt/login', (request, response) => {
  console.log(request.body);
  const { username, password } = request.body || {};
  if (!username || !password) {
    return response
           .status(400)
           .json({ error: 'username and password required' });
  }
  const user = findUserByUsername(username);
  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    return response
           .status(401)
           .json({ error: 'Invalid credentials' });
  }

  const payload = { sub: user.id, username: user.username, scopes: user.scopes };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h', jwtid: uuidv4() });
  response.json({ accessToken: token, tokenType: 'Bearer', expiresIn: 3600 });
});

// ungeschützter Endpunkt
app.get('/auth/jwt/public', (request, response) => {
  response
    .status(200)
    .send(`Hello ${process.env.audience ?? 'MEDT-Team' } from Json Web Token`);
});

// geschützter Endpunkt durch JWT
app.get('/auth/jwt/private', jwtAuth, (request, response) => {
  response
    .status(200)
    .send(`Hello ${request.auth.user.username} from Json Web Token`);
    console.log(request.auth);
});

app.listen(PORT, () => {
  console.log(`server listening on  http://localhost:${PORT}`)
});