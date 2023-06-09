import type { VercelRequest, VercelResponse } from '@vercel/node';
import fetch from 'node-fetch';
import * as bcrypt from 'bcrypt';

export default function handler(request: VercelRequest, response: VercelResponse) {
  if(request.method !== 'POST') {
    return response.setHeader('Allow', 'POST').status(405).end('Method Not Allowed');
  }

  const reqData = JSON.parse(request.body);

  if(reqData.email === undefined || reqData.password === undefined) {
    return response.status(400).end('Does not include email or password in request');
  }

  // fetches user with email to check if account already exists
  fetch('https://us-west-2.aws.data.mongodb-api.com/app/data-gvzkb/endpoint/data/v1/action/findOne', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Request-Headers': '*',
      'api-key': process.env.REACT_APP_MONGODB_DATA_API_KEY!
    },
    body: JSON.stringify({
      collection: 'users',
      database: 'mym',
      dataSource: "mym-assessment",
      filter: {
        'email': reqData.email
      }
    })
  })
    .then(res => res.json())
    .then((data: any) => {
      if(data.document !== null) {
        return response.status(400).end('Email already exists')
      }

      // inserts new user into database with salted password
      const saltedPass = bcrypt.hashSync(reqData.password, 10);
      fetch('https://us-west-2.aws.data.mongodb-api.com/app/data-gvzkb/endpoint/data/v1/action/insertOne', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Request-Headers': '*',
          'api-key': process.env.REACT_APP_MONGODB_DATA_API_KEY!
        },
        body: JSON.stringify({
          collection: 'users',
          database: 'mym',
          dataSource: "mym-assessment",
          document: {
            email: reqData.email,
            password: saltedPass
          }
        })
      })
        .then(() => {
          return response.status(200).end('OK');
        })
    })
}