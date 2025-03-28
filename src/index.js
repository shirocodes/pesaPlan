document.addEventListener("DOMContentLoaded", async () => {
    console.log("page loaded successfully")

    await fetchAndDisplayBudget() //fetchand show existing budgets
    
    // listen for budget button
    const budgetButton = document.querySelector(".budget-card .budget-holder #budget-BTN"); 
    budgetButton.addEventListener("click", handleBudgetCreates);
});

//fetch any existing budgets ||PATCH
async function fetchAndDisplayBudget() {
    console.log("fetching existing budget ...")

    try {
        const res = await fetch("http://localhost:3000/budget/1")
        if(!res.ok) throw new Error("failed in fetching existing budget")
        
            const budgetData = await res.json()
            console.log("fetched budget is:", budgetData);

        //update budget btn text
        const budgetBTN = document.querySelector("#budget-BTN");
        budgetBTN.innerHTML = budgetData.total ? `Budget Set: Ksh ${budgetData.total}`
        : "No budget set";
    } catch (error) {
        console.log("error fetching budget:", error);
    }   
}

function handleBudgetCreates(e) { //create budget inputs dynamically
    e.preventDefault()
    console.log("budget button clicked")

    // Prevent duplicate input fields
    if (document.getElementById("budget-inputs")) return;

    //create elements to hold budget inputs
    const WrapBudgetInputs = document.createElement("div");
    WrapBudgetInputs.id ="budget-inputs";
    WrapBudgetInputs.innerHTML = `
        <input type="number" id="budget-input" placeholder ="enter amount">
        <button id="save-btn">Save budget</button>
        <p id="budget-error"></p>`;
    //append to budget holder
    const budgetHolder = document.querySelector(".budget-card .budget-holder")
    budgetHolder.appendChild(WrapBudgetInputs)
    //listen for save button
    document.getElementById("save-btn").addEventListener("click", saveBudget);
}

//handling save budget
async function saveBudget(){
    console.log("save budget clicked")
    const budgetInput = document.getElementById("budget-input");
    const budgetError = document.getElementById("budget-error");
    const budgetValue = parseFloat(budgetInput.value.trim());

    //validate the input 
    if (!budgetValue || isNaN(budgetValue) || budgetValue <=0) {
        budgetError.textContent = "Enter a valid amount"
        budgetError.style.color = "red";
        console.warn("Invalid input")
        return
    }

     console.log(`budget saved: ${budgetValue}`)
     budgetError.textContent = ""

    //prepare budget data and send PATCH request || avoid overwriting
    let existingBudget = {}
    try {
        const res = await fetch("http://localhost:3000/budget/1")
        if(!res.ok) throw new Error("failed fetching existing budget")
        
            existingBudget = await res.json()
            console.log("existing budget before updates is:", existingBudget)       
    } catch (error) {
        console.warn("error fetching existing budget:", error)
    }

    //update budget without overwriting existing data
    const updatedBudgetData = {...existingBudget, total: Number(budgetValue)};
    console.log("Updated budget to be sent to json:", updatedBudgetData)

    try {
        const res = await fetch("http://localhost:3000/budget/1", {
            method: "PATCH",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(updatedBudgetData)
        })

        if(!res.ok) throw new Error("failed to update budget")
        
        const updatedBudget = await res.json()
        console.log("successful budget update:", updatedBudget)

        //remove input form and update UI
        document.getElementById("budget-inputs").remove();
        const budgetSet = document.querySelector(".budget-holder #budget-BTN")
        budgetSet.innerHTML = `budget set: Ksh ${updatedBudget.total}`
        budgetSet.style.backgroundColor = "green";
        budgetSet.style.color = "white"

        await fetchAndDisplayBudget(); //refetch budget to update UI
    } catch (error) {
        console.error("Error updating budget:", error)
        budgetError.textContent ="Failed! Try again"
        budgetError.style.color = "red"
    }
}

//handling goals creation || savings goals and investment goals
document.addEventListener("DOMContentLoaded", async () => {
    console.log("page loaded successfully");

    await fetchAndDisplayGoals();
    //listen on create goals btn
    const goalscreatebtn = document.querySelector(".goals-holder #goals-BTN");
    goalscreatebtn.addEventListener("click",handleGoalCreates);
})

