import { getData, postData, pathData } from "./api.js";

const goalsHolder = document.querySelector(".goals-holder")
const goalsBtn = document.getElementById("goals-BTN")

function createGoalsElement() {
    console.log("clicked set goals btn")

    if(document.getElementById("goals-wrap")) return;
    //create input elements
    console.log("creating the input field for goals")
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
    console.log("goals inputs added to DOM")
    document.getElementById("save-goals").addEventListener("click", handleSaveGoal)
}

//saving goals after click>>POST and PATCH for updates
async function handleSaveGoal() {
    console.log("saving financial goal")

    const savngsInput = document.getElementById("saving-input")
    const investmtInput = document.getElementById("investmnt-input")
    const goalsErr = document.getElementById("goals-error")

    //validating inputs
    const savngsValue = parseInt(savngsInput.value.trim())
    const investmntValue = parseInt(investmtInput.value.trim())
    
    console.log(`entered values are: savings: ${savngsValue}, investment: ${investmntValue}`)

    if(isNaN(savngsValue) || isNaN(investmntValue) ||
    savngsValue < 0 || investmntValue < 0) {
        console.log("invalid goal values entered")
        goalsErr.textContent = "Invalid goal number"
        goalsErr.style.color = "red"
        return;
    }

    try {
        console.log("fetching existing goals")
        const existngGoals = await getData("financial_goal")

        if(existngGoals.length === 0) {
            console.log("no existing goals found. create new ones")
            await postData("financial_goal", {savngsValue, investmntValue})
        } else {
            console.log(`updating existing goals (ID: ${existngGoals})`)
            await pathData("financial_goal", existngGoals[0].id, {savngsValue, investmntValue})    
        }
        console.log("goals successfully saved")
        displayGoals(savngsValue, investmntValue);
    } catch (error) {console.error("error saving goals:", error)}
}










document.addEventListener("DOMContentLoaded", () => {
    // loadGoals()
    goalsBtn.addEventListener("click", createGoalsElement)
});
