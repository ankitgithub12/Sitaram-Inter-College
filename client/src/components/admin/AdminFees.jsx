import React from 'react';
import {
  DollarSign, Download, EyeIcon, Check, X, Trash2, File, ImageIcon, FileText, ExternalLink
} from 'lucide-react';

const renderStatusBadge = (status) => {
  const statusConfig = {
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
    verified: { bg: 'bg-green-100', text: 'text-green-800', label: 'Verified' },
    rejected: { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejected' },
    unverified: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending Verification' },
  };

  const config = statusConfig[status] || statusConfig.pending;
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatFileSize = (bytes) => {
  if (!bytes) return 'N/A';
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Byte';
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
};

const AdminFees = ({ 
  feesData, 
  loadFeePayments, 
  handleUpdateStatus, 
  handleDelete,
  viewDetails,
  setViewDetails,
  handleViewImage,
  openExternal,
  getFileUrl,
  handleUploadReceipt
}) => {

  if (viewDetails) {
    const payment = viewDetails;
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{payment.studentName}</h3>
            <p className="text-gray-600">{payment.email}</p>
            <div className="mt-2">{renderStatusBadge(payment.status)}</div>
          </div>
          <button
            onClick={() => setViewDetails(null)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">Student Information</h4>
            <div className="space-y-2">
              <p><span className="text-gray-500">Father's Name:</span> {payment.fatherName}</p>
              <p><span className="text-gray-500">Mobile:</span> {payment.mobile}</p>
              <p><span className="text-gray-500">Class:</span> {payment.className}</p>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">Payment Information</h4>
            <div className="space-y-2">
              <p><span className="text-gray-500">Amount:</span> ₹{payment.amount?.toLocaleString('en-IN') || '0'}</p>
              <p><span className="text-gray-500">Payment Method:</span> {payment.paymentMethod}</p>
              <p><span className="text-gray-500">Transaction ID:</span> {payment.transactionId}</p>
              <p><span className="text-gray-500">Receipt Number:</span> {payment.receiptNumber}</p>
              <p><span className="text-gray-500">Receipt Date:</span> {formatDate(payment.receiptDate)}</p>
            </div>
          </div>
        </div>
        
        {/* Receipt File Section */}
        <div className="mt-8">
          <h4 className="font-semibold text-gray-700 mb-4">Payment Receipt</h4>
          
          {payment.cloudinaryFile ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-white rounded-lg shadow-sm">
                    {payment.cloudinaryFile.resource_type === 'image' ? (
                      <ImageIcon className="w-8 h-8 text-green-600" />
                    ) : (
                      <File className="w-8 h-8 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">
                      {payment.cloudinaryFile.original_filename || 'Payment Receipt'}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                      <span>{formatFileSize(payment.cloudinaryFile.bytes)}</span>
                      <span>•</span>
                      <span>{payment.cloudinaryFile.format?.toUpperCase() || 'Unknown Format'}</span>
                      <span>•</span>
                      <span>{payment.cloudinaryFile.resource_type === 'image' ? 'Image' : 'PDF'}</span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {/* Primary View Button */}
                  {payment.cloudinaryFile.resource_type === 'image' ? (
                    <button
                      onClick={() => handleViewImage(
                        getFileUrl(payment),
                        payment.cloudinaryFile?.original_filename || 'Receipt'
                      )}
                      className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-2.5 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-105 shadow-md flex items-center space-x-2"
                    >
                      <EyeIcon className="w-5 h-5" />
                      <span>View Screenshot</span>
                    </button>
                    ) : (
                    <button
                      onClick={() => openExternal(payment)}
                      className="bg-gradient-to-r from-red-600 to-red-700 text-white px-5 py-2.5 rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 transform hover:scale-105 shadow-md flex items-center space-x-2"
                    >
                      <File className="w-5 h-5" />
                      <span>Open PDF</span>
                    </button>
                  )}
                  
                  {/* External Link Button */}
                  <button
                    onClick={() => openExternal(payment)}
                    className="bg-gray-100 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-200 transition-all duration-200 border border-gray-300 flex items-center space-x-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span className="text-sm">Open New Tab</span>
                  </button>
                </div>
              </div>
              
              {/* Image Preview Thumbnail */}
              {payment.cloudinaryFile.resource_type === 'image' && (
                <div className="bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-colors duration-300">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="font-medium text-gray-700">Screenshot Preview</h5>
                    <button
                      onClick={() => handleViewImage(
                        getFileUrl(payment),
                        payment.cloudinaryFile?.original_filename || 'Receipt'
                      )}
                      className="text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                    >
                      <span>Full Screen</span>
                    </button>
                  </div>
                  <div 
                    className="relative w-full h-64 bg-gray-50 rounded-lg overflow-hidden cursor-pointer group"
                      onClick={() => handleViewImage(
                        getFileUrl(payment),
                        payment.cloudinaryFile?.original_filename || 'Receipt'
                      )}
                  >
                    <img
                      src={getFileUrl(payment)}
                      alt={`Receipt screenshot for ${payment.studentName}`}
                      className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%239CA3AF' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'%3E%3C/circle%3E%3Cpolyline points='21 15 16 10 5 21'%3E%3C/polyline%3E%3C/svg%3E";
                      }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <EyeIcon className="w-10 h-10 text-white drop-shadow-lg" />
                      </div>
                    </div>
                  </div>
                  {payment.cloudinaryFile.width && payment.cloudinaryFile.height && (
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      Original Resolution: {payment.cloudinaryFile.width} × {payment.cloudinaryFile.height}px
                    </p>
                  )}
                </div>
              )}
            </div>
          ) : payment.receiptFile ? (
            // Fallback for older local storage files
            <div className="mt-6 bg-gradient-to-r from-yellow-50 to-yellow-100 p-6 rounded-xl border border-yellow-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <FileText className="w-8 h-8 text-yellow-600" />
                  <div>
                    <p className="font-bold text-gray-900">Legacy Receipt File</p>
                    <p className="text-sm text-gray-600 mt-1">{payment.receiptFile.originalName}</p>
                  </div>
                </div>
                <a
                  href={payment.receiptFile.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-5 py-2.5 rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 transform hover:scale-105 shadow-md flex items-center space-x-2"
                >
                  <FileText className="w-5 h-5" />
                  <span>View File</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="mt-6 p-6 bg-gradient-to-r from-red-50 to-red-100 rounded-xl border border-red-200">
              <div className="flex items-start space-x-4">
                <FileText className="w-8 h-8 text-red-600" />
                <div className="flex-1">
                  <p className="font-bold text-red-800">No receipt file attached to this payment.</p>
                  <p className="text-sm text-red-600 mt-1">The user did not upload any payment screenshot.</p>
  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">Upload Receipt (admin)</label>
                    <div className="mt-2 flex items-center space-x-2">
                      <input id={`receipt-input-${payment._id}`} type="file" accept="image/*,application/pdf" className="text-sm" />
                      <button
                        onClick={async () => {
                          const input = document.getElementById(`receipt-input-${payment._id}`);
                          if (!input || !input.files || input.files.length === 0) {
                            alert('Please select a file first');
                            return;
                          }
                          const file = input.files[0];
                          await handleUploadReceipt(payment._id, file);
                        }}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Upload Receipt
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Accepted: JPG, PNG, WebP, GIF, PDF. Max 10MB.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Submitted on {formatDateTime(payment.submittedAt)}</p>
              {payment.verifiedAt && (
                <p className="text-sm text-gray-500">
                  Verified on {formatDateTime(payment.verifiedAt)} by {payment.verifiedBy || 'Admin'}
                </p>
              )}
            </div>
            <div className="space-x-3">
              <button
                onClick={() => handleUpdateStatus('fee', payment._id, 'verified')}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-colors flex items-center space-x-2 inline-flex"
              >
                <Check className="w-4 h-4" />
                <span>Verify</span>
              </button>
              <button
                onClick={() => handleUpdateStatus('fee', payment._id, 'rejected')}
                className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-red-700 transition-colors flex items-center space-x-2 inline-flex"
              >
                <X className="w-4 h-4" />
                <span>Reject</span>
              </button>
              <button
                onClick={() => handleDelete('fee', payment._id)}
                className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-4 py-2 rounded-lg hover:from-gray-600 hover:to-gray-700 transition-colors flex items-center space-x-2 inline-flex"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
          <h2 className="text-2xl font-bold text-gray-800">Fee Payments ({feesData.length})</h2>
          <div className="flex items-center space-x-3">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-blue-700 transition-colors">
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {feesData.length === 0 ? (
          <div className="text-center py-12">
            <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Fee Payments Found</h3>
            <p className="text-gray-500">No fee payments match your search criteria.</p>
            <button 
              onClick={loadFeePayments}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Refresh Data
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Class
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Receipt #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    File Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Array.isArray(feesData) && feesData.map((payment) => (
                  <tr key={payment._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          className="h-10 w-10 rounded-full"
                          src={`https://ui-avatars.com/api/?name=${payment.studentName}&background=002366&color=fff`}
                          alt={payment.studentName}
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{payment.studentName}</div>
                          <div className="text-sm text-gray-500">{payment.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{payment.className}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">₹{payment.amount?.toLocaleString('en-IN') || '0'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {payment.receiptNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {payment.cloudinaryFile ? (
                        <div className="flex items-center space-x-1">
                          {payment.cloudinaryFile.resource_type === 'image' ? (
                            <>
                              <ImageIcon className="w-4 h-4 text-green-600" />
                              <span className="text-xs text-gray-600">Image</span>
                            </>
                          ) : (
                            <>
                              <File className="w-4 h-4 text-red-600" />
                              <span className="text-xs text-gray-600">PDF</span>
                            </>
                          )}
                          <span className="text-xs text-gray-400 ml-1">☁️</span>
                        </div>
                      ) : payment.receiptFile ? (
                        <div className="flex items-center space-x-1">
                          <FileText className="w-4 h-4 text-blue-600" />
                          <span className="text-xs text-gray-600">File</span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">No file</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(payment.receiptDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {renderStatusBadge(payment.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button 
                        onClick={() => setViewDetails(payment)}
                        className="text-blue-600 hover:text-sricblue"
                      >
                        <EyeIcon className="w-4 h-4 inline mr-1" /> View
                      </button>
                      {payment.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => handleUpdateStatus('fee', payment._id, 'verified')}
                            className="text-green-600 hover:text-green-900"
                          >
                            <Check className="w-4 h-4 inline mr-1" /> Verify
                          </button>
                          <button 
                            onClick={() => handleUpdateStatus('fee', payment._id, 'rejected')}
                            className="text-red-600 hover:text-red-900"
                          >
                            <X className="w-4 h-4 inline mr-1" /> Reject
                          </button>
                        </>
                      )}
                      <button 
                        onClick={() => handleDelete('fee', payment._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4 inline mr-1" /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminFees;
