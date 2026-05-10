// MediAI Frontend JavaScript

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
  renderAdminTable();
  updateAdminStats();
  initCharts();
}

function renderAdminTable() {
  const table = document.getElementById('adminQueueTable');
  if (!table) return;
  
  const activePatients = patients.filter(p => p.status !== 'completed');
  
  table.innerHTML = activePatients.map(patient => `
    <tr>
      <td><strong>${patient.token}</strong></td>
      <td>${patient.name}</td>
      <td>${patient.department}</td>
      <td><span class="urgency-badge urgency-${patient.urgency}">${patient.urgency}</span></td>
      <td><span class="status-badge status-${patient.status}">${patient.status}</span></td>
      <td>
        <div class="action-buttons">
          ${patient.status === 'waiting' ? `
            <button class="btn btn-secondary" style="padding: 0.375rem 0.75rem; font-size: 0.875rem;" onclick="callPatient('${patient.token}')">Call</button>
          ` : ''}
          ${patient.status === 'current' ? `
            <button class="btn btn-success" style="padding: 0.375rem 0.75rem; font-size: 0.875rem;" onclick="completePatient('${patient.token}')">Done</button>
          ` : ''}
        </div>
      </td>
    </tr>
  `).join('');
}

function updateAdminStats() {
  const total = 156;
  const inQueue = patients.filter(p => p.status === 'waiting' || p.status === 'current').length;
  const completed = total - inQueue;
  const critical = patients.filter(p => p.urgency === 'critical' && p.status !== 'completed').length;
  
  const adminTotalPatients = document.getElementById('adminTotalPatients');
  const adminInQueue = document.getElementById('adminInQueue');
  const adminCompleted = document.getElementById('adminCompleted');
  const adminCritical = document.getElementById('adminCritical');
  
  if (adminTotalPatients) adminTotalPatients.textContent = total;
  if (adminInQueue) adminInQueue.textContent = inQueue;
  if (adminCompleted) adminCompleted.textContent = completed;
  if (adminCritical) adminCritical.textContent = critical;
  
  // Update current serving display
  const current = patients.find(p => p.status === 'current');
  if (current) {
    document.getElementById('currentToken').textContent = current.token;
    document.getElementById('currentName').textContent = current.name;
    document.getElementById('currentDept').textContent = current.department;
    document.getElementById('currentUrgency').textContent = current.urgency.charAt(0).toUpperCase() + current.urgency.slice(1);
  }
}

function callNextPatient() {
  // Mark current as completed
  const current = patients.find(p => p.status === 'current');
  if (current) current.status = 'completed';
  
  // Find next patient (prioritize by urgency)
  const urgencyOrder = { 'critical': 0, 'high': 1, 'medium': 2, 'low': 3 };
  const waiting = patients.filter(p => p.status === 'waiting');
  waiting.sort((a, b) => urgencyOrder[a.urgency] - urgencyOrder[b.urgency]);
  
  if (waiting.length > 0) {
    waiting[0].status = 'current';
  }
  
  renderAdminTable();
  updateAdminStats();
}

function callPatient(token) {
  // Mark current as waiting
  const current = patients.find(p => p.status === 'current');
  if (current) current.status = 'waiting';
  
  // Call selected patient
  const patient = patients.find(p => p.token === token);
  if (patient) patient.status = 'current';
  
  renderAdminTable();
  updateAdminStats();
}

function completePatient(token) {
  const patient = patients.find(p => p.token === token);
  if (patient) patient.status = 'completed';
  
  callNextPatient();
}

function markComplete() {
  const current = patients.find(p => p.status === 'current');
  if (current) {
    current.status = 'completed';
    callNextPatient();
  }
}

function skipPatient() {
  const current = patients.find(p => p.status === 'current');
  if (current) {
    current.status = 'waiting';
    callNextPatient();
  }
}

// =============================================
// CHARTS
// =============================================

