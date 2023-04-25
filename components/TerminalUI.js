import Terminal, { ColorMode, TerminalOutput, TerminalInput } from 'react-terminal-ui';
import React, {useState} from "react";
import { useUser } from "@clerk/nextjs";

async function getData(prompt) {

    try {
      const res = await fetch("/api/queryGPT?prompt="+prompt);
      const body = await res.json();
      return body["output"]
    } catch (e) {
      console.log("// There was an error with the request. Please contact support@clerk.dev");
      console.dir(e)
      return "Please try again..."
    }  
  }
  
  
  export const TerminalController = (props = {}) => {
    const { user } = useUser();
    const [terminalLineData, setTerminalLineData] = useState([
      <TerminalOutput>Welcome {user.firstName}...</TerminalOutput>
    ]);
  
    const onInput = async function(input) {
      let ld = [...terminalLineData];
      ld.push(<TerminalInput>{input}</TerminalInput>);
      setTerminalLineData(ld);      
      const resp = await getData(input)
      ld = [...terminalLineData];
      ld.push(<TerminalOutput>{resp}</TerminalOutput>)
      setTerminalLineData(ld);
    }
    // Terminal has 100% width by default so it should usually be wrapped in a container div
    return (
      <div className="container">
        <Terminal name='AdaGPT' colorMode={ ColorMode.Dark }  prompt="$" onInput={onInput} >
          {terminalLineData }
        </Terminal>
      </div>          
    )
  };