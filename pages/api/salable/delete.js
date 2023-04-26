import { getAuth } from "@clerk/nextjs/server";


// handler is the function that is called when the api is called
// The handler checks for a valid session, whether the user is licensed with Salable, and then calls callGPT
export default async function handler(req, res) {
  const { sessionId, userId } = getAuth(req);
  const {licenseId} = req.query
  try {
    // const returnedLicenses = await api.licenses.getLicenses(userId);
    console.log(licenseId)
    console.log(process.env["SALABLE_API_KEY"])
    const res = await fetch("https://api.salable.app/licenses/"+licenseId, {
      method: "DELETE", 
      headers: {
        "x-api-key" : process.env["SALABLE_API_KEY"]
      }
    });
    const body = await res.json()
  } catch (err) {
    console.error(err);
  }
    return res.status(200).json({ status: "done"});
} 