function initCharts() {
  if (typeof Chart === 'undefined') return;
  
  // Patient Flow Chart
  const flowCtx = document.getElementById('patientFlowChart');
  if (flowCtx) {
    new Chart(flowCtx, {
      type: 'bar',
      data: {
        labels: ['8AM', '9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM', '5PM'],
        datasets: [{
          label: 'Patients',
          data: [12, 25, 32, 28, 15, 22, 35, 30, 18, 10],
          backgroundColor: '#0d9488',
          borderRadius: 6,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, grid: { color: '#e2e8f0' } },
          x: { grid: { display: false } }
        }
      }
    });
  }
  
  // Wait Time Chart
  const waitCtx = document.getElementById('waitTimeChart');
  if (waitCtx) {
    new Chart(waitCtx, {
      type: 'line',
      data: {
        labels: ['8AM', '9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM', '5PM'],
        datasets: [{
          label: 'Wait Time (min)',
          data: [8, 12, 18, 22, 15, 10, 25, 20, 14, 8],
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          fill: true,
          tension: 0.4,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, grid: { color: '#e2e8f0' } },
          x: { grid: { display: false } }
        }
      }
    });
  }
  
  // Department Chart
  const deptCtx = document.getElementById('deptChart');
  if (deptCtx) {
    new Chart(deptCtx, {
      type: 'doughnut',
      data: {
        labels: ['General', 'Cardiology', 'Orthopedics', 'Pediatrics', 'Emergency', 'Other'],
        datasets: [{
          data: [35, 25, 15, 12, 8, 5],
          backgroundColor: ['#0d9488', '#10b981', '#14b8a6', '#2dd4bf', '#5eead4', '#99f6e4'],
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'right' }
        }
      }
    });
  }
  
  // Urgency Chart
  const urgencyCtx = document.getElementById('urgencyChart');
  if (urgencyCtx) {
    new Chart(urgencyCtx, {
      type: 'pie',
      data: {
        labels: ['Critical', 'High', 'Medium', 'Low'],
        datasets: [{
          data: [8, 22, 35, 35],
          backgroundColor: ['#ef4444', '#f97316', '#eab308', '#22c55e'],
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'right' }
        }
      }
    });
  }
}

// =============================================
// CHATBOT
// =============================================

const chatResponses = {
  'appointment': 'To book an appointment, please visit our Registration page or call our helpline at 1800-MEDI-AI. You can also register online by clicking the "Register" link in the navigation.',
  'symptoms': 'Based on your symptoms, I recommend visiting our General Medicine department. If symptoms are severe (chest pain, breathing difficulty), please go to Emergency immediately.',
  'headache': 'Headaches can be caused by various factors including stress, dehydration, or eye strain. If severe or persistent, please consult our Neurology department.',
  'fever': 'For fever, ensure you stay hydrated and rest. If temperature exceeds 103°F or persists for more than 3 days, please visit our General Medicine department.',
  'departments': 'Our hospital has the following departments:\n• General Medicine\n• Cardiology\n• Orthopedics\n• Pediatrics\n• Dermatology\n• Neurology\n• Emergency (24/7)',
  'hours': 'Our visiting hours are:\n• OPD: 9 AM - 5 PM (Mon-Sat)\n• Emergency: 24/7\n• Visiting Hours: 4 PM - 6 PM',
  'mental': 'Mental health is important to us. Our counseling services are available Mon-Fri, 10 AM - 4 PM. You can also call our mental health helpline: 1800-MIND-CARE. Remember, it\'s okay to seek help.',
  'default': 'I understand. Could you please provide more details about your concern? You can also speak with our front desk staff for immediate assistance.'
};

function sendMessage() {
  const input = document.getElementById('chatInput');
  const messages = document.getElementById('chatMessages');
  
  if (!input || !messages) return;
  
  const message = input.value.trim();
  if (!message) return;
  
  // Add user message
  addMessage(message, 'user');
  input.value = '';
  
  // Show typing indicator
  showTypingIndicator();
  
  // Generate response after delay
  setTimeout(() => {
    hideTypingIndicator();
    const response = generateResponse(message);
    addMessage(response, 'bot');
  }, 1000 + Math.random() * 1000);
}

function sendQuickMessage(message) {
  document.getElementById('chatInput').value = message;
  sendMessage();
}

function addMessage(text, type) {
  const messages = document.getElementById('chatMessages');
  
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${type}`;
  
  const avatar = type === 'bot' ? `
    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <path d="M12 8V4H8"></path>
      <rect x="8" y="8" width="8" height="12" rx="1"></rect>
    </svg>
  ` : `
    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  `;
  
  messageDiv.innerHTML = `
    <div class="message-avatar">${avatar}</div>
    <div class="message-content">${text.replace(/\n/g, '<br>')}</div>
  `;
  
  messages.appendChild(messageDiv);
  messages.scrollTop = messages.scrollHeight;
}

function showTypingIndicator() {
  const messages = document.getElementById('chatMessages');
  const typing = document.createElement('div');
  typing.className = 'message bot';
  typing.id = 'typingIndicator';
  typing.innerHTML = `
    <div class="message-avatar">
      <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path d="M12 8V4H8"></path>
        <rect x="8" y="8" width="8" height="12" rx="1"></rect>
      </svg>
    </div>
    <div class="message-content">
      <div class="typing-indicator">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>
    </div>
  `;
  messages.appendChild(typing);
  messages.scrollTop = messages.scrollHeight;
}

function hideTypingIndicator() {
  const typing = document.getElementById('typingIndicator');
  if (typing) typing.remove();
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