//fetch/display existing goals
async function fetchAndDisplayGoals() {
    console.log("Fetching existing goals...");

    try {
        const res = await fetch("http://localhost:3000/financial_goal/1");
        if (!res.ok) throw new Error("Failed to fetch goals");

        const goals = await res.json();
        console.log("Fetched goals:", goals);
        console.log("Investment goal fetched:", goals.investment)
        
        //avoid breaking when goal fetching
        if (!goals || typeof goals !== "object") {
            console.warn("Invalid goals data received");
            return;
        }
        const goalsBTN = document.querySelector("#goals-BTN");
        const savingsGoal = goals.savings ? `Savings Goal: Ksh ${goals.savings}` : "No Savings Goal Set";
        const investmentGoal = goals.investment > 0 ? `Investment Goal: Ksh ${goals.investment}` : "No Investment Goal Set";
        goalsBTN.innerHTML = `${savingsGoal} | ${investmentGoal}`;
    
    } catch (error) {
        console.error("Error fetching goals:", error);
    }
}

//show goals input after create goals click
function handleGoalCreates(e) {
    e.preventDefault()
    console.log("create goals btn clicked ...");

    //avoid duplicates by checking if input form exists already
    if (document.getElementById("goals-inputs")) return;


    //before showing form, fetch any existing goals:
    fetch("http://localhost:3000/financial_goal/1")
        .then(res => {
            if(!res.ok) throw new Error("failed to fetch goals")
                return res.json()
            })
        .then(goals => {
            const currentGoals = goals || {savings: 0, investment: 0}
            console.log("current goals before input:", currentGoals);

             //elements to hold goals' inputs
            const wrapGoalsInputs = document.createElement("div");
            wrapGoalsInputs.id = "goals-inputs";
            wrapGoalsInputs.innerHTML = `
                <p class="invest-input"> savings goal</p>
                <input type="number" id="goal-input" placeholder ="enter amount">
                <button class="savegoal-btn" data-type="savings">Save goal</button>

                <p class="invest-input"> investment goal</p>
                <input type="number" id="invest-input" placeholder ="enter amount">
                <button class="savegoal-btn" data-type="investment">Save goal</button>

                <p id="goals-error"></p> `
                
            //append to goals holder
            const goalsHolder = document.querySelector(".goals-holder")
            goalsHolder.appendChild(wrapGoalsInputs)

            //event delegation to both savegoal-btn
            wrapGoalsInputs.addEventListener("click", (e) => {
                if(e.target.classList.contains("savegoal-btn")) {
                    saveGoal(e.target.dataset.type);
                }
            })
            }) .catch(error => console.warn("error fetching current goals:", error))
}

//no overwriting others while saving new goals 
async function saveGoal(type) {
    console.log(`${type} goal save btn clicked`);
    //choose an input label based on type of goal
    const inputLabel = type === "savings" ? document.getElementById("goal-input") :
    document.getElementById("invest-input");
    const goalValue = inputLabel.value.trim();
    const goalError = document.getElementById("goals-error");
    //validate inputs
    if(!goalValue || isNaN(goalValue) || goalValue <=0) {
        goalError.textContent = "Invalid number"
        goalError.style.color = "red"
        console.warn("invalid input for goal")
        return;
    }
    console.log(`${type} goal saved: ${goalValue}`);
    goalError.textContent ="";

    let existingGoals = {};

    //fetch existing data to avoid overwrites
    try {
        const res = await fetch("http://localhost:3000/financial_goal/1")
        if (!res.ok) throw new Error("failed to fetch existing goals")
        
        existingGoals = await res.json();
        console.log("existing goals before update:", existingGoals)   
    } catch (error) {
        console.warn("error fetching existing goals:", error)
    }

    //consolidate the goals 
    const updatedGoalData = {...existingGoals, [type]: Number(goalValue)};
    console.log("updated goal data to be sent:", updatedGoalData)

    try {
        const res = await fetch("http://localhost:3000/financial_goal/1", {
            method: "PATCH",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(updatedGoalData)
        })
        if (!res.ok) throw new Error("failed to update goals")
        
        const updateGoal = await res.json();
        console.log(`successful ${type} goals update:`, updateGoal);

        //remove input form and update UI
        document.getElementById("goals-inputs").remove()
        document.querySelector("#goals-BTN").innerText = `${type} goal set: Ksh ${updateGoal[type]}`
    await fetchAndDisplayGoals();

    }catch (error) {
        console.error(`error updating ${type} goal:`, error)
    }
}

//Handling Expenses 
document.addEventListener("DOMContentLoaded", async () => {
    console.log("page expenses  loaded successfully");

    await fetchAndDisplayExpenses()

    //listen for trackexpenses BTN
    const expensesBtn = document.querySelector("#expenses-BTN")
    expensesBtn.addEventListener("click", handleExpensesCreated)
})

