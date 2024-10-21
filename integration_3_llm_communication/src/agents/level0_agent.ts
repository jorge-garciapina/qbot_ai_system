// The SpecializedAgent class is designed to promote modularity and encapsulate single-responsibility agents.
// Instances of this class will serve as specialized agents with well-defined, single tasks.
// Example instances of SpecializedAgent may include (but are not limited to):
// - Retrieve first name
// - Retrieve last name
// - Retrieve appointment date
// - Retrieve appointment time
// - Retrieve appointment reason

// These agents do not maintain context.
// Their design follows a single-purpose principle, where they perform a specific
// task and are no longer needed once the task is completed.

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

type ContextItem = {
  role: string;
  content: string;
};

export default class SpecializedAgent {
  systemRole: string;
  apiUrl: string;
  valid: boolean;

  constructor(systemRole: string) {
    this.systemRole = systemRole;
    this.apiUrl = "https://api.openai.com/v1/chat/completions";
    this.valid = false;
  }

  //////////////////////////////////////////////////////
  async initialMessage() {
    // This method generates the initial message that the specialized agent will present to the user,
    // based on the specific parameter it is responsible for validating:
    // - First name
    // - Last name
    // - Appointment date
    // - Appointment time
    // - Appointment reason

    try {
      const initialMessageContext = [
        {
          role: "system",
          content: this.systemRole,
        },
        {
          role: "user",
          content: `Make a polite request to the user to provide the parameter that is implied in this text: ${this.systemRole}`,
        },
      ];

      const response = await fetch(
        this.apiUrl,
        this.simpleOpenAIRequest(initialMessageContext)
      );
      const data = await response.json();

      if (response.ok) {
        const initialMessage = data.choices[0].message.content;

        return initialMessage;
      } else {
        // Handle API errors
        console.error("API Error:", data);
        return `Error: ${data.error.message}`;
      }
    } catch (error) {
      console.error("Network Error:", error);
      return "An error occurred while fetching the response.";
    }
  }
  //////////////////////////////////////////////////////
  async validateUserInput(userInput: string) {
    try {
      const statelessContext = [
        {
          role: "system",
          content: this.systemRole,
        },
        {
          role: "user",
          content: userInput,
        },
      ];

      const response = await fetch(
        this.apiUrl,
        this.functionRequestToOpenAI(statelessContext)
      );
      const data = await response.json();

      console.log("validateUserInput DATA: ", data);

      if (response.ok) {
        const assistantMessage = data.choices[0].message;

        const functionCall = assistantMessage.function_call;

        // CASE 1: System detected to trigger a function.
        if (functionCall) {
          this.valid = false;

          return `${userInput} is a valid name`;
        }
        // CASE 2: No function triggered
        else {
          return "NOT VALID NAME";
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
  }

  //////////////////////////////////////////////////////
  executeValidation(userInput: string) {
    if (!this.valid) {
      // DUMMY VALIDATION
      this.valid = true;
      return this.initialMessage();
    } else {
      const validationResponse = this.validateUserInput(userInput);
      return validationResponse;
    }
  }

  //////////////////////////////////////////////////////
  simpleOpenAIRequest(conversationContext: ContextItem[]) {
    return {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: conversationContext,
      }),
    };
  }

  //////////////////////////////////////////////////////
  functionRequestToOpenAI(conversationContext: ContextItem[]) {
    return {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: conversationContext,
        functions: [
          {
            name: "valid_information",
            description:
              "Verifies if the input is valid based on the system prompts",
            parameters: {
              type: "object",
              properties: {},
            },
          },
        ],
        function_call: "auto",
      }),
    };
  }
}
