import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { APP_CODES } from 'constants/config';
import { CONTROLPANEL_BASE_URL } from 'constants/config';
import { initialState } from 'state/slices/UserSlice';

const useAccessCheck = () => {
  const [isChecking, setIsChecking] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const navigate = useNavigate();
  const baseUrl = useSelector((state) => state.user.baseUrl);
  const token = window.localStorage.getItem("token");

  useEffect(() => {
    const checkAccess = async () => {
      try {
        console.log('Starting API access check...');
        setIsChecking(true);
        
        const appCode = APP_CODES.find(app => initialState.frontendURL.startsWith(app.URL))?.CODE || 'LOCALHOST';
        const endpoint = "/organization/check-by-code";
        
        const response = await axios.get(`${CONTROLPANEL_BASE_URL}${endpoint}/${appCode}/`);

        console.log('API Response:', response);
        
        if (response.status === 200) {
          const { exists, message, data } = response.data;
          const accessGranted = exists === true && data?.status === 'active';

          if (accessGranted) {
            setHasAccess(true);
            console.log('✅ Access granted - Organization exists and is active');
          } else {
            setHasAccess(false);
            console.log('❌ Access denied - Organization not found or inactive');
            console.log('Reason:', message);
            navigate('/access-denied');
          }
        } else {
          setHasAccess(false);
          console.log('❌ API returned non-200 status:', response.status);
          navigate('/access-denied');
        }
      } catch (error) {
        console.error('❌ Access check failed:', error);
        alert('API Error: ' + error.message);
        setHasAccess(false);
        console.log('❌ API failed - redirecting to access-denied');
        navigate('/access-denied');
      } finally {
        setIsChecking(false);
      }
    };

    // Always check access on every page load
    checkAccess();
  }, [baseUrl, token, navigate]);

  return { isChecking, hasAccess };
};

export default useAccessCheck;
