import { getData, postData, pathData } from "./api.js";

const goalsHolder = document.querySelector(".goals-holder")
const goalsBtn = document.getElementById("goals-BTN")

function createGoalsElement() {

    if(document.getElementById("goals-wrap")) return;

    //create input elements
    const goalsWrapper = document.createElement("div");
    goalsWrapper.id = "goals-wrap"
    goalsWrapper.innerHTML = `
        <label for="saving-input">Savings:</label>
        <input type="number" id="saving-input" placeholder="Enter amount">
        
        <label for="investmnt-input">Investment:</label>
        <input type="number" id="investmnt-input" placeholder="Enter amount">
        
        <button id="save-goals">Save Goals</button>
        <p id="goals-error"></p>
    `;
    goalsHolder.appendChild(goalsWrapper)
    document.getElementById("save-goals").addEventListener("click", handleSaveGoal)
}

//saving goals after click>>POST and PATCH for updates
async function handleSaveGoal() {

    const savngsInput = document.getElementById("saving-input")
    const investmtInput = document.getElementById("investmnt-input")
    const goalsErr = document.getElementById("goals-error")

    //validating inputs
    const savngsValue = parseInt(savngsInput.value.trim())
    const investmntValue = parseInt(investmtInput.value.trim())
    
    if(isNaN(savngsValue) || isNaN(investmntValue) ||
    savngsValue < 0 || investmntValue < 0) {
        goalsErr.textContent = "Invalid goal number"
        goalsErr.style.color = "red"
        return;
    }

    try {
        const existngGoals = await getData("financial_goal")

        if(existngGoals.length === 0) {
            await postData("financial_goal", {savings: savngsValue, investment: investmntValue})
        } else {
            await pathData("financial_goal", existngGoals[0].id, {savings: savngsValue, investment: investmntValue})    
        }
    
        displayGoals(savngsValue, investmntValue);
    } catch (error) {console.error("error saving goals:", error)}
}

//after saving goals > remove input form > update initial btn
function displayGoals(savngsValue, investmntValue) {

   //creating a total for savings and investment
   const goalInputs = [savngsValue, investmntValue]
   const totalGoals = goalInputs.reduce((sum, value) =>
    sum + value, 0)
   
    const goalsWrapper = document.getElementById("goals-wrap")
    if(goalsWrapper) {
        goalsWrapper.remove()
    }

    goalsBtn.textContent = totalGoals === 0 ? "set Goals" :
     `Goal set: Kshs ${totalGoals}`
}

//whenever page loads, existing goals should load and get lost
async function loadGoals() {
    try {
        const existngGoalsData = await getData("financial_goal")

        if(existngGoalsData.length > 0) {
            displayGoals(existngGoalsData[0].savings, existngGoalsData[0].investment)
        } else {
            displayGoals(0, 0);
        }
    }catch(error) {console.error("failed in loading goals:", error)}
    
}
//on each page load, call
document.addEventListener("DOMContentLoaded", () => {
    loadGoals();
    goalsBtn.addEventListener("click", createGoalsElement)
});
