import React, { useState, useMemo } from 'react';
import './DashboardPage.css';

// Mock data based on requirements
const initialOrders = [
  {
    id: 1,
    articleNumber: 'D001',
    articleName: 'Interior Door Oak Standard',
    quantity: 3,
    unit: 'pcs',
    orderNumber: 'O2024001',
    customerNumber: 'K1001',
    deliveryDate: '2024-11-15', // Tomorrow
    status: '-',
    specification: 'Mount handle on right side',
  },
  {
    id: 2,
    articleNumber: 'D002',
    articleName: 'Exterior Door Pine Classic',
    quantity: 1,
    unit: 'pcs',
    orderNumber: 'O2024002',
    customerNumber: 'K1002',
    deliveryDate: '2024-11-14', // Today
    status: 'Frame in stock',
    specification: '',
  },
  {
    id: 3,
    articleNumber: 'D003',
    articleName: 'Sliding Door Birch Modern',
    quantity: 2,
    unit: 'pcs',
    orderNumber: 'O2024003',
    customerNumber: 'K1003',
    deliveryDate: '2024-11-12', // Overdue
    status: 'Delayed',
    specification: 'Special order - extra wide',
  },
  {
    id: 4,
    articleNumber: 'D004',
    articleName: 'Glass Door Oak Premium',
    quantity: 4,
    unit: 'pcs',
    orderNumber: 'O2024004',
    customerNumber: 'K1004',
    deliveryDate: '2024-11-20',
    status: 'Door in stock',
    specification: '',
  },
  {
    id: 5,
    articleNumber: 'D005',
    articleName: 'French Doors Pine Rustic',
    quantity: 2,
    unit: 'pcs',
    orderNumber: 'O2024005',
    customerNumber: 'K1001',
    deliveryDate: '2024-11-18',
    status: 'Frame not in stock',
    specification: 'White lacquer RAL 9010',
  },
  {
    id: 6,
    articleNumber: 'D006',
    articleName: 'Double Door Oak Split',
    quantity: 1,
    unit: 'pcs',
    orderNumber: 'O2024006',
    customerNumber: 'K1005',
    deliveryDate: '2024-11-25',
    status: 'Complete',
    specification: '',
  },
  {
    id: 7,
    articleNumber: 'D007',
    articleName: 'Fire Door Steel',
    quantity: 3,
    unit: 'pcs',
    orderNumber: 'O2024007',
    customerNumber: 'K1002',
    deliveryDate: '2024-11-13', // Overdue
    status: 'Delayed',
    specification: 'EI60 certified',
  },
  {
    id: 8,
    articleNumber: 'D008',
    articleName: 'Pocket Door Walnut',
    quantity: 2,
    unit: 'pcs',
    orderNumber: 'O2024008',
    customerNumber: 'K1003',
    deliveryDate: '2024-11-16',
    status: 'Complete',
    specification: 'Soft close mechanism',
  },
];

const statusOptions = [
  '-',
  'Door in stock',
  'Frame in stock',
  'Frame not in stock',
  'Complete',
  'Delayed'
];

// Helper function to get today's date in YYYY-MM-DD format
const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

// Helper function to get tomorrow's date
const getTomorrowDate = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
};

// Helper function to determine priority
const getPriority = (deliveryDate) => {
  const today = getTodayDate();
  const tomorrow = getTomorrowDate();
  
  if (deliveryDate < today) {
    return 'Delayed';
  } else if (deliveryDate === today || deliveryDate === tomorrow) {
    return 'Priority';
  }
  return null;
};

