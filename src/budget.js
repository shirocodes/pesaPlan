//import key API functions
import { getData, postData, pathData } from "./api.js";

const budgetHolder = document.querySelector(".budget-holder")
const budgetBTN = document.getElementById("budget-BTN")

//create elements - a div for inputs and btn
function createBudgetElement() {
    console.log("Create Budget button clicked");
    //avoid duplicates
    if(document.getElementById("budget-element")) return;
    
    console.log("Creating budget input elements...");
    const budgetWrap = document.createElement("div")
    budgetWrap.id = "budget-wrapper";

    budgetWrap.innerHTML = `
    <input type="number" id="budgtInput-field" placeholder ="enter amount">
    <button id="save-budgt">Save budget</button>
    <p id="budget-error"></p>`;

    budgetHolder.appendChild(budgetWrap)
    console.log("Budget input field added to the DOM.");

    document.getElementById("save-budgt").addEventListener("click", saveBudget)
}

//saveBudget() > input validation > saving to json > updating UI
async function saveBudget() { 
    const budgtInput = document.getElementById("budgtInput-field")
    const budgtValue = parseInt(budgtInput.value.trim());
    const budgetError = document.getElementById("budget-error")

    console.log(`Entered budget value: ${budgtValue}`);

    //validation
    if(isNaN(budgtValue) || budgtValue <= 0) {
        console.error("Invalid budget amount entered!");
        budgetError.textContent = "Enter a valid amount"
        budgetError.style.color = "red";
        console.warn("Invalid input")
        return;
    }

    try {
        console.log("Fetching existing budget data...");

        const existingBudget = await getData("budget")

        if(existingBudget.length === 0) {
            console.log("No existing budget found. Creating new budget...");
            
            //no budget, so create one
            await postData("budget", {total: budgtValue});
        } else {
            console.log(`Updating existing budget (ID: ${existingBudget[0].id})...`);
            
            //budget exists, so update it
            await pathData("budget", existingBudget[0].id, {total: budgtValue}) 
        }
        console.log("Budget successfully saved.");
        updateBudgetUI(budgtValue);

    } catch(error) {console.error("error saving budget:", error)}  
}

//updating UI with saved budget ||
//remove inputs > changing buttons color/content
function updateBudgetUI(amount) {
    console.log(`Updating UI with new budget: Ksh ${amount}`);

    if (!amount || isNaN(amount)) {
        console.warn("No budget amount found. Keeping default button text.");
        return;
    }

    const budgetWrap = document.getElementById("budget-wrapper")
    console.log("Removing budget input container from DOM.");
        
    if(budgetWrap) budgetWrap.remove();

    //update appearance of 'save Budget' butn
    budgetBTN.textContent = `Budget set: Ksh ${amount}`;
    budgetBTN.style.backgroundColor = "green"  
    console.log("Budget button updated.") 
}

//on page load, load existing budget & updateUI
async function loadBudget() {
    console.log("Loading budget from server...");
    try {
        const budgetData = await getData("budget")
        console.log("Fetched budget data:", budgetData);

        if(budgetData.length > 0) {
            updateBudgetUI(budgetData[0].total)
        }
    }catch(error) {console.error("failed to load budget:", error)} 
}

document.addEventListener("DOMContentLoaded", () => {
    loadBudget();
    budgetBTN.addEventListener("click", createBudgetElement);
})
