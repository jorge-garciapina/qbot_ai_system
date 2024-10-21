// src/components/OpenAIChat.tsx
import React, { useState } from "react";
import Coordinator from "../agents/coordinator";

const coordinator = new Coordinator();

const OpenAIChat: React.FC = () => {
  const [userInput, setUserInput] = useState("");
  const [apiResponse, setApiResponse] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  const handleSendClick = async () => {
    // The method returns a promise
    const response = await coordinator.executeAgent(userInput);

    setApiResponse(response);
  };

  return (
    <div>
      <h2>I want to schedule an appointment</h2>
      <h2>I want to cancel an appointment</h2>
      <h2>I want to reschedule an appointment</h2>
      <input
        type="text"
        value={userInput}
        onChange={handleInputChange}
        placeholder="Type your message"
      />
      <button onClick={handleSendClick}>Send</button>
      <div>
        <h3>Response:</h3>
        <p>{apiResponse}</p>
      </div>
    </div>
  );
};

export default OpenAIChat;
