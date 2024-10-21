import { openAIRequestFunctions } from "./auxiliar_functions";
import { nameAgent } from "./name_agent";

type ContextItem = {
  role: string;
  content: string;
};

class Coordinator {
  identity: string;
  messages: ContextItem[];

  constructor() {
    this.identity =
      "Execute the proper function based on the user request: schedule, cancel or reschedule appointment ";

    this.messages = [{ role: "system", content: this.identity }];
  }

  addItemToContext({ role, content }: { role: string; content: string }) {
    const userContextItem = { role: role, content: content };
    this.messages.push(userContextItem);
  }

  executeAgent = async (userInput: string) => {
    const apiUrl = "https://api.openai.com/v1/chat/completions";

    try {
      this.addItemToContext({ role: "user", content: userInput });

      const response = await fetch(
        apiUrl,
        openAIRequestFunctions(this.messages)
      );
      const data = await response.json();

      if (response.ok) {
        const assistantMessage = data.choices[0].message;

        const functionCall = assistantMessage.function_call;

        // CASE 1: System detected to trigger a function.
        if (functionCall) {
          // This structure will play the role similar to the INTENT, it will trigger the
          // pertinent logic to execute the required task.
          if (functionCall.name === "schedule_appointment") {
            console.log("User wants to schedule an appointment");
            // const specializedAgentMessage = await nameAgent.initialMessage();
            const specializedAgentMessage = await nameAgent.executeValidation(
              userInput
            );

            return specializedAgentMessage;
            // I do not know how to allow user to input the name after the name has been requested
          } else if (functionCall.name === "cancel_appointment") {
            console.log("User wants to cancel an appointment");
          } else if (functionCall.name === "reschedule_appointment") {
            console.log("User wants to reschedule an appointment");
          }

          return "TESTING INPUT...";
        }
        // CASE 2: No function triggered
        else {
          const assistantContextItem = {
            role: "assistant",
            content: assistantMessage.content,
          };
          this.messages.push(assistantContextItem);
          return assistantMessage.content;
        }
      } else {
        // Handle API errors
        console.error("API Error:", data);
        return `Error: ${data.error.message}`;
      }
    } catch (error) {
      console.error("Network Error:", error);
      return "An error occurred while fetching the response.";
    }
  };
}

export default Coordinator;
