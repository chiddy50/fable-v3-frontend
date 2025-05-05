'use client';

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';

interface DatePickerProps {
  initialValue: string | null;
  setDisplayValue: React.Dispatch<React.SetStateAction<string>>;   
  displayValue: string;
}

const DatePickerComponent: React.FC<DatePickerProps> = ({
    initialValue,
    setDisplayValue,
    displayValue
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState({
        year: '',
        month: '',
        day: ''
    });

    const [daysInMonth, setDaysInMonth] = useState<number[]>([]);
    const datePickerRef = useRef<HTMLDivElement>(null);

    // Generate years (from 1900 to current year)
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - 1899 }, (_, i) => currentYear - i);

    // Months array
    const months = [
        { value: 1, label: 'January' },
        { value: 2, label: 'February' },
        { value: 3, label: 'March' },
        { value: 4, label: 'April' },
        { value: 5, label: 'May' },
        { value: 6, label: 'June' },
        { value: 7, label: 'July' },
        { value: 8, label: 'August' },
        { value: 9, label: 'September' },
        { value: 10, label: 'October' },
        { value: 11, label: 'November' },
        { value: 12, label: 'December' }
    ];

    // Initialize with initialValue prop if it exists
    useEffect(() => {
        if (initialValue && typeof initialValue === 'string') {
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (dateRegex.test(initialValue)) {
                try {
                    const date = new Date(initialValue);
                    if (!isNaN(date.getTime())) {
                        const year = date.getFullYear().toString();
                        // Month is 0-indexed in JS Date
                        const month = (date.getMonth() + 1).toString();
                        const day = date.getDate().toString();
                        
                        setSelectedDate({
                            year,
                            month,
                            day
                        });
                    }
                } catch (error) {
                    console.error("Invalid date format:", error);
                }
            }
        }
    }, [initialValue]);

    // Handle click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Update days based on selected year and month
    useEffect(() => {
        if (selectedDate.year && selectedDate.month) {
            const daysCount = getDaysInMonth(parseInt(selectedDate.year), parseInt(selectedDate.month));
            setDaysInMonth(Array.from({ length: daysCount }, (_, i) => i + 1));
        } else {
            setDaysInMonth([]);
        }
    }, [selectedDate.year, selectedDate.month]);

    // Update display value when date changes
    useEffect(() => {
        if (selectedDate.year && selectedDate.month && selectedDate.day) {
            const monthName = months.find(m => m.value === parseInt(selectedDate.month))?.label;
            setDisplayValue(`${monthName}, ${getOrdinalSuffix(selectedDate.day)} ${selectedDate.year}`);
        } else {
            setDisplayValue('');
        }
    }, [selectedDate]);

    // Get days in month considering leap years
    const getDaysInMonth = (year: number, month: number) => {
        // Month is 1-12 in our UI but 0-11 in Date API
        return new Date(year, month, 0).getDate();
    };

    // Get ordinal suffix for day (1st, 2nd, 3rd, etc.)
    const getOrdinalSuffix = (day: string) => {
        const parsedDay = parseInt(day);
        if (parsedDay > 3 && parsedDay < 21) return `${parsedDay}th`;
        switch (parsedDay % 10) {
            case 1: return `${parsedDay}st`;
            case 2: return `${parsedDay}nd`;
            case 3: return `${parsedDay}rd`;
            default: return `${parsedDay}th`;
        }
    };

    const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const year = e.target.value;
        setSelectedDate(prev => ({
            ...prev,
            year,
            // Reset day when year changes if it would become invalid
            day: prev.month && prev.day ?
                Math.min(parseInt(prev.day), getDaysInMonth(parseInt(year), parseInt(prev.month))).toString() :
                ''
        }));
    };

    const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const month = e.target.value;
        setSelectedDate(prev => ({
            ...prev,
            month,
            // Reset day when month changes if it would become invalid
            day: prev.day && prev.year ?
                Math.min(parseInt(prev.day), getDaysInMonth(parseInt(prev.year), parseInt(month))).toString() :
                ''
        }));
    };

    const handleDayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedDate(prev => ({
            ...prev,
            day: e.target.value
        }));
    };

    return (
        <div className="w-full" ref={datePickerRef}>
            <label className="block text-gray-600 text-sm mb-2">Date of birth <span className="text-[10px]">(Optional)</span> </label>

            <div className="relative">
                <div
                    className="w-full bg-gray-100 rounded-lg p-3 flex items-center cursor-pointer"
                    onClick={() => setIsOpen(true)}
                >
                    <Image
                        src="/icon/calendar.svg"
                        alt="calendar icon"
                        className="mr-2"
                        width={17}
                        height={17}
                    />
                    <span className="text-gray-500 text-sm">
                        {displayValue || 'Select date'}
                    </span>
                </div>

                {isOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg p-4 z-10 border border-gray-200">
                        <div className="grid grid-cols-3 gap-5">
                            {/* Year Dropdown */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Year</label>
                                <div className="p-1 border border-gray-300 rounded-lg">
                                    <select
                                        value={selectedDate.year}
                                        onChange={handleYearChange}
                                        className="w-full text-xs rounded-lg py-1 border-none focus:outline-none"
                                    >
                                        <option value="">Year</option>
                                        {years.map(year => (
                                            <option key={year} value={year}>
                                                {year}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Month Dropdown */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Month</label>
                                
                                <div className="p-1 border border-gray-300 rounded-lg">                                
                                    <select
                                        value={selectedDate.month}
                                        onChange={handleMonthChange}
                                        disabled={!selectedDate.year}
                                        className={`w-full rounded-lg text-xs disabled:bg-white py-1 border-none focus:outline-none ${!selectedDate.year ? 'bg-gray-100 opacity-60 cursor-not-allowed' : ''}`}
                                    >
                                        <option value="">Month</option>
                                        {months.map(month => (
                                            <option key={month.value} value={month.value}>
                                                {month.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Day Dropdown */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Day</label>
                                
                                <div className="p-1 border border-gray-300 rounded-lg">                                                                
                                    <select
                                        value={selectedDate.day}
                                        onChange={handleDayChange}
                                        disabled={!selectedDate.year || !selectedDate.month}
                                        className={`w-full text-xs disabled:bg-white rounded-lg py-1 border-none focus:outline-none  ${(!selectedDate.year || !selectedDate.month) ? 'bg-gray-100 opacity-60 cursor-not-allowed' : ''}`}
                                    >
                                        <option value="">Select Day</option>
                                        {daysInMonth.map(day => (
                                            <option key={day} value={day}>
                                                {day}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DatePickerComponent;