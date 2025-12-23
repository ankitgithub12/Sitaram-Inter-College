import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdmissionForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    motherTongue: '',
    caste: '',
    religion: '',
    previousClass: '',
    admissionClass: '',
    previousSchool: '',
    admissionDate: '',
    fatherName: '',
    motherName: '',
    fatherContact: '',
    motherContact: '',
    email: '',
    occupation: '',
    motherOccupation: '',
    address: '',
    declaration: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [submittedAdmissionId, setSubmittedAdmissionId] = useState(null);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [printData, setPrintData] = useState(null);
  const [isLoadingPrintData, setIsLoadingPrintData] = useState(false);
  const [applicationNumber, setApplicationNumber] = useState('');
  const printContentRef = useRef(null);

  // API URL - make sure this matches your server URL
  const API_URL = 'https://sitaram-inter-college.onrender.com/api';

  // Show toast notification
  const showToast = (message, type = 'info') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: '' });
    }, 5000);
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle class selection
  const handleClassSelect = (classValue) => {
    setFormData(prev => ({
      ...prev,
      admissionClass: classValue
    }));
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  // Get today's date in YYYY-MM-DD format
  const getToday = () => {
    return new Date().toISOString().split('T')[0];
  };

  // Get date 3 years ago for max DOB
  const getMaxDOB = () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 3);
    return date.toISOString().split('T')[0];
  };

  // Prepare print data
  const preparePrintData = async (admissionId) => {
    setIsLoadingPrintData(true);
    try {
       const response = await axios.get(`${API_URL}/admissions/${admissionId}`);
      if (response.data.success) {
        const admission = response.data.data;
        
        // Format dates for display
        const printAdmission = {
          ...admission,
          dob: formatDate(admission.dob),
          admissionDate: formatDate(admission.admissionDate),
          submittedAt: formatDate(admission.submittedAt)
        };
        
        setPrintData(printAdmission);
        setShowPrintModal(true);
      }
    } catch (error) {
      console.error('Error loading print data:', error);
      showToast('Error loading admission data for printing', 'error');
    } finally {
      setIsLoadingPrintData(false);
    }
  };

  // Handle print
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>SRIC Admission Form - ${printData.name}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Inter', sans-serif; line-height: 1.6; color: #333; padding: 20px; }
          .print-container { max-width: 800px; margin: 0 auto; background: white; }
          .header { text-align: center; padding: 30px 0; border-bottom: 4px solid #1e3a8a; margin-bottom: 30px; }
          .school-name { font-size: 28px; font-weight: 700; color: #1e3a8a; margin-bottom: 5px; }
          .school-address { color: #4b5563; margin-bottom: 10px; }
          .document-title { font-size: 22px; font-weight: 600; color: #111827; margin: 20px 0; text-align: center; }
          .section { margin-bottom: 30px; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; }
          .section-title { font-size: 18px; font-weight: 600; color: #1e3a8a; margin-bottom: 15px; padding-bottom: 8px; border-bottom: 2px solid #e5e7eb; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
          .info-item { margin-bottom: 12px; }
          .info-label { font-weight: 600; color: #374151; margin-bottom: 4px; }
          .info-value { color: #111827; }
          .declaration { background: #fef3c7; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #f59e0b; }
          .declaration-title { font-weight: 600; color: #92400e; margin-bottom: 10px; }
          .instructions { background: #dbeafe; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #3b82f6; }
          .instructions-title { font-weight: 600; color: #1e40af; margin-bottom: 10px; }
          .instructions-list { list-style: decimal inside; }
          .instructions-list li { margin-bottom: 8px; }
          .footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 14px; }
          .print-watermark { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); font-size: 80px; color: rgba(0,0,0,0.1); font-weight: bold; z-index: -1; }
          .signature-area { margin-top: 40px; display: flex; justify-content: space-between; }
          .signature-box { width: 45%; padding: 15px; border-top: 1px solid #374151; text-align: center; }
          .signature-label { font-weight: 600; margin-top: 10px; }
          .application-id { background: #1e3a8a; color: white; padding: 10px 20px; border-radius: 6px; display: inline-block; margin: 20px 0; }
          @media print {
            .no-print { display: none; }
            body { padding: 0; }
            .section { border: 1px solid #000; }
          }
        </style>
      </head>
      <body>
        <div class="print-container">
          <div class="print-watermark">SRIC ADMISSION</div>
          
          <div class="header">
            <div class="school-name">SRIC Senior Secondary School</div>
            <div class="school-address">Affiliated to CBSE, Delhi | NAAC Accredited</div>
            <div class="school-address">Academic Year 2025-26</div>
          </div>
          
          <div class="document-title">OFFICIAL ADMISSION FORM</div>
          
          <div class="application-id">
            Application ID: ${printData._id} | Status: ${printData.status.toUpperCase()}
            ${printData.applicationNumber ? `<br>Application Number: ${printData.applicationNumber}` : ''}
          </div>
          
          <div class="section">
            <div class="section-title">Student Information</div>
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">Full Name:</div>
                <div class="info-value">${printData.name}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Date of Birth:</div>
                <div class="info-value">${printData.dob}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Mother Tongue:</div>
                <div class="info-value">${printData.motherTongue}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Caste:</div>
                <div class="info-value">${printData.caste}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Religion:</div>
                <div class="info-value">${printData.religion}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Previous Class:</div>
                <div class="info-value">${printData.previousClass}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Admission Class:</div>
                <div class="info-value">${printData.admissionClass}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Previous School:</div>
                <div class="info-value">${printData.previousSchool}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Admission Date:</div>
                <div class="info-value">${printData.admissionDate}</div>
              </div>
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">Parent/Guardian Information</div>
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">Father's Name:</div>
                <div class="info-value">${printData.fatherName}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Mother's Name:</div>
                <div class="info-value">${printData.motherName}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Father's Contact:</div>
                <div class="info-value">${printData.fatherContact}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Mother's Contact:</div>
                <div class="info-value">${printData.motherContact || 'Not provided'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Email:</div>
                <div class="info-value">${printData.email}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Father's Occupation:</div>
                <div class="info-value">${printData.occupation}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Mother's Occupation:</div>
                <div class="info-value">${printData.motherOccupation || 'Not provided'}</div>
              </div>
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">Address Information</div>
            <div class="info-item">
              <div class="info-label">Complete Address:</div>
              <div class="info-value" style="white-space: pre-line;">${printData.address}</div>
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">Application Details</div>
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">Application Submitted:</div>
                <div class="info-value">${printData.submittedAt}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Application Status:</div>
                <div class="info-value" style="font-weight: 600; color: #059669;">${printData.status.toUpperCase()}</div>
              </div>
            </div>
          </div>
          
          <div class="declaration">
            <div class="declaration-title">Declaration:</div>
            <p>I hereby solemnly declare that all the information provided in this admission form is true, correct, and complete to the best of my knowledge. I understand that any false information or concealment of material facts will lead to immediate cancellation of admission and may result in legal action. I agree to abide by the rules and regulations of SRIC Senior Secondary School.</p>
          </div>
          
          <div class="instructions">
            <div class="instructions-title">IMPORTANT INSTRUCTIONS:</div>
            <ol class="instructions-list">
              <li><strong>PRINT THIS FORM:</strong> Keep a printed copy for your records</li>
              <li><strong>SUBMIT HARD COPY:</strong> You MUST submit a signed hard copy of this form to the school office within 7 days</li>
              <li><strong>REQUIRED DOCUMENTS:</strong> Bring original + photocopies of:
                <ul style="margin-left: 20px; margin-top: 5px;">
                  <li>Birth Certificate</li>
                  <li>Aadhar Card (Student & Parents)</li>
                  <li>Previous School Transfer Certificate</li>
                  <li>Previous Class Marksheet</li>
                  <li>Passport Size Photos (4 copies)</li>
                  <li>Caste Certificate (if applicable)</li>
                </ul>
              </li>
              <li><strong>OFFICE HOURS:</strong> Monday to Saturday, 9:00 AM to 4:00 PM</li>
              <li><strong>CONTACT:</strong> For queries, call +91-XXXXXXXXXX or email admissions@sric.edu.in</li>
            </ol>
            <p style="margin-top: 15px; color: #dc2626; font-weight: 600;">
              ⚠️ ADMISSION WILL NOT BE PROCESSED WITHOUT SUBMISSION OF HARD COPY
            </p>
          </div>
          
          <div class="signature-area">
            <div class="signature-box">
              <div>_________________________</div>
              <div class="signature-label">Student's Signature</div>
            </div>
            <div class="signature-box">
              <div>_________________________</div>
              <div class="signature-label">Parent/Guardian's Signature</div>
            </div>
          </div>
          
          <div class="footer">
            <p>This is a computer-generated document. No physical signature is required for online submission.</p>
            <p>Generated on: ${new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</p>
            <p>SRIC Admission System - Copyright © 2025 SRIC Senior Secondary School. All rights reserved.</p>
          </div>
        </div>
        
        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() {
              window.close();
            }, 1000);
          };
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Handle print button click
  const handlePrintClick = () => {
    if (submittedAdmissionId) {
      preparePrintData(submittedAdmissionId);
    }
  };

  // Form submission to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.admissionClass) {
      showToast('Please select an admission class', 'error');
      return;
    }

    if (!formData.declaration) {
      showToast('Please accept the declaration', 'error');
      return;
    }

    // Validate phone numbers
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.fatherContact.replace(/\D/g, ''))) {
      showToast('Please enter a valid 10-digit father contact number', 'error');
      return;
    }

    if (formData.motherContact && !phoneRegex.test(formData.motherContact.replace(/\D/g, ''))) {
      showToast('Please enter a valid 10-digit mother contact number', 'error');
      return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showToast('Please enter a valid email address', 'error');
      return;
    }

    // Validate all required fields
    const requiredFields = [
      'name', 'dob', 'motherTongue', 'caste', 'religion', 
      'previousClass', 'previousSchool', 'admissionDate',
      'fatherName', 'motherName', 'email', 'occupation', 'address'
    ];
    
    const missingFields = requiredFields.filter(field => !formData[field]);
    if (missingFields.length > 0) {
      showToast(`Please fill in all required fields: ${missingFields.join(', ')}`, 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare data for submission
      const submissionData = {
        name: formData.name.trim(),
        dob: formData.dob,
        motherTongue: formData.motherTongue,
        caste: formData.caste.trim(),
        religion: formData.religion,
        previousClass: formData.previousClass,
        admissionClass: formData.admissionClass,
        previousSchool: formData.previousSchool.trim(),
        admissionDate: formData.admissionDate,
        fatherName: formData.fatherName.trim(),
        motherName: formData.motherName.trim(),
        fatherContact: formData.fatherContact.replace(/\D/g, ''),
        motherContact: formData.motherContact ? formData.motherContact.replace(/\D/g, '') : '',
        email: formData.email.trim(),
        occupation: formData.occupation.trim(),
        motherOccupation: formData.motherOccupation ? formData.motherOccupation.trim() : '',
        address: formData.address.trim(),
        declaration: formData.declaration
      };

      console.log('Submitting data to:', `${API_URL}/admissions`);
      console.log('Data:', submissionData);

      // Send POST request to backend
      const response = await axios.post(`${API_URL}/admissions`, submissionData, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000
      });

      console.log('Response:', response.data);

      if (response.data.success) {
        const admissionId = response.data.data._id;
        const appNumber = response.data.applicationNumber;
        
        setSubmittedAdmissionId(admissionId);
        setApplicationNumber(appNumber || '');
        
        // Store in localStorage for persistence
        localStorage.setItem('lastAdmissionId', admissionId);
        if (appNumber) {
          localStorage.setItem('lastApplicationNumber', appNumber);
        }
        
        showToast('🎉 Admission form submitted successfully! Please print and submit the hard copy to school.', 'success');
        
        // Show print instructions
        setTimeout(() => {
          showToast('📄 Click the "Print Application" button below to get your admission form', 'info');
        }, 2000);

        // Reset form
        setFormData({
          name: '',
          dob: getMaxDOB(),
          motherTongue: '',
          caste: '',
          religion: '',
          previousClass: '',
          admissionClass: '',
          previousSchool: '',
          admissionDate: getToday(),
          fatherName: '',
          motherName: '',
          fatherContact: '',
          motherContact: '',
          email: '',
          occupation: '',
          motherOccupation: '',
          address: '',
          declaration: false
        });

      } else {
        throw new Error(response.data.message || 'Submission failed');
      }

    } catch (error) {
      console.error('Submission error:', error);
      
      // Handle specific error messages
      if (error.response) {
        const errorData = error.response.data;
        if (errorData.errors && Array.isArray(errorData.errors)) {
          showToast(`❌ ${errorData.errors.join(', ')}`, 'error');
        } else {
          showToast(`❌ ${errorData.message || 'Error submitting form'}`, 'error');
        }
      } else if (error.request) {
        showToast('❌ Network error. Please check if the server is running at https://sitaram-inter-college.onrender.com/', 'error');
        console.log('Server might not be running. Please start it with: node server.js');
      } else {
        showToast(`❌ ${error.message}`, 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check server connection on mount
  useEffect(() => {
    const checkServer = async () => {
      try {
        await axios.get(`${API_URL}/health`, { timeout: 5000 });
        console.log('Server connection successful');
      } catch (error) {
        console.warn('Server not reachable:', error.message);
        showToast('⚠️ Server not connected. Please start the backend server.', 'error');
      }
    };

    // Set default dates
    const today = getToday();
    const maxDob = getMaxDOB();

    setFormData(prev => ({ 
      ...prev, 
      dob: prev.dob || maxDob,
      admissionDate: prev.admissionDate || today
    }));

    // Check for previously submitted admission
    const lastAdmissionId = localStorage.getItem('lastAdmissionId');
    const lastAppNumber = localStorage.getItem('lastApplicationNumber');
    
    if (lastAdmissionId) {
      setSubmittedAdmissionId(lastAdmissionId);
      if (lastAppNumber) {
        setApplicationNumber(lastAppNumber);
      }
    }

    checkServer();
  }, []);

  const classCategories = [
    {
      title: "Pre-Primary",
      classes: [
        { value: "L.K.G", label: "L.K.G", sublabel: "Lower Kindergarten", icon: "fas fa-child" },
        { value: "U.K.G", label: "U.K.G", sublabel: "Upper Kindergarten", icon: "fas fa-baby" }
      ]
    },
    {
      title: "Primary (1-5)",
      classes: [
        { value: "Class 1", label: "Class 1", sublabel: "Primary", icon: "fas fa-pencil-alt" },
        { value: "Class 2", label: "Class 2", sublabel: "Primary", icon: "fas fa-book" },
        { value: "Class 3", label: "Class 3", sublabel: "Primary", icon: "fas fa-book-open" },
        { value: "Class 4", label: "Class 4", sublabel: "Primary", icon: "fas fa-graduation-cap" },
        { value: "Class 5", label: "Class 5", sublabel: "Primary", icon: "fas fa-user-graduate" }
      ]
    },
    {
      title: "Upper Primary (6-8)",
      classes: [
        { value: "Class 6", label: "Class 6", sublabel: "Upper Primary", icon: "fas fa-laptop" },
        { value: "Class 7", label: "Class 7", sublabel: "Upper Primary", icon: "fas fa-tablet-alt" },
        { value: "Class 8", label: "Class 8", sublabel: "Upper Primary", icon: "fas fa-mobile-alt" }
      ]
    },
    {
      title: "Secondary (9-10)",
      classes: [
        { value: "Class 9", label: "Class 9", sublabel: "Secondary", icon: "fas fa-book" },
        { value: "Class 10", label: "Class 10", sublabel: "Board", icon: "fas fa-graduation-cap" }
      ]
    },
    {
      title: "Senior Secondary (11-12)",
      classes: [
        { value: "Class 11 Science", label: "Class 11 Science", sublabel: "PCM/PCB", icon: "fas fa-flask" },
        { value: "Class 11 Commerce", label: "Class 11 Commerce", sublabel: "Commerce", icon: "fas fa-calculator" },
        { value: "Class 11 Humanities", label: "Class 11 Humanities", sublabel: "Arts", icon: "fas fa-globe" },
        { value: "Class 12 Science", label: "Class 12 Science", sublabel: "PCM/PCB", icon: "fas fa-atom" },
        { value: "Class 12 Commerce", label: "Class 12 Commerce", sublabel: "Commerce", icon: "fas fa-chart-line" },
        { value: "Class 12 Humanities", label: "Class 12 Humanities", sublabel: "Arts", icon: "fas fa-landmark" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-800 py-8">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-8 right-8 z-50 px-6 py-4 rounded-xl text-white font-semibold shadow-2xl transform transition-all duration-500 ${
          toast.type === 'success' 
            ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
            : toast.type === 'info'
            ? 'bg-gradient-to-r from-blue-500 to-blue-600'
            : 'bg-gradient-to-r from-red-500 to-pink-600'
        } ${toast.show ? 'translate-x-0 opacity-100' : 'translate-x-32 opacity-0'}`}>
          <div className="flex items-center">
            <i className={`mr-3 text-xl ${
              toast.type === 'success' ? 'fas fa-check-circle' : 
              toast.type === 'info' ? 'fas fa-info-circle' : 
              'fas fa-exclamation-circle'
            }`}></i>
            <span className="text-lg">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Print Modal */}
      {showPrintModal && printData && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-blue-900">
                <i className="fas fa-print mr-3"></i>
                Print Admission Form
              </h2>
              <button
                onClick={() => setShowPrintModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border-2 border-blue-200">
                <h3 className="font-bold text-blue-900 text-xl mb-3">
                  <i className="fas fa-exclamation-triangle mr-2 text-yellow-500"></i>
                  Important Instructions
                </h3>
                <ul className="space-y-2 text-blue-800">
                  <li className="flex items-start">
                    <i className="fas fa-check-circle text-green-500 mt-1 mr-3"></i>
                    <span><strong>Print this form</strong> and keep a copy for your records</span>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-check-circle text-green-500 mt-1 mr-3"></i>
                    <span><strong>Submit a signed hard copy</strong> to the school office within 7 days</span>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-check-circle text-green-500 mt-1 mr-3"></i>
                    <span>Bring all required original documents along with photocopies</span>
                  </li>
                </ul>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Application ID</div>
                  <div className="font-mono font-bold">{printData._id.substring(0, 8)}...</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Student Name</div>
                  <div className="font-bold text-lg">{printData.name}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Admission Class</div>
                  <div className="font-bold">{printData.admissionClass}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Application Status</div>
                  <div className={`font-bold ${
                    printData.status === 'pending' ? 'text-yellow-600' :
                    printData.status === 'approved' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {printData.status.toUpperCase()}
                  </div>
                </div>
              </div>
              
              <div className="text-center text-gray-600 mb-6">
                The print preview will open in a new window. After printing, close the window to return here.
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-4">
              <button
                onClick={() => setShowPrintModal(false)}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handlePrint}
                disabled={isLoadingPrintData}
                className="px-6 py-3 bg-gradient-to-r from-blue-900 to-blue-700 text-white rounded-xl hover:from-blue-800 hover:to-blue-600 transition-all disabled:opacity-50"
              >
                <i className="fas fa-print mr-2"></i>
                {isLoadingPrintData ? 'Loading...' : 'Print Now'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 max-w-6xl">
        {/* Progress Bar */}
        <div className="flex justify-between mb-12 relative">
          <div className="absolute top-5 left-0 w-full h-1 bg-gray-300 z-0"></div>
          <div className="absolute top-5 left-0 h-1 bg-gradient-to-r from-blue-900 to-blue-700 z-10 transition-all duration-500" 
               style={{ width: '100%' }}></div>
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className={`w-12 h-12 rounded-full flex items-center justify-center font-bold relative z-20 transition-all duration-300 ${
              step === 4 
                ? 'bg-gradient-to-br from-blue-900 to-blue-700 text-white scale-110 shadow-lg' 
                : 'bg-gray-300 text-gray-600'
            }`}>
              <i className={`${
                step === 1 ? 'fas fa-user-graduate' :
                step === 2 ? 'fas fa-users' :
                step === 3 ? 'fas fa-home' : 'fas fa-file-signature'
              }`}></i>
            </div>
          ))}
        </div>

        {/* Main Form Container */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden backdrop-blur-sm">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white px-8 py-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-pulse"></div>
            </div>
            <div className="flex flex-col md:flex-row items-center justify-center mb-6 relative z-10">
              <img 
                src="/assets/SRIC LOGO.PNG" 
                alt="SRIC Logo" 
                className="h-24 w-24 rounded-full mr-6 border-4 border-white shadow-2xl transform hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/96/1e3a8a/ffffff?text=SRIC";
                }}
              />
              <div className="text-center md:text-left mt-6 md:mt-0">
                <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent">
                  SRIC Online Admission
                </h1>
                <p className="text-yellow-300 text-xl font-semibold">
                  Academic Year 2025-26 | Empowering Minds, Shaping Futures
                </p>
              </div>
            </div>
            <div className="relative z-10">
              <div className="bg-white bg-opacity-20 rounded-xl px-6 py-3 inline-block backdrop-blur-sm border border-white border-opacity-30">
                <p className="text-sm font-medium">
                  <i className="fas fa-clock mr-2 text-yellow-300"></i>
                  Fill this form in 5-10 minutes
                </p>
              </div>
            </div>
          </div>

          {/* Form Sections */}
          <div className="p-8">
            {/* Show print button after successful submission */}
            {submittedAdmissionId && (
              <div className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6">
                <div className="flex flex-col md:flex-row items-center justify-between">
                  <div className="mb-4 md:mb-0">
                    <h3 className="text-xl font-bold text-green-800 mb-2">
                      <i className="fas fa-check-circle mr-3 text-green-500"></i>
                      Application Submitted Successfully!
                    </h3>
                    <p className="text-green-700">
                      Your application ID: <span className="font-mono font-bold">{submittedAdmissionId.substring(0, 8)}...</span>
                    </p>
                    {applicationNumber && (
                      <p className="text-green-700">
                        Application Number: <span className="font-mono font-bold">{applicationNumber}</span>
                      </p>
                    )}
                    <p className="text-green-700 text-sm mt-2">
                      Please print and submit a hard copy to the school office
                    </p>
                  </div>
                  <button
                    onClick={handlePrintClick}
                    disabled={isLoadingPrintData}
                    className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
                  >
                    <i className="fas fa-print mr-3"></i>
                    {isLoadingPrintData ? 'Loading...' : 'Print Application'}
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Student Information Section */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-900 to-blue-700"></div>
                <h2 className="text-2xl font-bold text-blue-900 mb-8 flex items-center">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-900 to-blue-700 rounded-2xl flex items-center justify-center mr-4 text-white text-xl shadow-lg">
                    <i className="fas fa-user-graduate"></i>
                  </div>
                  Student Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-900 focus:ring-4 focus:ring-blue-200 transition-all duration-300 hover:border-gray-400"
                      placeholder="Enter student's full name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Date of Birth <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                      required
                      max={getMaxDOB()}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-900 focus:ring-4 focus:ring-blue-200 transition-all duration-300 hover:border-gray-400"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Mother Tongue <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="motherTongue"
                      value={formData.motherTongue}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-900 focus:ring-4 focus:ring-blue-200 transition-all duration-300 hover:border-gray-400"
                    >
                      <option value="">Select Mother Tongue</option>
                      <option value="Hindi">Hindi</option>
                      <option value="English">English</option>
                      <option value="Urdu">Urdu</option>
                      <option value="Punjabi">Punjabi</option>
                      <option value="Bengali">Bengali</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Caste <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="caste"
                      value={formData.caste}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-900 focus:ring-4 focus:ring-blue-200 transition-all duration-300 hover:border-gray-400"
                      placeholder="Enter caste"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Religion <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="religion"
                      value={formData.religion}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-900 focus:ring-4 focus:ring-blue-200 transition-all duration-300 hover:border-gray-400"
                    >
                      <option value="">Select Religion</option>
                      <option value="Hindu">Hindu</option>
                      <option value="Muslim">Muslim</option>
                      <option value="Christian">Christian</option>
                      <option value="Sikh">Sikh</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Previous Class <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="previousClass"
                      value={formData.previousClass}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-900 focus:ring-4 focus:ring-blue-200 transition-all duration-300 hover:border-gray-400"
                    >
                      <option value="">Select Previous Class</option>
                      <optgroup label="Pre-Primary">
                        <option value="L.K.G">L.K.G (Lower Kindergarten)</option>
                        <option value="U.K.G">U.K.G (Upper Kindergarten)</option>
                      </optgroup>
                      <optgroup label="Primary (1-5)">
                        <option value="Class 1">Class 1</option>
                        <option value="Class 2">Class 2</option>
                        <option value="Class 3">Class 3</option>
                        <option value="Class 4">Class 4</option>
                        <option value="Class 5">Class 5</option>
                      </optgroup>
                      <optgroup label="Upper Primary (6-8)">
                        <option value="Class 6">Class 6</option>
                        <option value="Class 7">Class 7</option>
                        <option value="Class 8">Class 8</option>
                      </optgroup>
                      <optgroup label="Secondary (9-10)">
                        <option value="Class 9">Class 9</option>
                        <option value="Class 10">Class 10</option>
                      </optgroup>
                      <optgroup label="Senior Secondary (11-12)">
                        <option value="Class 11 Science">Class 11 Science</option>
                        <option value="Class 11 Commerce">Class 11 Commerce</option>
                        <option value="Class 11 Humanities">Class 11 Humanities</option>
                        <option value="Class 12 Science">Class 12 Science</option>
                        <option value="Class 12 Commerce">Class 12 Commerce</option>
                        <option value="Class 12 Humanities">Class 12 Humanities</option>
                      </optgroup>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Previous School <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="previousSchool"
                      value={formData.previousSchool}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-900 focus:ring-4 focus:ring-blue-200 transition-all duration-300 hover:border-gray-400"
                      placeholder="Name of previous school"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Admission Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="admissionDate"
                      value={formData.admissionDate}
                      onChange={handleChange}
                      required
                      min={getToday()}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-900 focus:ring-4 focus:ring-blue-200 transition-all duration-300 hover:border-gray-400"
                    />
                  </div>
                </div>

                {/* Admission Class Selection */}
                <div className="mt-8 space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Admission Class <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-6">
                    {classCategories.map((category, index) => (
                      <div key={index} className="class-category">
                        <div className="category-title text-lg font-bold text-blue-900 mb-4 pb-2 border-b-2 border-gray-200">
                          {category.title}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                          {category.classes.map((classItem, classIndex) => (
                            <div
                              key={classIndex}
                              onClick={() => handleClassSelect(classItem.value)}
                              className={`class-option p-4 rounded-xl border-2 text-center cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                                formData.admissionClass === classItem.value
                                  ? 'bg-gradient-to-br from-blue-900 to-blue-700 text-white border-blue-900 shadow-lg'
                                  : 'bg-white border-gray-300 hover:border-blue-900'
                              }`}
                            >
                              <i className={`${classItem.icon} text-2xl mb-2`}></i>
                              <div className="font-semibold">{classItem.label}</div>
                              <small className="text-xs opacity-75">{classItem.sublabel}</small>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Parent/Guardian Information Section */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-900 to-blue-700"></div>
                <h2 className="text-2xl font-bold text-blue-900 mb-8 flex items-center">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-900 to-blue-700 rounded-2xl flex items-center justify-center mr-4 text-white text-xl shadow-lg">
                    <i className="fas fa-users"></i>
                  </div>
                  Parent/Guardian Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Father's Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="fatherName"
                      value={formData.fatherName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-900 focus:ring-4 focus:ring-blue-200 transition-all duration-300 hover:border-gray-400"
                      placeholder="Enter father's full name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Mother's Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="motherName"
                      value={formData.motherName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-900 focus:ring-4 focus:ring-blue-200 transition-all duration-300 hover:border-gray-400"
                      placeholder="Enter mother's full name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Father's Contact Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="fatherContact"
                      value={formData.fatherContact}
                      onChange={handleChange}
                      required
                      pattern="[0-9]{10}"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-900 focus:ring-4 focus:ring-blue-200 transition-all duration-300 hover:border-gray-400"
                      placeholder="9876543210"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Mother's Contact Number
                    </label>
                    <input
                      type="tel"
                      name="motherContact"
                      value={formData.motherContact}
                      onChange={handleChange}
                      pattern="[0-9]{10}"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-900 focus:ring-4 focus:ring-blue-200 transition-all duration-300 hover:border-gray-400"
                      placeholder="9876543210"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-900 focus:ring-4 focus:ring-blue-200 transition-all duration-300 hover:border-gray-400"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Father's Occupation <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="occupation"
                      value={formData.occupation}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-900 focus:ring-4 focus:ring-blue-200 transition-all duration-300 hover:border-gray-400"
                      placeholder="Enter occupation"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Mother's Occupation
                    </label>
                    <input
                      type="text"
                      name="motherOccupation"
                      value={formData.motherOccupation}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-900 focus:ring-4 focus:ring-blue-200 transition-all duration-300 hover:border-gray-400"
                      placeholder="Enter occupation"
                    />
                  </div>
                </div>
              </div>

              {/* Address Information Section */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-900 to-blue-700"></div>
                <h2 className="text-2xl font-bold text-blue-900 mb-8 flex items-center">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-900 to-blue-700 rounded-2xl flex items-center justify-center mr-4 text-white text-xl shadow-lg">
                    <i className="fas fa-home"></i>
                  </div>
                  Address Information
                </h2>
                
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Complete Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    rows="4"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-900 focus:ring-4 focus:ring-blue-200 transition-all duration-300 hover:border-gray-400 resize-none"
                    placeholder="Enter complete residential address with PIN code"
                  />
                </div>
              </div>

              {/* Declaration Section */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-900 to-blue-700"></div>
                <h2 className="text-2xl font-bold text-blue-900 mb-8 flex items-center">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-900 to-blue-700 rounded-2xl flex items-center justify-center mr-4 text-white text-xl shadow-lg">
                    <i className="fas fa-file-signature"></i>
                  </div>
                  Declaration & Final Step
                </h2>
                
                <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-400 rounded-2xl p-6">
                  <div className="flex items-start space-x-4">
                    <input
                      type="checkbox"
                      name="declaration"
                      checked={formData.declaration}
                      onChange={handleChange}
                      required
                      className="mt-1 w-5 h-5 text-blue-900 focus:ring-blue-900 border-gray-300 rounded"
                    />
                    <span className="text-gray-800 font-semibold text-lg leading-relaxed">
                      I hereby solemnly declare that all the information provided in this admission form is true, correct, and complete to the best of my knowledge. I understand that any false information or concealment of material facts will lead to immediate cancellation of admission and may result in legal action. I agree to abide by the rules and regulations of SRIC Senior Secondary School.
                    </span>
                  </div>
                </div>
                
                <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-200">
                  <h3 className="font-bold text-blue-900 text-xl mb-4 flex items-center">
                    <i className="fas fa-info-circle mr-3 text-blue-600"></i>
                    What happens next?
                  </h3>
                  <ul className="text-blue-800 space-y-3 text-lg">
                    <li className="flex items-center">
                      <i className="fas fa-check-circle text-green-500 mr-3"></i>
                      You will receive a confirmation email within 24 hours
                    </li>
                    <li className="flex items-center">
                      <i className="fas fa-check-circle text-green-500 mr-3"></i>
                      Our admission team will contact you for document verification
                    </li>
                    <li className="flex items-center">
                      <i className="fas fa-check-circle text-green-500 mr-3"></i>
                      Complete the fee payment process
                    </li>
                    <li className="flex items-center">
                      <i className="fas fa-check-circle text-green-500 mr-3"></i>
                      Welcome kit and schedule will be provided
                    </li>
                    <li className="flex items-center">
                      <i className="fas fa-print text-blue-500 mr-3"></i>
                      <strong>Print and submit hard copy</strong> to school office
                    </li>
                  </ul>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={isSubmitting || submittedAdmissionId}
                  className="bg-gradient-to-r from-blue-900 to-blue-700 hover:from-blue-800 hover:to-blue-600 text-white font-bold text-lg py-4 px-12 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-500 -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%]"></div>
                  <i className={`mr-3 ${isSubmitting ? 'fas fa-spinner fa-spin' : 'fas fa-paper-plane'}`}></i>
                  {submittedAdmissionId ? 'Already Submitted' : (isSubmitting ? 'Submitting Application...' : 'Submit Application')}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-6 mt-8">
          {submittedAdmissionId && (
            <>
              <button
                onClick={handlePrintClick}
                disabled={isLoadingPrintData}
                className="inline-flex items-center bg-gradient-to-r from-blue-900 to-blue-700 hover:from-blue-800 hover:to-blue-600 text-white px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 disabled:opacity-50 backdrop-blur-sm border border-blue-700"
              >
                <i className="fas fa-print mr-3"></i>
                {isLoadingPrintData ? 'Loading...' : 'Print Admission Form'}
              </button>
              <div className="text-white text-center bg-black bg-opacity-40 px-6 py-3 rounded-xl backdrop-blur-sm">
                <i className="fas fa-exclamation-circle mr-2 text-yellow-300"></i>
                Don't forget to submit hard copy to school office
              </div>
            </>
          )}
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center text-white hover:text-yellow-300 transition-all duration-300 bg-black bg-opacity-40 hover:bg-opacity-60 px-8 py-4 rounded-full backdrop-blur-sm border border-white border-opacity-30 hover:border-opacity-50 transform hover:scale-105"
          >
            <i className="fas fa-arrow-left mr-3"></i>
            Back to Homepage
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdmissionForm;
