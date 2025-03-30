        
           📌pesaPlan: 
A budget planning tool to track and visualize your spending habits and financial goals, against an allocated budget.

    📝 Table of Contents
            Features
            Installation
            Usage
            API Reference
            Technologies Used
            Contributing
            License
            Contact
1. Features  
    ✔ Budget management: A user sets a budget that tracks expenses for financial planning
    ✔ Spending monitoring: Based off the 20% rule of budgeting.
    ✔ Expense categorization: A user defines and visualizes their expenses based on categories 
    ✔ Data: The tool uses a db.json for storing and fetching the users' inputs.
    ✔ Visualization: Via chart.js, the tool provides statistics and financial advice based off the inputs.

2. Installation
    ✔ requirements 
     - install node.js to run json-server
     - install Git to fork and clone the tool's repository
     - after ensuring the right installations are in place:
       - clone the repository using: 
        ~$ <your working directory>git clone https://github.com/shirocodes/pesaPlan
       - install json-server globally:
        ~$ npm install -g json-server
        - in the terminal: start the mock
            json-server --watch db.json --port 3000
        - open index.html in your browser to use the tool

3. Usage 
    - After loading the app, create budget, set goals, track expenses by adding your expenses per category. Finally, monitor your spending and savings habits via the chart

4. API reference 
    - The endpoint is: http://localhost:3000
        - Endpoints include:
            - budget
            - financial_goal
            - expenses
        - Methods: GET POST PATCH DELETE

5. Development Technologies
  - Frontend - HTML,CSS,JS
  - db.json as mock api

6. Contributions
  - To provide contributions, do the following:
        Fork the repository.

        Create a new branch (git checkout -b feature/your-feature).

        Commit your changes (git commit -m 'Add some feature').

        Push to the branch (git push origin feature/your-feature).

        Open a Pull Request.

7. 📜 License 
    All rights reserved to https://github.com/shirocodes

📩 Contact Wanjiru Muchiri
            ishirapt@gmail.com