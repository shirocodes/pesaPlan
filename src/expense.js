import { getData, postData, deleteData } from "./api.js";

const expensHolder = document.querySelector(".expenses-holder");
const expensBTN = document.getElementById("expenses-BTN")

const categories = ["Rent", "Food", "Health", "Transport", "Entertainment", "Amenities"];

//create elements
function createExpensInput() {
    if(document.getElementById("expense-input")) return

    const expensesDiv = document.createElement("div")
    expensesDiv.id = "expense-input";

    expensesDiv.innerHTML = `
        <select id="expns-category">
            <option value="">Select Category</option>
            ${categories.map(categry => `<option value="${categry}">${categry}</option>`).join("")}
        </select>
         <input type="number" id="expns-amt" placeholder = "enter amount">
        <button id="save-expns">Save Expense</button>
        <p id="expns-error" style="color: red; display: none;"></p>
    `;
    expensHolder.appendChild(expensesDiv);
    

    //Enable event listeners
    const targetCategory = document.getElementById("expns-category");
    const inputAmount = document.getElementById("expns-amt");
    const msgError = document.getElementById("expns-error");
    const saveButton = document.getElementById("save-expns");
    
        //focus event
    targetCategory.addEventListener("focus", () => {
        targetCategory.style.border = "2px solid violet";
    });
    inputAmount.addEventListener("focus", () => {
        inputAmount.style.border = "2px solid green";
        msgError.style.display = "none"; // Clear error when user starts typing
    });

        //input event for validation 
    inputAmount.addEventListener("input", (e) => {
        let value = e.target.value.trim();

        // avoid invalid $ negative amounts
        if (value < 0 || isNaN(value) || value === "") {
             msgError.textContent = "Enter a valid amount"
            msgError.style.display = "block"
        } else {
           msgError.style.display = "none"
        }
    });

        //remove focus using blur event
    targetCategory.addEventListener("blur", () => {
        targetCategory.style.border = "1px solid #ccc";
    });
    
    inputAmount.addEventListener("blur", () => {
        inputAmount.style.border = "1px solid #ccc";
    });
        //key down to save via enter key
    inputAmount.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            console.log("Enter key pressed to save expense");
            saveExpenses();
        }
        });
            //click event on saving
    saveButton.addEventListener("click", saveExpenses)
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
        msgError.textContent = "Invalid: Select category and enter amount"
        msgError.style.color = "red"
        return;
    }

    try {
        await postData("expenses", {amount, category})

        //after saving, clear input values 
        inputAmt.value = ""
        inputCategory.value = ""
        //now loading
        loadExpenses();
    } catch (error) {console.error("error saving expenses")}
}

//after saving expense >> fetch existing expenses >> later display
async function loadExpenses() {
    try {
        const existingExpns = await getData("expenses")

        if(!existingExpns ||existingExpns.length === 0) {
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

    //validate if id is undefines
    if(!expnsID) return;

    try {
        await deleteData("expenses", expnsID);
        loadExpenses()
    } catch (error) {console.error("error deleting expense:", error)}
    
}
//on page load, call 
document.addEventListener("DOMContentLoaded", () => {
    loadExpenses();
    expensBTN.addEventListener("click", createExpensInput)
})
