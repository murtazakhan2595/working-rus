import React from 'react';
import { RxCross2 } from 'react-icons/rx';

const notifications = [
    {
        icon: null,
        title: 'Abdul',
        description: 'some description',
        time: 'Apr 18, 8:37',
        isRead: true,
    },
    {
        icon: null,
        title: 'Abdul',
        description: 'some description',
        time: 'Apr 18, 8:37',
        isRead: true,
    },
    {
        icon: null,
        title: 'Abdul',
        description: 'some description',
        time: 'Apr 18, 8:37',
        isRead: true,
    },
    {
        icon: null,
        title: 'Abdul',
        description: 'some description',
        time: 'Apr 18, 8:37',
        isRead: true,
    },
    {
        icon: null,
        title: 'Abdul',
        description: 'some description',
        time: 'Apr 18, 8:37',
        isRead: true,
    },
    {
        icon: null,
        title: 'Abdul',
        description: 'some description',
        time: 'Apr 18, 8:37',
        isRead: true,
    },
    {
        icon: null,
        title: 'Abdul',
        description: 'some description',
        time: 'Apr 18, 8:37',
        isRead: true,
    },
    {
        icon: null,
        title: 'Inam',
        description: 'some description is here...',
        time: 'Apr 18, 8:37',
        isRead: true,
    },
    {
        icon: null,
        title: 'Sakina Burhan',
        description: 'Lorem ipsum dolor sit amet',
        time: 'Apr 18, 8:37',
        isRead: false,
    },
    {
        icon: null,
        title: 'Sakina Burhan',
        description: 'Lorem ipsum dolor sit amet',
        time: 'Apr 18, 8:37',
        isRead: false,
    },
    {
        icon: null,
        title: 'Sakina Burhan',
        description: 'Lorem ipsum dolor sit amet',
        time: 'Apr 18, 8:37',
        isRead: false,
    },
];

// Function to generate a random color
const getRandomColor = () => {
    const colors = [
        'bg-red-500',
        'bg-green-500',
        'bg-blue-500',
        'bg-yellow-500',
        'bg-purple-500',
        'bg-pink-500',
        'bg-indigo-500',
    ];
    return colors[Math.floor(Math.random() * colors.length)];
};

export const NotificationItem = ({ icon, title, description, time, isRead }) => {
    const randomColor = getRandomColor();
    return (
        <div className={`flex items-start mx-3 py-2 border-b ${isRead ? 'bg-white' : ''}`}>
            <div className="flex-shrink-0">
                {icon ? (
                    <img src={icon} alt={title} className="w-10 h-10 rounded-full" />
                ) : (
                    <div className={`w-10 h-10 font-semibold rounded-full text-white flex items-center justify-center ${randomColor}`}>
                        {title.slice(0, 2).toUpperCase()}
                    </div>
                )}
            </div>
            <div className="ml-3">
                <div className="text-[14px] font-bold text-baseGray">{title}</div>
                <div className="text-sm text-gray-500">{description}</div>
                <div className="text-xs text-gray-400">{time}</div>
            </div>
        </div>
    );
};

const Notifications = ({ onClose }) => {
    return (
        <div className="w-72 top-10 h-[85vh] overflow-hidden bg-white shadow-lg rounded-xl absolute left-56 z-50">
            <div className='flex justify-end mt-2 pr-2'>
                <RxCross2 className='text-gray-300 text-lg cursor-pointer' onClick={onClose} />
            </div>
            <div className="flex items-center justify-between border-b mx-3 py-2">
                <h2 className="text-lg font-semibold">Notifications</h2>
                <div className="flex space-x-4">
                    <button className="text-blue-600 font-lato text-[13px]">All</button>
                    <button className="text-gray-500 font-lato text-[13px]">Unread</button>
                </div>
            </div>
            <div className="overflow-y-auto h-[80vh] gray-scorll">
                {notifications.map((notification, index) => (
                    <NotificationItem
                        key={index}
                        icon={notification.icon}
                        title={notification.title}
                        description={notification.description}
                        time={notification.time}
                        isRead={notification.isRead}
                    />
                ))}
            </div>
        </div>
    );
};

export default Notifications;
