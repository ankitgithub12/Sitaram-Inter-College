import React from 'react';
import {
  Mail, Download, EyeIcon, Trash2, X
} from 'lucide-react';

const renderStatusBadge = (status) => {
  const statusConfig = {
    unread: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Unread' },
    read: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Read' },
    replied: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Replied' },
    archived: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Archived' }
  };

  const config = statusConfig[status] || statusConfig.unread;
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

const AdminContacts = ({
  contactsData,
  loadContacts,
  handleUpdateStatus,
  handleDelete,
  viewDetails,
  setViewDetails
}) => {
  
  if (viewDetails) {
    const contact = viewDetails;
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{contact.name}</h3>
            <p className="text-gray-600">{contact.email}</p>
            <div className="mt-2">{renderStatusBadge(contact.status)}</div>
          </div>
          <button
            onClick={() => setViewDetails(null)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">Contact Information</h4>
            <div className="space-y-2">
              {contact.phone && <p><span className="text-gray-500">Phone:</span> {contact.phone}</p>}
              <p><span className="text-gray-500">Subject:</span> {contact.subject || 'General Inquiry'}</p>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">Message</h4>
            <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">{contact.message}</p>
          </div>
          
          {contact.responseMessage && (
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Response</h4>
              <p className="text-gray-600 bg-blue-50 p-4 rounded-lg">{contact.responseMessage}</p>
              <p className="text-sm text-gray-500 mt-2">
                Responded on {formatDateTime(contact.respondedAt)} by {contact.respondedBy}
              </p>
            </div>
          )}
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Submitted on {formatDateTime(contact.submittedAt)}</p>
            </div>
            <div className="space-x-3">
              {contact.status !== 'replied' && (
                <button
                  onClick={() => {
                    const response = prompt('Enter your response:');
                    if (response) {
                      handleUpdateStatus('contact', contact._id, 'replied', response);
                    }
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Reply
                </button>
              )}
              <button
                onClick={() => handleUpdateStatus('contact', contact._id, 'archived')}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Archive
              </button>
              <button
                onClick={() => handleDelete('contact', contact._id)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
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
          <h2 className="text-2xl font-bold text-gray-800">Contact Messages ({contactsData.length})</h2>
          <div className="flex items-center space-x-3">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-blue-700 transition-colors">
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {contactsData.length === 0 ? (
          <div className="text-center py-12">
            <Mail className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Contact Messages Found</h3>
            <p className="text-gray-500">No contact messages match your search criteria.</p>
            <button 
              onClick={loadContacts}
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
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Message Preview
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
                {Array.isArray(contactsData) && contactsData.map((contact) => (
                  <tr key={contact._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          className="h-10 w-10 rounded-full"
                          src={`https://ui-avatars.com/api/?name=${contact.name}&background=002366&color=fff`}
                          alt={contact.name}
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{contact.name}</div>
                          {contact.phone && (
                            <div className="text-sm text-gray-500">{contact.phone}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {contact.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{contact.subject || 'General Inquiry'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {contact.message}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(contact.submittedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {renderStatusBadge(contact.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button 
                        onClick={() => setViewDetails(contact)}
                        className="text-blue-600 hover:text-sricblue"
                      >
                        <EyeIcon className="w-4 h-4 inline mr-1" /> View
                      </button>
                      {contact.status === 'unread' && (
                        <button 
                          onClick={() => handleUpdateStatus('contact', contact._id, 'read')}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          <Mail className="w-4 h-4 inline mr-1" /> Mark Read
                        </button>
                      )}
                      <button 
                        onClick={() => handleDelete('contact', contact._id)}
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

export default AdminContacts;
