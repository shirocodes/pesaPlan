import { getData, postData, pathData, deleteData } from "./api.js";

const expensHolder = document.querySelector(".expenses-holder");
const expensBTN = document.getElementById("expenses-BTN")

const categories = ["Rent", "Food", "Health", "Transport", "Entertainment", "Amenities"];

//create elements
function createExpensInput() {
    console.log("track expenses btn clicked")
    if(document.getElementById("expense-input")) return
    console.log("creating expense input elements")

    const expensesDiv = document.createElement("div")
    expensesDiv.id = "expense-input";

    expensesDiv.innerHTML = `
        <select id="expns-category">
            <option value="">Select Category</option>
            ${categories.map(categry => `<option value="${categry}">${categry}</option>`).join("")}
        </select>
         <input type="number" id="expns-amt" placeholder = "enter amount">
        <button id="save-expns">Save Expense</button>
        <p id="expns-error"></p>
    `;
    expensHolder.appendChild(expensesDiv);
    console.log("expense inputs added successfully")

    document.getElementById("save-expns").addEventListener("click", saveExpenses)
}

//saving expenses after click>>POST and PATCH for updates
async function saveExpenses() {
    console.log("saving expenses");
    const inputAmt = document.getElementById("expns-amt")
    const inputCategory = document.getElementById("expns-category")
    const msgError = document.getElementById("expns-error");

    const amount = parseInt(inputAmt.value.trim())
    const category = inputCategory.value.trim()

    //validate input values
    if(isNaN(amount) || amount <= 0 ||
    category === "") {
        console.warn("invalid expense values entered")
        msgError.textContent = "Invalid: Select category and enter amount"
        msgError.style.color = "red"
        return;
    }

    try {
        await postData("expenses", {amount, category})
        console.log("successfuly saved expense")

        //after saving, clear input values 
        inputAmt.value = ""
        inputCategory.value = ""
        //now load expense list
        loadExpenses();
    } catch (error) {console.error("error saving expenses")}
}

//after saving expense >> fetch existing expenses >> later display
async function loadExpenses() {
    console.log("loading expenses from server")

    try {
        const existingExpns = await getData("expenses")
        console.log("fetched expense:", existingExpns)

        if(!existingExpns ||existingExpns.length === 0) {
            console.warn("no expenses found")
            displayExpenses([]) //ensuring that the load doesnt break when empty
            return;
        }
        displayExpenses(existingExpns);
    } catch (error) {console.error("failed in loading expenses:", error)}   
}

//after loading for existing expenses, display
function displayExpenses(expenses) {
    const list = document.getElementById("listed-expenses")
    if(list) list.remove();

    const listHolder = document.createElement("div");
    listHolder.id = "listed-expenses";

    if(expenses.length === 0) {
        listHolder.innerHTML = `<p>No expenses to track</p>`
    } else {
        listHolder.innerHTML = expenses.map(exp => `
            <div class="listed-item"> 
                <span>${exp.category}: Kshs ${exp.amount}</span>
                <button class="delete-Btn" data-id="${exp.id}">X</button>
            </div>
            `). join("")
        }
    
        //append created element div
    expensHolder.appendChild(listHolder);

    document.querySelectorAll(".delete-Btn").forEach(button => {
        button.addEventListener("click", deleteExpense)
    })
}

//DELETE request: remove from UI and server
async function deleteExpense(e) {
    //target the delete btn using unique id
    const expnsID = e.target.getAttribute("data-id")
    console.log(`deleting expense with ID: ${expnsID}`);

    //validate if id is undefines
    if(!expnsID) return;

    try {
        await deleteData("expenses", expnsID);
        console.log("successfuly deleted expense")
        loadExpenses()
    } catch (error) {console.error("error deleting expense:", error)}
    
}
//on page load, call 
document.addEventListener("DOMContentLoaded", () => {
    loadExpenses();
    expensBTN.addEventListener("click", createExpensInput)
})
