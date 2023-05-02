import { getAuth } from "@clerk/nextjs/server";
const util = require('util');

// handler is the function that is called when the api is called
// The handler checks for a valid session, whether the user is licensed with Salable, and then calls callGPT
export default async function handler(req, res) {
  const { sessionId, userId } = getAuth(req);

  if (sessionId) {
    return res.status(200).json({ trigger: "web" });
  } else {
    console.dir(req.query)
    const output = util.inspect(req.body.data.object, { depth: 8, colors: true });
console.log(output);
    return res.status(200).json({ trigger: "api" });
    
  }
}