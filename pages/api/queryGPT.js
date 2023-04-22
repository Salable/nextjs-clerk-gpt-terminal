import { getAuth } from "@clerk/nextjs/server";
import { OpenAI } from "langchain/llms/openai";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { SerpAPI } from "langchain/tools";
import { Calculator } from "langchain/tools/calculator";

export default async function handler(req, res) {
  const { sessionId, userId } = getAuth(req);

  if (!sessionId) {
    return res.status(401).json({ id: null });
  }  
  console.log("Getting data for user:", userId)

const model = new OpenAI({ temperature: 0 });
const tools = [
  new SerpAPI(process.env.SERPAPI_API_KEY, {
    location: "Austin,Texas,United States",
    hl: "en",
    gl: "us",
  }),
  new Calculator(),
];

const executor = await initializeAgentExecutorWithOptions(tools, model, {
  agentType: "zero-shot-react-description",
});
console.log("Loaded agent.");

const {prompt} = req.query
const input = prompt

console.log(`Executing with input "${input}"...`);

const result = await executor.call({ input });

console.log(`Got output ${result.output}`);
  return res.status(200).json({ id: userId, output: result.output });
}
