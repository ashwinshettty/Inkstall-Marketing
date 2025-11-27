import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InnerCard from '../../ui/InnerCard';
import { FaCalendarAlt, FaClock, FaUser, FaPhone, FaUserTie } from 'react-icons/fa';

// Backend API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const api = axios.create({
 baseURL: API_BASE_URL,
 headers: {
   'Content-Type': 'application/json',
 },
});

const SalesCard = ({ filters, refreshTrigger, onEdit }) => {
 const [salesData, setSalesData] = useState([]);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
   const fetchSalesData = async () => {
     try {
       setLoading(true);
       const authToken = localStorage.getItem('authToken');
      
       const { data } = await api.get('/api/sales', {
         headers: {
           Authorization: `Bearer ${authToken}`,
         },
       });

       if (data.success) {
         setSalesData(data.sales);
       }
     } catch (error) {
       console.error('Error fetching sales data:', error);
     } finally {
       setLoading(false);
     }
   };

   fetchSalesData();
 }, [refreshTrigger]);

 // Filter sales data based on filters
 const filteredSales = salesData.filter(sale => {
   const matchesEvent = !filters.event || filters.event === 'all' || sale.type === filters.event;
   const matchesPriority = !filters.priority || filters.priority === 'all' || sale.priority === filters.priority;
   const matchesStatus = !filters.status || filters.status === 'all' || sale.status === filters.status;
   const matchesCounsellor = !filters.counsellor || filters.counsellor === 'all' || sale.createdBy === filters.counsellor;
   const matchesSearch = !filters.search ||
     sale.studentName?.toLowerCase().includes(filters.search.toLowerCase()) ||
     sale.title?.toLowerCase().includes(filters.search.toLowerCase()) ||
     sale.contactNumber?.includes(filters.search);

   return matchesEvent && matchesPriority && matchesStatus && matchesCounsellor && matchesSearch;
 });

 // Get background color for status
 const getStatusColor = (status) => {
   switch (status?.toLowerCase()) {
     case 'pending':
       return 'bg-orange-500';
     case 'confirmed':
       return 'bg-blue-500';
     case 'completed':
       return 'bg-green-500';
     case 'cancelled':
       return 'bg-red-500';
     default:
       return 'bg-gray-500';
   }
 };

 // Get background color for priority
 const getPriorityColor = (priority) => {
   switch (priority?.toLowerCase()) {
     case 'high':
       return 'bg-red-500';
     case 'medium':
       return 'bg-yellow-500';
     case 'low':
       return 'bg-green-500';
     default:
       return 'bg-gray-500';
   }
 };

 // Format date
 const formatDate = (dateString) => {
   if (!dateString) return '-';
   const date = new Date(dateString);
   return date.toLocaleDateString('en-US', {
     weekday: 'short',
     month: 'short',
     day: 'numeric',
     year: 'numeric'
   });
 };

 if (loading) {
   return (
     <div className="flex justify-center items-center py-12">
       <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
     </div>
   );
 }

 if (filteredSales.length === 0) {
   return (
     <div className="text-center py-12">
       <p className="text-gray-400 text-lg">No sales actions found</p>
     </div>
   );
 }

 return (
   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mt-6">
     {filteredSales.map((sale) => (
       <InnerCard key={sale._id}>
         {/* Title */}
         <h2 className="text-white font-semibold text-xl mb-3">
           {sale.title || 'Sales Action'}
         </h2>

         {/* Status and Priority Badges */}
         <div className="flex gap-2 mb-3">
           <span className={`${getStatusColor(sale.status)} text-white text-xs px-3 py-1 rounded-full font-medium`}>
             {sale.status || 'pending'}
           </span>
           <span className={`${getPriorityColor(sale.priority)} text-white text-xs px-3 py-1 rounded-full font-medium`}>
             {sale.priority || 'medium'}
           </span>
         </div>

         {/* Date and Time */}
         <div className="flex items-center gap-4 mb-3 text-gray-300 text-sm">
           <div className="flex items-center gap-2">
             <FaCalendarAlt className="text-gray-400" />
             <span>{formatDate(sale.date)}</span>
           </div>
           <div className="flex items-center gap-2">
             <FaClock className="text-gray-400" />
             <span>{sale.time || '-'}</span>
           </div>
         </div>

         {/* Student Name */}
         <div className="flex items-center gap-2 mb-2 text-white">
           <FaUser className="text-gray-400" />
           <span className="font-medium">{sale.studentName || '-'}</span>
         </div>

         {/* Contact Number */}
         <div className="flex items-center gap-2 mb-2 text-gray-300 text-sm">
           <FaPhone className="text-gray-400" />
           <span>{sale.contacts?.[0]?.number || '-'}</span>
         </div>


         <div className="flex items-center gap-2 text-gray-300 text-sm">
           <FaUserTie className="text-gray-400" />
           <span>{sale.createdBy || '-'}</span>
         </div>


         {/* Edit Button */}
         <div className="mt-4 flex justify-end gap-2">
           <button className="px-4 py-1.5 bg-green-600 text-white text-sm rounded-sm hover:bg-green-700 transition-colors font-medium">
             COMPLETE
           </button>
           <button 
             onClick={() => onEdit(sale)}
             className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded-sm hover:bg-blue-700 transition-colors font-medium"
           >
             EDIT
           </button>
         </div>
       </InnerCard>
     ))}
   </div>
 );
};

export default SalesCard;
