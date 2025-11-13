import React, { useState, useMemo } from 'react';
import './DashboardPage.css';

// Mock data based on your sketch, translated to English status terms
const initialOrders = [
  {
    id: 3,
    articleNumber: 'D003',
    articleName: 'Sliding Door Birch Modern',
    quantity: 2,
    unit: 'pcs',
    orderNumber: 'O2024003',
    deliveryDate: '2024-01-12',
    status: 'Delayed',
  },
  {
    id: 5,
    articleNumber: 'D005',
    articleName: 'French Door Pine Rustic',
    quantity: 2,
    unit: 'pcs',
    orderNumber: 'O2024005',
    deliveryDate: '2024-01-14',
    status: 'In Production',
  },
  {
    id: 1,
    articleNumber: 'D001',
    articleName: 'Interior Door Oak Standard',
    quantity: 3,
    unit: 'pcs',
    orderNumber: 'O2024001',
    deliveryDate: '2024-01-15',
    status: 'In Production',
  },
  {
    id: 2,
    articleNumber: 'D002',
    articleName: 'Exterior Door Pine Classic',
    quantity: 1,
    unit: 'pcs',
    orderNumber: 'O2024002',
    deliveryDate: '2024-01-18',
    status: 'Planned',
  },
  {
    id: 4,
    articleNumber: 'D004',
    articleName: 'Glass Door Oak Premium',
    quantity: 4,
    unit: 'pcs',
    orderNumber: 'O2024004',
    deliveryDate: '2024-01-20',
    status: 'Planned',
  },
  {
    id: 4,
    articleNumber: 'D005',
    articleName: 'Glass Door Oak Premium',
    quantity: 4,
    unit: 'pcs',
    orderNumber: 'O2024004',
    deliveryDate: '2024-01-20',
    status: 'Delayed',
  },
  {
    id: 7,
    articleNumber: 'D006',
    articleName: 'Glass Door Oak Premium',
    quantity: 4,
    unit: 'pcs',
    orderNumber: 'O2024004',
    deliveryDate: '2024-01-20',
    status: 'Delayed',
  },
  {
    id: 6,
    articleNumber: 'D007',
    articleName: 'Glass Door Oak Premium',
    quantity: 4,
    unit: 'pcs',
    orderNumber: 'O2024004',
    deliveryDate: '2024-01-20',
    status: 'In Production',
  },
  {
    id: 8,
    articleNumber: 'D008',
    articleName: 'Glass Door Oak Premium',
    quantity: 4,
    unit: 'pcs',
    orderNumber: 'O2024004',
    deliveryDate: '2024-01-20',
    status: 'In Production',
  },
  {
    id: 9,
    articleNumber: 'D009',
    articleName: 'Glass Door Oak Premium',
    quantity: 4,
    unit: 'pcs',
    orderNumber: 'O2024004',
    deliveryDate: '2024-01-20',
    status: 'Delayed',
  },
];

const statusOptions = ['All Statuses', 'In Production', 'Delayed', 'Planned'];
const sortOptions = ['Delivery Date', 'Article Number', 'Order Number'];

// HELPER FUNCTION TO RENDER SVG ICONS INLINE for KPI cards
const getKpiIcon = (iconName) => {
  const iconProps = {
    width: 24,
    height: 24,
    // Use 'currentColor' to inherit the parent's text color (which is white from .kpi-icon CSS)
    stroke: 'currentColor',
    fill: 'none',
    strokeWidth: '2',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  };

  switch (iconName) {
    case 'ClipboardList':
      return (
        <svg {...iconProps} viewBox='0 0 24 24'>
          <rect x='8' y='2' width='8' height='4' rx='1' ry='1'></rect>
          <path d='M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2'></path>
          <line x1='9' y1='12' x2='15' y2='12'></line>
          <line x1='9' y1='16' x2='15' y2='16'></line>
        </svg>
      );
    case 'Wrench':
      return (
        <svg {...iconProps} viewBox='0 0 24 24'>
          <path d='M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.71-3.71a1 1 0 0 0 0-1.41L18.61 2.5a1 1 0 0 0-1.41 0z'></path>
          <path d='M11.21 16.07a1 1 0 0 0 0 1.4L13.84 20a1 1 0 0 0 1.4 0l.7-.7a1 1 0 0 0 0-1.41l-2.63-2.63a1 1 0 0 0-1.4 0z'></path>
          <path d='M14 4l-1 4.5 4.5-1L14 4z'></path>
          <path d='M12 15L3 22l7-7 9-9'></path>
        </svg>
      );
    case 'Clock':
      return (
        <svg {...iconProps} viewBox='0 0 24 24'>
          <circle cx='12' cy='12' r='10'></circle>
          <polyline points='12 6 12 12 16 14'></polyline>
        </svg>
      );
    case 'Calendar':
      return (
        <svg {...iconProps} viewBox='0 0 24 24'>
          <rect x='3' y='4' width='18' height='18' rx='2' ry='2'></rect>
          <line x1='16' y1='2' x2='16' y2='6'></line>
          <line x1='8' y1='2' x2='8' y2='6'></line>
          <line x1='3' y1='10' x2='21' y2='10'></line>
        </svg>
      );
    default:
      return <span style={{ fontSize: '18px' }}>?</span>;
  }
};

function DashboardPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All Statuses');
  const [sortBy, setSortBy] = useState('Delivery Date');
  const [sortDirection, setSortDirection] = useState('asc'); // 'asc' or 'desc'

  // Define the logo source using the absolute public path
  const logoSrc = '/furuhalls-logo.png';

  // Calculate KPIs (Key Performance Indicators)
  const statusCounts = useMemo(() => {
    const counts = {
      'Total Orders': initialOrders.length,
      'In Production': 0,
      Delayed: 0,
      Planned: 0,
    };
    initialOrders.forEach((order) => {
      // Need to map the Swedish status in data to English keys
      let key = order.status;
      if (key === 'Försenad') key = 'Delayed';
      if (key === 'I produktion') key = 'In Production';
      if (key === 'Planerad') key = 'Planned';

      if (counts.hasOwnProperty(key)) {
        counts[key]++;
      } else {
        // Handle case where mock data might still contain Swedish values from previous runs
        if (order.status === 'Försenad') counts['Delayed']++;
        else if (order.status === 'I produktion') counts['In Production']++;
        else if (order.status === 'Planerad') counts['Planned']++;
      }
    });
    return counts;
  }, []);

  const kpiData = [
    {
      title: 'Total Orders',
      count: statusCounts['Total Orders'] || initialOrders.length,
      color: 'bg-indigo-600',
      icon: 'ClipboardList',
    },
    {
      title: 'In Production',
      count: statusCounts['In Production'],
      color: 'bg-blue-500',
      icon: 'Wrench',
    },
    {
      title: 'Delayed',
      count: statusCounts['Delayed'],
      color: 'bg-red-500',
      icon: 'Clock',
    },
    {
      title: 'Planned',
      count: statusCounts['Planned'],
      color: 'bg-green-500',
      icon: 'Calendar',
    },
  ];

  // Sorting and Filtering Logic
  const sortedAndFilteredOrders = useMemo(() => {
    let orders = [...initialOrders];

    // Filtering (basic text search and status filter)
    orders = orders.filter((order) => {
      const matchesSearch = Object.values(order).some((val) =>
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      );

      // Note: filterStatus uses English keys, but order.status uses the string from the initialOrders array ('Delayed', 'In Production', etc.)
      const matchesStatus =
        filterStatus === 'All Statuses' || order.status === filterStatus;
      return matchesSearch && matchesStatus;
    });

    // Sorting
    orders.sort((a, b) => {
      let key;
      if (sortBy === 'Delivery Date') key = 'deliveryDate';
      else if (sortBy === 'Article Number') key = 'articleNumber';
      else key = 'orderNumber'; // 'Order Number'

      let comparison = 0;

      if (a[key] > b[key]) {
        comparison = 1;
      } else if (a[key] < b[key]) {
        comparison = -1;
      }

      return sortDirection === 'asc' ? comparison : comparison * -1;
    });

    return orders;
  }, [searchTerm, filterStatus, sortBy, sortDirection]);

  const handleSortChange = (key) => {
    if (sortBy === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortDirection('asc');
    }
  };

  /**
   * Renders the appropriate SVG icon for the sortable column header.
   */
  const getSortIcon = (key) => {
    const isCurrentSort = sortBy === key;
    const iconProps = {
      className: 'ml-1 inline-block',
      width: 16,
      height: 16,
      stroke: 'currentColor',
      fill: 'none',
      strokeWidth: '2',
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      // Dim non-active icons slightly
      style: {
        opacity: isCurrentSort ? 1 : 0.5, 
        transition: 'opacity 0.2s',
      },
    };

    if (isCurrentSort) {
      if (sortDirection === 'asc') {
        // Ascending (Up arrow)
        return (
          <svg {...iconProps} viewBox='0 0 24 24'>
            <path d='M12 19V5M5 12l7-7 7 7' />
          </svg>
        );
      } else {
        // Descending (Down arrow)
        return (
          <svg {...iconProps} viewBox='0 0 24 24'>
            <path d='M12 5v14M19 12l-7 7-7-7' />
          </svg>
        );
      }
    } else {
      // Unsorted (Up and Down arrows, or simply 'un-sorted' icon)
      return (
        <svg {...iconProps} viewBox='0 0 24 24'>
          <path d='M7 16l5 5 5-5M7 8l5-5 5 5' />
        </svg>
      );
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Delayed': // Note: Matches the English status in the mock data now
      case 'Försenad': // Fallback for old data if needed
        return 'status-delayed';
      case 'In Production':
      case 'I produktion':
        return 'status-in-progress';
      case 'Planned':
      case 'Planerad':
        return 'status-planned';
      default:
        return 'status-default';
    }
  };

  return (
    <div className='dashboard-page'>
      <header className='dashboard-header'>
        <h2>
          <img 
            src={logoSrc} 
            alt="Furuhalls Logo" 
            style={{ 
              height: '75px', // Adjusted height for better header balance
              width: 'auto',
              verticalAlign: 'middle', 
              marginRight: '12px' 
            }} 
          />
 
        </h2>
        
        <div className='header-actions'>
          <button className='btn btn-primary'>New Order</button>
          <button className='btn btn-secondary'>Excel Export</button>
        </div>
      </header>
   
      {/* NEW: Combined KPI and Filter area */}
      {/* This container needs to be styled with display: flex or grid in CSS 
          to place the KPI section and the Filter panel side-by-side. */}
      <div className='dashboard-data-and-filters'>
        
        {/* KPI Section - Now includes its own title */}
        <div className='kpi-section-wrapper'>
          <h3 className='section-header-kpi'>Dashboard Overview</h3>
          <div className='kpi-grid'> 
            {kpiData.map((kpi) => (
              <div key={kpi.title} className='kpi-card'>
                <div className={`kpi-icon ${kpi.color}`}>
                  {getKpiIcon(kpi.icon)}
                </div>
                <div className='kpi-content'>
                  <p className='kpi-title'>{kpi.title}</p>
                  <p className='kpi-count'>{kpi.count}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Filters and Search - Existing structure kept inside the new wrapper */}
        <div className='filter-panel'>
          <div className='filter-section'>
            <h3 className='filter-title'>Filters & Search</h3>
            <div className='filter-controls'>
              <div className='filter-group search-group'>
                <label htmlFor='search'>Search</label>
                <input
                  id='search'
                  type='text'
                  placeholder='Search'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='input-field search-input'
                />
              </div>

              <div className='filter-group'>
                <label htmlFor='status-filter'>Status</label>
                <select
                  id='status-filter'
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className='input-field'
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div className='filter-group'>
                <label htmlFor='sort-by'>Sort By</label>
                <select
                  id='sort-by'
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className='input-field'
                >
                  {sortOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Table */}
      <div className='order-table-container'>
        <h3 className='table-summary'>
          Production Orders
          <span>
            {sortedAndFilteredOrders.length} of {initialOrders.length} orders
            shown
          </span>
        </h3>

        <table className='order-table'>
          <thead>
            <tr>
              <th>Article Number</th>
              <th>Article Name</th>
              <th>Quantity</th>
              <th>Order Number</th>
              <th
                className='sortable-header'
                onClick={() => handleSortChange('Delivery Date')}
              >
                Delivery Date {getSortIcon('Delivery Date')}
              </th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Using index in addition to ID for key to handle duplicate IDs in mock data */}
            {sortedAndFilteredOrders.map((order, index) => (
              <tr key={order.id + '-' + index}>
                <td>{order.articleNumber}</td>
                <td>{order.articleName}</td>
                <td>
                  {order.quantity} {order.unit}
                </td>
                <td>{order.orderNumber}</td>
                <td>{order.deliveryDate}</td>
                <td>
                  <span
                    className={`status-badge ${getStatusClass(order.status)}`}
                  >
                    {order.status}
                  </span>
                </td>
                <td>
                  <button className='btn btn-action'>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {sortedAndFilteredOrders.length === 0 && (
          <p className='no-results'>No orders match the selected filters.</p>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;