//fetching & displaying existing/current expenses
async function fetchAndDisplayExpenses() {
    console.log("fetching expenses ...")

    try {
        const res = await fetch("http://localhost:3000/expenses");
        if(!res.ok) throw new Error("failed to fetch expenses");

        const expenses = await res.json();
        console.log("fetched expenses:", expenses);

        //check if fetched data is valid before any processing
        if(!Array.isArray(expenses) || expenses.length === 0) {
            console.warn("no available expenses");
            return;
        }

        displayExpenses(expenses)
    }catch (error) {
        console.error("error fetching expenses", error)
    }  

    //account for the analyzed expenses for analysis
    //  >>drawing from expenseAnalysis()
    try {
        const ResOnExpenses = await fetch("http://localhost:3000/expenses")
        const ResOnBudget = await fetch("http://localhost:3000/budget")
        const ResOnFinancialGoal = await fetch("http://localhost:3000/financial_goal")
    if(!ResOnExpenses.ok || !ResOnBudget.ok || !ResOnFinancialGoal.ok) {
        throw new Error("Error fetching data")
    }
    const expenses = await ResOnExpenses.json()
    const budgetData = await ResOnBudget.json()
    const goalData = await ResOnFinancialGoal.json()

    if(!budgetData.length || !goalData.length) {
        console.warn("Financial goal and budget not set")
        return;
    }

    const budget = budgetData[0].total;
    const financialGoal = goalData[0]

    //avoid calling expenseAnalysis() on empty data
    if (!Array.isArray(expenses) || expenses.length === 0) {
        console.warn("No expenses to analyze");
        return;
    }

    //assess the expenses
    const analyze = expenseAnalysis(expenses, budget, financialGoal)

    console.log("Expense analysis result:", analyze);

    //ensure allExpensePercategories is available before passing chart update
    if (!analyze || !analyze.allExpensePerCategories) {
        console.warn("Invalid analysis structure");
        return;
    }
    //visualize using chart
    updateChart(analyze.allExpensePerCategories, budget, financialGoal);
    displaySuggestion(analyze.suggestion)
    } catch (error) {
        console.error("error analysing the expenses:", error);
    }

}
function displayExpenses(expenses) {
    const expensesHolder = document.querySelector(".expenses-holder")
    const existingExpList = document.getElementById("expense-list")
    //avoid duplicates
    if(existingExpList) existingExpList.remove();

    //create expense list ul holder
    const expenseList = document.createElement("ul");
    expenseList.id = "expense-list";

    expenses.forEach(expense => {
        const li = document.createElement("li");
        li.innerHTML = `${expense.category}: Ksh ${expense.expenseAmount}
        <button class="delete-expense" data-id="${expense.id}">X</button>`;
        expenseList.appendChild(li)
    })
    expensesHolder.appendChild(expenseList);

    //listen on delete
    document.querySelectorAll(".delete-expense").forEach(button => {
        button.addEventListener("click", deleteExpense)
    })
}

//to delete expense from UI and json ||get ID >> send DELETE >> refresh list
async function deleteExpense(e) {
    const expenseID = e.target.dataset.id;
    console.log("deleting the expenseID:", expenseID);

    try {
        const res = await fetch(`http://localhost:3000/expenses/${expenseID}`, {
            method: "DELETE",
        })
        if(!res.ok) throw new Error("failed in deleting")
        
            console.log("success in deleting expense")
            await fetchAndDisplayExpenses() //refresh expense list
    } catch(error) {
        console.error("error deleting expense:", error)
    }   
}

//create expense input form
function handleExpensesCreated(e) {
    e.preventDefault()
    console.log("track expenses button clicked")

    if(document.getElementById("expense-inputs")) return;

    //create elements ||drop-downmenu
    const wrapExpenseInputs = document.createElement("div")
    wrapExpenseInputs.id = "expense-inputs"
    wrapExpenseInputs.innerHTML = `
        <label for="expense-category">Category:</label>
        <select id="expense-category">
            <option value="food">Food</option>
            <option value="transport">Transport</option>
            <option value="debt">Debt</option>
            <option value="rent">Rent</option>
            <option value="amenities">Amenities</option>
        </select>

        <input type="number" id="expense-amount" placeholder="enter amount">
        <button id="saveExpense-btn">Save expense</button>
        <p id="ErrorInInput"></p>
    `;
    //listen for save expense btn
    document.querySelector(".expenses-holder").appendChild(wrapExpenseInputs);
    document.getElementById("saveExpense-btn").addEventListener("click", saveExpense)
}

