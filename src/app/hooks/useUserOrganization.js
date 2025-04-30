import { useSelector } from 'react-redux';

/**
 * Custom hook to get the current user's organization data from Redux.
 * Used across Office Settings components (Departments, Designations, Branches, etc.)
 * 
 * @returns {Object} userOrganization - Object containing organization id and name
 * @returns {number|string} userOrganization.id - The organization ID
 * @returns {string} userOrganization.name - The organization name
 */
const useUserOrganization = () => {
  // Get user details from Redux store (same approach used in OfficeSetting.jsx)
  const userDetails = useSelector((state) => state.emp?.user_details);
  
  // Format the organization data consistently for all components
  const userOrganization = userDetails ? {
    id: userDetails?.organization_id || userDetails?.organization,
    name: userDetails?.organization_name || "Your Organization"
  } : null;
  
  return userOrganization;
};

export default useUserOrganization; 