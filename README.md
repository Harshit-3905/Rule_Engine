# Rule Engine

Rule Engine is a web application that allows users to create, combine, and evaluate complex rules. It provides a user-friendly interface for managing rules and checking eligibility based on those rules.

## Hosted Links

- Frontend : https://rule-engine.harshit-joshi.tech/
- Backend : https://rule-engine-backend.harshit-joshi.tech/

## Features

- **Create Rules:** Define new rules using a custom syntax that allows for flexibility and precision.
- **Combine Rules:** Merge existing rules using logical operators (AND/OR) to form complex conditions.
- **Evaluate Data:** Check data against defined rules to determine eligibility or compliance.
- **Visualize Rules:** Use an Abstract Syntax Tree (AST) to visualize and understand the structure of rules.
- **Manage Rules:** View, edit, and delete existing rules to keep your rule set up-to-date.

## Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express, TypeScript
- **Database:** MongoDB

## Running the Application

### Steps to Run the Application

1. Clone the repository
2. Run the application using Docker Compose:
   - Ensure Docker and Docker Compose are installed on your machine
   - In the root directory of the project, run: `docker-compose up`
   - This will build and start both the frontend and backend services along with the MongoDB database
   - The frontend will be accessible at `http://localhost:3000`
   - The backend will be running at `http://localhost:5000`

## Usage

1. **Create a Rule:** Use the "Create Rule" page to define new rules using the custom syntax.
2. **Combine Rules:** Navigate to the "Combine Rules" page to merge existing rules with AND/OR operators.
3. **Check Eligibility:** Use the "Check Eligibility" page to evaluate data against a selected rule.
4. **View Rules:** The "View Rule" page allows you to visualize the structure of existing rules.
