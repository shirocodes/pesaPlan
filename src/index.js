document.addEventListener("DOMContentLoaded", () => {
    console.log("page loaded successfully")
    
    // listen for budget button
    const budgetButton = document.querySelector(".budget-card .budget-holder #budget-BTN"); 
    budgetButton.addEventListener("click", handleBudgetCreates);
});

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
    const budgetValue = budgetInput.value.trim();

    //validate the input 
    if (!budgetValue || isNaN(budgetValue) || budgetValue <=0) {
        budgetError.textContent = "Enter a valid amount"
        budgetError.style.color = "red";
        console.warn("Invalid input")
        return
    }

     console.log(`budget saved: ${budgetValue}`)
     budgetError.textContent = ""

    //prepare budget data and send PATCH request
    const budgetData = {total: Number(budgetValue)};
    console.log("sending request updating budget:", budgetData)

    try { 
        const res = await fetch("http://localhost:3000/budget/1", {
            method: "PATCH",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ total: Number(budgetValue) }),
        });
        //see if successful
        if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
        const updatedBudget = await res.json();

        console.log("successful budget update:", updatedBudget);
         //remove input form and update UI
         document.getElementById("budget-inputs").remove();
         const budgetSet = document.querySelector(".budget-holder #budget-BTN")
         budgetSet.innerHTML = `budget set: KSH ${updatedBudget.total}`
         budgetSet.style.backgroundColor = "green";
         budgetSet.style.color = "white"
    } catch(error) {
        console.error("Error updating budget:", error)
        budgetError.textContent ="Failed! Try again"
        budgetError.style.color = "red"
    }
}

//handling goals creation || savings goals and investment goals
const goalscreatebtn = document.querySelector(".goals-holder #goals-BTN");
goalscreatebtn.addEventListener("click",handleGoalCreates);

function handleGoalCreates(e) {
    e.preventDefault()
    console.log("create goals btn clicked ...");

    //avoid duplicates by checking if input form exists already
    if (document.getElementById("goals-inputs")) return;
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
}

//handling save goals 
async function saveGoal(type) {
    console.log(`${type} goal save btn clicked`);

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

    //prepare data for a PATCH request
    const goalData = {[type]: Number(goalValue)}

    try {
        const res = await fetch("http://localhost:3000/financial_goal/1", {
            method: "PATCH",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify(goalData),
        })
        if(!res.ok) throw new Error("failed to update goal")

        const updateGoal = await res.json();
        console.log(`successful ${type} goals update:`, updateGoal);

        //remove input form and update UI
        document.getElementById("goals-inputs").remove()
        document.querySelector("#goals-BTN").innerText = `${type} goal set: KSH ${updateGoal[type]}`
    } catch (error) {
        console.error(`error updating ${type} goal:`, error)
    }
}
//modify event listener for create goals btn
document.querySelector("#goals-BTN").addEventListener("click", (e) => {
    e.preventDefault();
    handleGoalCreates();
});