//saving on json and displaying it
async function saveExpense() { 
    console.log("save expense clicked")

    const category = document.getElementById("expense-category").value
    const inputAmount = document.getElementById("expense-amount")
    const errorAlert = document.getElementById("ErrorInInput")
    //validate inputs
    const expenseAmount = inputAmount.value.trim();

    if(!expenseAmount || isNaN(expenseAmount) || expenseAmount <= 0) {
        errorAlert.textContent = "Enter a valid number"
        errorAlert.style.color = "red"
        console.warn("Invalid input")
        return;
    }

    //prepare expense Data ||POST request
    const currentExpense = {
        id: Math.random().toString(16).slice(2, 6),  // Unique ID
        category,   // Store as a string, not an object
        expenseAmount: Number(expenseAmount) 
    }

    try {
        const res = await fetch("http://localhost:3000/expenses", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body:JSON.stringify(currentExpense),
        })

        if(!res.ok) throw new Error("failed to save the expense");

        const expenseSaved = await res.json()
        console.log("expense saved:", expenseSaved);
        //remove input forms & refresh list
        document.getElementById("expense-inputs").remove()
        await fetchAndDisplayExpenses();

    } catch (error) {
        console.error("error saving the expense:", error)
        errorAlert.textContent = "Failed!"
    }   
}

//Analyzing Expenses
function expenseAnalysis(expenses, budget, financialGoal) {

    if(expenses.length === 0) {
        console.warn("no expenses to analyze")
        return;
    }
    //sum-up all expenses' spendings
    const totalSpending = expenses.reduce((sum, exp) => sum + exp.expenseAmount, 0)
    console.log("total spent on expenses:", totalSpending)
    
    //sum up spending per category
    const allExpensePerCategories = expenses.reduce((acc, exp) => {
        acc[exp.category] = (acc[exp.category] || 0) + exp.expenseAmount;
        return acc;
    }, {});
    console.log("total expense per category:", allExpensePerCategories)

    //Visualizing spending per category by Percent
    const categoryPercents = Object.keys(allExpensePerCategories).map(category => ({
            category,
            percentage: ((allExpensePerCategories[category] /budget) * 100). toFixed(2),
        }))
    console.log("category percentage mapdown:",categoryPercents);
    
    //Using the 20% in budget breakdown >> define % on financial goals
    const overallFinancialGoal = financialGoal.savings + financialGoal.investment;
    const goalPercntg = ((overallFinancialGoal / budget) * 100).toFixed(2);

    console.log("financial goal allocation:", goalPercntg + "%")

    //after analysis, use 20% RULE to provide financial advice 
    const suggestions = [
        { threshold: 10, message: "Critical Warning! Your savings & investment are below 10%!" },
        { threshold: 20, message: "Caution! Consider increasing your savings & investments to 20% or more." },
        { threshold: Infinity, message: "Great! Your financial goal allocation is healthy." }
    ];
    
    const suggestion = suggestions.find(s => goalPercntg < s.threshold).message;
    
    // let suggestion = "Your financial strategy is great"
    if(goalPercntg <20) {
        suggestion ="Warning! Financial goals below 20%. Manage your spending "
    }
    console.log("financial advice:", suggestion)
    return {
        totalSpending,
        allExpensePerCategories,
        categoryPercents,
        goalPercntg,
        suggestion,       
    }  
} 

// //Visualization >> initializing chart.js >>Doughnut chart
let visualChart = null; //reference the chart

function updateChart(expenseData, budget, financialGoal) {
    const chartElement = document.getElementById("myChart");
    if (!chartElement) {
        console.warn("Chart element not found in DOM");
        return;
    }

    const ctx = chartElement.getContext("2d");
    if (!ctx) {
        console.error("Failed to get canvas context for Chart.js");
        return;
    }
    //retrieve categories and values
    const categories = Object.keys(expenseData);
    const values = Object.values(expenseData);

    // Adding savings & investment to the chart
    const financialGoalValue = financialGoal.savings + financialGoal.investment;
    categories.push("Savings & Investment");
    values.push(financialGoalValue);

    //remove any existing chart before adding another
    if(visualChart) {
        visualChart.destroy();
    }
    //make a new chart
    visualChart = new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: categories,
            datasets: [{
                label: "Expenses Breakdown",
                data: values,
                backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
                hoverBackgroundColor: ["#FF4384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
            }]
    },
    options: {
        plugins: {
            annotation: {
                annotations: {
                    line1: {
                        type: "line",
                        yMin: (budget * 0.2),
                        yMax: (budget * 0.2),
                        borderColor: "red",
                        borderWidth: 2,
                        borderDash: [5, 5], // Dashed line
                        label: {
                            content: "20% Savings Threshold",
                            enabled: true,
                            position: "start"
                        }
                    }
                }
            }
        }
    }

 });
}

//updating UI with suggestions from analysis
function displaySuggestion(message) {
    const suggestionItem = document.getElementById("financial-advice")

    if(!suggestionItem){
        console.warn("suggestion item not found in DOM")
        return;
    }
    suggestionItem.innerText = message;
    suggestionItem.style.color = message.includes("Warning") ? "red" : "green"   
}
//ensure page reload
document.addEventListener("DOMContentLoaded", async () => {
    console.log("page loaded. now fetching data to visualize")
    await fetchAndDisplayExpenses();
})






