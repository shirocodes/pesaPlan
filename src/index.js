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
const goalsBTN = document.querySelector("#goals-BTN");
goalsBTN.addEventListener("click", (e) =>{
    e.preventDefault()
    console.log("create goals btn clicked")

    //elements to hold goals' inputs
    const wrapGoalsInputs = document.createElement("div");
    wrapGoalsInputs.id = "goals-inputs";
    wrapGoalsInputs.innerHTML = `
        <p class="invest-input"> savings goal</p>
        <input type="number" id="goal-input" placeholder ="enter amount">
        <button id="savegoal-btn">Save goal</button>
        <p class="invest-input"> investment goal</p>
        <input type="number" id="invest-input" placeholder ="enter amount">
        <button id="investgoal-btn">Save goal</button>
        <p id="goals-error"></p> `

        //append to goals holder
        const goalsHolder = document.querySelector(".goals-holder")
        goalsHolder.appendChild(wrapGoalsInputs)

})
