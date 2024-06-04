import React, { useEffect } from 'react'
import { fetchDTRById } from '../../../state/slices/DtrGetSlice';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

const GetDtr = () => {
    const dispatch = useDispatch();
    const userProfile = useSelector(state => state.user.userProfile);
    const dtrs = useSelector(state => state.emp.employees);

    // Access the id from the userProfile object
    const userId = userProfile.id;


    useEffect(() => {
        dispatch(fetchDTRById());
    }, [dispatch]);
    return (
        <div>GetDtr</div>
    )
}

export default GetDtr