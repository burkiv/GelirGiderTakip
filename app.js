let editIndex = -1;

document.getElementById('transaction-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const type = document.getElementById('type').value;
    const date = new Date().toLocaleString();

    if (editIndex === -1) {
        // Yeni işlem ekleme
        addTransaction(description, amount, type, date);
    } else {
        // Mevcut işlemi güncelleme
        transactions[editIndex] = { description, amount, type, date };
        editIndex = -1; // Düzenleme modundan çık
    }

    saveTransactions();
    renderTransactions();
    updateSummary();
    updateChart();

    // Formu temizle
    document.getElementById('transaction-form').reset();
});

let transactions = loadTransactions();

function addTransaction(description, amount, type, date) {
    transactions.push({ description, amount, type, date });

    renderTransactions();
}

function renderTransactions() {
    const transactionList = document.getElementById('transaction-list');
    transactionList.innerHTML = '';

    transactions.forEach((transaction, index) => {
        const row = document.createElement('tr');

        if (transaction.type === 'Gelir') {
            row.innerHTML = `
                <td>${transaction.description}</td>
                <td style="color: green;">${transaction.amount.toFixed(2)}</td>
                <td></td>
                <td>${transaction.date}</td>
                <td>
                    <button onclick="editTransaction(${index})">Düzenle</button>
                    <button onclick="deleteTransaction(${index})">Sil</button>
                </td>
            `;
        } else {
            row.innerHTML = `
                <td>${transaction.description}</td>
                <td></td>
                <td style="color: red;">${transaction.amount.toFixed(2)}</td>
                <td>${transaction.date}</td>
                <td>
                    <button onclick="editTransaction(${index})">Düzenle</button>
                    <button onclick="deleteTransaction(${index})">Sil</button>
                </td>
            `;
        }

        transactionList.appendChild(row);
    });
}

function deleteTransaction(index) {
    transactions.splice(index, 1); // İlgili işlemi listeden çıkar
    saveTransactions(); // Güncellenmiş listeyi kaydet
    renderTransactions(); // İşlemleri yeniden render et
    updateSummary(); // Özet bilgileri güncelle
    updateChart(); // Grafiği güncelle
}

function editTransaction(index) {
    const transaction = transactions[index];
    document.getElementById('description').value = transaction.description;
    document.getElementById('amount').value = transaction.amount;
    document.getElementById('type').value = transaction.type;

    // Düzenleme moduna geç
    editIndex = index;
}

function updateSummary() {
    const income = transactions
        .filter(transaction => transaction.type === 'Gelir')
        .reduce((total, transaction) => total + transaction.amount, 0);

    const expense = transactions
        .filter(transaction => transaction.type === 'Gider')
        .reduce((total, transaction) => total + transaction.amount, 0);

    const balance = income - expense;

    const summary = document.getElementById('summary');
    summary.innerHTML = `
        <p>Toplam Gelir: <span style="color: green;">${income.toFixed(2)} TL</span></p>
        <p>Toplam Gider: <span style="color: red;">${expense.toFixed(2)} TL</span></p>
        <p>Bakiye: <span style="color: ${balance >= 0 ? 'green' : 'red'};">${balance.toFixed(2)} TL</span></p>
    `;
}

function updateChart() {
    const income = transactions
        .filter(transaction => transaction.type === 'Gelir')
        .reduce((total, transaction) => total + transaction.amount, 0);

    const expense = transactions
        .filter(transaction => transaction.type === 'Gider')
        .reduce((total, transaction) => total + transaction.amount, 0);

    const ctx = document.getElementById('myChart').getContext('2d');

    if (myChart) {
        myChart.destroy();
    }

    myChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Gelir', 'Gider'],
            datasets: [{
                label: 'Gelir ve Gider',
                data: [income, expense],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(255, 99, 132, 0.2)'
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 99, 132, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

function saveTransactions() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

function loadTransactions() {
    const savedTransactions = localStorage.getItem('transactions');
    return savedTransactions ? JSON.parse(savedTransactions) : [];
}

function clearAllTransactions() {
    transactions = []; // İşlem listesini boşalt
    saveTransactions(); // Boş listeyi kaydet
    renderTransactions(); // İşlemleri yeniden render et
    updateSummary(); // Özet bilgileri güncelle
    updateChart(); // Grafiği güncelle
}

document.addEventListener('DOMContentLoaded', function() {
    transactions = loadTransactions();
    renderTransactions();
    updateSummary();
    updateChart();
});
