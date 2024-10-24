# Rule Engine

Rule Engine is a web application that allows users to create, combine, and evaluate complex rules. It provides a user-friendly interface for managing rules and checking eligibility based on those rules.

## Hosted Links

- [Frontend](https://rule-engine.harshit-joshi.tech/)
- Backend: [Link to Backend] (Add the actual link here)

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

1. **Open the Project Folder in Terminal:**

   - Navigate to the project directory where the `docker-compose.yml` file is located.

2. **Run Docker Compose:**

   - Simply execute the following command to start the application:

     ```sh
     docker compose up
     ```

3. **Access the Application:**
   Once the containers are up and running, you can access the frontend at [http://localhost:3000](http://localhost:3000) and the backend at [http://localhost:5000](http://localhost:5000).

## Usage

1. **Create a Rule:** Use the "Create Rule" page to define new rules using the custom syntax.
2. **Combine Rules:** Navigate to the "Combine Rules" page to merge existing rules with AND/OR operators.
3. **Check Eligibility:** Use the "Check Eligibility" page to evaluate data against a selected rule.
4. **View Rules:** The "View Rule" page allows you to visualize the structure of existing rules.
