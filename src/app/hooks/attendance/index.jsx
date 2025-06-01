import { format } from 'date-fns';
import api from 'utils/api'; // Make sure this path matches your api utility location

export const getEmployeeShiftDetails = async (userId, date) => {
  try {
    const response = await api.get(`/api/attendance/employee-shift-details`, {
      params: {
        employee_id: userId,
        date: format(date, 'yyyy-MM-dd')
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching employee shift details:', error);
    throw error;
  }
};

// Add this function to calculate offset days
export const getEmployeeOffsetCount = async (userId) => {
  try {
    const response = await api.get(`/api/attendance/employee-offset-count`, {
      params: {
        employee_id: userId
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching employee offset count:', error);
    throw error;
  }
};
