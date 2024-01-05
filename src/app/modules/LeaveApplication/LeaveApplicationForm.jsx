import React, { useState } from 'react';
import LeaveHeader from './LeaveHeader';
import Datepicker from "../Dashboard/Datepicker";
import moment from 'moment';


const EmployeeForm = () => {
    const [formData, setFormData] = useState({
        employeeId: '',
        name: '',
        dateOfBirth: '',
        position: '',
        department: '',
        joiningDate: '',
        nationality: '',
        leaveType: {
            annual: false,
            casual: false,
            emergency: false,
            maternity: false,
            unpaid: false,
            sick: false,
        },
        reason: '',
        startDate: '',
        endDate: '',
        lastWorkDay: '',
        rejoiningDate: '',
        totalLeaves: '',
        contactNumber: '',
        addressDuringLeave: '',
        reportingManager: '',
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === 'checkbox') {
            setFormData({
                ...formData,
                leaveType: {
                    ...formData.leaveType,
                    [name]: checked,
                },
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add your form submission logic here
        console.log('Form submitted:', formData);
    };

    return (
        <div>
            <LeaveHeader post="Leave Application Form" />
            <div>
                <h1 className="font-sfpro tracking-wide text-input text-base">Note: Annual Leave Application Should be Submitted to HR Two Months Prior to Annual Leave Date.</h1>
                <form onSubmit={handleSubmit}>
                    <div>
                        <div><label className="font-sfpro tracking-wide font-semibold
                            text-input text-base">
                            Employee ID:
                        </label>
                            <input type="text" name="employeeId" value={formData.employeeId} onChange={handleChange} /></div>
                        <div className='flex justify-between'>
                            <div className='flex flex-col'>
                                <div><label className="font-sfpro tracking-wide font-semibold
                            text-input text-base">
                                    Name:
                                </label>
                                    <input type="text" name="name" value={formData.name} onChange={handleChange} />
                                </div>

                                <div><label className="font-sfpro tracking-wide font-semibold
                            text-input text-base">
                                    Position:
                                </label>
                                    <input type="text" name="position" value={formData.position} onChange={handleChange} />
                                </div>


                                <div><label className="font-sfpro tracking-wide font-semibold
                            text-input text-base">
                                    Joining Date:
                                </label>
                                    <input type="date" name="joiningDate" value={formData.joiningDate} onChange={handleChange} />
                                    {/* <Datepicker className="z-50" name="Deadline" required onChange={(date) => {
                        let formattedDate = moment(date).format("YYYY-MM-DD");
                        handleChange("Deadline", formattedDate);
                    }}
                    /> */}
                                </div>
                            </div>
                            <div className='flex flex-col'>
                                <div><label className="font-sfpro tracking-wide font-semibold
                            text-input text-base">
                                    Date
                                </label>
                                    <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} />
                                </div>

                                <div><label className="font-sfpro tracking-wide font-semibold
                            text-input text-base">
                                    Department:
                                </label>
                                    <input type="text" name="department" value={formData.department} onChange={handleChange} />
                                </div>

                                <div><label className="font-sfpro tracking-wide font-semibold
                            text-input text-base">
                                    Nationality:
                                </label>
                                    <input type="text" name="nationality" value={formData.nationality} onChange={handleChange} />
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="font-sfpro tracking-wide font-semibold
                            text-input text-base">
                                Leave Type:
                                <label className="font-sfpro tracking-wide font-semibold
                            text-input text-base">
                                    Annual
                                </label>
                                <input
                                    type="checkbox"
                                    name="annual"
                                    checked={formData.leaveType.annual}
                                    onChange={handleChange}
                                />
                                <label>
                                    Casual
                                </label>
                                <input
                                    type="checkbox"
                                    name="casual"
                                    checked={formData.leaveType.casual}
                                    onChange={handleChange}
                                />
                                <label>
                                    Emergency
                                </label>
                                <input
                                    type="checkbox"
                                    name="emergency"
                                    checked={formData.leaveType.emergency}
                                    onChange={handleChange}
                                />
                                <label>
                                    Maternity
                                </label>
                                <input
                                    type="checkbox"
                                    name="maternity"
                                    checked={formData.leaveType.maternity}
                                    onChange={handleChange}
                                />
                                <label>
                                    Unpaid
                                </label>
                                <input
                                    type="checkbox"
                                    name="unpaid"
                                    checked={formData.leaveType.unpaid}
                                    onChange={handleChange}
                                />
                                <label>
                                    Sick
                                </label>
                                <input
                                    type="checkbox"
                                    name="sick"
                                    checked={formData.leaveType.sick}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div>
                            <label>
                                Reason:
                            </label>

                            <textarea name="reason" value={formData.reason} onChange={handleChange} />
                        </div>


                        <h1 className='text-2xl font-semibold'>Leave Details</h1>

                        <div className='flex justify-between'>
                            <div className='flex flex-col'>
                                <div><label className="font-sfpro tracking-wide font-semibold
                            text-input text-base">
                                    Start Date:
                                </label>
                                    <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} />
                                </div>
                                <div><label className="font-sfpro tracking-wide font-semibold
                            text-input text-base">
                                    Last Work Day:
                                </label>
                                    <input type="date" name="lastWorkDay" value={formData.lastWorkDay} onChange={handleChange} />
                                </div>
                                <div><label className="font-sfpro tracking-wide font-semibold
                            text-input text-base">
                                    Total Leaves:
                                </label>
                                    <input type="text" name="totalLeaves" value={formData.totalLeaves} onChange={handleChange} />
                                </div>
                            </div>

                            <div className='flex flex-col'>
                                <div><label className="font-sfpro tracking-wide font-semibold
                            text-input text-base">
                                    End Date:
                                </label>
                                    <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} />
                                </div>

                                <div><label className="font-sfpro tracking-wide font-semibold
                            text-input text-base">
                                    Rejoining Date:
                                </label>
                                    <input type="date" name="rejoiningDate" value={formData.rejoiningDate} onChange={handleChange} />
                                </div>

                                <div><label className="font-sfpro tracking-wide font-semibold
                            text-input text-base">
                                    Contact Number:
                                </label>
                                    <input type="text" name="contactNumber" value={formData.contactNumber} onChange={handleChange} />
                                </div>
                            </div>
                        </div>

                        <div><label className="font-sfpro tracking-wide font-semibold
                            text-input text-base">
                            Address During Leave:
                        </label>
                            <textarea name="addressDuringLeave" value={formData.addressDuringLeave} onChange={handleChange} />
                        </div>
                        <div><label className="font-sfpro tracking-wide font-semibold
                            text-input text-base">
                            Reporting Manager:
                        </label>
                            <select name="reportingManager" value={formData.reportingManager} onChange={handleChange}>
                                <option value="">Select...</option>
                                <option value="manager1">Manager 1</option>
                                <option value="manager2">Manager 2</option>
                                {/* Add more options as needed */}
                            </select>
                        </div>
                        <button type="submit">Submit Application</button>

                    </div>
                </form>
            </div>

            <div>
                {/* <form onSubmit={handleSubmit}>
                    <label className="font-sfpro tracking-wide font-semibold
                            text-input text-base">
                        Employee ID:
                    </label>
                    <input type="text" name="employeeId" value={formData.employeeId} onChange={handleChange} />

                    <label className="font-sfpro tracking-wide font-semibold
                            text-input text-base">
                        Name:
                    </label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} />

                    <label className="font-sfpro tracking-wide font-semibold
                            text-input text-base">
                        Date
                    </label>
                    <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} />

                    <label className="font-sfpro tracking-wide font-semibold
                            text-input text-base">
                        Position:
                    </label>
                    <input type="text" name="position" value={formData.position} onChange={handleChange} />

                    <label className="font-sfpro tracking-wide font-semibold
                            text-input text-base">
                        Department:
                    </label>
                    <input type="text" name="department" value={formData.department} onChange={handleChange} />

                    <label className="font-sfpro tracking-wide font-semibold
                            text-input text-base">
                        Joining Date:
                    </label>
                    <input type="date" name="joiningDate" value={formData.joiningDate} onChange={handleChange} />

                    <label className="font-sfpro tracking-wide font-semibold
                            text-input text-base">
                        Nationality:
                    </label>
                    <input type="text" name="nationality" value={formData.nationality} onChange={handleChange} />

                    <div>
                        Leave Type:
                        <label className="font-sfpro tracking-wide font-semibold
                            text-input text-base">
                            Annual
                        </label>
                        <input
                            type="checkbox"
                            name="annual"
                            checked={formData.leaveType.annual}
                            onChange={handleChange}
                        />
                        <label>
                            Casual
                        </label>
                        <input
                            type="checkbox"
                            name="casual"
                            checked={formData.leaveType.casual}
                            onChange={handleChange}
                        />
                        <label>
                            Emergency
                        </label>
                        <input
                            type="checkbox"
                            name="emergency"
                            checked={formData.leaveType.emergency}
                            onChange={handleChange}
                        />
                        <label>
                            Maternity
                        </label>
                        <input
                            type="checkbox"
                            name="maternity"
                            checked={formData.leaveType.maternity}
                            onChange={handleChange}
                        />
                        <label>
                            Unpaid
                        </label>
                        <input
                            type="checkbox"
                            name="unpaid"
                            checked={formData.leaveType.unpaid}
                            onChange={handleChange}
                        />
                        <label>
                            Sick
                        </label>
                        <input
                            type="checkbox"
                            name="sick"
                            checked={formData.leaveType.sick}
                            onChange={handleChange}
                        />
                    </div>

                    <label>
                        Reason:
                    </label>

                    <textarea name="reason" value={formData.reason} onChange={handleChange} />
                    <h1 className='text-3xl'>Leave Details</h1>
                    <label className="font-sfpro tracking-wide font-semibold
                            text-input text-base">
                        Start Date:
                    </label>
                    <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} />

                    <label className="font-sfpro tracking-wide font-semibold
                            text-input text-base">
                        End Date:
                    </label>
                    <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} />

                    <label className="font-sfpro tracking-wide font-semibold
                            text-input text-base">
                        Last Work Day:
                    </label>
                    <input type="date" name="lastWorkDay" value={formData.lastWorkDay} onChange={handleChange} />

                    <label className="font-sfpro tracking-wide font-semibold
                            text-input text-base">
                        Rejoining Date:
                    </label>
                    <input type="date" name="rejoiningDate" value={formData.rejoiningDate} onChange={handleChange} />

                    <label className="font-sfpro tracking-wide font-semibold
                            text-input text-base">
                        Total Leaves:
                    </label>
                    <input type="text" name="totalLeaves" value={formData.totalLeaves} onChange={handleChange} />

                    <label className="font-sfpro tracking-wide font-semibold
                            text-input text-base">
                        Contact Number:
                    </label>
                    <input type="text" name="contactNumber" value={formData.contactNumber} onChange={handleChange} />

                    <label className="font-sfpro tracking-wide font-semibold
                            text-input text-base">
                        Address During Leave:
                    </label>
                    <textarea name="addressDuringLeave" value={formData.addressDuringLeave} onChange={handleChange} />

                    <label className="font-sfpro tracking-wide font-semibold
                            text-input text-base">
                        Reporting Manager:
                    </label>
                    <select name="reportingManager" value={formData.reportingManager} onChange={handleChange}>
                        <option value="">Select...</option>
                        <option value="manager1">Manager 1</option>
                        <option value="manager2">Manager 2</option>
                    </select>

                    <button type="submit">Submit</button>

                </form> */}
            </div>
        </div>
    );
};

export default EmployeeForm;
