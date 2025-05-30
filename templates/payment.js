// Data structure for payments
let payments = [];

// DOM references
const paymentsList = document.getElementById('paymentsList');
const totalRevenueEl = document.getElementById('totalRevenue');
const totalPaidEl = document.getElementById('totalPaid');
const totalPendingEl = document.getElementById('totalPending');
const totalPaymentsEl = document.getElementById('totalPayments');

const addPaymentForm = document.getElementById('addPaymentForm');
const clientNameInput = document.getElementById('clientName');
const totalAmountInput = document.getElementById('totalAmount');
const dueDateInput = document.getElementById('dueDate');
const initialPaidInput = document.getElementById('initialPaid');

const searchInput = document.getElementById('searchInput');
const statusFilter = document.getElementById('statusFilter');

const container = document.querySelector('.container');

// Utility to show alerts
function showAlert(message, type = 'success') {
  const alert = document.createElement('div');
  alert.className = `alert ${type}`;
  alert.textContent = message;
  container.insertBefore(alert, container.firstChild);

  setTimeout(() => {
    alert.remove();
  }, 3000);
}

// Generate unique ID for payments
function generateId() {
  return '_' + Math.random().toString(36).substr(2, 9);
}

// Calculate and update summary
function updateSummary() {
  const totalRevenue = payments.reduce((acc, p) => acc + p.totalAmount, 0);
  const totalPaid = payments.reduce((acc, p) => acc + p.amountPaid, 0);
  const totalPending = totalRevenue - totalPaid;
  const totalPayments = payments.length;

  totalRevenueEl.textContent = totalRevenue.toFixed(2);
  totalPaidEl.textContent = totalPaid.toFixed(2);
  totalPendingEl.textContent = totalPending.toFixed(2);
  totalPaymentsEl.textContent = totalPayments;
}

// Determine payment status
function getStatus(payment) {
  if (payment.amountPaid === 0) return 'pending';
  if (payment.amountPaid > 0 && payment.amountPaid < payment.totalAmount) return 'partial';
  if (payment.amountPaid >= payment.totalAmount) return 'paid';
  return 'pending'; // fallback
}

// Render the list of payments based on filters/search
function renderPayments() {
  const searchText = searchInput.value.toLowerCase();
  const filterStatus = statusFilter.value;

  paymentsList.innerHTML = '';

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.clientName.toLowerCase().includes(searchText);
    const paymentStatus = getStatus(payment);
    const matchesStatus = filterStatus === 'all' || paymentStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (filteredPayments.length === 0) {
    paymentsList.innerHTML = `<p style="text-align:center; color:#777; margin-top:20px;">No payments found.</p>`;
    return;
  }

  filteredPayments.forEach(payment => {
    const status = getStatus(payment);

    const card = document.createElement('div');
    card.className = 'payment-card';

    card.innerHTML = `
      <div class="payment-info">
        <p><strong>Client:</strong> ${payment.clientName}</p>
        <p><strong>Total Due:</strong> $${payment.totalAmount.toFixed(2)}</p>
        <p><strong>Paid:</strong> $${payment.amountPaid.toFixed(2)}</p>
        <p><strong>Balance:</strong> $${(payment.totalAmount - payment.amountPaid).toFixed(2)}</p>
        <p><strong>Due Date:</strong> ${payment.dueDate}</p>
        <p class="status ${status}">${status.charAt(0).toUpperCase() + status.slice(1)}</p>
      </div>
      <div class="payment-actions">
        <input type="number" min="0.01" step="0.01" max="${(payment.totalAmount - payment.amountPaid).toFixed(2)}" placeholder="Partial Amount" id="partial-${payment.id}" />
        <button data-id="${payment.id}" class="pay-btn" ${status === 'paid' ? 'disabled style="opacity:0.6;cursor:not-allowed;"' : ''}>Submit Payment</button>
        <button data-id="${payment.id}" class="delete-btn">Delete</button>
      </div>
    `;

    paymentsList.appendChild(card);
  });
}

// Add new payment
addPaymentForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const clientName = clientNameInput.value.trim();
  const totalAmount = parseFloat(totalAmountInput.value);
  const dueDate = dueDateInput.value;
  let initialPaid = parseFloat(initialPaidInput.value);

  if (!clientName || isNaN(totalAmount) || totalAmount <= 0 || !dueDate) {
    showAlert('Please fill all required fields with valid values.', 'error');
    return;
  }

  if (isNaN(initialPaid) || initialPaid < 0) initialPaid = 0;
  if (initialPaid > totalAmount) {
    showAlert('Initial paid amount cannot be more than total amount.', 'error');
    return;
  }

  const newPayment = {
    id: generateId(),
    clientName,
    totalAmount,
    amountPaid: initialPaid,
    dueDate,
  };

  payments.push(newPayment);

  // Reset form
  addPaymentForm.reset();

  updateSummary();
  renderPayments();
  showAlert('Payment added successfully!');
});

// Handle clicks on payment actions (delegate)
paymentsList.addEventListener('click', (e) => {
  const target = e.target;

  if (target.classList.contains('pay-btn')) {
    const paymentId = target.dataset.id;
    const payment = payments.find(p => p.id === paymentId);
    const input = document.getElementById(`partial-${paymentId}`);

    if (!input || !input.value) {
      showAlert('Please enter an amount to pay.', 'error');
      return;
    }

    let partialAmount = parseFloat(input.value);
    if (isNaN(partialAmount) || partialAmount <= 0) {
      showAlert('Enter a valid positive number.', 'error');
      return;
    }

    const maxPayable = payment.totalAmount - payment.amountPaid;
    if (partialAmount > maxPayable) {
      showAlert(`You can only pay up to $${maxPayable.toFixed(2)}.`, 'error');
      return;
    }

    payment.amountPaid += partialAmount;

    // Clear input after payment
    input.value = '';

    updateSummary();
    renderPayments();
    showAlert(`$${partialAmount.toFixed(2)} payment submitted for ${payment.clientName}.`);
  }

  if (target.classList.contains('delete-btn')) {
    const paymentId = target.dataset.id;
    payments = payments.filter(p => p.id !== paymentId);
    updateSummary();
    renderPayments();
    showAlert('Payment deleted.', 'success');
  }
});

// Filters and search listeners
searchInput.addEventListener('input', renderPayments);
statusFilter.addEventListener('change', renderPayments);

// Initial call
updateSummary();
renderPayments();
