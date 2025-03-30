import {getData} from "./api.js";

//retrieve data from server //total budget, all goals, and expenses
async function fetchAnalysisData() {
    try {
        const [dataOnBudget, dataOnGoals, dataOnExpenses] = await Promise.all([
            getData("budget"),
            getData("financial_goal"),
            getData("expenses"),
        ]);
        return {dataOnBudget, dataOnGoals, dataOnExpenses}
    } catch (error) {console.error("Error fetching all data:", error)
        return null;
    }       
}
//with fetched data, process for visualization || reduce()
function processAnalysisData(dataOnBudget, dataOnGoals, dataOnExpenses) {
    const allBudgt = dataOnBudget.amount;
    
}