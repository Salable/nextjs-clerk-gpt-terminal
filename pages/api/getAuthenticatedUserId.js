import { getAuth } from "@clerk/nextjs/server";

export default async function handler(req, res) {
  const { sessionId, userId } = getAuth(req);

  if (!sessionId) {
    return res.status(401).json({ id: null });
  }  
  console.log("Getting data for user:", userId)

  const url="https://adagpt-backend.fly.dev/"

  const prompt = req.query['prompt']



  const response = await fetch(url, {
      method: 'POST', // Specify the HTTP method
      headers: {
        'Content-Type': 'application/json' // Set the content type of the request body
      },
      body: JSON.stringify({
        userId: userId, // Set the data to be sent in the request body
        sessionId: sessionId,
        prompt: prompt,
      }) // Convert the data to a JSON string
    })
  const data = await response.json()
  console.log(data)
  return res.status(200).json({ id: userId, output: data["output"] });
}
