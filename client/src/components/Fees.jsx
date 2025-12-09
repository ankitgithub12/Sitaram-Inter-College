import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const Fees = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [feeInputs, setFeeInputs] = useState({});
  const [activeStep, setActiveStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('online');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [bankUploadedFile, setBankUploadedFile] = useState(null);
  const [isPaymentActive, setIsPaymentActive] = useState(false);
  const [isDragover, setIsDragover] = useState(false);
  const [isBankDragover, setIsBankDragover] = useState(false);
  const [formData, setFormData] = useState({
    studentName: '',
    fatherName: '',
    mobile: '',
    email: '',
  });
  const [transactionId, setTransactionId] = useState('');
  const [bankTransactionId, setBankTransactionId] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [receiptDetails, setReceiptDetails] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef(null);
  const bankFileInputRef = useRef(null);

  const feeStructure = {
    'lkg': {
      name: 'LKG',
      fees: [
        { name: 'Tuition Fee', amount: 3000, editable: true, min: 1000 },
        { name: 'Exam Fee', amount: 200, editable: false },
        { name: 'Annual Charges', amount: 0, editable: true, min: 0 }
      ],
      note: 'Includes books and basic supplies. Uniform costs extra (₹1,500).'
    },
    'ukg': {
      name: 'UKG',
      fees: [
        { name: 'Tuition Fee', amount: 3200, editable: true, min: 1000 },
        { name: 'Exam Fee', amount: 200, editable: false },
        { name: 'Annual Charges', amount: 0, editable: true, min: 0 }
      ],
      note: 'Includes books and basic supplies. Uniform costs extra (₹1,500).'
    },
    '1': {
      name: 'Class 1',
      fees: [
        { name: 'Tuition Fee', amount: 3200, editable: true, min: 1000 },
        { name: 'Exam Fee', amount: 200, editable: false },
        { name: 'Annual Charges', amount: 0, editable: true, min: 0 }
      ],
      note: 'Includes books. Uniform costs extra (₹2,000).'
    },
    '2': {
      name: 'Class 2',
      fees: [
        { name: 'Tuition Fee', amount: 3600, editable: true, min: 1000 },
        { name: 'Exam Fee', amount: 200, editable: false },
        { name: 'Annual Charges', amount: 0, editable: true, min: 0 }
      ],
      note: 'Includes books. Uniform costs extra (₹2,000).'
    },
    '3': {
      name: 'Class 3',
      fees: [
        { name: 'Tuition Fee', amount: 3600, editable: true, min: 1000 },
        { name: 'Exam Fee', amount: 200, editable: false },
        { name: 'Annual Charges', amount: 0, editable: true, min: 0 }
      ],
      note: 'Includes books. Uniform costs extra (₹2,000).'
    },
    '4': {
      name: 'Class 4',
      fees: [
        { name: 'Tuition Fee', amount: 3600, editable: true, min: 1000 },
        { name: 'Exam Fee', amount: 200, editable: false },
        { name: 'Annual Charges', amount: 0, editable: true, min: 0 }
      ],
      note: 'Includes books. Uniform costs extra (₹2,000).'
    },
    '5': {
      name: 'Class 5',
      fees: [
        { name: 'Tuition Fee', amount: 3600, editable: true, min: 1000 },
        { name: 'Exam Fee', amount: 200, editable: false },
        { name: 'Annual Charges', amount: 0, editable: true, min: 0 }
      ],
      note: 'Includes books. Uniform costs extra (₹2,200).'
    },
    '6': {
      name: 'Class 6',
      fees: [
        { name: 'Tuition Fee', amount: 4200, editable: true, min: 1000 },
        { name: 'Exam Fee', amount: 200, editable: false },
        { name: 'Annual Charges', amount: 0, editable: true, min: 0 }
      ],
      note: 'Includes books. Uniform costs extra (₹2,600).'
    },
    '7': {
      name: 'Class 7',
      fees: [
        { name: 'Tuition Fee', amount: 4200, editable: true, min: 1000 },
        { name: 'Exam Fee', amount: 200, editable: false },
        { name: 'Annual Charges', amount: 0, editable: true, min: 0 }
      ],
      note: 'Includes books. Uniform costs extra (₹2,700).'
    },
    '8': {
      name: 'Class 8',
      fees: [
        { name: 'Tuition Fee', amount: 4200, editable: true, min: 1000 },
        { name: 'Exam Fee', amount: 200, editable: false },
        { name: 'Annual Charges', amount: 0, editable: true, min: 0 }
      ],
      note: 'Includes books. Uniform costs extra (₹2,800).'
    },
    '9': {
      name: 'Class 9',
      fees: [
        { name: 'Tuition Fee', amount: 6000, editable: true, min: 1000 },
        { name: 'Registration Fee', amount: 500, editable: true },
        { name: 'Exam Fee', amount: 200, editable: false },
        { name: 'Annual Charges', amount: 0, editable: true, min: 0 }
      ],
      note: 'Includes books. Uniform costs extra (₹3,000). Board exam fee will be additional.'
    },
    '10': {
      name: 'Class 10',
      fees: [
        { name: 'Tuition Fee', amount: 6000, editable: true, min: 1000 },
        { name: 'Practical Fee', amount: 600, editable: true },
        { name: 'PreBoard + HalfYearly', amount: 400, editable: true },
        { name: 'Board Exam Fee', amount: 1000, editable: true }
      ],
      note: 'Includes books. Uniform costs extra (₹3,000).'
    },
    '11-science': {
      name: 'Class 11 (Science)',
      fees: [
        { name: 'Tuition Fee', amount: 7200, editable: true, min: 1000 },
        { name: 'Activity Fee', amount: 0, editable: true, min: 0 },
        { name: 'Reg Fee', amount: 500, editable: true },
        { name: 'HalfYearly+Yearly Exam fee', amount: 500, editable: true }
      ],
      note: 'Includes practical notebooks. Uniform costs extra (₹4,000).'
    },
    '11-humanities': {
      name: 'Class 11 (Humanities)',
      fees: [
        { name: 'Tuition Fee', amount: 6000, editable: true, min: 1000 },
        { name: 'Activity Fee', amount: 0, editable: true, min: 0 },
        { name: 'Reg Fee', amount: 500, editable: false },
        { name: 'HalfYearly+Yearly Exam fee', amount: 500, editable: false }
      ],
      note: 'Includes practical notebooks. Uniform costs extra (₹4,000).'
    },
    '12-science': {
      name: 'Class 12 (Science)',
      fees: [
        { name: 'Tuition Fee', amount: 8400, editable: true, min: 1000 },
        { name: 'Practical Fee', amount: 1500, editable: true },
        { name: 'Board Exam Fee', amount: 1000, editable: true }
      ],
      note: 'Includes practical notebooks. Uniform costs extra (₹4,000).'
    },
    '12-humanities': {
      name: 'Class 12 (Humanities)',
      fees: [
        { name: 'Tuition Fee', amount: 8400, editable: true, min: 1000 },
        { name: 'Practical Fee', amount: 1000, editable: true },
        { name: 'Board Exam Fee', amount: 1000, editable: true }
      ],
      note: 'Includes practical notebooks. Uniform costs extra (₹4,000).'
    }
  };

  // Helper function to convert number to words for receipt
  const numberToWordsInReceipt = (num) => {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    
    if (num === 0) return 'Zero';
    
    function convertHundreds(n) {
      let result = '';
      if (n >= 100) {
        result += ones[Math.floor(n / 100)] + ' Hundred ';
        n %= 100;
      }
      
      if (n >= 10 && n <= 19) {
        result += teens[n - 10] + ' ';
        return result;
      } else if (n >= 20) {
        result += tens[Math.floor(n / 10)] + ' ';
        n %= 10;
      }
      
      if (n > 0) {
        result += ones[n] + ' ';
      }
      
      return result;
    }
    
    let words = '';
    if (num >= 10000000) {
      words += convertHundreds(Math.floor(num / 10000000)) + 'Crore ';
      num %= 10000000;
    }
    
    if (num >= 100000) {
      words += convertHundreds(Math.floor(num / 100000)) + 'Lakh ';
      num %= 100000;
    }
    
    if (num >= 1000) {
      words += convertHundreds(Math.floor(num / 1000)) + 'Thousand ';
      num %= 1000;
    }
    
    words += convertHundreds(num);
    
    return words.trim() + ' Rupees Only';
  };

  const handleClassSelect = (classId) => {
    setSelectedClass(classId);
    if (feeStructure[classId]) {
      const initialInputs = {};
      feeStructure[classId].fees.forEach(fee => {
        if (fee.editable) {
          const key = fee.name.toLowerCase().replace(/ /g, '-');
          initialInputs[key] = fee.amount;
        }
      });
      setFeeInputs(initialInputs);
    }
  };

  const handleFeeInputChange = (feeName, value) => {
    const key = feeName.toLowerCase().replace(/ /g, '-');
    const fee = feeStructure[selectedClass]?.fees.find(f => f.name === feeName);
    
    if (fee && fee.editable) {
      const numValue = parseInt(value) || 0;
      const minValue = fee.min || 0;
      const validatedValue = Math.max(minValue, numValue);
      
      setFeeInputs(prev => ({
        ...prev,
        [key]: validatedValue
      }));
    }
  };

  const calculateTotal = () => {
    if (!selectedClass || !feeStructure[selectedClass]) return 0;
    
    let total = 0;
    feeStructure[selectedClass].fees.forEach(fee => {
      if (fee.editable) {
        const key = fee.name.toLowerCase().replace(/ /g, '-');
        total += feeInputs[key] || fee.amount;
      } else {
        total += fee.amount;
      }
    });
    
    return total;
  };

  const handleProceedToPayment = () => {
    if (selectedClass) {
      setIsPaymentActive(true);
      setTimeout(() => {
        document.getElementById('payment-process-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const handleFileSelect = (event, type) => {
    const file = event.target.files[0];
    if (file) {
      validateAndSetFile(file, type);
    }
  };

  const validateAndSetFile = (file, type) => {
    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds 5MB limit. Please choose a smaller file.');
      return;
    }
    
    // Check file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      alert('Only JPEG, PNG, GIF, and PDF files are allowed.');
      return;
    }
    
    if (type === 'upi') {
      setUploadedFile(file);
    } else {
      setBankUploadedFile(file);
    }
  };

  const handleRemoveFile = (type) => {
    if (type === 'upi') {
      setUploadedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } else {
      setBankUploadedFile(null);
      if (bankFileInputRef.current) {
        bankFileInputRef.current.value = '';
      }
    }
  };

  const handleDragOver = (e, type) => {
    e.preventDefault();
    e.stopPropagation();
    if (type === 'upi') {
      setIsDragover(true);
    } else {
      setIsBankDragover(true);
    }
  };

  const handleDragLeave = (e, type) => {
    e.preventDefault();
    e.stopPropagation();
    if (type === 'upi') {
      setIsDragover(false);
    } else {
      setIsBankDragover(false);
    }
  };

  const handleDrop = (e, type) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (type === 'upi') {
      setIsDragover(false);
    } else {
      setIsBankDragover(false);
    }
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      validateAndSetFile(files[0], type);
    }
  };

  const validateStep1 = () => {
    const { studentName, fatherName, mobile, email } = formData;
    const errors = [];
    
    if (!studentName.trim()) errors.push('Student Name');
    if (!fatherName.trim()) errors.push('Father\'s Name');
    if (!mobile.trim()) errors.push('Mobile Number');
    if (!email.trim()) errors.push('Email Address');
    if (!termsAccepted) errors.push('Terms and Conditions');
    
    if (errors.length > 0) {
      alert(`Please fill all required fields: ${errors.join(', ')}`);
      return false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address');
      return false;
    }
    
    // Mobile validation
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(mobile.replace(/\D/g, ''))) {
      alert('Please enter a valid 10-digit mobile number');
      return false;
    }
    
    return true;
  };

  const validateStep2 = () => {
    if (paymentMethod === 'online') {
      if (!transactionId.trim()) {
        alert('Please enter your UPI transaction ID');
        return false;
      }
      if (!uploadedFile) {
        alert('Please upload your payment receipt');
        return false;
      }
    } else {
      if (!bankTransactionId.trim()) {
        alert('Please enter your bank transaction reference');
        return false;
      }
      if (!bankUploadedFile) {
        alert('Please upload your bank transfer receipt');
        return false;
      }
    }
    return true;
  };

  // NEW FUNCTION: Submit payment to backend
  const submitPaymentToBackend = async () => {
    try {
      const totalAmount = calculateTotal();
      const now = new Date();
      const receiptNumber = `SRIC-${now.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      
      // Prepare payment data - matching your MongoDB schema
      const paymentData = {
        studentName: formData.studentName,
        fatherName: formData.fatherName,
        mobile: formData.mobile,
        email: formData.email,
        className: feeStructure[selectedClass]?.name || '',
        classId: selectedClass,
        amount: totalAmount,
        paymentMethod: paymentMethod === 'online' ? 'UPI Payment' : 'Bank Transfer',
        transactionId: paymentMethod === 'online' ? transactionId : bankTransactionId,
        receiptNumber: receiptNumber,
        receiptDate: now,
        status: 'pending'
      };
      
      // Create FormData to include file
      const formDataToSend = new FormData();
      formDataToSend.append('paymentData', JSON.stringify(paymentData));
      
      // Add the receipt file
      if (paymentMethod === 'online' && uploadedFile) {
        formDataToSend.append('receipt', uploadedFile);
      } else if (paymentMethod === 'bank-transfer' && bankUploadedFile) {
        formDataToSend.append('receipt', bankUploadedFile);
      }
      
      // Send to your backend API
      const response = await fetch('/api/fee-payment', {
        method: 'POST',
        body: formDataToSend,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Payment submission failed');
      }
      
      const result = await response.json();
      
      if (result.success) {
        console.log('Payment saved to database:', result.data);
        return { success: true, receiptNumber: receiptNumber };
      } else {
        throw new Error(result.message || 'Payment submission failed');
      }
      
    } catch (error) {
      console.error('Error submitting payment:', error);
      alert(`Payment submission failed: ${error.message}`);
      return { success: false };
    }
  };

  const handleNextStep = async () => {
    if (activeStep === 1) {
      if (!validateStep1()) return;
      setActiveStep(2);
    }
    
    if (activeStep === 2) {
      if (!validateStep2()) return;
      
      setIsSubmitting(true);
      
      try {
        // Submit to backend first
        const submissionResult = await submitPaymentToBackend();
        
        if (!submissionResult.success) {
          setIsSubmitting(false);
          return;
        }
        
        // Generate receipt for display
        generateReceipt();
        
        // Move to confirmation step
        setActiveStep(3);
        
      } catch (error) {
        console.error('Error in payment process:', error);
        alert('Error processing payment. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleBackStep = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1);
    } else {
      setIsPaymentActive(false);
    }
  };

  const generateReceipt = () => {
    const now = new Date();
    const receiptNumber = `SRIC-${now.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    
    const receipt = {
      date: now.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }),
      receiptNumber,
      transactionId: paymentMethod === 'online' ? transactionId : bankTransactionId,
      paymentMethod: paymentMethod === 'online' ? 'UPI Payment' : 'Bank Transfer',
      studentName: formData.studentName,
      fatherName: formData.fatherName,
      className: feeStructure[selectedClass]?.name || '',
      amount: calculateTotal(),
      email: formData.email,
      generatedAt: now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    };
    
    setReceiptDetails(receipt);
  };

  const handlePrintReceipt = () => {
    const amountInWords = numberToWordsInReceipt(calculateTotal());
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>SRIC Fee Payment Receipt</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600&display=swap');
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Montserrat', sans-serif;
            background: #f8f9fa;
            color: #333;
            padding: 30px;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
          }
          
          .receipt-container {
            width: 100%;
            max-width: 800px;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0, 35, 102, 0.15);
            overflow: hidden;
            border: 1px solid #e0e0e0;
          }
          
          .receipt-header {
            background: linear-gradient(135deg, #002366 0%, #1a3d8f 100%);
            color: white;
            padding: 40px;
            text-align: center;
            position: relative;
            overflow: hidden;
          }
          
          .receipt-header::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
            background-size: 30px 30px;
            opacity: 0.1;
          }
          
          .school-name {
            font-family: 'Playfair Display', serif;
            font-size: 32px;
            font-weight: 700;
            margin-bottom: 8px;
            letter-spacing: 1px;
          }
          
          .school-address {
            font-size: 14px;
            opacity: 0.9;
            margin-bottom: 5px;
          }
          
          .receipt-title {
            font-size: 28px;
            font-weight: 600;
            margin-top: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid rgba(255, 255, 255, 0.3);
            display: inline-block;
          }
          
          .receipt-body {
            padding: 40px;
          }
          
          .receipt-details {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 25px;
            margin-bottom: 40px;
          }
          
          .detail-item {
            display: flex;
            flex-direction: column;
            padding-bottom: 12px;
            border-bottom: 1px dashed #e0e0e0;
          }
          
          .detail-label {
            font-size: 12px;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 4px;
          }
          
          .detail-value {
            font-size: 16px;
            font-weight: 600;
            color: #002366;
          }
          
          .amount-section {
            text-align: center;
            padding: 30px;
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            border-radius: 15px;
            margin: 40px 0;
            border: 2px solid #e0e0e0;
          }
          
          .amount-label {
            font-size: 14px;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 10px;
          }
          
          .amount-value {
            font-size: 48px;
            font-weight: 700;
            color: #002366;
            font-family: 'Playfair Display', serif;
          }
          
          .amount-in-words {
            font-size: 14px;
            color: #666;
            margin-top: 10px;
            font-style: italic;
          }
          
          .security-section {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-top: 60px;
            padding-top: 30px;
            border-top: 2px solid #e0e0e0;
          }
          
          .signature-box {
            text-align: center;
          }
          
          .signature-line {
            width: 200px;
            height: 1px;
            background: #333;
            margin: 40px auto 10px;
          }
          
          .signature-name {
            font-weight: 600;
            color: #002366;
            margin-top: 5px;
          }
          
          .signature-title {
            font-size: 12px;
            color: #666;
          }
          
          .stamp-box {
            position: relative;
            width: 150px;
            height: 150px;
          }
          
          .stamp {
            width: 150px;
            height: 150px;
            border: 3px solid #d32f2f;
            border-radius: 50%;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            transform: rotate(-15deg);
            background: rgba(255, 255, 255, 0.95);
          }
          
          .stamp-text {
            text-align: center;
            font-weight: 700;
            color: #d32f2f;
            font-size: 14px;
            line-height: 1.3;
          }
          
          .stamp-seal {
            position: absolute;
            width: 100%;
            height: 100%;
            border: 2px dashed #d32f2f;
            border-radius: 50%;
            opacity: 0.7;
          }
          
          .receipt-footer {
            background: #f8f9fa;
            padding: 25px 40px;
            text-align: center;
            border-top: 1px solid #e0e0e0;
          }
          
          .footer-note {
            font-size: 12px;
            color: #666;
            line-height: 1.5;
            margin-bottom: 15px;
          }
          
          .verification-code {
            font-family: monospace;
            background: #002366;
            color: white;
            padding: 8px 15px;
            border-radius: 5px;
            display: inline-block;
            font-size: 12px;
            letter-spacing: 2px;
          }
          
          .watermark {
            position: absolute;
            opacity: 0.05;
            font-size: 120px;
            font-weight: 900;
            color: #002366;
            transform: rotate(-45deg);
            z-index: 0;
            top: 30%;
            left: 10%;
            user-select: none;
          }
          
          @media print {
            body {
              padding: 0;
              background: white;
              margin: 0;
            }
            
            .receipt-container {
              box-shadow: none;
              border: none;
              max-width: 100%;
              margin: 0;
              border-radius: 0;
            }
            
            .no-print {
              display: none !important;
            }
            
            .watermark {
              opacity: 0.08;
            }
            
            @page {
              margin: 20mm;
            }
          }
          
          .print-controls {
            text-align: center;
            margin-top: 30px;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 10px;
          }
          
          .print-btn, .close-btn {
            padding: 12px 30px;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            font-size: 16px;
            transition: all 0.3s ease;
            margin: 0 10px;
          }
          
          .print-btn {
            background: linear-gradient(135deg, #002366 0%, #1a3d8f 100%);
            color: white;
          }
          
          .print-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(0, 35, 102, 0.2);
          }
          
          .close-btn {
            background: #6c757d;
            color: white;
          }
          
          .close-btn:hover {
            background: #5a6268;
            transform: translateY(-2px);
          }
        </style>
      </head>
      <body>
        <div class="receipt-container">
          <div class="watermark">SRIC</div>
          
          <div class="receipt-header">
            <h1 class="school-name">SITARAM INTER COLLEGE</h1>
            <p class="school-address">Sabdalpur Sharki, Mathana Road Hasanpur, Amroha 244242</p>
            <p class="school-address">Email: sitaramintercollege1205@gmail.com | Phone: +91 9756517750</p>
            <div class="receipt-title">FEE PAYMENT RECEIPT</div>
          </div>
          
          <div class="receipt-body">
            <div class="receipt-details">
              <div class="detail-item">
                <span class="detail-label">Receipt Number</span>
                <span class="detail-value">${receiptDetails.receiptNumber}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Date & Time</span>
                <span class="detail-value">${receiptDetails.date} at ${receiptDetails.generatedAt}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Student Name</span>
                <span class="detail-value">${receiptDetails.studentName}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Father's Name</span>
                <span class="detail-value">${receiptDetails.fatherName}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Class</span>
                <span class="detail-value">${receiptDetails.className}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Payment Method</span>
                <span class="detail-value">${receiptDetails.paymentMethod}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Transaction ID</span>
                <span class="detail-value">${receiptDetails.transactionId}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Email</span>
                <span class="detail-value">${receiptDetails.email}</span>
              </div>
            </div>
            
            <div class="amount-section">
              <div class="amount-label">Total Amount Paid</div>
              <div class="amount-value">₹${receiptDetails.amount.toLocaleString('en-IN')}</div>
              <div class="amount-in-words">Amount in Words: ${amountInWords}</div>
            </div>
            
            <div class="security-section">
              <div class="signature-box">
                <div class="signature-line"></div>
                <div class="signature-name">Principal</div>
                <div class="signature-title">Authorized Signature</div>
              </div>
              
              <div class="stamp-box">
                <div class="stamp">
                  <div class="stamp-seal"></div>
                  <div class="stamp-text">
                    SITARAM INTER COLLEGE<br>
                    <span style="font-size: 12px;">OFFICIAL STAMP</span><br>
                    <span style="font-size: 10px;">${receiptDetails.date}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="receipt-footer">
            <p class="footer-note">
              <strong>Important:</strong> This is a computer generated receipt. Please submit the hardcopy of this receipt 
              in the school office within 7 days for verification and final approval. This receipt is invalid without 
              official stamp and signature.
            </p>
            <p class="footer-note">
              For any queries, please contact school administration at +91 9756517750 or email sitaramintercollege1205@gmail.com
            </p>
            <div class="verification-code">Verification Code: ${receiptDetails.receiptNumber}</div>
          </div>
        </div>
        
        <div class="print-controls no-print">
          <button class="print-btn" onclick="window.print()">Print Receipt</button>
          <button class="close-btn" onclick="window.close()">Close Window</button>
        </div>
        
        <script>
          // Auto-print after window loads
          window.onload = function() {
            // Small delay to ensure all content is loaded
            setTimeout(() => {
              window.print();
            }, 500);
          };
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleNewPayment = () => {
    setSelectedClass(null);
    setFeeInputs({});
    setActiveStep(1);
    setIsPaymentActive(false);
    setPaymentMethod('online');
    setUploadedFile(null);
    setBankUploadedFile(null);
    setIsDragover(false);
    setIsBankDragover(false);
    setFormData({
      studentName: '',
      fatherName: '',
      mobile: '',
      email: '',
    });
    setTransactionId('');
    setBankTransactionId('');
    setTermsAccepted(false);
    setReceiptDetails(null);
    setIsSubmitting(false);
    
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (bankFileInputRef.current) bankFileInputRef.current.value = '';
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleDropdown = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('#mobile-menu') && !event.target.closest('#menu-toggle')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const progressPercentage = (activeStep / 3) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header - Updated to match Home.jsx */}
      <header className="sticky top-0 z-50 shadow-md">
        <nav className="bg-sricblue p-4">
          <div className="container mx-auto flex justify-between items-center">
            {/* Logo + School Name */}
            <div className="flex items-center space-x-2">
              <img 
                src="/assets/SRIC LOGO.PNG" 
                alt="SRIC Logo" 
                className="h-10 w-10 rounded-full"
              />
              <Link to="/" className="text-white text-xl font-bold">
                SITARAM INTER COLLEGE
              </Link>
              <span className="hidden sm:inline text-sricgold text-sm">
                Empowering Minds, Shaping Futures
              </span>
            </div>

            {/* Desktop Menu */}
            <ul className="hidden md:flex space-x-6 items-center">
              <li>
                <Link to="/" className="nav-link text-gray-300 hover:text-white">
                  Home
                </Link>
              </li>
              
              {/* About Us Dropdown */}
              <li className="relative dropdown-group">
                <button className="nav-link text-gray-300 hover:text-white focus:outline-none flex items-center">
                  About Us 
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                <ul className="dropdown-menu absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                  <li>
                    <Link to="/mission" className="block px-4 py-2 text-gray-800 hover:bg-sricblue hover:text-white">
                      Mission
                    </Link>
                  </li>
                  <li>
                    <Link to="/history" className="block px-4 py-2 text-gray-800 hover:bg-sricblue hover:text-white">
                      History
                    </Link>
                  </li>
                  <li>
                    <Link to="/faculty" className="block px-4 py-2 text-gray-800 hover:bg-sricblue hover:text-white">
                      Faculty
                    </Link>
                  </li>
                </ul>
              </li>
              
              {/* Academics Dropdown */}
              <li className="relative dropdown-group">
                <button className="nav-link text-gray-300 hover:text-white focus:outline-none flex items-center">
                  Academics 
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                <ul className="dropdown-menu absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                  <li>
                    <Link to="/curriculum" className="block px-4 py-2 text-gray-800 hover:bg-sricblue hover:text-white">
                      Curriculum
                    </Link>
                  </li>
                  <li>
                    <Link to="/programs" className="block px-4 py-2 text-gray-800 hover:bg-sricblue hover:text-white">
                      Programs
                    </Link>
                  </li>
                </ul>
              </li>

              {/* Admissions Dropdown */}
              <li className="relative dropdown-group">
                <button className="nav-link text-white focus:outline-none flex items-center">
                  Admissions 
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                <ul className="dropdown-menu absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                  <li>
                    <Link to="/process" className="block px-4 py-2 text-gray-800 hover:bg-sricblue hover:text-white">
                      Process
                    </Link>
                  </li>
                  <li>
                    <Link to="/fees" className="block px-4 py-2 text-gray-800 hover:bg-sricblue hover:text-white">
                      Fees
                    </Link>
                  </li>
                </ul>
              </li>

              {/* News & Events Dropdown */}
              <li className="relative dropdown-group">
                <button className="nav-link text-gray-300 hover:text-white focus:outline-none flex items-center">
                  News & Events 
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                <ul className="dropdown-menu absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                  <li>
                    <Link to="/calendar" className="block px-4 py-2 text-gray-800 hover:bg-sricblue hover:text-white">
                      Calendar
                    </Link>
                  </li>
                  <li>
                    <Link to="/announcements" className="block px-4 py-2 text-gray-800 hover:bg-sricblue hover:text-white">
                      Announcements
                    </Link>
                  </li>
                </ul>
              </li>

              {/* Gallery Dropdown */}
              <li className="relative dropdown-group">
                <button className="nav-link text-gray-300 hover:text-white focus:outline-none flex items-center">
                  Gallery 
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                <ul className="dropdown-menu absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                  <li>
                    <Link to="/photos-videos" className="block px-4 py-2 text-gray-800 hover:bg-sricblue hover:text-white">
                      Photos/Videos
                    </Link>
                  </li>
                </ul>
              </li>

              <li className="mr-4">
                <Link to="/contact" className="nav-link text-gray-300 hover:text-white">
                  Contact
                </Link>
              </li>
            </ul>

            {/* Desktop Buttons Group */}
            <div className="hidden md:flex items-center space-x-3">
              {/* Admin Button */}
              <Link 
                to="/admin-login" 
                className="admin-button px-4 py-2.5 rounded-md font-bold flex items-center space-x-2"
              >
                <i className="fas fa-user-shield"></i>
                <span>Admin</span>
              </Link>
              
              {/* CTA Button */}
              <Link 
                to="/admission-form" 
                className="pulse-button bg-sricgold text-sricblue px-5 py-2.5 rounded-md font-bold hover:bg-yellow-500 transition transform hover:scale-105"
              >
                Apply Now
              </Link>
            </div>

            {/* Mobile Hamburger Menu */}
            <button 
              id="menu-toggle"
              onClick={toggleMobileMenu}
              className="md:hidden text-white focus:outline-none"
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          <div 
            id="mobile-menu" 
            className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'} bg-sriclightblue pb-4 px-4`}
          >
            <ul className="flex flex-col space-y-2">
              <li className="mobile-menu-item">
                <Link 
                  to="/" 
                  className="block text-gray-300 hover:text-white py-3 px-4 rounded-md hover:bg-sricblue transition"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </Link>
              </li>
              
              {/* About Us Mobile Dropdown */}
              <li className="dropdown-container mobile-menu-item">
                <button 
                  onClick={() => toggleDropdown('about')}
                  className="dropdown-btn w-full text-left text-gray-300 hover:text-white py-3 px-4 rounded-md hover:bg-sricblue flex justify-between items-center transition"
                >
                  About Us 
                  <svg 
                    className={`dropdown-icon w-4 h-4 transform transition-transform ${openDropdown === 'about' ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                <ul 
                  className={`dropdown-content pl-4 mt-1 space-y-1 overflow-hidden transition-all duration-300 ${
                    openDropdown === 'about' ? 'max-h-40' : 'max-h-0'
                  }`}
                >
                  <li>
                    <Link 
                      to="/mission" 
                      className="block text-gray-400 hover:text-white py-2 px-4 rounded-md hover:bg-sricblue transition text-sm"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Mission
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/history" 
                      className="block text-gray-400 hover:text-white py-2 px-4 rounded-md hover:bg-sricblue transition text-sm"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      History
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/faculty" 
                      className="block text-gray-400 hover:text-white py-2 px-4 rounded-md hover:bg-sricblue transition text-sm"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Faculty
                    </Link>
                  </li>
                </ul>
              </li>

              {/* Academics Mobile Dropdown */}
              <li className="dropdown-container mobile-menu-item">
                <button 
                  onClick={() => toggleDropdown('academics')}
                  className="dropdown-btn w-full text-left text-gray-300 hover:text-white py-3 px-4 rounded-md hover:bg-sricblue flex justify-between items-center transition"
                >
                  Academics 
                  <svg 
                    className={`dropdown-icon w-4 h-4 transform transition-transform ${openDropdown === 'academics' ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                <ul 
                  className={`dropdown-content pl-4 mt-1 space-y-1 overflow-hidden transition-all duration-300 ${
                    openDropdown === 'academics' ? 'max-h-40' : 'max-h-0'
                  }`}
                >
                  <li>
                    <Link 
                      to="/curriculum" 
                      className="block text-gray-400 hover:text-white py-2 px-4 rounded-md hover:bg-sricblue transition text-sm"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Curriculum
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/programs" 
                      className="block text-gray-400 hover:text-white py-2 px-4 rounded-md hover:bg-sricblue transition text-sm"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Programs
                    </Link>
                  </li>
                </ul>
              </li>

              {/* Admissions Mobile Dropdown */}
              <li className="dropdown-container mobile-menu-item">
                <button 
                  onClick={() => toggleDropdown('admissions')}
                  className="dropdown-btn w-full text-left text-white py-3 px-4 rounded-md hover:bg-sricblue flex justify-between items-center transition"
                >
                  Admissions 
                  <svg 
                    className={`dropdown-icon w-4 h-4 transform transition-transform ${openDropdown === 'admissions' ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                <ul 
                  className={`dropdown-content pl-4 mt-1 space-y-1 overflow-hidden transition-all duration-300 ${
                    openDropdown === 'admissions' ? 'max-h-40' : 'max-h-0'
                  }`}
                >
                  <li>
                    <Link 
                      to="/process" 
                      className="block text-gray-400 hover:text-white py-2 px-4 rounded-md hover:bg-sricblue transition text-sm"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Process
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/fees" 
                      className="block text-white py-2 px-4 rounded-md hover:bg-sricblue transition text-sm"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Fees
                    </Link>
                  </li>
                </ul>
              </li>

              {/* News & Events Mobile Dropdown */}
              <li className="dropdown-container mobile-menu-item">
                <button 
                  onClick={() => toggleDropdown('news')}
                  className="dropdown-btn w-full text-left text-gray-300 hover:text-white py-3 px-4 rounded-md hover:bg-sricblue flex justify-between items-center transition"
                >
                  News & Events 
                  <svg 
                    className={`dropdown-icon w-4 h-4 transform transition-transform ${openDropdown === 'news' ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                <ul 
                  className={`dropdown-content pl-4 mt-1 space-y-1 overflow-hidden transition-all duration-300 ${
                    openDropdown === 'news' ? 'max-h-40' : 'max-h-0'
                  }`}
                >
                  <li>
                    <Link 
                      to="/calendar" 
                      className="block text-gray-400 hover:text-white py-2 px-4 rounded-md hover:bg-sricblue transition text-sm"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Calendar
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/announcements" 
                      className="block text-gray-400 hover:text-white py-2 px-4 rounded-md hover:bg-sricblue transition text-sm"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Announcements
                    </Link>
                  </li>
                </ul>
              </li>

              {/* Gallery Mobile Dropdown */}
              <li className="dropdown-container mobile-menu-item">
                <button 
                  onClick={() => toggleDropdown('gallery')}
                  className="dropdown-btn w-full text-left text-gray-300 hover:text-white py-3 px-4 rounded-md hover:bg-sricblue flex justify-between items-center transition"
                >
                  Gallery 
                  <svg 
                    className={`dropdown-icon w-4 h-4 transform transition-transform ${openDropdown === 'gallery' ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                <ul 
                  className={`dropdown-content pl-4 mt-1 space-y-1 overflow-hidden transition-all duration-300 ${
                    openDropdown === 'gallery' ? 'max-h-40' : 'max-h-0'
                  }`}
                >
                  <li>
                    <Link 
                      to="/photos-videos" 
                      className="block text-gray-400 hover:text-white py-2 px-4 rounded-md hover:bg-sricblue transition text-sm"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Photos/Videos
                    </Link>
                  </li>
                </ul>
              </li>

              <li className="mobile-menu-item">
                <Link 
                  to="/contact" 
                  className="block text-gray-300 hover:text-white py-3 px-4 rounded-md hover:bg-sricblue transition"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contact
                </Link>
              </li>
              
              {/* Mobile Admin Button */}
              <li className="mobile-menu-item">
                <Link 
                  to="/admin-login" 
                  className="admin-button flex text-white py-3 px-4 rounded-md text-center font-bold items-center justify-center space-x-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <i className="fas fa-user-shield"></i>
                  <span>Admin Login</span>
                </Link>
              </li>
              
              {/* Mobile Apply Now Button */}
              <li className="mobile-menu-item">
                <Link 
                  to="/admission-form" 
                  className="block pulse-button bg-sricgold text-sricblue px-4 py-3 rounded-md text-center font-bold hover:bg-yellow-500 transition"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Apply Now
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-sricblue via-blue-800 to-purple-900 text-white py-20">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-20 h-20 bg-sricgold rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-16 h-16 bg-sricgold rounded-full"></div>
          <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-white rounded-full"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Fee Structure & Payment</h1>
          <p className="text-xl max-w-3xl mx-auto mb-8 bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
            Transparent and affordable fee structure with secure online payment options
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/process" 
              className="bg-white hover:bg-gray-100 text-sricblue font-semibold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105 shadow-lg"
            >
              Admission Process
            </Link>
            <a 
              href="#fee-details" 
              className="bg-gradient-to-r from-sricgold to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-sricblue font-semibold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105 shadow-lg"
            >
              View Fees
            </a>
          </div>
        </div>
      </section>

      {/* Class Selection */}
      <section className="py-16 bg-white" id="fee-details">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">Select Your Class</h2>
              <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">Choose your class to view the detailed fee structure</p>
              <div className="w-20 h-1 bg-sricblue mx-auto mb-8"></div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {[
                { id: 'lkg', label: 'LKG' },
                { id: 'ukg', label: 'UKG' },
                { id: '1', label: 'Class 1' },
                { id: '2', label: 'Class 2' },
                { id: '3', label: 'Class 3' },
                { id: '4', label: 'Class 4' },
                { id: '5', label: 'Class 5' },
                { id: '6', label: 'Class 6' },
                { id: '7', label: 'Class 7' },
                { id: '8', label: 'Class 8' },
                { id: '9', label: 'Class 9' },
                { id: '10', label: 'Class 10' },
                { id: '11-science', label: 'Class 11 (Science)' },
                { id: '11-humanities', label: 'Class 11 (Humanities)' },
                { id: '12-science', label: 'Class 12 (Science)' },
                { id: '12-humanities', label: 'Class 12 (Humanities)' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleClassSelect(item.id)}
                  className={`p-4 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                    selectedClass === item.id
                      ? 'bg-gradient-to-r from-sricblue to-blue-700 text-white shadow-2xl'
                      : 'bg-gradient-to-r from-gray-50 to-gray-100 text-sricblue hover:from-sricblue/10 hover:to-blue-100 border-2 border-gray-200 hover:border-sricblue'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Fee Structure */}
      {selectedClass && (
        <section className="py-16 bg-gradient-to-b from-blue-50 to-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h3 className="text-3xl md:text-4xl font-bold text-gray-800">
                  {feeStructure[selectedClass]?.name} Fee Structure
                </h3>
                <p className="text-gray-600 mt-2">Academic Year 2025-26</p>
              </div>
              
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gradient-to-r from-sricblue to-blue-700 text-white">
                      <tr>
                        <th className="py-4 px-6 text-left text-lg font-bold">Fee Component</th>
                        <th className="py-4 px-6 text-right text-lg font-bold">Amount (₹)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {feeStructure[selectedClass]?.fees.map((fee, index) => (
                        <tr key={index} className="hover:bg-blue-50 transition-colors duration-200">
                          <td className="py-4 px-6 text-gray-700 font-medium">{fee.name}</td>
                          <td className="py-4 px-6 text-right">
                            {fee.editable ? (
                              <input
                                type="number"
                                value={feeInputs[fee.name.toLowerCase().replace(/ /g, '-')] || fee.amount}
                                onChange={(e) => handleFeeInputChange(fee.name, e.target.value)}
                                min={fee.min || 0}
                                className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sricblue focus:border-transparent text-right"
                              />
                            ) : (
                              <span className="text-gray-800 font-bold">₹{fee.amount.toLocaleString('en-IN')}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gradient-to-r from-gray-50 to-gray-100 border-t-2 border-sricblue">
                      <tr>
                        <td className="py-4 px-6 text-lg font-bold text-gray-800">Total Annual Fee</td>
                        <td className="py-4 px-6 text-right text-2xl font-bold text-sricblue">
                          ₹{calculateTotal().toLocaleString('en-IN')}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
              
              <div className="mt-6 bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500 p-4 rounded-r-lg">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <i className="fas fa-info-circle text-blue-500 text-xl mt-1 mr-3"></i>
                  </div>
                  <div>
                    <p className="text-blue-800 font-medium">{feeStructure[selectedClass]?.note}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 text-center">
                <button
                  onClick={handleProceedToPayment}
                  className="bg-gradient-to-r from-sricgold to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-sricblue font-bold py-3 px-8 rounded-xl transition duration-300 transform hover:scale-105 shadow-lg"
                >
                  Proceed to Payment
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Payment Process Steps */}
      {isPaymentActive && selectedClass && (
        <section className="py-16 bg-gradient-to-b from-white to-gray-50" id="payment-process-section">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">Complete Your Payment</h2>
                <p className="text-gray-600 text-lg">Secure and convenient payment options</p>
              </div>
              
              {/* Progress Bar */}
              <div className="mb-12">
                <div className="flex justify-between mb-4">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className="flex flex-col items-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold mb-2 ${
                        step <= activeStep 
                          ? 'bg-gradient-to-r from-sricblue to-blue-600 shadow-lg' 
                          : 'bg-gray-300'
                      }`}>
                        {step}
                      </div>
                      <span className={`text-sm font-medium ${
                        step <= activeStep ? 'text-sricblue' : 'text-gray-500'
                      }`}>
                        {step === 1 && 'Details'}
                        {step === 2 && 'Payment'}
                        {step === 3 && 'Confirmation'}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="relative">
                  <div className="absolute top-1/2 left-0 right-0 h-2 bg-gray-200 transform -translate-y-1/2 rounded-full"></div>
                  <div 
                    className="absolute top-1/2 left-0 h-2 bg-gradient-to-r from-sricblue to-blue-600 transform -translate-y-1/2 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Step 1: Student Details */}
              {activeStep === 1 && (
                <div className="bg-white p-8 rounded-2xl shadow-2xl border border-gray-200">
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-sricblue mb-4">Selected Class: <span className="text-gray-700">{feeStructure[selectedClass]?.name}</span></h3>
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl">
                      <h4 className="text-lg font-semibold">Total Fee: <span className="text-2xl text-sricblue">₹{calculateTotal().toLocaleString('en-IN')}</span></h4>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Student Name*</label>
                      <input
                        type="text"
                        value={formData.studentName}
                        onChange={(e) => setFormData({...formData, studentName: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sricblue focus:border-transparent transition"
                        placeholder="Enter student name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Father's Name*</label>
                      <input
                        type="text"
                        value={formData.fatherName}
                        onChange={(e) => setFormData({...formData, fatherName: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sricblue focus:border-transparent transition"
                        placeholder="Enter father's name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Mobile Number*</label>
                      <input
                        type="tel"
                        value={formData.mobile}
                        onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sricblue focus:border-transparent transition"
                        placeholder="Enter mobile number"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Email Address*</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sricblue focus:border-transparent transition"
                        placeholder="Enter email address"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <h3 className="text-xl font-bold text-sricblue mb-4">Payment Method</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <input
                          type="radio"
                          id="online-payment"
                          name="payment-method"
                          checked={paymentMethod === 'online'}
                          onChange={() => setPaymentMethod('online')}
                          className="hidden peer"
                        />
                        <label htmlFor="online-payment" className="flex items-center p-4 border-2 border-gray-300 rounded-xl cursor-pointer peer-checked:border-sricblue peer-checked:bg-blue-50 transition hover:scale-[1.02]">
                          <div className="bg-gradient-to-r from-sricblue to-blue-600 text-white p-3 rounded-lg mr-4">
                            <i className="fas fa-credit-card text-xl"></i>
                          </div>
                          <div>
                            <span className="font-semibold">UPI Payment</span>
                            <p className="text-sm text-gray-600">GPay, PayTM, PhonePe</p>
                          </div>
                        </label>
                      </div>
                      
                      <div>
                        <input
                          type="radio"
                          id="bank-transfer"
                          name="payment-method"
                          checked={paymentMethod === 'bank-transfer'}
                          onChange={() => setPaymentMethod('bank-transfer')}
                          className="hidden peer"
                        />
                        <label htmlFor="bank-transfer" className="flex items-center p-4 border-2 border-gray-300 rounded-xl cursor-pointer peer-checked:border-sricblue peer-checked:bg-blue-50 transition hover:scale-[1.02]">
                          <div className="bg-gradient-to-r from-sricblue to-blue-600 text-white p-3 rounded-lg mr-4">
                            <i className="fas fa-university text-xl"></i>
                          </div>
                          <div>
                            <span className="font-semibold">Bank Transfer</span>
                            <p className="text-sm text-gray-600">NEFT/RTGS/IMPS</p>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <div className="flex items-start">
                      <input
                        type="checkbox"
                        id="terms"
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        className="mt-1 mr-3 w-5 h-5 rounded focus:ring-sricblue text-sricblue"
                      />
                      <label htmlFor="terms" className="text-gray-700">
                        I agree to the <a href="#" className="text-sricblue hover:underline font-semibold">terms and conditions</a> and confirm that all information provided is accurate*
                      </label>
                    </div>
                  </div>
                  
                  <div className="mt-8 flex justify-between">
                    <button
                      onClick={handleBackStep}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-8 rounded-xl transition duration-300 transform hover:scale-105"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleNextStep}
                      className="bg-gradient-to-r from-sricblue to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-8 rounded-xl transition duration-300 transform hover:scale-105 shadow-lg"
                    >
                      Continue to Payment
                    </button>
                  </div>
                </div>
              )}
              
              {/* Step 2: Payment Gateway */}
              {activeStep === 2 && (
                <div className="bg-white p-8 rounded-2xl shadow-2xl border border-gray-200">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-sricblue mb-2">Payment Summary</h3>
                    <p className="text-gray-600">Class: <span className="font-bold text-sricblue">{feeStructure[selectedClass]?.name}</span></p>
                    <div className="mt-4">
                      <span className="text-4xl font-bold bg-gradient-to-r from-sricblue to-blue-600 bg-clip-text text-transparent">
                        ₹{calculateTotal().toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                  
                  {paymentMethod === 'online' ? (
                    <div>
                      <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl border-2 border-blue-200 mb-8">
                        <div className="flex items-center mb-4">
                          <div className="bg-gradient-to-r from-sricblue to-blue-600 text-white p-3 rounded-full mr-4">
                            <i className="fas fa-mobile-alt text-xl"></i>
                          </div>
                          <h4 className="text-xl font-bold">UPI Payment via GPay/PayTM</h4>
                        </div>
                        <p className="text-gray-600 mb-6">Scan the QR code below using your UPI app to complete the payment</p>
                        
                        <div className="grid md:grid-cols-2 gap-6 mb-8">
                          <div className="text-center bg-white p-4 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow duration-300">
                            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-2 rounded-lg mb-3">
                              <p className="font-bold text-sricblue">GPay</p>
                            </div>
                            <div className="bg-white p-2 rounded-lg border border-gray-300">
                              <img src="/assets/googlepay.jpeg" alt="GPay QR Code" className="w-full max-w-[200px] mx-auto" />
                            </div>
                            <p className="text-sm text-gray-600 mt-2">Scan with GPay app</p>
                          </div>
                          
                          <div className="text-center bg-white p-4 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow duration-300">
                            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-2 rounded-lg mb-3">
                              <p className="font-bold text-sricblue">PayTM</p>
                            </div>
                            <div className="bg-white p-2 rounded-lg border border-gray-300">
                              <img src="/assets/paytm.jpeg" alt="PayTM QR Code" className="w-full max-w-[200px] mx-auto" />
                            </div>
                            <p className="text-sm text-gray-600 mt-2">Scan with PayTM app</p>
                          </div>
                        </div>
                        
                        {/* File Upload Section */}
                        <div className="mb-6">
                          <h3 className="text-xl font-bold text-sricblue mb-4">Upload Payment Receipt</h3>
                          <div 
                            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
                              isDragover 
                                ? 'border-sricblue bg-blue-50' 
                                : 'border-gray-300 hover:border-sricblue hover:bg-blue-50'
                            }`}
                            onClick={() => fileInputRef.current?.click()}
                            onDragOver={(e) => handleDragOver(e, 'upi')}
                            onDragLeave={(e) => handleDragLeave(e, 'upi')}
                            onDrop={(e) => handleDrop(e, 'upi')}
                          >
                            <input
                              type="file"
                              ref={fileInputRef}
                              onChange={(e) => handleFileSelect(e, 'upi')}
                              accept="image/*,.pdf"
                              className="hidden"
                            />
                            <div className="py-4">
                              <i className="fas fa-cloud-upload-alt text-sricblue text-4xl mb-3"></i>
                              <p className="text-gray-600">Click to upload or drag and drop your payment receipt</p>
                              <p className="text-gray-500 text-sm mt-1">PNG, JPG, PDF up to 5MB</p>
                            </div>
                          </div>
                          
                          {uploadedFile && (
                            <div className="mt-4 bg-white border border-gray-200 rounded-xl p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <i className="fas fa-file text-sricblue text-xl mr-3"></i>
                                  <div>
                                    <p className="font-medium">{uploadedFile.name}</p>
                                    <p className="text-sm text-gray-500">
                                      {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                  </div>
                                </div>
                                <button
                                  onClick={() => handleRemoveFile('upi')}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <i className="fas fa-times"></i>
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="mt-6">
                          <label className="block text-gray-700 font-medium mb-2">Transaction ID (After Payment)*</label>
                          <input
                            type="text"
                            value={transactionId}
                            onChange={(e) => setTransactionId(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sricblue focus:border-transparent transition"
                            placeholder="Enter UPI transaction ID"
                          />
                          <p className="text-xs text-gray-500 mt-1">You can find this in your payment app after successful transaction</p>
                        </div>
                      </div>
                      
                      <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                        <div className="flex items-center">
                          <i className="fas fa-lock text-green-500 text-xl mr-3"></i>
                          <span className="text-green-700 font-medium">Your payment is secured with UPI's encryption</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl border-2 border-blue-200 mb-8">
                        <div className="flex items-center mb-4">
                          <div className="bg-gradient-to-r from-sricblue to-blue-600 text-white p-3 rounded-full mr-4">
                            <i className="fas fa-university text-xl"></i>
                          </div>
                          <h4 className="text-xl font-bold">Bank Transfer Details</h4>
                        </div>
                        
                        <div className="bg-white p-5 rounded-lg border border-blue-300 mb-6">
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="font-semibold text-gray-700">Account Name:</span>
                              <span className="text-sricblue font-bold">Sitaram Inter College</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-semibold text-gray-700">Bank:</span>
                              <span>Prathama U.P Gramin Bank</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-semibold text-gray-700">A/C No:</span>
                              <span className="font-mono">85022137405652</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-semibold text-gray-700">IFSC:</span>
                              <span className="font-mono">PUNB0SUPGB5</span>
                            </div>
                          </div>
                          <p className="mt-4 text-sricblue font-medium">
                            Please send the payment receipt to accounts@sricschool.edu.in after transfer
                          </p>
                        </div>
                        
                        {/* Bank File Upload Section */}
                        <div className="mb-6">
                          <h3 className="text-xl font-bold text-sricblue mb-4">Upload Transfer Receipt</h3>
                          <div 
                            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
                              isBankDragover 
                                ? 'border-sricblue bg-blue-50' 
                                : 'border-gray-300 hover:border-sricblue hover:bg-blue-50'
                            }`}
                            onClick={() => bankFileInputRef.current?.click()}
                            onDragOver={(e) => handleDragOver(e, 'bank')}
                            onDragLeave={(e) => handleDragLeave(e, 'bank')}
                            onDrop={(e) => handleDrop(e, 'bank')}
                          >
                            <input
                              type="file"
                              ref={bankFileInputRef}
                              onChange={(e) => handleFileSelect(e, 'bank')}
                              accept="image/*,.pdf"
                              className="hidden"
                            />
                            <div className="py-4">
                              <i className="fas fa-cloud-upload-alt text-sricblue text-4xl mb-3"></i>
                              <p className="text-gray-600">Click to upload or drag and drop your bank transfer receipt</p>
                              <p className="text-gray-500 text-sm mt-1">PNG, JPG, PDF up to 5MB</p>
                            </div>
                          </div>
                          
                          {bankUploadedFile && (
                            <div className="mt-4 bg-white border border-gray-200 rounded-xl p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <i className="fas fa-file text-sricblue text-xl mr-3"></i>
                                  <div>
                                    <p className="font-medium">{bankUploadedFile.name}</p>
                                    <p className="text-sm text-gray-500">
                                      {(bankUploadedFile.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                  </div>
                                </div>
                                <button
                                  onClick={() => handleRemoveFile('bank')}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <i className="fas fa-times"></i>
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="mt-6">
                          <label className="block text-gray-700 font-medium mb-2">Transaction ID/UTR Number*</label>
                          <input
                            type="text"
                            value={bankTransactionId}
                            onChange={(e) => setBankTransactionId(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sricblue focus:border-transparent transition"
                            placeholder="Enter bank transaction reference"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-8 flex justify-between">
                    <button
                      onClick={handleBackStep}
                      disabled={isSubmitting}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-8 rounded-xl transition duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleNextStep}
                      disabled={isSubmitting}
                      className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-8 rounded-xl transition duration-300 transform hover:scale-105 shadow-lg flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-check-circle mr-2"></i>
                          Confirm Payment
                        </>
                      )}
                    </button>
                  </div>

                  {/* Loading overlay */}
                  {isSubmitting && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                      <div className="bg-white p-8 rounded-xl text-center max-w-sm">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sricblue mx-auto mb-4"></div>
                        <p className="text-lg font-semibold mb-2">Submitting Payment...</p>
                        <p className="text-gray-600 text-sm">Please wait while we save your payment details to the database</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Step 3: Confirmation */}
              {activeStep === 3 && receiptDetails && (
                <div className="bg-white p-8 rounded-2xl shadow-2xl border border-gray-200 text-center">
                  <div className="text-green-500 text-7xl mb-6 animate-bounce">
                    <i className="fas fa-check-circle"></i>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-800 mb-4">Payment Successful!</h3>
                  <p className="text-gray-600 text-lg mb-8">Thank you for your payment. Your transaction has been completed and saved to our database.</p>
                  
                  <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-l-4 border-yellow-400 p-4 mb-8 text-left rounded-lg">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <i className="fas fa-exclamation-triangle text-yellow-500 text-xl mt-1"></i>
                      </div>
                      <div className="ml-3">
                        <p className="text-yellow-800 font-medium">
                          <strong>Important Notice:</strong> You have to submit the hardcopy of this receipt in the school office within 7 days for verification and final approval.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Receipt Preview */}
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl mb-8 border-2 border-blue-200">
                    <div className="text-center mb-6">
                      <div className="text-2xl font-bold text-sricblue">Sitaram Inter College</div>
                      <div className="text-gray-600 text-sm">Sabdalpur Sharki, Mathana Road Hasanpur, Amroha 244242</div>
                      <div className="text-xl font-bold text-sricblue mt-4">FEE PAYMENT RECEIPT</div>
                    </div>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between border-b border-blue-200 pb-2">
                        <span className="text-gray-700">Date:</span>
                        <span className="font-bold text-sricblue">{receiptDetails.date}</span>
                      </div>
                      <div className="flex justify-between border-b border-blue-200 pb-2">
                        <span className="text-gray-700">Receipt No:</span>
                        <span className="font-bold text-sricblue">{receiptDetails.receiptNumber}</span>
                      </div>
                      <div className="flex justify-between border-b border-blue-200 pb-2">
                        <span className="text-gray-700">Transaction ID:</span>
                        <span className="font-bold text-sricblue">{receiptDetails.transactionId}</span>
                      </div>
                      <div className="flex justify-between border-b border-blue-200 pb-2">
                        <span className="text-gray-700">Payment Method:</span>
                        <span className="font-bold text-sricblue">{receiptDetails.paymentMethod}</span>
                      </div>
                      <div className="flex justify-between border-b border-blue-200 pb-2">
                        <span className="text-gray-700">Student Name:</span>
                        <span className="font-bold text-sricblue">{receiptDetails.studentName}</span>
                      </div>
                      <div className="flex justify-between border-b border-blue-200 pb-2">
                        <span className="text-gray-700">Father's Name:</span>
                        <span className="font-bold text-sricblue">{receiptDetails.fatherName}</span>
                      </div>
                      <div className="flex justify-between border-b border-blue-200 pb-2">
                        <span className="text-gray-700">Class:</span>
                        <span className="font-bold text-sricblue">{receiptDetails.className}</span>
                      </div>
                    </div>
                    
                    <div className="text-center pt-4 border-t-2 border-blue-300">
                      <p className="text-gray-600">Total Amount Paid:</p>
                      <div className="text-4xl font-bold bg-gradient-to-r from-sricblue to-blue-600 bg-clip-text text-transparent mt-2">
                        ₹{receiptDetails.amount.toLocaleString('en-IN')}
                      </div>
                    </div>
                    
                    <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <p className="text-yellow-800 text-sm text-center">
                        <strong>Important:</strong> Submit hardcopy to school office within 7 days
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <p className="text-gray-600 mb-4">Payment details have been saved to our database with receipt number: <span className="font-bold text-sricblue">{receiptDetails.receiptNumber}</span></p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                      <button
                        onClick={handlePrintReceipt}
                        className="bg-gradient-to-r from-sricblue to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-8 rounded-xl transition duration-300 transform hover:scale-105 shadow-lg"
                      >
                        <i className="fas fa-print mr-2"></i>
                        Print Receipt
                      </button>
                      <button
                        onClick={handleNewPayment}
                        className="bg-gradient-to-r from-sricgold to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-sricblue font-bold py-3 px-8 rounded-xl transition duration-300 transform hover:scale-105 shadow-lg"
                      >
                        <i className="fas fa-plus-circle mr-2"></i>
                        Make Another Payment
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Floating Notice */}
      {isPaymentActive && (
        <div className="fixed bottom-4 right-4 bg-gradient-to-r from-sricblue to-blue-600 text-white p-4 rounded-xl shadow-2xl max-w-xs z-50">
          <div className="flex items-start">
            <i className="fas fa-info-circle text-xl mr-3 mt-1"></i>
            <div>
              <strong>Important:</strong> Submit hardcopy of receipt to school office within 7 days
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gradient-to-b from-gray-900 to-black text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="bg-gradient-to-br from-sricblue to-blue-900 w-12 h-12 rounded-xl flex items-center justify-center">
                  <span className="text-white text-xl font-bold">SRIC</span>
                </div>
                <h3 className="text-xl font-bold ml-3">SRIC</h3>
              </div>
              <p className="text-gray-400 mb-4">Preparing students for board success since 2002.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition"><i className="fab fa-facebook-f"></i></a>
                <a href="#" className="text-gray-400 hover:text-white transition"><i className="fab fa-twitter"></i></a>
                <a href="#" className="text-gray-400 hover:text-white transition"><i className="fab fa-instagram"></i></a>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4">Contact Us</h4>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <i className="fas fa-map-marker-alt mt-1 mr-3 text-gray-400"></i>
                  <span className="text-gray-400">Sabdalpur Sharki, Mathana Road Hasanpur, Amroha 244242</span>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-phone-alt mr-3 text-gray-400"></i>
                  <span className="text-gray-400">+91 9756517750</span>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-envelope mr-3 text-gray-400"></i>
                  <span className="text-gray-400">sitaramintercollege1205@gmail.com</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-4">School Hours</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Monday - Friday: 8:00 AM - 2:00 PM</li>
                <li>Saturday: 8:00 AM - 12:00 PM</li>
                <li>Sunday: Closed</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-10 pt-6 text-center text-gray-400">
            <p>© 2025 SRIC Senior Secondary School. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Fees;