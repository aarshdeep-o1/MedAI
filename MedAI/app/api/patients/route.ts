import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, query, orderBy, serverTimestamp } from 'firebase/firestore';

// Helper functions (copied from frontend)
function determineUrgency(symptoms: string, department: string) {
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

function getDepartmentName(value: string) {
  const depts: { [key: string]: string } = {
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

export async function GET() {
  try {
    const patientsRef = collection(db, 'patients');
    const q = query(patientsRef, orderBy('createdAt'));
    const querySnapshot = await getDocs(q);

    const patients = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    console.log(`✅ Successfully fetched ${patients.length} patients from Firestore`);

    const response = NextResponse.json(patients);
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    return response;
  } catch (error) {
    console.error('❌ Error fetching patients:', error);
    const response = NextResponse.json({ error: 'Failed to fetch patients' }, { status: 500 });
    response.headers.set('Access-Control-Allow-Origin', '*');
    return response;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, age, gender, phone, department, symptoms } = body;

    if (!name || !age || !gender || !phone || !department || !symptoms) {
      const response = NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
      response.headers.set('Access-Control-Allow-Origin', '*');
      return response;
    }

    // Get the next token number
    const patientsRef = collection(db, 'patients');
    const q = query(patientsRef, orderBy('token', 'desc'));
    const querySnapshot = await getDocs(q);
    let nextTokenNumber = 1;
    if (!querySnapshot.empty) {
      const lastPatient = querySnapshot.docs[0].data();
      const lastToken = lastPatient.token as string;
      const lastNumber = parseInt(lastToken.split('-')[1], 10);
      nextTokenNumber = lastNumber + 1;
    }
    const token = `A-${String(nextTokenNumber).padStart(3, '0')}`;

    const urgency = determineUrgency(symptoms, department);
    const newPatient = {
      token,
      name,
      age: parseInt(age),
      gender,
      phone,
      department: getDepartmentName(department),
      symptoms,
      urgency,
      status: 'waiting',
      createdAt: serverTimestamp()
    };

    console.log('🔄 Attempting to add patient to Firestore:', newPatient);

    const docRef = await addDoc(patientsRef, newPatient);

    console.log(`✅ Successfully added patient ${newPatient.name} with token ${newPatient.token} to Firestore, doc ID: ${docRef.id}`);

    const response = NextResponse.json({ id: docRef.id, ...newPatient }, { status: 201 });
    response.headers.set('Access-Control-Allow-Origin', '*');
    return response;
  } catch (error) {
    console.error('❌ Error adding patient:', error);
    const response = NextResponse.json({ error: 'Failed to add patient' }, { status: 500 });
    response.headers.set('Access-Control-Allow-Origin', '*');
    return response;
  }
}

export async function OPTIONS() {
  const response = new NextResponse(null, { status: 200 });
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return response;
}