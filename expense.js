let expenses = [];

let budget = Number(prompt("Enter your total budget:")) || 0;

let form = document.getElementById("frm");

let expenseName = document.getElementById("expensename");
let expenseAmount = document.getElementById("expenseamount");
let expenseCategory = document.getElementById("expensecategory");
let expenseDate = document.getElementById("expensedate");

let totalAmount = document.getElementById("TotalAmount");
let numExpenses = document.getElementById("numexpenses");
let remainingBudget = document.getElementById("rembudget");

let savedExpenses = localStorage.getItem("expenses");

if (savedExpenses !== null) {
    try {
        expenses = JSON.parse(savedExpenses);

        if (!Array.isArray(expenses)) {
            expenses = [];
        }
    } catch (error) {
        expenses = [];
    }
}

function saveExpenses() {
    localStorage.setItem("expenses", JSON.stringify(expenses));
}

form.addEventListener("submit", function(event) {

    event.preventDefault();

    let name = expenseName.value.trim();
    let amount = Number(expenseAmount.value);
    let category = expenseCategory.value;
    let date = expenseDate.value;

    if (
        name === "" ||
        expenseAmount.value.trim() === "" ||
        !Number.isFinite(amount) ||
        amount <= 0
    ) {
        alert("Please enter a valid expense name and amount.");
        return;
    }

    let expense = {
        id: Date.now(),
        name: name,
        amount: amount,
        category: category,
        date: date
    };

    expenses.push(expense);

    saveExpenses();

    form.reset();

    displayExpenses();
});

function displayExpenses() {

    let expenseList = document.getElementById("expenseList");

       if (expenseList === null) {
        expenseList = document.createElement("div");
        expenseList.id = "expenseList";

        form.after(expenseList);
     }

    expenseList.innerHTML = "";

    expenses.forEach(function(expense) {

        let row = document.createElement("div");

        row.style.display = "flex";
        row.style.alignItems = "center";
        row.style.justifyContent = "space-between";
        row.style.flexWrap = "wrap";
        row.style.gap = "10px";
        row.style.backgroundColor = "white";
        row.style.padding = "15px";
        row.style.marginTop = "10px";
        row.style.borderRadius = "8px";

        let details = document.createElement("p");

        details.style.fontSize = "16px";

        details.textContent =
            expense.name +
            " | ₹" + expense.amount +
            " | " + expense.category +
            " | " + (expense.date || "No date");

        let deleteButton = document.createElement("button");

        deleteButton.textContent = "Delete";
        deleteButton.type = "button";

        deleteButton.addEventListener("click", function() {

            expenses = expenses.filter(function(item) {
                return item.id !== expense.id;
            });

            saveExpenses();

            displayExpenses();
        });

        row.appendChild(details);
        row.appendChild(deleteButton);

        expenseList.appendChild(row);
    });

    updateSummary();
}

function updateSummary() {

    let total = 0;

    for (let i = 0; i < expenses.length; i++) {
        total = total + expenses[i].amount;
    }

    totalAmount.textContent = "₹" + total.toFixed(2);

    numExpenses.textContent = expenses.length;

    remainingBudget.textContent =
        "₹" + (budget - total).toFixed(2);
}

let clearButton = document.getElementById("clearAll");

if (clearButton) {
    clearButton.addEventListener("click", function() {

        if (confirm("Do you want to delete all expenses?")) {

            expenses = [];

            saveExpenses();

            displayExpenses();
        }
    });
}

displayExpenses();
