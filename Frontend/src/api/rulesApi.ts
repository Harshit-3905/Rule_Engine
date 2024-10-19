import axiosInstance from "./axiosInstance";

export const createRule = (data: { ruleName: string; ruleString: string }) => {
  return axiosInstance.post("/rules/create", data);
};

export const combineRules = (data: {
  ruleNames: string[];
  operator: "AND" | "OR";
  newRuleName: string;
}) => {
  return axiosInstance.post("/rules/combine", data);
};

export const evaluateRule = (data: { ruleName: string; data: object }) => {
  return axiosInstance.post("/rules/evaluate", data);
};

export const getRule = (ruleName: string) => {
  return axiosInstance.get(`/rules/${ruleName}`);
};

export const getAllRuleNames = () => {
  return axiosInstance.get("/rules/names");
};
