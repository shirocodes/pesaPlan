//import key API functions
import { getData, postData, pathData } from "./api.js";

const budgetHolder = document.querySelector(".budget-holder")
const budgetBTN = document.getElementById("budget-BTN")

//create elements - a div for inputs and btn
function createBudgetElement() {
    //avoid duplicates
    if(document.getElementById("budget-element")) return;

    const budgetWrap = document.createElement("div")
    budgetWrap.id = "budget-wrapper";

    budgetWrap.innerHTML = `
    <input type="number" id="budgtInput-field" placeholder ="enter amount">
    <button id="save-budgt">Save budget</button>
    <p id="budget-error"></p>`;

    budgetHolder.appendChild(budgetWrap)

    document.getElementById("save-budgt").addEventListener("click", saveBudget)
}

//saveBudget() > input validation > saving to json > updating UI
async function saveBudget() { 
    const budgtInput = document.getElementById("budgtInput-field")
    const budgtValue = parseInt(budgtInput.value.trim());
    const budgetError = document.getElementById("budget-error")

    //validation
    if(isNaN(budgtValue) || budgtValue <= 0) {
        budgetError.textContent = "Enter a valid amount"
        budgetError.style.color = "red";
        return;
    }

    try {
        const existingBudget = await getData("budget")

        if(existingBudget.length === 0) {
            //no budget, so create one
            await postData("budget", {total: budgtValue});
        } else {
            //budget exists, so update it
            await pathData("budget", existingBudget[0].id, {total: budgtValue}) 
        }
        updateBudgetUI(budgtValue);

    } catch(error) {console.error("error saving budget:", error)}  
}

//updating UI with saved budget ||
//remove inputs > changing buttons color/content
function updateBudgetUI(amount) {

    if (!amount || isNaN(amount)) return;

    const budgetWrap = document.getElementById("budget-wrapper")
        
    if(budgetWrap) budgetWrap.remove();

    //update appearance of 'save Budget' butn
    budgetBTN.textContent = `Budget set: Ksh ${amount}`;
    budgetBTN.style.hover = "green" 
}

//on page load, load existing budget & updateUI
async function loadBudget() {
    try {
        const budgetData = await getData("budget")

        if(budgetData.length > 0) {
            updateBudgetUI(budgetData[0].total)
        }
    }catch(error) {console.error("failed to load budget:", error)} 
}

document.addEventListener("DOMContentLoaded", () => {
    loadBudget();
    budgetBTN.addEventListener("click", createBudgetElement);
})
