import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Swal from 'sweetalert2';
import { apiAddSchedule } from '../../services/product';
import { FaCalendarPlus, FaTimes, FaMapMarkerAlt } from 'react-icons/fa';

const WASTE_TYPES = [
    'General Waste',
    'Recyclable Materials',
    'Organic/Food Waste',
    'Electronic (E-Waste)',
    'Hazardous Waste',
    'Fashion & Textiles',
    'Plastics',
    'Metals & Scrap',
    'Glass',
    'Wood & Furniture',
    'Paper & Cardboard',
    'Rubber',
    'Other',
];

const WasteSchedulePage = ({ onScheduleAdded }) => {
    const [pickupDate, setPickupDate] = useState(null);
    const [location, setLocation] = useState('');
    const [wasteType, setWasteType] = useState('General Waste');
    const [estimatedWeight, setEstimatedWeight] = useState('');
    const [notes, setNotes] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const scheduleData = {
            pickupDate: pickupDate ? pickupDate.toISOString() : null,
            location,
            wasteType,
            estimatedWeight: estimatedWeight ? parseFloat(estimatedWeight) : 0,
            notes,
        };
        try {
            await apiAddSchedule(scheduleData);
            Swal.fire({
                icon: 'success',
                title: 'Scheduled!',
                text: 'Your waste pickup has been scheduled successfully!',
                confirmButtonColor: '#026937',
            });
            setIsModalOpen(false);
            setPickupDate(null);
            setLocation('');
            setWasteType('General Waste');
            setEstimatedWeight('');
            setNotes('');
            if (onScheduleAdded) onScheduleAdded();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Failed',
                text: error.response?.data?.message || 'There was an error. Please try again.',
                confirmButtonColor: '#026937',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 bg-green-600 text-white py-2 px-4 rounded-xl hover:bg-green-700 transition-colors shadow-sm font-medium"
            >
                <FaCalendarPlus />
                <span>Schedule Pickup</span>
            </button>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden">

                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-green-600 to-teal-500 p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-bold">Schedule Waste Pickup</h2>
                                    <p className="text-green-100 text-sm mt-1">Fill in the details for your pickup</p>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="text-white hover:text-green-200">
                                    <FaTimes size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">

                            {/* Pickup Date */}
                            <div>
                                <label className="block text-gray-700 text-sm font-semibold mb-2">📅 Pickup Date & Time</label>
                                <DatePicker
                                    selected={pickupDate}
                                    onChange={(date) => setPickupDate(date)}
                                    showTimeSelect
                                    dateFormat="Pp"
                                    minDate={new Date()}
                                    placeholderText="Select date and time"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700"
                                    required
                                />
                            </div>

                            {/* Location */}
                            <div>
                                <label className="block text-gray-700 text-sm font-semibold mb-2">📍 Location</label>
                                <div className="relative">
                                    <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400" />
                                    <input
                                        type="text"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        placeholder="Enter your pickup location"
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Waste Type */}
                            <div>
                                <label className="block text-gray-700 text-sm font-semibold mb-2">♻️ Waste Type</label>
                                <select
                                    value={wasteType}
                                    onChange={(e) => setWasteType(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700"
                                >
                                    {WASTE_TYPES.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Estimated Weight */}
                            <div>
                                <label className="block text-gray-700 text-sm font-semibold mb-2">⚖️ Estimated Weight (kg) <span className="text-gray-400 font-normal">Optional</span></label>
                                <input
                                    type="number"
                                    value={estimatedWeight}
                                    onChange={(e) => setEstimatedWeight(e.target.value)}
                                    placeholder="e.g. 5"
                                    min="0"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700"
                                />
                                {estimatedWeight > 0 && (
                                    <p className="text-xs text-green-600 mt-1">
                                        🏆 You'll earn ~{Math.round(estimatedWeight * 10)} points on completion
                                    </p>
                                )}
                            </div>

                            {/* Notes */}
                            <div>
                                <label className="block text-gray-700 text-sm font-semibold mb-2">📝 Notes <span className="text-gray-400 font-normal">Optional</span></label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Any special instructions for the pickup agent..."
                                    rows={2}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700 resize-none"
                                />
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
                                >
                                    {loading ? 'Scheduling...' : 'Schedule Pickup'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default WasteSchedulePage;