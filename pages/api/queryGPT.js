import { getAuth } from "@clerk/nextjs/server";
import { OpenAI } from "langchain/llms/openai";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { SerpAPI } from "langchain/tools";
import { Calculator } from "langchain/tools/calculator";
const { SalableApi } = require("@salable/node-sdk");

// callGPT is a function that takes a prompt as input and returns an output from langchain
const callGPT = async function (input) {
  // Default to 0 temp OpenAI model
  const model = new OpenAI({ temperature: 0 });
  // Add SerpAPI and Calculator tools to our chain of capabilities
  const tools = [
    new SerpAPI(process.env.SERPAPI_API_KEY, {
      location: "Austin,Texas,United States",
      hl: "en",
      gl: "us",
    }),
    new Calculator(),
  ];  
  // Initialize the agent executor with the options agentType as zero-shot
  const executor = await initializeAgentExecutorWithOptions(tools, model, {
    agentType: "zero-shot-react-description",
  });

  // Execute the agent with the input
  console.log(`Executing with input "${input}"...`);
  const result = await executor.call({ input });
  return result
}

// handler is the function that is called when the api is called
// The handler checks for a valid session, whether the user is licensed with Salable, and then calls callGPT
export default async function handler(req, res) {
  const { sessionId, userId } = getAuth(req);

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
      console.log("Found capabilities: " , capabilitiesCheck)
      console.log(`${userId} has the capabilities:`)
      console.dir(capabilitiesCheck)
      if ("free" in capabilitiesCheck.capabilities) {
        const {prompt} = req.query
        const result = await callGPT(prompt)

        console.log(`Got output ${result.output}`);
        return res.status(200).json({ id: userId, output: result.output });
      }
    } catch (err) {
      console.log("Found an error!")
      console.log(err.status)
      console.error(err);
      return res.status(200).json({ id: userId, output: "Error, try again..." });
    }
  }  
  const {prompt} = req.query
  const result = await callGPT(prompt)

  console.log(`Got output ${result.output}`);
  return res.status(200).json({ id: userId, output: result.output });
}
