import Rule from "../models/rules.model";

const sampleRules = [
  {
    ruleName: "Employee Eligibility Rule",
    ast: JSON.stringify({
      type: "operator",
      operator: "AND",
      left: {
        type: "operator",
        operator: "OR",
        left: {
          type: "operator",
          operator: "AND",
          left: {
            type: "operand",
            left: null,
            right: null,
            value: {
              attribute: "age",
              operator: ">",
              comparisonValue: "30",
            },
          },
          right: {
            type: "operand",
            left: null,
            right: null,
            value: {
              attribute: "department",
              operator: "=",
              comparisonValue: "Sales",
            },
          },
          value: null,
        },
        right: {
          type: "operator",
          operator: "AND",
          left: {
            type: "operand",
            left: null,
            right: null,
            value: {
              attribute: "age",
              operator: "<",
              comparisonValue: "25",
            },
          },
          right: {
            type: "operand",
            left: null,
            right: null,
            value: {
              attribute: "department",
              operator: "=",
              comparisonValue: "Marketing",
            },
          },
          value: null,
        },
        value: null,
      },
      right: {
        type: "operator",
        operator: "OR",
        left: {
          type: "operand",
          left: null,
          right: null,
          value: {
            attribute: "salary",
            operator: ">",
            comparisonValue: "50000",
          },
        },
        right: {
          type: "operand",
          left: null,
          right: null,
          value: {
            attribute: "experience",
            operator: ">",
            comparisonValue: "5",
          },
        },
        value: null,
      },
      value: null,
    }),
  },
  {
    ruleName: "Project Assignment Rule",
    ast: JSON.stringify({
      type: "operator",
      operator: "OR",
      left: {
        type: "operator",
        operator: "AND",
        left: {
          type: "operand",
          left: null,
          right: null,
          value: {
            attribute: "skillLevel",
            operator: ">=",
            comparisonValue: "8",
          },
        },
        right: {
          type: "operand",
          left: null,
          right: null,
          value: {
            attribute: "availability",
            operator: "=",
            comparisonValue: "true",
          },
        },
        value: null,
      },
      right: {
        type: "operator",
        operator: "AND",
        left: {
          type: "operand",
          left: null,
          right: null,
          value: {
            attribute: "role",
            operator: "=",
            comparisonValue: "ProjectManager",
          },
        },
        right: {
          type: "operand",
          left: null,
          right: null,
          value: {
            attribute: "projectCount",
            operator: "<",
            comparisonValue: "3",
          },
        },
        value: null,
      },
      value: null,
    }),
  },
];

export default async function seedData() {
  try {
    await Rule.deleteMany({});
    await Rule.insertMany(sampleRules);
    console.log("Data seeding completed");
  } catch (error) {
    console.error("Error seeding data:", error);
  }
}
