/**
 * Filters leads based on their last activity date within the last N days
 * @param {Array} leads - Array of lead objects
 * @param {number} days - Number of days to look back
 * @returns {Array} - Filtered array of leads
 */
export const filterLeadsByDateRange = (leads, days) => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
  
    return leads.filter(lead => {
      // Get the most recent status change date or fallback to createdAt
      let lastStatusChange;
      if (lead.statusHistory?.length > 0) {
        const sortedHistory = [...lead.statusHistory].sort((a, b) => 
          new Date(b.date) - new Date(a.date)
        );
        lastStatusChange = new Date(sortedHistory[0].date);
      } else {
        lastStatusChange = new Date(lead.createdAt || 0);
      }
      
      return lastStatusChange >= startDate && lastStatusChange <= endDate;
    });
  };
  
  /**
   * Groups leads by their sales status
   * @param {Array} leads - Array of lead objects
   * @returns {Object} - Object with status as keys and arrays of leads as values
   */
  export const groupLeadsByStatus = (leads = []) => {
    return leads.reduce((acc, lead) => {
      const status = lead.sales_status?.toLowerCase() || 'no status';
      if (!acc[status]) {
        acc[status] = [];
      }
      acc[status].push(lead);
      return acc;
    }, {});
  };
  
  /**
   * Gets a formatted date range string for display
   * @param {number} days - Number of days in the past to start the range
   * @returns {string} - Formatted date range string
   */
  export const getDateRangeText = (days) => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    return `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
  };