import {getData, pathData} from "./api.js";

let visualChart; //for a dynamic update on statschart

//retrieve data from server for analysis and visualization
async function fetchAnalysisData() {
    try {
        const dataOnBudget = await getData("budget") || []
        const dataOnGoals = await getData("financial_goal") || []
        const dataOnExpenses = await getData("expenses") || []
        
        if (!dataOnBudget.length || !dataOnGoals.length || 
            !dataOnExpenses.length) {
             }

        const budget = dataOnBudget.length ? dataOnBudget[0].total : 0;
        const savings = dataOnGoals.length ? dataOnGoals[0].savings : 0;
        const investment = dataOnGoals.length ? dataOnGoals[0].investment : 0;

        //Sum all expenses saved
        const totalExpsns = dataOnExpenses.reduce((sum, expense) =>
         sum + expense.amount, 0)

        return {budget, savings, investment, totalExpsns}
    } catch(error) {console.error("error fetching all data:", error)}             
}

//with fetched data, process for visualization
//analyzing on 20:80 proportion
async function processAnalysisData() {
    const {budget, savings, investment, totalExpsns} = await fetchAnalysisData();

    if (budget === 0) {
        document.getElementById("financial-advice").textContent = "Set a budget first!";
        return;
    }

    //allocation per %
    const allGoals = savings + investment;
    const goalsAllocation = ((allGoals/budget) * 100).toFixed(2)
    const expenseAllocation = ((totalExpsns/budget) * 100).toFixed(2)

    let statsInsight = ""

    if(goalsAllocation >= 20) {
        statsInsight += `A (${goalsAllocation}%) on financial goals is recommendable.\n`
    } else {
        statsInsight += `A ${goalsAllocation}% on financial goals is risky. Cut on expenses.\n`
    }

    if(expenseAllocation >=80) {
        statsInsight += `Your (${expenseAllocation}%) on expenses is risky. <br>
        Allocate more to financial goals. `
    }

    document.getElementById("financial-advice").innerHTML = statsInsight;

    generateChart(goalsAllocation, expenseAllocation)
 }

//analyzed data flow to chart generation > chart.js = barchart

function generateChart(goalsAllocation, expenseAllocation) {
    const ctx = document.getElementById("statsChart").getContext("2d")

    if(visualChart) {
        visualChart.destroy();
    }
       
    visualChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["budget allocation"],
            datasets: [
                {
                    label: "Financial Goals",
                    data: [goalsAllocation],
                    backgroundColor: goalsAllocation >= 20 ? "green" : "orange",
                },
                {
                    label: "Expenses",
                    data: [expenseAllocation],
                    backgroundColor: expenseAllocation >= 80 ? "red" : "grey",
                }]
        },
        options: {
            responsive: true,
            scales: {
                x: { stacked: true },
                y: { stacked: true, beginAtZero: true, max: 100 }
            }
        }
    })
}

//when data changes in budget, goals, or expense fields, chart updates
async function updateWithdataChanges(e) {
    const field = e.target.id
    const updatedValue = parseInt(e.target.value.trim())
    
    if (isNaN(updatedValue) || updatedValue < 0) {

        return;
    }

    if(field === "budget-input") {
        await pathData("budget", "1", {total: updatedValue})
    } else if (field === "savings-input") {
        await pathData("financial_goal", "1", {savings: updatedValue})
    } else if (field === "investment-input") {
        await pathData("financial_goal", "1", {investment: updatedValue})
    }
    
    processAnalysisData() //after updating, refresh analysis and chart
}

//on page loads 
document.addEventListener("DOMContentLoaded", () => {
    const statsBTN = document.getElementById("chart-Btn")

    if(statsBTN) {
        statsBTN.addEventListener("click", async () => {
            await processAnalysisData()
        })
    } else {
        console.error("chart btn not found")
    }
    
    //use forEach(), reducing repetition with if else on all inputs
    const fields = [
        {id: "budgtInput-field", name:"budgetField"},
        {id: "saving-input", name:"budgetField"},
        {id: "investmnt-input", name:"budgetField"},
        {id: "expns-amt", name:"budgetField"}
    ]

    fields.forEach(({id, name}) => {
        const field = document.getElementById(id)
        
        if(field) {
            field.addEventListener("input", updateWithdataChanges)
        }
        else {
            console.log(`${name} not found`)
        }
    })
});