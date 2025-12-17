import React, { useState, useEffect } from 'react';

// Custom Alert Component
const CustomAlert = ({ type = 'info', title, message, onConfirm, onCancel, confirmText = 'OK', cancelText = 'Cancel', showCancel = false, children }) => {
  const getAlertStyle = () => {
    switch (type) {
      case 'success':
        return { icon: '✅', color: '#10b981', bgColor: '#d1fae5', borderColor: '#059669' };
      case 'error':
        return { icon: '❌', color: '#ef4444', bgColor: '#fee2e2', borderColor: '#dc2626' };
      case 'warning':
        return { icon: '⚠️', color: '#f59e0b', bgColor: '#fef3c7', borderColor: '#d97706' };
      case 'confirm':
        return { icon: '❓', color: '#3b82f6', bgColor: '#dbeafe', borderColor: '#2563eb' };
      case 'prompt':
        return { icon: '✏️', color: '#8b5cf6', bgColor: '#ede9fe', borderColor: '#7c3aed' };
      default:
        return { icon: 'ℹ️', color: '#3b82f6', bgColor: '#dbeafe', borderColor: '#2563eb' };
    }
  };

  const style = getAlertStyle();

  return (
    <div className="custom-alert-overlay" onClick={showCancel ? undefined : onConfirm}>
      <div className="custom-alert-box" onClick={(e) => e.stopPropagation()}>
        <div className="alert-icon" style={{ backgroundColor: style.bgColor, color: style.color }}>
          <span>{style.icon}</span>
        </div>
        
        {title && <h3 className="alert-title">{title}</h3>}
        
        <div className="alert-message">
          {children || message.split('\n').map((line, idx) => (
            <p key={idx}>{line}</p>
          ))}
        </div>
        
        <div className="alert-actions">
          {showCancel && (
            <button className="alert-button cancel" onClick={onCancel}>
              {cancelText}
            </button>
          )}
          <button className="alert-button confirm" onClick={onConfirm} style={{ backgroundColor: style.color }}>
            {confirmText}
          </button>
        </div>
      </div>

      <style jsx>{`
        .custom-alert-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          animation: fadeIn 0.2s ease-in;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideIn {
          from {
            transform: translateY(-20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .custom-alert-box {
          background: white;
          border-radius: 12px;
          padding: 30px;
          max-width: 450px;
          width: 90%;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          animation: slideIn 0.3s ease-out;
          text-align: center;
        }

        .alert-icon {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          font-size: 32px;
        }

        .alert-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 15px 0;
        }

        .alert-message {
          color: #6b7280;
          font-size: 1rem;
          line-height: 1.6;
          margin-bottom: 25px;
        }

        .alert-message p {
          margin: 8px 0;
        }

        .alert-actions {
          display: flex;
          gap: 12px;
          justify-content: center;
        }

        .alert-button {
          padding: 12px 28px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
          min-width: 100px;
        }

        .alert-button.cancel {
          background: #f3f4f6;
          color: #6b7280;
        }

        .alert-button.cancel:hover {
          background: #e5e7eb;
        }

        .alert-button.confirm {
          color: white;
        }

        .alert-button.confirm:hover {
          opacity: 0.9;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
      `}</style>
    </div>
  );
};

// Hook for custom alerts
const useCustomAlert = () => {
  const [alertConfig, setAlertConfig] = useState(null);

  const showAlert = (config) => {
    return new Promise((resolve) => {
      setAlertConfig({
        ...config,
        onConfirm: () => {
          setAlertConfig(null);
          if (config.onConfirm) config.onConfirm();
          resolve(config.promptValue || true);
        },
        onCancel: () => {
          setAlertConfig(null);
          if (config.onCancel) config.onCancel();
          resolve(false);
        }
      });
    });
  };

  const alert = (message, title = '') => showAlert({ type: 'info', title, message });
  const success = (message, title = 'Success') => showAlert({ type: 'success', title, message });
  const error = (message, title = 'Error') => showAlert({ type: 'error', title, message });
  const warning = (message, title = 'Warning') => showAlert({ type: 'warning', title, message });
  const confirm = (message, title = 'Confirm') => showAlert({ 
    type: 'confirm', 
    title, 
    message,
    confirmText: 'Yes',
    cancelText: 'No',
    showCancel: true
  });

  const prompt = (message, title = 'Input Required', defaultValue = '') => {
    let inputValue = defaultValue;
    return showAlert({
      type: 'prompt',
      title,
      message: '',
      confirmText: 'Submit',
      cancelText: 'Cancel',
      showCancel: true,
      promptValue: () => inputValue,
      children: (
        <div>
          <p style={{ marginBottom: '15px', color: '#6b7280' }}>{message}</p>
          <textarea
            defaultValue={defaultValue}
            onChange={(e) => inputValue = e.target.value}
            placeholder="Enter your input here..."
            rows={4}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '14px',
              fontFamily: 'inherit',
              resize: 'vertical'
            }}
            onFocus={(e) => e.target.style.borderColor = '#8b5cf6'}
            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
          />
        </div>
      )
    });
  };

  const AlertComponent = alertConfig ? <CustomAlert {...alertConfig} /> : null;

  return { alert, success, error, warning, confirm, prompt, AlertComponent };
};

