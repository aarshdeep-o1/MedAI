// MediAI Frontend JavaScript

// =============================================
// Backend API Setup
// =============================================

const API_BASE_URL = 'http://localhost:3000/api'; // Adjust if Next.js runs on different port

async function loadPatientsFromAPI() {
  try {
    const response = await fetch(`${API_BASE_URL}/patients`);
    if (!response.ok) throw new Error('Failed to load patients');
    patients = await response.json();

    // Ensure token counter stays unique across reloads
    const maxToken = patients.reduce((max, p) => {
      const n = parseInt((p.token || "").split("-")[1], 10);
      return Number.isFinite(n) ? Math.max(max, n) : max;
    }, 0);
    tokenCounter = Math.max(tokenCounter, maxToken + 1);
  } catch (error) {
    console.warn("Failed to load patients from API:", error);
  }
}

async function addPatientToAPI(patient) {
  try {
    const response = await fetch(`${API_BASE_URL}/patients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patient)
    });
    if (!response.ok) throw new Error('Failed to save patient');
    return await response.json();
  } catch (error) {
    console.warn("Failed to save patient to API:", error);
  }
}

// =============================================
// DATA STORAGE (Simulated Database)
// =============================================

let patients = [
  { token: 'A-001', name: 'Amit Kumar', age: 45, department: 'Cardiology', symptoms: 'Chest pain', urgency: 'high', status: 'waiting' },
  { token: 'A-002', name: 'Priya Singh', age: 32, department: 'General Medicine', symptoms: 'Fever and cold', urgency: 'low', status: 'waiting' },
  { token: 'A-003', name: 'Rahul Sharma', age: 28, department: 'Cardiology', symptoms: 'Heart palpitations', urgency: 'high', status: 'current' },
  { token: 'A-004', name: 'Sunita Devi', age: 55, department: 'Orthopedics', symptoms: 'Knee pain', urgency: 'medium', status: 'waiting' },
  { token: 'A-005', name: 'Vikram Patel', age: 67, department: 'Neurology', symptoms: 'Severe headache', urgency: 'critical', status: 'waiting' },
  { token: 'A-006', name: 'Anita Gupta', age: 23, department: 'Dermatology', symptoms: 'Skin rash', urgency: 'low', status: 'waiting' },
  { token: 'A-007', name: 'Rajesh Verma', age: 41, department: 'Emergency', symptoms: 'Breathing difficulty', urgency: 'critical', status: 'waiting' },
  { token: 'A-008', name: 'Meera Joshi', age: 35, department: 'Pediatrics', symptoms: 'Child fever', urgency: 'medium', status: 'waiting' },
];

let tokenCounter = 9;

// =============================================
// PATIENT REGISTRATION
// =============================================

const registrationForm = document.getElementById('registrationForm');
if (registrationForm) {
  registrationForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const age = document.getElementById('age').value;
    const gender = document.getElementById('gender').value;
    const phone = document.getElementById('phone').value;
    const department = document.getElementById('department').value;
    const symptoms = document.getElementById('symptoms').value;
    
    // Determine urgency based on keywords
    const urgency = determineUrgency(symptoms, department);
    
    // Generate token
    const token = `A-${String(tokenCounter).padStart(3, '0')}`;
    tokenCounter++;

    // Create patient object
    const newPatient = {
      token,
      name,
      age: parseInt(age),
      gender,
      phone,
      department: getDepartmentName(department),
      symptoms,
      urgency,
      status: 'waiting'
    };

    // Save locally (fallback) + persist to API
    patients.push(newPatient);
    addPatientToAPI({
      name,
      age: parseInt(age),
      gender,
      phone,
      department,
      symptoms
    });

    // Show success modal
    document.getElementById('tokenNumber').textContent = token;
    document.getElementById('successModal').classList.add('active');
    
    // Reset form
    registrationForm.reset();
  });
}

function determineUrgency(symptoms, department) {
  const criticalKeywords = ['breathing', 'chest pain', 'unconscious', 'severe bleeding', 'heart attack', 'stroke'];
  const highKeywords = ['high fever', 'vomiting', 'accident', 'fracture', 'palpitations'];
  const mediumKeywords = ['pain', 'infection', 'swelling'];
  
  const symptomsLower = symptoms.toLowerCase();
  
  if (department === 'emergency') return 'critical';
  if (criticalKeywords.some(k => symptomsLower.includes(k))) return 'critical';
  if (highKeywords.some(k => symptomsLower.includes(k))) return 'high';
  if (mediumKeywords.some(k => symptomsLower.includes(k))) return 'medium';
  return 'low';
}

function getDepartmentName(value) {
  const depts = {
    'general': 'General Medicine',
    'cardiology': 'Cardiology',
    'orthopedics': 'Orthopedics',
    'pediatrics': 'Pediatrics',
    'dermatology': 'Dermatology',
    'neurology': 'Neurology',
    'emergency': 'Emergency'
  };
  return depts[value] || value;
}

function closeModal() {
  document.getElementById('successModal').classList.remove('active');
}

// =============================================
// QUEUE STATUS PAGE
// =============================================

function initQueuePage() {
  const queueList = document.getElementById('queueList');
  const deptStatus = document.getElementById('deptStatus');
  
  if (!queueList) return;
  
  // Render queue list
  renderQueueList();
  
  // Render department status
  renderDeptStatus();
  
  // Update stats
  updateQueueStats();
}

function renderQueueList() {
  const queueList = document.getElementById('queueList');
  if (!queueList) return;
  
  const waitingPatients = patients.filter(p => p.status === 'waiting' || p.status === 'current');
  
  // Sort by urgency
  const urgencyOrder = { 'critical': 0, 'high': 1, 'medium': 2, 'low': 3 };
  waitingPatients.sort((a, b) => urgencyOrder[a.urgency] - urgencyOrder[b.urgency]);
  
  queueList.innerHTML = waitingPatients.map(patient => `
    <div class="queue-item ${patient.status === 'current' ? 'current' : ''}">
      <div class="queue-token">${patient.token.split('-')[1]}</div>
      <div class="queue-details">
        <div class="queue-name">${patient.name}</div>
        <div class="queue-dept">${patient.department}</div>
      </div>
      <span class="urgency-badge urgency-${patient.urgency}">${patient.urgency}</span>
      ${patient.status === 'current' ? '<span class="status-badge status-current">Now Serving</span>' : ''}
    </div>
  `).join('');
}

function renderDeptStatus() {
  const deptStatus = document.getElementById('deptStatus');
  if (!deptStatus) return;
  
  const departments = ['General Medicine', 'Cardiology', 'Orthopedics', 'Pediatrics', 'Dermatology', 'Neurology', 'Emergency'];
  
  deptStatus.innerHTML = departments.map(dept => {
    const count = patients.filter(p => p.department === dept && (p.status === 'waiting' || p.status === 'current')).length;
    return `
      <div class="flex justify-between items-center" style="padding: 0.75rem; background: var(--surface-secondary); border-radius: 8px;">
        <span>${dept}</span>
        <span style="background: var(--primary); color: white; padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.875rem; font-weight: 600;">${count}</span>
      </div>
    `;
  }).join('');
}

function updateQueueStats() {
  const waiting = patients.filter(p => p.status === 'waiting').length;
  const current = patients.find(p => p.status === 'current');
  const completed = 45; // Simulated
  
  const totalWaiting = document.getElementById('totalWaiting');
  const currentServing = document.getElementById('currentServing');
  const avgWaitTime = document.getElementById('avgWaitTime');
  const completedToday = document.getElementById('completedToday');
  
  if (totalWaiting) totalWaiting.textContent = waiting;
  if (currentServing) currentServing.textContent = current ? current.token : '-';
  if (avgWaitTime) avgWaitTime.textContent = `${Math.round(waiting * 5)} min`;
  if (completedToday) completedToday.textContent = completed;
}

function searchToken() {
  const tokenInput = document.getElementById('tokenSearch');
  const statusCard = document.getElementById('tokenStatusCard');
  
  if (!tokenInput || !statusCard) return;
  
  const searchValue = tokenInput.value.toUpperCase().trim();
  const patient = patients.find(p => p.token === searchValue);
  
  if (patient) {
    const waitingBefore = patients.filter(p => 
      (p.status === 'waiting' || p.status === 'current') && 
      patients.indexOf(p) < patients.indexOf(patient)
    ).length;
    
    document.getElementById('displayToken').textContent = patient.token;
    document.getElementById('queuePosition').textContent = patient.status === 'current' ? 'Now!' : `${waitingBefore + 1}${getOrdinalSuffix(waitingBefore + 1)}`;
    document.getElementById('estimatedWait').textContent = patient.status === 'current' ? 'Your Turn!' : `~${waitingBefore * 5} min`;
    document.getElementById('patientDept').textContent = patient.department;
    
    statusCard.style.display = 'block';
  } else {
    alert('Token not found. Please check and try again.');
  }
}

function getOrdinalSuffix(n) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

// =============================================
// ADMIN DASHBOARD
// =============================================

function initAdminPage() {
  const adminQueueTable = document.getElementById('adminQueueTable');
  if (!adminQueueTable) return;

  renderAdminTable();
  renderCharts();
}

function renderAdminTable() {
  const adminQueueTable = document.getElementById('adminQueueTable');
  if (!adminQueueTable) return;

  adminQueueTable.innerHTML = patients.map(p => `
    <tr>
      <td>${p.token}</td>
      <td>${p.name}</td>
      <td>${p.department}</td>
      <td><span class="badge urgency-${p.urgency}">${p.urgency}</span></td>
      <td>${p.status}</td>
      <td>
        <button class="btn btn-sm btn-success" onclick="callNextPatient('${p.token}')">Call</button>
        <button class="btn btn-sm btn-danger" onclick="markComplete('${p.token}')">Complete</button>
      </td>
    </tr>
  `).join('');
}

function callNextPatient(token) {
  patients = patients.map(p => ({
    ...p,
    status: p.token === token ? 'current' : (p.status === 'current' ? 'waiting' : p.status)
  }));
  renderAdminTable();
  renderQueueList();
  updateQueueStats();
}

function markComplete(token) {
  patients = patients.map(p => ({
    ...p,
    status: p.token === token ? 'completed' : p.status
  }));
  renderAdminTable();
  renderQueueList();
  updateQueueStats();
}

function skipPatient() {
  const currentIndex = patients.findIndex(p => p.status === 'current');
  if (currentIndex === -1) return;

  patients[currentIndex].status = 'waiting';
  renderAdminTable();
  renderQueueList();
  updateQueueStats();
}

function renderCharts() {
  if (typeof Chart === 'undefined') return;

  const ctx = document.getElementById('flowChart');
  if (ctx) {
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['8AM', '9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM', '5PM'],
        datasets: [{
          label: 'Patients',
          data: [12, 25, 38, 45, 32, 28, 42, 35, 48, 30],
          backgroundColor: 'rgba(13, 148, 136, 0.75)',
          borderColor: 'rgba(13, 148, 136, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  const waitCtx = document.getElementById('waitTimeChart');
  if (waitCtx) {
    new Chart(waitCtx, {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'Avg Wait (min)',
          data: [18, 22, 15, 28, 25, 12, 10],
          backgroundColor: 'rgba(16, 185, 129, 0.3)',
          borderColor: 'rgba(16, 185, 129, 1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
}

// =============================================
// CHATBOT
// =============================================

const chatResponses = {
  appointment: "Sure! To book an appointment, please provide your preferred date, time, and department.",
  headache: "I'm sorry to hear about your headache. Make sure you're well hydrated and get some rest. If it persists, please consult our doctor.",
  fever: "For fever, it's important to drink lots of fluids and rest. If your temperature is above 102°F (38.9°C), see a doctor.",
  symptoms: "Could you share more details about your symptoms so I can help you better?",
  departments: "We have General Medicine, Cardiology, Orthopedics, Pediatrics, Dermatology, Neurology, and Emergency.",
  hours: "We are open Monday-Friday 8am-8pm, and weekends 9am-5pm.",
  mental: "If you're feeling overwhelmed, please reach out to a professional. We're here to help you find the right support.",
  default: "I'm not sure about that—can you please clarify or ask something else?"
};

function sendMessage() {
  const input = document.getElementById('chatInput');
  if (!input || !input.value.trim()) return;

  const message = input.value.trim();
  appendMessage('user', message);
  input.value = '';

  setTimeout(() => {
    const response = generateResponse(message);
    appendMessage('bot', response);
  }, 500);
}

function appendMessage(sender, text) {
  const chatMessages = document.getElementById('chatMessages');
  if (!chatMessages) return;

  const messageEl = document.createElement('div');
  messageEl.className = `message ${sender}`;
  messageEl.innerHTML = `
    <div class="message-avatar">
      <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path d="M12 8V4H8"></path>
        <rect x="8" y="8" width="8" height="12" rx="1"></rect>
      </svg>
    </div>
    <div class="message-content">${text}</div>
  `;

  chatMessages.appendChild(messageEl);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function sendQuickMessage(text) {
  document.getElementById('chatInput').value = text;
  sendMessage();
}

function generateResponse(message) {
  const msg = message.toLowerCase();
  
  if (msg.includes('appointment') || msg.includes('book')) return chatResponses.appointment;
  if (msg.includes('headache')) return chatResponses.headache;
  if (msg.includes('fever')) return chatResponses.fever;
  if (msg.includes('symptom') || msg.includes('pain') || msg.includes('sick')) return chatResponses.symptoms;
  if (msg.includes('department') || msg.includes('available')) return chatResponses.departments;
  if (msg.includes('hour') || msg.includes('time') || msg.includes('visit')) return chatResponses.hours;
  if (msg.includes('mental') || msg.includes('stress') || msg.includes('anxiety') || msg.includes('depress')) return chatResponses.mental;
  
  return chatResponses.default;
}

function handleKeyPress(event) {
  if (event.key === 'Enter') {
    sendMessage();
  }
}

// =============================================
// INITIALIZATION
// =============================================

document.addEventListener('DOMContentLoaded', async function() {
  // Load data from API
  await loadPatientsFromAPI();

  // Initialize based on current page
  const path = window.location.pathname;
  
  if (path.includes('queue')) {
    initQueuePage();
  } else if (path.includes('admin')) {
    initAdminPage();
  }
  
  // Initialize queue page if elements exist
  if (document.getElementById('queueList')) {
    initQueuePage();
  }
  
  // Initialize admin page if elements exist  
  if (document.getElementById('adminQueueTable')) {
    initAdminPage();
  }
});
