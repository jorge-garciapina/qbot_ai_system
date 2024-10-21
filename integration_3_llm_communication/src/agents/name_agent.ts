import SpecializedAgent from "./level0_agent";

const systemRole =
  "Your task is to validate if the name input by the user is a valid name. Names must not contain numbers";
// "Your task is to validate if the date of birth input by the user is a valid .";
export const nameAgent = new SpecializedAgent(systemRole);