// HELPER FUNCTION TO RENDER SVG ICONS INLINE for KPI cards
const getKpiIcon = (iconName) => {
  const iconProps = {
    width: 24,
    height: 24,
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
    case 'Package':
      return (
        <svg {...iconProps} viewBox='0 0 24 24'>
          <line x1='16.5' y1='9.4' x2='7.5' y2='4.21'></line>
          <path d='M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z'></path>
          <polyline points='3.27 6.96 12 12.01 20.73 6.96'></polyline>
          <line x1='12' y1='22.08' x2='12' y2='12'></line>
        </svg>
      );
    case 'Clock':
      return (
        <svg {...iconProps} viewBox='0 0 24 24'>
          <circle cx='12' cy='12' r='10'></circle>
          <polyline points='12 6 12 12 16 14'></polyline>
        </svg>
      );
    case 'CheckCircle':
      return (
        <svg {...iconProps} viewBox='0 0 24 24'>
          <path d='M22 11.08V12a10 10 0 1 1-5.93-9.14'></path>
          <polyline points='22 4 12 14.01 9 11.01'></polyline>
        </svg>
      );
    default:
      return <span style={{ fontSize: '18px' }}>?</span>;
  }
};

function DashboardPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All Statuses');
  const [filterCustomer, setFilterCustomer] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortBy, setSortBy] = useState('deliveryDate');
  const [sortDirection, setSortDirection] = useState('asc');

  // Define the logo source using the absolute public path
  const logoSrc = '/furuhalls-logo.png';

  // Calculate KPIs (Key Performance Indicators)
  const statusCounts = useMemo(() => {
    const counts = {
      total: initialOrders.length,
      inStorage: 0,
      delayed: 0,
      completed: 0,
    };
    
    initialOrders.forEach((order) => {
      if (order.status === 'Door in stock' || order.status === 'Frame in stock') {
        counts.inStorage++;
      }
      if (order.status === 'Delayed' || getPriority(order.deliveryDate) === 'Delayed') {
        counts.delayed++;
      }
      if (order.status === 'Complete') {
        counts.completed++;
      }
    });
    
    return counts;
  }, []);

  const kpiData = [
    {
      title: 'Total Orders',
      count: statusCounts.total,
      color: 'bg-indigo-600',
      icon: 'ClipboardList',
    },
    {
      title: 'In Storage',
      count: statusCounts.inStorage,
      color: 'bg-blue-500',
      icon: 'Package',
    },
    {
      title: 'Delayed',
      count: statusCounts.delayed,
      color: 'bg-red-500',
      icon: 'Clock',
    },
    {
      title: 'Completed',
      count: statusCounts.completed,
      color: 'bg-green-500',
      icon: 'CheckCircle',
    },
  ];

  // Get unique customer numbers for filter
  const customerNumbers = useMemo(() => {
    const customers = [...new Set(initialOrders.map(o => o.customerNumber))];
    return customers.sort();
  }, []);

  // Sorting and Filtering Logic
  const sortedAndFilteredOrders = useMemo(() => {
    let orders = [...initialOrders];

    // Search filter
    if (searchTerm) {
      orders = orders.filter((order) => {
        const searchLower = searchTerm.toLowerCase();
        return (
          order.articleNumber.toLowerCase().includes(searchLower) ||
          order.articleName.toLowerCase().includes(searchLower) ||
          order.orderNumber.toLowerCase().includes(searchLower) ||
          order.customerNumber.toLowerCase().includes(searchLower)
        );
      });
    }

    // Status filter
    if (filterStatus !== 'All Statuses') {
      orders = orders.filter(order => order.status === filterStatus);
    }

    // Customer filter
    if (filterCustomer) {
      orders = orders.filter(order => order.customerNumber === filterCustomer);
    }

    // Date range filter
    if (startDate) {
      orders = orders.filter(order => order.deliveryDate >= startDate);
    }
    if (endDate) {
      orders = orders.filter(order => order.deliveryDate <= endDate);
    }

    // Sorting
    orders.sort((a, b) => {
      let comparison = 0;
      
      if (a[sortBy] > b[sortBy]) {
        comparison = 1;
      } else if (a[sortBy] < b[sortBy]) {
        comparison = -1;
      }

      return sortDirection === 'asc' ? comparison : comparison * -1;
    });

    return orders;
  }, [searchTerm, filterStatus, filterCustomer, startDate, endDate, sortBy, sortDirection]);

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
      style: {
        opacity: isCurrentSort ? 1 : 0.5, 
        transition: 'opacity 0.2s',
      },
    };

    if (isCurrentSort) {
      if (sortDirection === 'asc') {
        return (
          <svg {...iconProps} viewBox='0 0 24 24'>
            <path d='M12 19V5M5 12l7-7 7 7' />
          </svg>
        );
      } else {
        return (
          <svg {...iconProps} viewBox='0 0 24 24'>
            <path d='M12 5v14M19 12l-7 7-7-7' />
          </svg>
        );
      }
    } else {
      return (
        <svg {...iconProps} viewBox='0 0 24 24'>
          <path d='M7 16l5 5 5-5M7 8l5-5 5 5' />
        </svg>
      );
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Delayed':
        return 'status-delayed';
      case 'Door in stock':
      case 'Frame in stock':
        return 'status-in-storage';
      case 'Frame not in stock':
        return 'status-not-in-storage';
      case 'Complete':
        return 'status-completed';
      default:
        return 'status-default';
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterStatus('All Statuses');
    setFilterCustomer('');
    setStartDate('');
    setEndDate('');
  };

  return (
    <div className='dashboard-page'>
      <header className='dashboard-header'>
        <h2>
          <img 
            src={logoSrc} 
            alt="Furuhalls Logo" 
            style={{ 
              height: '75px',
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
   
      {/* Combined KPI and Filter area */}
      <div className='dashboard-data-and-filters'>
        
        {/* KPI Section */}
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

        {/* Filters and Search */}
        <div className='filter-panel'>
          <div className='filter-section'>
            <h3 className='filter-title'>Filters & Search</h3>
            <div className='filter-controls'>
              <div className='filter-group search-group'>
                <label htmlFor='search'>Search</label>
                <input
                  id='search'
                  type='text'
                  placeholder='Search by article, name, order...'
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
                  <option value='All Statuses'>All Statuses</option>
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div className='filter-group'>
                <label htmlFor='customer-filter'>Customer Number</label>
                <select
                  id='customer-filter'
                  value={filterCustomer}
                  onChange={(e) => setFilterCustomer(e.target.value)}
                  className='input-field'
                >
                  <option value=''>All Customers</option>
                  {customerNumbers.map((customer) => (
                    <option key={customer} value={customer}>
                      {customer}
                    </option>
                  ))}
                </select>
              </div>

              <div className='filter-group'>
                <label htmlFor='start-date'>From Date</label>
                <input
                  id='start-date'
                  type='date'
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className='input-field'
                />
              </div>

              <div className='filter-group'>
                <label htmlFor='end-date'>To Date</label>
                <input
                  id='end-date'
                  type='date'
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className='input-field'
                />
              </div>

              <div className='filter-group filter-actions'>
                <button 
                  onClick={clearFilters}
                  className='btn btn-clear'
                >
                  Clear Filters
                </button>
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
            {sortedAndFilteredOrders.length} of {initialOrders.length} orders shown
          </span>
        </h3>

        <table className='order-table'>
          <thead>
            <tr>
              <th>Article Number</th>
              <th>Article Name</th>
              <th>Quantity</th>
              <th>Order Number</th>
              <th>Customer Number</th>
              <th
                className='sortable-header'
                onClick={() => handleSortChange('deliveryDate')}
              >
                Delivery Date {getSortIcon('deliveryDate')}
              </th>
              <th>Specification</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedAndFilteredOrders.map((order) => {
              const priority = getPriority(order.deliveryDate);
              return (
                <tr key={order.id}>
                  <td>{order.articleNumber}</td>
                  <td>{order.articleName}</td>
                  <td>
                    {order.quantity} {order.unit}
                  </td>
                  <td>{order.orderNumber}</td>
                  <td>{order.customerNumber}</td>
                  <td>
                    {order.deliveryDate}
                    {priority && (
                      <span className={`priority-badge priority-${priority.toLowerCase()}`}>
                        {priority}
                      </span>
                    )}
                  </td>
                  <td className='specification-cell'>
                    {order.specification || '-'}
                  </td>
                  <td>
                    <span className={`status-badge ${getStatusClass(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <button className='btn btn-action'>Edit</button>
                  </td>
                </tr>
              );
            })}
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