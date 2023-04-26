import { getAuth } from "@clerk/nextjs/server";
const { SalableApi } = require("@salable/node-sdk");


// handler is the function that is called when the api is called
// The handler checks for a valid session, whether the user is licensed with Salable, and then calls callGPT
export default async function handler(req, res) {
  const { sessionId, userId } = getAuth(req);
  let licenses = []
  let capabilities = []
  if (!sessionId) {
    return res.status(401).json({ id: null });
  } else {
    console.log("Checking with salable api key", process.env["SALABLE_API_KEY"])
    const api = new SalableApi(process.env["SALABLE_API_KEY"]);
    try {
      const capabilitiesCheck = await api.licenses.checkLicenses(
        process.env["SALABLE_PRODUCT_ID"],
        [userId]
      );
      capabilities=capabilitiesCheck.capabilities      
    } catch (err) {
      console.log("Found an error!")
      console.log(err.status)
      console.error(err);      
    }
    try {
      // const returnedLicenses = await api.licenses.getLicenses(userId);
      const res = await fetch("https://api.salable.app/licenses/granteeId/"+userId+"?expand=[product,plan,subscription]", {
        method: "GET", 
        headers: {
          "x-api-key" : process.env["SALABLE_API_KEY"]
        }
      });
      const body = await res.json();
      licenses=body
    } catch (err) {
      console.error(err);
    }
    return res.status(200).json({ id: userId, licenses: licenses, capabilities: capabilities});
  }  
}
