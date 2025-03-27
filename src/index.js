document.addEventListener("DOMContentLoaded", () => {
    console.log("page loaded successfully")
    
    // listen for budget button
    const budgetButton = document.querySelector(".budget-card .budget-holder #budget-BTN");
     
    budgetButton.addEventListener("click", (e) => {
        e.preventDefault()
        console.log("budget button clicked") 
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

        document.getElementById("save-btn").addEventListener("click", saveBudget);
    })
})

//handling save budget
function saveBudget(){
    console.log("save budget clicked")
    const budgetInput = document.getElementById("budget-input");
    const budgetError = document.getElementById("budget-error");
    const budgetValue = budgetInput.value.trim();

    if (!budgetValue) {
        budgetError.textContent = "budget cannot be empty"
        budgetError.style.color = "red";
        console.warn("budget input is empty")
        return
    }
     if (isNaN(budgetValue) || budgetValue <=0) {
        budgetError.textContent = "Enter a valid positive number"
        budgetError.style.color = "red";
        console.warn("invalid input")
        return;
     }
     console.log(`budget saved: ${budgetValue}`)
     budgetError.textContent = ""

    //prepare budget data and send PATCH request
    const budgetData = {total: Number(budgetValue)};
    console.log("sending request updating budget:", budgetData)
    fetch("http://localhost:3000/budget", {
        method: "PATCH",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(budgetData),
    })
    .then(res => res.json())
    .then(updatedBudget => {
        console.log("successful budget update:", updatedBudget);

        //remove input form and update UI
        document.getElementById("budget-inputs").remove();
        const budgetSet = document.querySelector(".budget-holder #budget-BTN")
        budgetSet.innerHTML = `budget set: KSH ${updatedBudget.total}`
        budgetSet.style.backgroundColor = "green";
        budgetSet.style.color = "white"
    })
    .catch(error => {
        console.error("Error updating budget:", error)
    })
}
