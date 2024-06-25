function getLavefromEmployeeInfo(data) {
    const leaveInfo = {
        employee_id: data?.id ?? '',
        name: `${data?.first_name} ${data.last_name}`,
        date: data?.joining_date ?? '',
        position: data?.department_position ?? '',
        department: data?.department_name ?? '',
        joining_date: data?.joining_date ?? '',
        nationality: data?.nic ?? '',
        start_date: '',
        end_date:  '',
        last_work_day:  '',
        rejoining_date: '',
        total_leave: '',
        leave_type:  '',
        reason: '',
        contact_no:  '',
        country_code: '',
        report_to: data?.direct_report ?? '',
        address_during_leave: '',
    };
    return leaveInfo;
}

export {
    getLavefromEmployeeInfo,
}