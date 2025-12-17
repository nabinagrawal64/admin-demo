import React, { useState, useEffect } from 'react';

const Analytics = () => {
  const [timeframe, setTimeframe] = useState('daily');
  const [metrics, setMetrics] = useState(null);
  const [bookingTrends, setBookingTrends] = useState(null);
  const [locationData, setLocationData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Chart color schemes
  const chartColors = {
    primary: 'rgba(59, 130, 246, 0.8)',
    secondary: 'rgba(16, 185, 129, 0.8)',
    accent: 'rgba(139, 92, 246, 0.8)',
    background: 'rgba(59, 130, 246, 0.2)',
    pie: ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444']
  };

  // Static data - no API calls needed
  const staticData = {
    daily: { 
      metrics: { bookings: 58, revenue: 29000, hotels: 24, users: 1320 },
      trends: [
        { period: '00:00', bookings: 2, revenue: 1000 },
        { period: '04:00', bookings: 1, revenue: 500 },
        { period: '08:00', bookings: 8, revenue: 4000 },
        { period: '12:00', bookings: 15, revenue: 7500 },
        { period: '16:00', bookings: 20, revenue: 10000 },
        { period: '20:00', bookings: 12, revenue: 6000 }
      ],
      locations: [
        { location: 'Mumbai', revenue: 18850, percentage: 65 },
        { location: 'Pune', revenue: 7250, percentage: 25 },
        { location: 'Thane', revenue: 2900, percentage: 10 }
      ]
    },
    weekly: { 
      metrics: { bookings: 385, revenue: 192500, hotels: 24, users: 1320 },
      trends: [
        { period: 'Mon', bookings: 45, revenue: 22500 },
        { period: 'Tue', bookings: 52, revenue: 26000 },
        { period: 'Wed', bookings: 48, revenue: 24000 },
        { period: 'Thu', bookings: 65, revenue: 32500 },
        { period: 'Fri', bookings: 80, revenue: 40000 },
        { period: 'Sat', bookings: 75, revenue: 37500 },
        { period: 'Sun', bookings: 60, revenue: 30000 }
      ],
      locations: [
        { location: 'Mumbai', revenue: 125125, percentage: 65 },
        { location: 'Pune', revenue: 48125, percentage: 25 },
        { location: 'Thane', revenue: 19250, percentage: 10 }
      ]
    },
    monthly: { 
      metrics: { bookings: 1650, revenue: 825000, hotels: 24, users: 1320 },
      trends: [
        { period: 'Week 1', bookings: 380, revenue: 190000 },
        { period: 'Week 2', bookings: 410, revenue: 205000 },
        { period: 'Week 3', bookings: 430, revenue: 215000 },
        { period: 'Week 4', bookings: 430, revenue: 215000 }
      ],
      locations: [
        { location: 'Mumbai', revenue: 536250, percentage: 65 },
        { location: 'Pune', revenue: 206250, percentage: 25 },
        { location: 'Thane', revenue: 82500, percentage: 10 }
      ]
    }
  };

  const loadAnalyticsData = (timeframe) => {
    setLoading(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      const data = staticData[timeframe];
      setMetrics(data.metrics);
      setBookingTrends(data.trends);
      setLocationData(data.locations);
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    loadAnalyticsData(timeframe);
  }, [timeframe]);

  // Simple chart rendering functions
  const renderLineChart = () => {
    if (!bookingTrends) return null;

    const maxBookings = Math.max(...bookingTrends.map(item => item.bookings));
    const maxRevenue = Math.max(...bookingTrends.map(item => item.revenue));

    return (
      <div className="simple-line-chart">
        <div className="chart-lines">
          {bookingTrends.map((item, index) => {
            const bookingHeight = (item.bookings / maxBookings) * 100;
            const revenueHeight = (item.revenue / maxRevenue) * 100;
            
            return (
              <div key={index} className="chart-column">
                <div className="column-container">
                  <div 
                    className="booking-bar" 
                    style={{ height: `${bookingHeight}%` }}
                    title={`${item.bookings} bookings`}
                  ></div>
                  <div 
                    className="revenue-bar" 
                    style={{ height: `${revenueHeight}%` }}
                    title={`₹${item.revenue}`}
                  ></div>
                </div>
                <span className="period-label">{item.period}</span>
              </div>
            );
          })}
        </div>
        <div className="chart-legend">
          <div className="legend-item">
            <div className="legend-color booking"></div>
            <span>Bookings</span>
          </div>
          <div className="legend-item">
            <div className="legend-color revenue"></div>
            <span>Revenue</span>
          </div>
        </div>
      </div>
    );
  };

  const renderPieChart = () => {
    if (!locationData) return null;

    let currentAngle = 0;
    const totalRevenue = locationData.reduce((sum, loc) => sum + loc.revenue, 0);

    return (
      <div className="simple-pie-chart">
        <div className="pie-container">
          <svg width="200" height="200" viewBox="0 0 200 200">
            {locationData.map((location, index) => {
              const percentage = (location.revenue / totalRevenue) * 100;
              const angle = (percentage / 100) * 360;
              const largeArcFlag = angle > 180 ? 1 : 0;
              
              const x1 = 100 + 80 * Math.cos(currentAngle * Math.PI / 180);
              const y1 = 100 + 80 * Math.sin(currentAngle * Math.PI / 180);
              
              const x2 = 100 + 80 * Math.cos((currentAngle + angle) * Math.PI / 180);
              const y2 = 100 + 80 * Math.sin((currentAngle + angle) * Math.PI / 180);
              
              const pathData = [
                `M 100 100`,
                `L ${x1} ${y1}`,
                `A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                `Z`
              ].join(' ');
              
              const slice = (
                <path
                  key={index}
                  d={pathData}
                  fill={chartColors.pie[index]}
                  stroke="#fff"
                  strokeWidth="2"
                />
              );
              
              currentAngle += angle;
              return slice;
            })}
            <circle cx="100" cy="100" r="50" fill="white" />
          </svg>
        </div>
        <div className="pie-legend">
          {locationData.map((location, index) => (
            <div key={index} className="legend-item">
              <div 
                className="legend-color" 
                style={{ backgroundColor: chartColors.pie[index] }}
              ></div>
              <span>{location.location}: {location.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderBarChart = () => {
    if (!locationData) return null;

    const maxRevenue = Math.max(...locationData.map(loc => loc.revenue));

    return (
      <div className="simple-bar-chart">
        {locationData.map((location, index) => {
          const barHeight = (location.revenue / maxRevenue) * 100;
          
          return (
            <div key={index} className="bar-column">
              <div 
                className="bar" 
                style={{ 
                  height: `${barHeight}%`,
                  backgroundColor: chartColors.pie[index]
                }}
                title={`₹${location.revenue.toLocaleString()}`}
              >
                <span className="bar-value">₹{(location.revenue / 1000).toFixed(0)}K</span>
              </div>
              <span className="bar-label">{location.location}</span>
            </div>
          );
        })}
      </div>
    );
  };

  const handleTimeframeChange = (newTimeframe) => {
    setTimeframe(newTimeframe);
  };

  if (loading && !metrics) {
    return (
      <div className="page-container">
        <div className="loading">Loading analytics data...</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Analytics Dashboard</h2>
        <div className="timeframe-selector">
          <button 
            className={timeframe === 'daily' ? 'active' : ''} 
            onClick={() => handleTimeframeChange('daily')}
          >
            Daily
          </button>
          <button 
            className={timeframe === 'weekly' ? 'active' : ''} 
            onClick={() => handleTimeframeChange('weekly')}
          >
            Weekly
          </button>
          <button 
            className={timeframe === 'monthly' ? 'active' : ''} 
            onClick={() => handleTimeframeChange('monthly')}
          >
            Monthly
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading">Updating data...</div>
      ) : (
        <>
          {/* Metrics Cards */}
          <div className="analytics-grid">
            <div className="analytics-card">
              <h3>Total Bookings</h3>
              <p className="metric-value">{metrics?.bookings || 0}</p>
              <span className="metric-change positive">+12% from last {timeframe}</span>
            </div>
            <div className="analytics-card">
              <h3>Revenue</h3>
              <p className="metric-value">₹{metrics?.revenue?.toLocaleString() || 0}</p>
              <span className="metric-change positive">+8% from last {timeframe}</span>
            </div>
            <div className="analytics-card">
              <h3>Active Hotels</h3>
              <p className="metric-value">{metrics?.hotels || 0}</p>
              <span className="metric-change neutral">No change</span>
            </div>
            <div className="analytics-card">
              <h3>Total Users</h3>
              <p className="metric-value">{metrics?.users || 0}</p>
              <span className="metric-change positive">+5% from last {timeframe}</span>
            </div>
          </div>

          {/* Booking Trends Chart */}
          <div className="chart-section">
            <h3>Booking Trends - {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}</h3>
            <div className="chart-container">
              {bookingTrends && bookingTrends.length > 0 ? (
                renderLineChart()
              ) : (
                <div className="no-data">No booking trends data available</div>
              )}
            </div>
          </div>

          {/* Location Revenue Charts */}
          <div className="charts-grid">
            <div className="chart-section">
              <h3>Revenue by Location - Distribution</h3>
              <div className="chart-container">
                {locationData && locationData.length > 0 ? (
                  renderPieChart()
                ) : (
                  <div className="no-data">No location data available</div>
                )}
              </div>
            </div>

            <div className="chart-section">
              <h3>Revenue by Location - Comparison</h3>
              <div className="chart-container">
                {locationData && locationData.length > 0 ? (
                  renderBarChart()
                ) : (
                  <div className="no-data">No location data available</div>
                )}
              </div>
            </div>
          </div>

          {/* Location Progress Bars */}
          <div className="chart-section">
            <h3>Revenue Share by Location</h3>
            <div className="location-stats">
              {locationData && locationData.map((location, index) => (
                <div key={index} className="location-item">
                  <div className="location-header">
                    <span className="location-name">{location.location}</span>
                    <span className="location-revenue">₹{location.revenue?.toLocaleString()}</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ 
                        width: `${location.percentage}%`,
                        backgroundColor: chartColors.pie[index]
                      }}
                    >
                      <span className="percentage-text">{location.percentage}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        .page-container {
          padding: 20px;
          background: #f8fafc;
          min-height: 100vh;
        }
        
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          flex-wrap: wrap;
          gap: 15px;
        }
        
        .page-header h2 {
          color: #1e293b;
          margin: 0;
          font-size: 1.8rem;
        }
        
        .timeframe-selector {
          display: flex;
          gap: 10px;
          background: white;
          padding: 5px;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        
        .timeframe-selector button {
          padding: 8px 16px;
          border: none;
          background: transparent;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s;
          font-weight: 500;
          color: #64748b;
        }
        
        .timeframe-selector button:hover {
          background: #f1f5f9;
        }
        
        .timeframe-selector button.active {
          background: #3b82f6;
          color: white;
        }
        
        .analytics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }
        
        .analytics-card {
          background: white;
          padding: 25px;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          border-left: 4px solid #3b82f6;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .analytics-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        
        .analytics-card h3 {
          margin: 0 0 15px 0;
          color: #64748b;
          font-size: 0.9rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .metric-value {
          font-size: 2.5rem;
          font-weight: bold;
          margin: 10px 0;
          color: #1e293b;
          line-height: 1;
        }
        
        .metric-change {
          font-size: 0.85rem;
          font-weight: 500;
        }
        
        .metric-change.positive {
          color: #10b981;
        }
        
        .metric-change.neutral {
          color: #6b7280;
        }
        
        .chart-section {
          background: white;
          padding: 25px;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          margin-bottom: 25px;
        }
        
        .chart-section h3 {
          margin: 0 0 20px 0;
          color: #1e293b;
          font-size: 1.3rem;
          font-weight: 600;
        }
        
        .charts-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 25px;
          margin-bottom: 25px;
        }
        
        .chart-container {
          height: 400px;
          margin-top: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        /* Simple Line Chart Styles */
        .simple-line-chart {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        
        .chart-lines {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          height: 300px;
          padding: 20px;
          border-bottom: 2px solid #e2e8f0;
        }
        
        .chart-column {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 1;
          margin: 0 5px;
        }
        
        .column-container {
          display: flex;
          align-items: flex-end;
          gap: 4px;
          height: 100%;
          width: 30px;
        }
        
        .booking-bar {
          background: ${chartColors.primary};
          width: 12px;
          border-radius: 3px 3px 0 0;
          transition: all 0.3s ease;
        }
        
        .revenue-bar {
          background: ${chartColors.secondary};
          width: 12px;
          border-radius: 3px 3px 0 0;
          transition: all 0.3s ease;
        }
        
        .booking-bar:hover, .revenue-bar:hover {
          opacity: 0.8;
          transform: scale(1.1);
        }
        
        .period-label {
          margin-top: 8px;
          font-size: 0.8rem;
          color: #64748b;
          font-weight: 500;
        }
        
        .chart-legend {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin-top: 15px;
        }
        
        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .legend-color {
          width: 16px;
          height: 16px;
          border-radius: 3px;
        }
        
        .legend-color.booking {
          background: ${chartColors.primary};
        }
        
        .legend-color.revenue {
          background: ${chartColors.secondary};
        }
        
        /* Simple Pie Chart Styles */
        .simple-pie-chart {
          display: flex;
          align-items: center;
          gap: 30px;
          width: 100%;
          height: 100%;
        }
        
        .pie-container {
          flex-shrink: 0;
        }
        
        .pie-legend {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        /* Simple Bar Chart Styles */
        .simple-bar-chart {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          height: 300px;
          width: 100%;
          padding: 20px;
        }
        
        .bar-column {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 1;
          margin: 0 10px;
        }
        
        .bar {
          width: 40px;
          border-radius: 4px 4px 0 0;
          transition: all 0.3s ease;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          position: relative;
        }
        
        .bar:hover {
          opacity: 0.8;
          transform: scale(1.05);
        }
        
        .bar-value {
          color: white;
          font-weight: bold;
          font-size: 0.7rem;
          margin-top: 5px;
          text-shadow: 0 1px 2px rgba(0,0,0,0.3);
        }
        
        .bar-label {
          margin-top: 8px;
          font-size: 0.8rem;
          color: #64748b;
          font-weight: 500;
        }
        
        .location-stats {
          margin-top: 20px;
        }
        
        .location-item {
          margin-bottom: 20px;
        }
        
        .location-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          align-items: center;
        }
        
        .location-name {
          font-weight: 600;
          color: #374151;
          font-size: 0.95rem;
        }
        
        .location-revenue {
          color: #6b7280;
          font-weight: 500;
          font-size: 0.9rem;
        }
        
        .progress-bar {
          width: 100%;
          height: 32px;
          background: #f1f5f9;
          border-radius: 16px;
          overflow: hidden;
          position: relative;
          box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);
        }
        
        .progress-fill {
          height: 100%;
          border-radius: 16px;
          transition: width 0.5s ease;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          padding: 0 15px;
          min-width: 60px;
        }
        
        .percentage-text {
          color: white;
          font-weight: 600;
          font-size: 0.8rem;
          text-shadow: 0 1px 2px rgba(0,0,0,0.2);
        }
        
        .loading, .no-data {
          text-align: center;
          padding: 40px;
          background: white;
          border-radius: 10px;
          margin: 20px 0;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        
        .loading {
          color: #64748b;
          font-size: 1.1rem;
        }
        
        .no-data {
          color: #6b7280;
          font-style: italic;
        }
        
        @media (max-width: 768px) {
          .page-container {
            padding: 15px;
          }
          
          .charts-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          
          .page-header {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .timeframe-selector {
            width: 100%;
            justify-content: center;
          }
          
          .analytics-grid {
            grid-template-columns: 1fr;
            gap: 15px;
          }
          
          .chart-container {
            height: 300px;
          }
          
          .metric-value {
            font-size: 2rem;
          }
          
          .simple-pie-chart {
            flex-direction: column;
            gap: 20px;
          }
        }
        
        @media (max-width: 480px) {
          .chart-section {
            padding: 20px 15px;
          }
          
          .analytics-card {
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default Analytics;