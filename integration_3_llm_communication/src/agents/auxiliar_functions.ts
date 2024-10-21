import { tools } from "./tools";

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

export function simpleOpenAIRequest(conversationContext: object[]) {
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

export function openAIRequestFunctions(conversationContext: object[]) {
  return {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: conversationContext,
      // Spread the tools coming from an external file
      ...tools,
    }),
  };
}

type TemperatureRequest = {
  location: string;
  unit: string;
};
export function dummyClimateGenerator(temperatureRequest: TemperatureRequest) {
  return {
    location: temperatureRequest.location,
    temperature: "32 " + temperatureRequest.unit,
  };
}
