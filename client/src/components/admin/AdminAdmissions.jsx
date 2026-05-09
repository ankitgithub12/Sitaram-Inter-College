import React from 'react';
import {
  GraduationCap, Download, Eye as EyeIcon, CheckCircle, XCircle, Trash2, X
} from 'lucide-react';

const renderStatusBadge = (status) => {
  const statusConfig = {
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending', icon: null },
    approved: { bg: 'bg-green-100', text: 'text-green-800', label: 'Approved', icon: CheckCircle },
    rejected: { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejected', icon: XCircle }
  };

  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {Icon && <Icon className="w-3 h-3 mr-1" />}
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

const AdminAdmissions = ({ 
  admissionsData, 
  loadAdmissions, 
  handleUpdateStatus, 
  handleDelete,
  viewDetails,
  setViewDetails
}) => {
  
  if (viewDetails) {
    const admission = viewDetails;
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{admission.name}</h3>
            <p className="text-gray-600">{admission.email}</p>
            <div className="mt-2">{renderStatusBadge(admission.status)}</div>
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
              <p><span className="text-gray-500">Date of Birth:</span> {formatDate(admission.dob)}</p>
              <p><span className="text-gray-500">Mother Tongue:</span> {admission.motherTongue}</p>
              <p><span className="text-gray-500">Caste:</span> {admission.caste}</p>
              <p><span className="text-gray-500">Religion:</span> {admission.religion}</p>
              <p><span className="text-gray-500">Previous Class:</span> {admission.previousClass}</p>
              <p><span className="text-gray-500">Admission Class:</span> {admission.admissionClass}</p>
              <p><span className="text-gray-500">Previous School:</span> {admission.previousSchool}</p>
              <p><span className="text-gray-500">Admission Date:</span> {formatDate(admission.admissionDate)}</p>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">Parent Information</h4>
            <div className="space-y-2">
              <p><span className="text-gray-500">Father's Name:</span> {admission.fatherName}</p>
              <p><span className="text-gray-500">Mother's Name:</span> {admission.motherName}</p>
              <p><span className="text-gray-500">Father's Contact:</span> {admission.fatherContact}</p>
              <p><span className="text-gray-500">Mother's Contact:</span> {admission.motherContact || 'N/A'}</p>
              <p><span className="text-gray-500">Occupation:</span> {admission.occupation}</p>
              <p><span className="text-gray-500">Mother's Occupation:</span> {admission.motherOccupation || 'N/A'}</p>
            </div>
            
            <h4 className="font-semibold text-gray-700 mt-6 mb-3">Address</h4>
            <p className="text-gray-600">{admission.address}</p>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Submitted on {formatDateTime(admission.submittedAt)}</p>
              {admission.applicationNumber && (
                <p className="text-sm text-gray-500">Application #: {admission.applicationNumber}</p>
              )}
            </div>
            <div className="space-x-3">
              <button
                onClick={() => handleUpdateStatus('admission', admission._id, 'approved')}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Approve
              </button>
              <button
                onClick={() => handleUpdateStatus('admission', admission._id, 'rejected')}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Reject
              </button>
              <button
                onClick={() => handleDelete('admission', admission._id)}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Delete
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
          <h2 className="text-2xl font-bold text-gray-800">Admission Applications ({admissionsData.length})</h2>
          <div className="flex items-center space-x-3">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-blue-700 transition-colors">
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Table */}
        {admissionsData.length === 0 ? (
          <div className="text-center py-12">
            <GraduationCap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Admissions Found</h3>
            <p className="text-gray-500">No admission applications match your search criteria.</p>
            <button 
              onClick={loadAdmissions}
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
                    Father's Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
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
                {Array.isArray(admissionsData) && admissionsData.map((admission) => (
                  <tr key={admission._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          className="h-10 w-10 rounded-full"
                          src={`https://ui-avatars.com/api/?name=${admission.name}&background=002366&color=fff`}
                          alt={admission.name}
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{admission.name}</div>
                          <div className="text-sm text-gray-500">{admission.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{admission.admissionClass}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{admission.fatherName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {admission.fatherContact}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(admission.submittedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {renderStatusBadge(admission.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button 
                        onClick={() => setViewDetails(admission)}
                        className="text-blue-600 hover:text-sricblue"
                      >
                        <EyeIcon className="w-4 h-4 inline mr-1" /> View
                      </button>
                      {admission.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => handleUpdateStatus('admission', admission._id, 'approved')}
                            className="text-green-600 hover:text-green-900"
                          >
                            <CheckCircle className="w-4 h-4 inline mr-1" /> Approve
                          </button>
                          <button 
                            onClick={() => handleUpdateStatus('admission', admission._id, 'rejected')}
                            className="text-red-600 hover:text-red-900"
                          >
                            <XCircle className="w-4 h-4 inline mr-1" /> Reject
                          </button>
                        </>
                      )}
                      <button 
                        onClick={() => handleDelete('admission', admission._id)}
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

export default AdminAdmissions;