const HotelApproval = () => {
  const { alert, success, error, warning, confirm, prompt, AlertComponent } = useCustomAlert();
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [pendingHotels, setPendingHotels] = useState([]);
  const [approvedHotels, setApprovedHotels] = useState([]);
  const [rejectedHotels, setRejectedHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageForm, setMessageForm] = useState({ subject: '', message: '', adminEmail: 'notifications@sshotels.in' });
  const [sendingMessage, setSendingMessage] = useState(false);

  const API_BASE_URL = 'http://localhost:8000/api/admin';

  const fetchHotels = async (status) => {
    try {
      const response = await fetch(`${API_BASE_URL}/hotels?status=${status}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const result = await response.json();
      if (result.success) return result.hotels;
      throw new Error(result.message || 'Failed to fetch data');
    } catch (err) {
      console.error(`Error fetching ${status} hotels:`, err);
      throw err;
    }
  };

  const loadAllHotels = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const [pending, approved, rejected] = await Promise.all([
        fetchHotels('pending'),
        fetchHotels('approved'),
        fetchHotels('rejected')
      ]);
      setPendingHotels(pending);
      setApprovedHotels(approved);
      setRejectedHotels(rejected);
    } catch (err) {
      console.error('Error loading hotels:', err);
      setErrorMsg('Failed to load hotels. Please check if the backend server is running on port 8000.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllHotels();
  }, []);

  const handleApprove = async (hotel) => {
    if (!window.confirm(`Are you sure you want to approve ${hotel.hotelName}?\n\nThis will:\n- Change status to "Approved"\n- Send approval email to partner\n- Make the hotel live on the platform`)) {
      return;
    }

    try {
      console.log('Approving hotel:', hotel.id);
      const url = `${API_BASE_URL}/hotels/${hotel.id}/status`;
      console.log('Request URL:', url);
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'approved' })
      });

      console.log('Response status:', response.status);
      const result = await response.json();
      console.log('Response data:', result);

      if (response.ok && result.success) {
        await loadAllHotels();
        setSelectedHotel(null);
        alert(`✅ Hotel "${hotel.hotelName}" approved successfully!\n\n✉️ Approval email sent to ${hotel.partner.email}`);
      } else {
        alert('❌ Error approving hotel: ' + (result.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Approval error:', error);
      alert('❌ Error approving hotel: ' + error.message + '\n\nPlease check if the backend server is running on port 8000.');
    }
  };

  // Function to render hotel images
const renderHotelImages = (images) => {
  // Debug: Log the images object to see its structure
  console.log('Images object:', images);
  
  if (!images || typeof images !== 'object' || Object.keys(images).length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af' }}>
        <p>📷 No images uploaded</p>
      </div>
    );
  }

  const imageCategories = [
    { key: 'exterior', label: '🏢 Exterior Photos' },
    { key: 'lobby', label: '🛋️ Lobby Photos' },
    { key: 'rooms', label: '🛏️ Room Photos' },
    { key: 'washroom', label: '🚿 Washroom Photos' },
    { key: 'other', label: '📸 Other Photos' }
  ];

  // Check if any images exist at all
  const hasAnyImages = imageCategories.some(category => {
    const categoryImages = images[category.key];
    return categoryImages && Array.isArray(categoryImages) && categoryImages.length > 0;
  });

  if (!hasAnyImages) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af' }}>
        <p>📷 No images uploaded</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {imageCategories.map(category => {
        const categoryImages = images[category.key];
        
        // Debug: Log each category
        console.log(`${category.label}:`, categoryImages);
        
        // Check if categoryImages exists and is an array
        if (!categoryImages || !Array.isArray(categoryImages) || categoryImages.length === 0) {
          return null;
        }

        return (
          <div key={category.key} style={{ marginBottom: '1rem' }}>
            <h5 style={{ 
              fontSize: '1rem', 
              fontWeight: '600', 
              color: '#374151', 
              marginBottom: '0.75rem',
              paddingBottom: '0.5rem',
              borderBottom: '2px solid #e5e7eb'
            }}>
              {category.label} ({categoryImages.length})
            </h5>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '1rem'
            }}>
              {categoryImages.map((img, idx) => (
                <div key={idx} style={{ 
                  position: 'relative',
                  borderRadius: '0.5rem',
                  overflow: 'hidden',
                  border: '1px solid #e5e7eb',
                  backgroundColor: '#f9fafb',
                  aspectRatio: '4/3'
                }}>
                  <img 
                    src={img} 
                    alt={`${category.label} ${idx + 1}`}
                    style={{ 
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      cursor: 'pointer',
                      transition: 'transform 0.2s'
                    }}
                    onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                    onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                    onClick={() => window.open(img, '_blank')}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = `
                        <div style="
                          display: flex;
                          align-items: center;
                          justify-content: center;
                          height: 100%;
                          color: #9ca3af;
                          font-size: 0.875rem;
                        ">
                          ❌ Image failed to load
                        </div>
                      `;
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    bottom: '0.5rem',
                    right: '0.5rem',
                    background: 'rgba(0, 0, 0, 0.6)',
                    color: 'white',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.25rem',
                    fontSize: '0.75rem',
                    fontWeight: '500'
                  }}>
                    #{idx + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

  const handleReject = async (hotel) => {
    const reason = await prompt(
      'Enter rejection reason:\n\n(This will be sent to the partner via email)',
      'Reject Hotel'
    );
    
    if (!reason || reason.trim() === '') {
      await warning('Rejection cancelled. Reason is required.', 'Cancelled');
      return;
    }

    const confirmed = await confirm(
      `Are you sure you want to reject ${hotel.hotelName}?\n\nReason: ${reason}\n\nThis will send a rejection email to the partner.`,
      'Confirm Rejection'
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`${API_BASE_URL}/hotels/${hotel.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected', reason: reason.trim() })
      });

      const result = await response.json();

      if (result.success) {
        await loadAllHotels();
        setSelectedHotel(null);
        await success(
          `Hotel "${hotel.hotelName}" rejected.\n\nRejection email with reason sent to ${hotel.partner.email}`,
          'Hotel Rejected'
        );
      } else {
        await error('Error rejecting hotel: ' + result.message, 'Rejection Failed');
      }
    } catch (err) {
      console.error('Rejection error:', err);
      await error('Error rejecting hotel. Please try again.', 'Rejection Failed');
    }
  };

  const handleSendMessage = (hotel) => {
    setSelectedHotel(hotel);
    setShowMessageModal(true);
    setMessageForm({ 
      subject: `Important Update: ${hotel.hotelName}`, 
      message: '', 
      adminEmail: 'notifications@sshhotels.in' 
    });
  };

  const submitMessage = async () => {
    if (!messageForm.subject || !messageForm.message) {
      await warning('Please fill in both subject and message', 'Missing Information');
      return;
    }

    const confirmed = await confirm(
      `Send this message to ${selectedHotel.partner.ownerName}?\n\nSubject: ${messageForm.subject}\n\nThe partner can reply to: ${messageForm.adminEmail}`,
      'Send Message'
    );

    if (!confirmed) return;

    setSendingMessage(true);

    try {
      const response = await fetch(`${API_BASE_URL}/hotels/${selectedHotel.id}/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageForm)
      });

      const result = await response.json();

      if (result.success) {
        await success(
          `Message sent successfully!\n\nEmail sent to ${selectedHotel.partner.email}\nPartner can reply to ${messageForm.adminEmail}`,
          'Message Sent'
        );
        setShowMessageModal(false);
        setMessageForm({ subject: '', message: '', adminEmail: 'notifications@sshhotels.in' });
      } else {
        await error('Error sending message: ' + result.message, 'Send Failed');
      }
    } catch (err) {
      console.error('Message sending error:', err);
      await error('Error sending message. Please try again.', 'Send Failed');
    } finally {
      setSendingMessage(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderAmenities = (amenities) => {
    if (!amenities || typeof amenities !== 'object') return 'None specified';
    const amenityList = Object.entries(amenities)
      .filter(([_, value]) => value === true)
      .map(([key, _]) => key.replace(/([A-Z])/g, ' $1').trim());
    return amenityList.length > 0 ? amenityList.join(', ') : 'None specified';
  };

 // Replace your renderRoomPricing function with this:

const renderRoomPricing = (roomTypes) => {
  console.log('🔍 renderRoomPricing called with:', roomTypes);
  
  if (!roomTypes || roomTypes.length === 0) {
    return <p style={{ color: '#9ca3af', fontStyle: 'italic' }}>No room types specified</p>;
  }

  // Mapping for display names
  const rateDisplayNames = {
    threeHours: '3 Hours',
    sixHours: '6 Hours',
    nineHours: '9 Hours',
    twelveHours: '12 Hours',
    twentyFourHours: '24 Hours',
    oneDay: '1 Day',
    fiveDays: '5 Days',
    tenDays: '10 Days',
    oneMonth: '1 Month'
  };

  return roomTypes.map((room, idx) => {
    console.log(`\n📦 Processing room ${idx}:`, room);
    
    // The backend already normalizes the data, so room should be an object
    const roomData = room;
    console.log('📋 Room data:', roomData);
    
    // Get rates directly from roomData.rates
    const rates = roomData?.rates || {};
    console.log('💰 Rates found:', rates);
    
    const hasRates = rates && typeof rates === 'object' && 
                     Object.values(rates).some(price => price && parseFloat(price) > 0);
    
    console.log('✅ Has rates?', hasRates);

    // Categorize rates into hourly and daily
    const hourlyRates = {
      threeHours: rates.threeHours,
      sixHours: rates.sixHours,
      nineHours: rates.nineHours,
      twelveHours: rates.twelveHours,
      twentyFourHours: rates.twentyFourHours
    };

    const dailyRates = {
      oneDay: rates.oneDay,
      fiveDays: rates.fiveDays,
      tenDays: rates.tenDays,
      oneMonth: rates.oneMonth
    };

    const hasHourlyRates = Object.values(hourlyRates).some(p => p && parseFloat(p) > 0);
    const hasDailyRates = Object.values(dailyRates).some(p => p && parseFloat(p) > 0);
    
    console.log('⏰ Has hourly rates?', hasHourlyRates, hourlyRates);
    console.log('📅 Has daily rates?', hasDailyRates, dailyRates);

    return (
      <div key={idx} className="room-pricing-section">
        <h5>{roomData?.name || `Room Type ${idx + 1}`}</h5>
        
        {/* Room Count */}
        {roomData?.count && (
          <p className="room-count-info">
            <strong>Available Rooms:</strong> {roomData.count} {roomData.count === 1 ? 'Room' : 'Rooms'}
          </p>
        )}
        
        {/* Extra Guest Charge */}
        {roomData?.extraGuestCharge > 0 && (
          <p className="extra-guest-info">
            <strong>Extra Guest Charge:</strong> ₹{parseFloat(roomData.extraGuestCharge).toLocaleString('en-IN')} per guest
          </p>
        )}

        {/* Room Amenities */}
        {roomData?.roomAmenities && roomData.roomAmenities.length > 0 && (
          <div className="room-amenities-info">
            <strong>Room Amenities:</strong>
            <div className="amenities-tags">
              {roomData.roomAmenities.map((amenity, i) => (
                <span key={i} className="amenity-tag">{amenity}</span>
              ))}
            </div>
          </div>
        )}

        {hasRates ? (
          <table className="room-types-table">
            <thead>
              <tr>
                <th>Rate Type</th>
                <th>Duration</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {/* Hourly Rates */}
              {hasHourlyRates && Object.entries(hourlyRates)
                .filter(([_, price]) => price && parseFloat(price) > 0)
                .map(([key, price]) => (
                  <tr key={`hourly-${key}`}>
                    <td><span className="rate-type">Hourly</span></td>
                    <td>{rateDisplayNames[key]}</td>
                    <td className="price-cell">₹{parseFloat(price).toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              
              {/* Daily/Extended Rates */}
              {hasDailyRates && Object.entries(dailyRates)
                .filter(([_, price]) => price && parseFloat(price) > 0)
                .map(([key, price]) => (
                  <tr key={`daily-${key}`}>
                    <td><span className="rate-type daily">Extended</span></td>
                    <td>{rateDisplayNames[key]}</td>
                    <td className="price-cell">₹{parseFloat(price).toLocaleString('en-IN')}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        ) : (
          <div className="no-pricing-message">
            <svg width="20" height="20" fill="none" stroke="#9ca3af" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>No pricing information provided for this room type</span>
          </div>
        )}
      </div>
    );
  });
};

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading hotel registrations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {AlertComponent}
      
      <div className="page-header">
        <div>
          <h2>Hotel Approval System</h2>
          <p>Review and approve hotel registration requests</p>
        </div>
        <button onClick={loadAllHotels} className="btn-refresh">
          Refresh
        </button>
      </div>

      {errorMsg && (
        <div className="error-banner">
          ❌ {errorMsg}
          <button onClick={loadAllHotels} className="retry-button">
            Retry
          </button>
        </div>
      )}

      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'pending' ? 'active' : ''}`} 
          onClick={() => setActiveTab('pending')}
        >
          Pending ({pendingHotels.length})
        </button>
        <button 
          className={`tab ${activeTab === 'approved' ? 'active' : ''}`} 
          onClick={() => setActiveTab('approved')}
        >
          Approved ({approvedHotels.length})
        </button>
        <button 
          className={`tab ${activeTab === 'rejected' ? 'active' : ''}`} 
          onClick={() => setActiveTab('rejected')}
        >
          Rejected ({rejectedHotels.length})
        </button>
      </div>

      {activeTab === 'pending' && (
        <div className="hotels-grid">
          {pendingHotels.map(hotel => (
            <div key={hotel.id} className="hotel-card">
              <div className="hotel-card-header">
                <h3>{hotel.hotelName}</h3>
                <span className="badge-pending">Pending</span>
              </div>
              <div className="hotel-info">
                <p><strong>Property Type:</strong> {hotel.propertyType}</p>
                <p><strong>Location:</strong> {hotel.city}</p>
                <p><strong>Total Rooms:</strong> {hotel.totalRooms}</p>
                <p><strong>SSH Rooms:</strong> {hotel.sshRooms}</p>
                <p><strong>Owner:</strong> {hotel.partner.ownerName}</p>
                <p><strong>Contact:</strong> {hotel.partner.mobile}</p>
                <p><strong>Email:</strong> {hotel.partner.email}</p>
                <p><strong>Submitted:</strong> {formatDate(hotel.createdAt)}</p>
              </div>
              <div className="hotel-actions">
                <button className="btn-view" onClick={() => setSelectedHotel(hotel)}>
                  View Details
                </button>
                <button className="btn-message" onClick={() => handleSendMessage(hotel)}>
                  Send Message
                </button>
                <button className="btn-approve" onClick={() => handleApprove(hotel)}>
                  Approve
                </button>
                <button className="btn-reject" onClick={() => handleReject(hotel)}>
                  Reject
                </button>
              </div>
            </div>
          ))}
          {pendingHotels.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <h3>No pending registrations</h3>
              <p>All hotel applications have been processed</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'approved' && (
        <div className="hotels-list">
          {approvedHotels.map(hotel => (
            <div key={hotel.id} className="hotel-list-item">
              <div>
                <h3>{hotel.hotelName}</h3>
                <p>{hotel.city} • {hotel.propertyType}</p>
                <p className="text-sm">Owner: {hotel.partner.ownerName} • {hotel.partner.mobile}</p>
                <p className="text-sm">Email: {hotel.partner.email}</p>
                <p className="text-sm">Approved: {formatDate(hotel.approvalDate)}</p>
              </div>
              <div className="hotel-list-meta">
                <span className="badge-approved">Approved</span>
                <button className="btn-view-small" onClick={() => setSelectedHotel(hotel)}>
                  View Details
                </button>
              </div>
            </div>
          ))}
          {approvedHotels.length === 0 && (
            <div className="empty-state">
              <h3>No approved hotels yet</h3>
              <p>Approved hotels will appear here</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'rejected' && (
        <div className="hotels-list">
          {rejectedHotels.map(hotel => (
            <div key={hotel.id} className="hotel-list-item">
              <div>
                <h3>{hotel.hotelName}</h3>
                <p>{hotel.city} • {hotel.propertyType}</p>
                <p className="text-sm">Owner: {hotel.partner.ownerName}</p>
                <p className="text-sm">Email: {hotel.partner.email}</p>
                {hotel.rejectionReason && (
                  <p className="rejection-reason">Reason: {hotel.rejectionReason}</p>
                )}
                <p className="text-sm">Submitted: {formatDate(hotel.createdAt)}</p>
              </div>
              <div className="hotel-list-meta">
                <span className="badge-rejected">Rejected</span>
                <button className="btn-view-small" onClick={() => setSelectedHotel(hotel)}>
                  View Details
                </button>
              </div>
            </div>
          ))}
          {rejectedHotels.length === 0 && (
            <div className="empty-state">
              <h3>No rejected applications</h3>
              <p>Rejected applications will appear here</p>
            </div>
          )}
        </div>
      )}

      {/* Hotel Details Modal */}
      {selectedHotel && !showMessageModal && (
        <div className="modal-overlay" onClick={() => setSelectedHotel(null)}>
          <div className="modal-content large-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedHotel.hotelName}</h3>
              <button onClick={() => setSelectedHotel(null)} className="close-button">
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="modal-body">
              {/* Partner Information */}
              <div className="detail-section">
                <h4>Partner Information</h4>
                <table className="info-table">
                  <tbody>
                    <tr>
                      <td><strong>Property Name:</strong></td>
                      <td>{selectedHotel.partner.propertyName}</td>
                    </tr>
                    <tr>
                      <td><strong>Owner Name:</strong></td>
                      <td>{selectedHotel.partner.ownerName}</td>
                    </tr>
                    <tr>
                      <td><strong>Email:</strong></td>
                      <td>{selectedHotel.partner.email}</td>
                    </tr>
                    <tr>
                      <td><strong>Mobile:</strong></td>
                      <td>{selectedHotel.partner.mobile}</td>
                    </tr>
                    <tr>
                      <td><strong>City:</strong></td>
                      <td>{selectedHotel.partner.city || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td><strong>State:</strong></td>
                      <td>{selectedHotel.partner.state || 'N/A'}</td>
                    </tr>
                    {selectedHotel.partner.address && (
                      <tr>
                        <td><strong>Address:</strong></td>
                        <td>{selectedHotel.partner.address}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Hotel Information */}
              <div className="detail-section">
                <h4>Hotel Information</h4>
                <table className="info-table">
                  <tbody>
                    <tr>
                      <td><strong>Hotel Name:</strong></td>
                      <td>{selectedHotel.hotelName}</td>
                    </tr>
                    <tr>
                      <td><strong>Property Type:</strong></td>
                      <td>{selectedHotel.propertyType}</td>
                    </tr>
                    <tr>
                      <td><strong>City:</strong></td>
                      <td>{selectedHotel.city}</td>
                    </tr>
                    <tr>
                      <td><strong>Address:</strong></td>
                      <td>{selectedHotel.address}</td>
                    </tr>
                    <tr>
                      <td><strong>Total Rooms:</strong></td>
                      <td>{selectedHotel.totalRooms}</td>
                    </tr>
                    <tr>
                      <td><strong>SSH Rooms:</strong></td>
                      <td>{selectedHotel.sshRooms}</td>
                    </tr>
                    <tr>
                      <td><strong>Check-in Time:</strong></td>
                      <td>{selectedHotel.checkInTime || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td><strong>Check-out Time:</strong></td>
                      <td>{selectedHotel.checkOutTime || 'N/A'}</td>
                    </tr>
                    {selectedHotel.description && (
                      <tr>
                        <td><strong>Description:</strong></td>
                        <td>{selectedHotel.description}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Contact Information */}
              <div className="detail-section">
                <h4>Contact Details</h4>
                <table className="info-table">
                  <tbody>
                    <tr>
                      <td><strong>Contact Person:</strong></td>
                      <td>{selectedHotel.ownerName}</td>
                    </tr>
                    <tr>
                      <td><strong>Phone:</strong></td>
                      <td>{selectedHotel.contactPhone || selectedHotel.ownerContact}</td>
                    </tr>
                    <tr>
                      <td><strong>Email:</strong></td>
                      <td>{selectedHotel.contactEmail}</td>
                    </tr>
                    {selectedHotel.contactAddress && (
                      <tr>
                        <td><strong>Address:</strong></td>
                        <td>{selectedHotel.contactAddress}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Amenities */}
              <div className="detail-section">
                <h4>Amenities</h4>
                <p>{renderAmenities(selectedHotel.amenities)}</p>
                {selectedHotel.customAmenities && selectedHotel.customAmenities.length > 0 && (
                  <>
                    <p><strong>Custom Amenities:</strong></p>
                    <p>{selectedHotel.customAmenities.join(', ')}</p>
                  </>
                )}
              </div>

              {/* Policies */}
              <div className="detail-section">
                <h4>Policies</h4>
                <table className="info-table">
                  <tbody>
                    <tr>
                      <td><strong>Cancellation Policy:</strong></td>
                      <td>{selectedHotel.cancellationPolicy}</td>
                    </tr>
                    <tr>
                      <td><strong>Refund Policy:</strong></td>
                      <td>{selectedHotel.refundPolicy}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="detail-section">
  <h4>Property Images</h4>
  {renderHotelImages(selectedHotel.images)}
</div>

{selectedHotel.roomTypes && selectedHotel.roomTypes.length > 0 && (
  <div className="detail-section">
    <h4>Room Types & Pricing</h4>
    
    {selectedHotel.roomTypes.map((room, idx) => {
      // Handle both old (string) and new (object) data formats
      let roomData;
      try {
        // If it's a string (old double-stringified data), parse it
        roomData = typeof room === 'string' ? JSON.parse(room) : room;
      } catch (e) {
        console.error('Error parsing room data:', e);
        roomData = room;
      }
      
      // Check if we have valid pricing data
      const hasHourlyRates = roomData?.hourlyRates && 
        typeof roomData.hourlyRates === 'object' &&
        Object.values(roomData.hourlyRates).some(p => p && parseInt(p) > 0);
        
      const hasDailyRates = roomData?.dailyRates && 
        typeof roomData.dailyRates === 'object' &&
        Object.values(roomData.dailyRates).some(p => p && parseInt(p) > 0);
        
      const hasOldPrice = roomData?.price && parseInt(roomData.price) > 0;
      const hasPricing = hasHourlyRates || hasDailyRates || hasOldPrice;
      
      return (
        <div key={idx} className="room-pricing-section">
          <h5>{roomData?.name || `Room Type ${idx + 1}`}</h5>
          
          {/* Capacity */}
          {roomData?.capacity && (
            <p className="room-capacity-info">
              <strong>Capacity:</strong> {roomData.capacity} {roomData.capacity === 1 ? 'Person' : 'People'}
            </p>
          )}
          
          {hasPricing ? (
            <table className="room-types-table">
              <thead>
                <tr>
                  <th>Duration Type</th>
                  <th>Duration</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {/* Hourly Rates */}
                {hasHourlyRates && Object.entries(roomData.hourlyRates)
                  .filter(([_, price]) => price && parseInt(price) > 0)
                  .map(([hours, price]) => {
                    const priceNum = parseInt(price);
                    return (
                      <tr key={`hourly-${hours}`}>
                        <td><span className="rate-type">Hourly</span></td>
                        <td>{hours} {parseInt(hours) === 1 ? 'Hour' : 'Hours'}</td>
                        <td className="price-cell">₹{priceNum.toLocaleString('en-IN')}</td>
                      </tr>
                    );
                  })}
                
                {/* Daily Rates */}
                {hasDailyRates && Object.entries(roomData.dailyRates)
                  .filter(([_, price]) => price && parseInt(price) > 0)
                  .map(([days, price]) => {
                    const priceNum = parseInt(price);
                    return (
                      <tr key={`daily-${days}`}>
                        <td><span className="rate-type daily">Daily</span></td>
                        <td>{days} {parseInt(days) === 1 ? 'Day' : 'Days'}</td>
                        <td className="price-cell">₹{priceNum.toLocaleString('en-IN')}</td>
                      </tr>
                    );
                  })}
                
                {/* Old format fallback */}
                {!hasHourlyRates && !hasDailyRates && hasOldPrice && (
                  <tr>
                    <td><span className="rate-type">Standard</span></td>
                    <td>Per Stay</td>
                    <td className="price-cell">₹{parseInt(roomData.price).toLocaleString('en-IN')}</td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : (
            <div className="no-pricing-message">
              <svg width="20" height="20" fill="none" stroke="#9ca3af" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>No pricing information provided for this room type</span>
            </div>
          )}
        </div>
      );
    })}
  </div>
)}
              

              {/* Status Information */}
              <div className="detail-section">
                <h4>Status Information</h4>
                <table className="info-table">
                  <tbody>
                    <tr>
                      <td><strong>Current Status:</strong></td>
                      <td><span className={`badge-${selectedHotel.status}`}>{selectedHotel.status.toUpperCase()}</span></td>
                    </tr>
                    <tr>
                      <td><strong>Submitted:</strong></td>
                      <td>{formatDate(selectedHotel.createdAt)}</td>
                    </tr>
                    {selectedHotel.approvalDate && (
                      <tr>
                        <td><strong>Approved:</strong></td>
                        <td>{formatDate(selectedHotel.approvalDate)}</td>
                      </tr>
                    )}
                    {selectedHotel.rejectionReason && (
                      <tr>
                        <td><strong>Rejection Reason:</strong></td>
                        <td className="rejection-reason">{selectedHotel.rejectionReason}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Action Buttons */}
              {selectedHotel.status === 'pending' && (
                <div className="modal-actions">
                  <button className="btn-message" onClick={() => handleSendMessage(selectedHotel)}>
                    Send Message
                  </button>
                  <button className="btn-approve" onClick={() => handleApprove(selectedHotel)}>
                    Approve Hotel
                  </button>
                  <button className="btn-reject" onClick={() => handleReject(selectedHotel)}>
                    Reject Hotel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Message Modal - FIX #2: Added reply-to email field */}
      {showMessageModal && selectedHotel && (
        <div className="modal-overlay" onClick={() => setShowMessageModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Send Message to Partner</h3>
              <button onClick={() => setShowMessageModal(false)} className="close-button">
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="modal-body">
  {/* Partner Information */}
  <div className="detail-section">
    <h4>👤 Partner Information</h4>
    <table className="info-table">
      <tbody>
        <tr>
          <td><strong>Property Name:</strong></td>
          <td>{selectedHotel.partner.propertyName}</td>
        </tr>
        <tr>
          <td><strong>Owner Name:</strong></td>
          <td>{selectedHotel.partner.ownerName}</td>
        </tr>
        <tr>
          <td><strong>Email:</strong></td>
          <td>{selectedHotel.partner.email}</td>
        </tr>
        <tr>
          <td><strong>Mobile:</strong></td>
          <td>{selectedHotel.partner.mobile}</td>
        </tr>
        <tr>
          <td><strong>City:</strong></td>
          <td>{selectedHotel.partner.city || 'N/A'}</td>
        </tr>
        <tr>
          <td><strong>State:</strong></td>
          <td>{selectedHotel.partner.state || 'N/A'}</td>
        </tr>
        {selectedHotel.partner.address && (
          <tr>
            <td><strong>Address:</strong></td>
            <td>{selectedHotel.partner.address}</td>
          </tr>
        )}
      </tbody>
    </table>
  </div>

  {/* Hotel Information */}
  <div className="detail-section">
    <h4>🏨 Hotel Information</h4>
    <table className="info-table">
      <tbody>
        <tr>
          <td><strong>Hotel Name:</strong></td>
          <td>{selectedHotel.hotelName}</td>
        </tr>
        <tr>
          <td><strong>Property Type:</strong></td>
          <td>{selectedHotel.propertyType}</td>
        </tr>
        <tr>
          <td><strong>City:</strong></td>
          <td>{selectedHotel.city}</td>
        </tr>
        <tr>
          <td><strong>Address:</strong></td>
          <td>{selectedHotel.address}</td>
        </tr>
        <tr>
          <td><strong>Total Rooms:</strong></td>
          <td>{selectedHotel.totalRooms}</td>
        </tr>
        <tr>
          <td><strong>SSH Rooms:</strong></td>
          <td>{selectedHotel.sshRooms}</td>
        </tr>
        <tr>
          <td><strong>Check-in Time:</strong></td>
          <td>{selectedHotel.checkInTime || 'N/A'}</td>
        </tr>
        <tr>
          <td><strong>Check-out Time:</strong></td>
          <td>{selectedHotel.checkOutTime || 'N/A'}</td>
        </tr>
        {selectedHotel.description && (
          <tr>
            <td><strong>Description:</strong></td>
            <td>{selectedHotel.description}</td>
          </tr>
        )}
      </tbody>
    </table>
  </div>

  {/* Contact Information */}
  <div className="detail-section">
    <h4>📞 Contact Details</h4>
    <table className="info-table">
      <tbody>
        <tr>
          <td><strong>Contact Person:</strong></td>
          <td>{selectedHotel.ownerName}</td>
        </tr>
        <tr>
          <td><strong>Phone:</strong></td>
          <td>{selectedHotel.contactPhone || selectedHotel.ownerContact}</td>
        </tr>
        <tr>
          <td><strong>Email:</strong></td>
          <td>{selectedHotel.contactEmail}</td>
        </tr>
        {selectedHotel.contactAddress && (
          <tr>
            <td><strong>Address:</strong></td>
            <td>{selectedHotel.contactAddress}</td>
          </tr>
        )}
      </tbody>
    </table>
  </div>

  {/* Amenities */}
  <div className="detail-section">
    <h4>✨ Amenities</h4>
    <p>{renderAmenities(selectedHotel.amenities)}</p>
    {selectedHotel.customAmenities && selectedHotel.customAmenities.length > 0 && (
      <>
        <p><strong>Custom Amenities:</strong></p>
        <p>{selectedHotel.customAmenities.join(', ')}</p>
      </>
    )}
  </div>

  {/* Policies */}
  <div className="detail-section">
    <h4>📋 Policies</h4>
    <table className="info-table">
      <tbody>
        <tr>
          <td><strong>Cancellation Policy:</strong></td>
          <td>{selectedHotel.cancellationPolicy}</td>
        </tr>
        <tr>
          <td><strong>Refund Policy:</strong></td>
          <td>{selectedHotel.refundPolicy}</td>
        </tr>
      </tbody>
    </table>
  </div>

  {/* Property Images Section - NEW */}
  <div className="detail-section">
    <h4>🖼️ Property Images</h4>
    {renderHotelImages(selectedHotel.images)}
  </div>

  {/* Room Types & Pricing */}
  {selectedHotel.roomTypes && selectedHotel.roomTypes.length > 0 && (
    <div className="detail-section">
      <h4>💰 Room Types & Pricing</h4>
      {renderRoomPricing(selectedHotel.roomTypes)}
    </div>
  )}

  {/* Status Information */}
  <div className="detail-section">
    <h4>📊 Status Information</h4>
    <table className="info-table">
      <tbody>
        <tr>
          <td><strong>Current Status:</strong></td>
          <td><span className={`badge-${selectedHotel.status}`}>{selectedHotel.status.toUpperCase()}</span></td>
        </tr>
        <tr>
          <td><strong>Submitted:</strong></td>
          <td>{formatDate(selectedHotel.createdAt)}</td>
        </tr>
        {selectedHotel.approvalDate && (
          <tr>
            <td><strong>Approved:</strong></td>
            <td>{formatDate(selectedHotel.approvalDate)}</td>
          </tr>
        )}
        {selectedHotel.rejectionReason && (
          <tr>
            <td><strong>Rejection Reason:</strong></td>
            <td className="rejection-reason">{selectedHotel.rejectionReason}</td>
          </tr>
        )}
      </tbody>
    </table>
  </div>

  {/* Action Buttons */}
  {selectedHotel.status === 'pending' && (
    <div className="modal-actions">
      <button className="btn-message" onClick={() => handleSendMessage(selectedHotel)}>
        Send Message
      </button>
      <button className="btn-approve" onClick={() => handleApprove(selectedHotel)}>
        Approve Hotel
      </button>
      <button className="btn-reject" onClick={() => handleReject(selectedHotel)}>
        Reject Hotel
      </button>
    </div>
  )}
</div>
          </div>
        </div>
      )}

      <style jsx>{`
        .page-container {
          padding: 20px;
          background: #f8fafc;
          min-height: 100vh;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem;
          color: #6b7280;
        }

        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 4px solid #e5e7eb;
          border-top-color: #d11528;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .error-banner {
          background: #fee2e2;
          border: 1px solid #fecaca;
          color: #dc2626;
          padding: 1rem;
          border-radius: 0.5rem;
          margin-bottom: 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .retry-button {
          padding: 0.5rem 1rem;
          background: #dc2626;
          color: white;
          border: none;
          border-radius: 0.375rem;
          cursor: pointer;
          font-weight: 500;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .page-header h2 {
          font-size: 1.875rem;
          font-weight: bold;
          color: #1e293b;
          margin: 0 0 0.5rem 0;
        }

        .page-header p {
          color: #6b7280;
          margin: 0;
        }

        .btn-refresh {
          padding: 0.625rem 1.25rem;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
          font-weight: 600;
          transition: background-color 0.2s;
        }

        .btn-refresh:hover {
          background: #2563eb;
        }

        .tabs {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 2rem;
          border-bottom: 2px solid #e5e7eb;
        }

        .tab {
          padding: 0.75rem 1.5rem;
          background: none;
          border: none;
          border-bottom: 2px solid transparent;
          color: #6b7280;
          cursor: pointer;
          font-size: 0.95rem;
          font-weight: 500;
          transition: all 0.2s;
          margin-bottom: -2px;
        }

        .tab:hover {
          color: #d11528;
        }

        .tab.active {
          color: #d11528;
          border-bottom-color: #d11528;
          font-weight: 600;
        }

        .hotels-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 1.5rem;
        }

        .hotel-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          padding: 1.5rem;
          transition: box-shadow 0.2s;
        }

        .hotel-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .hotel-card-header {
          display: flex;
          justify-content: space-between;
          align-items: start;
          margin-bottom: 1rem;
        }

        .hotel-card-header h3 {
          font-size: 1.125rem;
          font-weight: bold;
          color: black;
          margin: 0;
        }

        .hotel-info {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .hotel-info p {
          font-size: 0.875rem;
          color: #374151;
          margin: 0;
        }

        .hotel-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.5rem;
          margin-top: 1rem;
        }

        .btn-view, .btn-message, .btn-approve, .btn-reject {
          padding: 0.5rem;
          border: none;
          border-radius: 0.375rem;
          cursor: pointer;
          font-size: 0.875rem;
          font-weight: 500;
          transition: all 0.2s;
        }

        .btn-view {
          background: white;
          border: 1px solid #d1d5db;
          color: #374151;
        }

        .btn-view:hover {
          background: #f9fafb;
        }

        .btn-message {
          background: #3b82f6;
          color: white;
        }

        .btn-message:hover {
          background: #2563eb;
        }

        .btn-approve {
          background: #10b981;
          color: white;
        }

        .btn-approve:hover {
          background: #059669;
        }

        .btn-reject {
          background: #ef4444;
          color: white;
        }

        .btn-reject:hover {
          background: #dc2626;
        }

        .badge-pending, .badge-approved, .badge-rejected {
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .badge-pending {
          background: #fef3c7;
          color: #92400e;
        }

        .badge-approved {
          background: #d1fae5;
          color: #065f46;
        }

        .badge-rejected {
          background: #fee2e2;
          color: #991b1b;
        }

        .hotels-list {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          overflow: hidden;
        }

        .hotel-list-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .hotel-list-item:last-child {
          border-bottom: none;
        }

        .hotel-list-item h3 {
          font-size: 1rem;
          font-weight: 600;
          color: black;
          margin: 0 0 0.25rem 0;
        }

        .hotel-list-item p {
          font-size: 0.875rem;
          color: #6b7280;
          margin: 0.125rem 0;
        }

        .hotel-list-meta {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .text-sm {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .rejection-reason {
          color: #ef4444;
          font-style: italic;
        }

        .btn-view-small {
          padding: 0.375rem 0.75rem;
          font-size: 0.75rem;
          background: white;
          border: 1px solid #d1d5db;
          color: #374151;
          border-radius: 0.375rem;
          cursor: pointer;
          font-weight: 500;
        }

        .btn-view-small:hover {
          background: #f9fafb;
        }

        .empty-state {
          grid-column: 1 / -1;
          text-align: center;
          padding: 4rem 2rem;
          color: #9ca3af;
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .empty-state h3 {
          font-size: 1.5rem;
          margin: 0 0 0.5rem 0;
          color: #6b7280;
        }

        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          z-index: 50;
        }

        .modal-content {
          background: white;
          border-radius: 0.5rem;
          max-width: 42rem;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          padding: 1.5rem;
        }

        .large-modal {
          max-width: 900px;
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .modal-header h3 {
          font-size: 1.5rem;
          font-weight: bold;
          color: black;
          margin: 0;
        }

        .close-button {
          background: none;
          border: none;
          color: #9ca3af;
          cursor: pointer;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .close-button:hover {
          color: #6b7280;
        }

        .modal-body {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .detail-section {
          padding-bottom: 1rem;
          border-bottom: 1px solid #f3f4f6;
        }

        .detail-section:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .detail-section h4 {
          font-size: 1rem;
          font-weight: 600;
          color: black;
          margin: 0 0 1rem 0;
        }

        .info-table {
          width: 100%;
          border-collapse: collapse;
        }

        .info-table td {
          padding: 0.75rem;
          border-bottom: 1px solid #f3f4f6;
          font-size: 0.875rem;
        }

        .info-table td:first-child {
          width: 200px;
          color: #6b7280;
          vertical-align: top;
        }

        .info-table td:last-child {
          color: #374151;
        }

        .info-table tr:last-child td {
          border-bottom: none;
        }

        .room-pricing-section {
          margin-bottom: 2rem;
          padding: 1rem;
          background: #f9fafb;
          border-radius: 0.5rem;
          border: 1px solid #e5e7eb;
        }

        .room-pricing-section:last-child {
          margin-bottom: 0;
        }

        .room-pricing-section h5 {
          margin: 0 0 0.5rem 0;
          font-size: 1.125rem;
          font-weight: 600;
          color: #1f2937;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #d11528;
        }

        .room-capacity {
          margin: 0.5rem 0 1rem 0;
          padding: 0.5rem;
          background: white;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          color: #6b7280;
          font-weight: 500;
        }

        .pricing-category {
          margin-top: 1rem;
        }

        .pricing-category h6 {
          margin: 0 0 0.5rem 0;
          font-size: 0.95rem;
          font-weight: 600;
          color: #374151;
        }

        .room-types-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 0.5rem;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          overflow: hidden;
        }

        .room-types-table th {
          background: #f9fafb;
          padding: 0.75rem;
          text-align: left;
          font-weight: 600;
          font-size: 0.875rem;
          color: #374151;
          border-bottom: 2px solid #e5e7eb;
        }

        .room-types-table td {
          padding: 0.75rem;
          border-bottom: 1px solid #f3f4f6;
          font-size: 0.875rem;
          color: #374151;
        }

        .room-types-table tbody tr:last-child td {
          border-bottom: none;
        }

        .room-types-table tbody tr:hover {
          background: #f9fafb;
        }

        .info-box {
          background: #f9fafb;
          padding: 1rem;
          border-radius: 0.5rem;
          border-left: 4px solid #3b82f6;
          margin-bottom: 1.5rem;
        }

        .info-box p {
          margin: 0.5rem 0;
          font-size: 0.875rem;
        }

        .form-group {
          margin-bottom: 1rem;
        }

        .form-group label {
          display: block;
          font-size: 0.875rem;
          font-weight: 600;
          color: black;
          margin-bottom: 0.5rem;
        }

        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          font-family: inherit;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #d11528;
          box-shadow: 0 0 0 3px rgba(209, 21, 40, 0.1);
        }

        .form-group textarea {
          resize: vertical;
        }

        small {
          display: block;
          margin-top: 0.25rem;
          color: #6b7280;
          font-size: 0.75rem;
        }

        .modal-actions {
          display: flex;
          gap: 0.75rem;
          padding-top: 1rem;
        }

        .cancel-button, .submit-button {
          flex: 1;
          padding: 0.625rem 1rem;
          border-radius: 0.5rem;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s;
          border: none;
        }

        .cancel-button {
          background: white;
          border: 1px solid #d1d5db;
          color: black;
        }

        .cancel-button:hover:not(:disabled) {
          background: #f9fafb;
        }

        .submit-button {
          background: #d11528;
          color: white;
        }

        .submit-button:hover:not(:disabled) {
          background: #b01020;
        }

        .cancel-button:disabled,
        .submit-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .hotels-grid {
            grid-template-columns: 1fr;
          }

          .large-modal {
            max-width: 100%;
            max-height: 95vh;
          }

          .page-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
            .room-pricing-section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #f9fafb;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
}

.room-pricing-section:last-child {
  margin-bottom: 0;
}

.room-pricing-section h5 {
  margin: 0 0 1rem 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #d11528;
}

.room-capacity-info {
  margin: 0 0 1rem 0;
  padding: 0.625rem 0.875rem;
  background: white;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  color: #374151;
  border-left: 3px solid #3b82f6;
}

.room-capacity-info strong {
  color: #1f2937;
  margin-right: 0.5rem;
}

.room-types-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  overflow: hidden;
}

.room-types-table th {
  background: #f9fafb;
  padding: 0.875rem 1rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.875rem;
  color: #374151;
  border-bottom: 2px solid #e5e7eb;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.room-types-table td {
  padding: 0.875rem 1rem;
  border-bottom: 1px solid #f3f4f6;
  font-size: 0.875rem;
  color: #374151;
  vertical-align: middle;
}

.room-types-table tbody tr:last-child td {
  border-bottom: none;
}

.room-types-table tbody tr:hover {
  background: #f9fafb;
  transition: background-color 0.15s ease;
}

.room-types-table td:first-child {
  width: 25%;
}

.room-types-table td:nth-child(2) {
  width: 35%;
  font-weight: 500;
}

.room-types-table td:last-child {
  width: 40%;
}

.rate-type {
  display: inline-block;
  padding: 0.25rem 0.625rem;
  background: #dbeafe;
  color: #1e40af;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.rate-type.daily {
  background: #d1fae5;
  color: #065f46;
}

.price-cell {
  color: #d11528;
  font-weight: 700;
  font-size: 1rem;
}

.no-pricing-message {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 2rem;
  background: white;
  border: 2px dashed #e5e7eb;
  border-radius: 0.5rem;
  color: #6b7280;
  font-size: 0.875rem;
  font-style: italic;
}

.no-pricing-message svg {
  flex-shrink: 0;
}
  /* Room Count Information */
.room-count-info,
.extra-guest-info {
  margin: 0.5rem 0;
  padding: 0.625rem 0.875rem;
  background: white;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  color: #374151;
  border-left: 3px solid #10b981;
}

.room-count-info strong,
.extra-guest-info strong {
  color: #1f2937;
  margin-right: 0.5rem;
}

/* Extra Guest Charge - Orange border */
.extra-guest-info {
  border-left-color: #f59e0b;
}

/* Room Amenities Container */
.room-amenities-info {
  margin: 1rem 0;
  padding: 0.75rem;
  background: white;
  border-radius: 0.375rem;
  border: 1px solid #e5e7eb;
}

.room-amenities-info strong {
  display: block;
  margin-bottom: 0.5rem;
  color: #1f2937;
  font-size: 0.875rem;
}

/* Amenities Tags Container */
.amenities-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

/* Individual Amenity Tag */
.amenity-tag {
  padding: 0.375rem 0.75rem;
  background: #dbeafe;
  color: #1e40af;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 500;
}
        }
      `}</style>
    </div>
  );
};

export default HotelApproval;