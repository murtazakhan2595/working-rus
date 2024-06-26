
const Status = (status) => {
    if(status.includes('Approved'))
        return 'Approved'
    else if (status.includes('Denied'))
        return 'Denied'
    else if (status.includes('Pending'))
        return 'Pending'

};


export default Status;
