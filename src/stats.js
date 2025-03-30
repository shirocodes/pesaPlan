import {getData, postData, pathData} from "./api.js";

let visualChart; //for a dynamic update on statschart

//retrieve data from server for analysis and visualization
async function fetchAnalysisData() {
    try {
        const dataOnBudget = await getData("budget")
        const dataOnGoals = await getData("financial_goal")
        const dataOnExpenses = await getData("expenses");
        
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
function processAnalysisData() {
    const {budget, savings, investment, totalExpsns} = await fetchAnalysisData();

    if (budget === 0) {
        console.warn("No budget set. Analysis cannot proceed.");
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
        statsInsight += `A ${goalsAllocation}% on financial goals is risky.\n`
    }

    if(expenseAllocation >=80) {
        statsInsight += `Your (${expenseAllocation}%) on expenses is risky <br>
        Allocate more to financial goals. `
    }

    console.log()
    generateChart(goalsAllocation, expenseAllocation)
 }

//analyzed data flow to chart generation > chart.js = barchart

function generateChart(goalsAllocation, expenseAllocation) {
    const ctx = document.getElementById("statsChart").getContext("2d")

    if(visualChart) visualChart.destroy();

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
                    backgroundColor: expenseAllocation >= 80 ? "red" : "blue",
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
    
    if (isNaN(updatedValue) || updatedValue < 0)
}