import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { apiEditProduct, apiGetSingleScheduledProducts } from '../../services/product';
import { FaArrowLeft, FaCalendarAlt, FaMapMarkerAlt, FaRecycle, FaStickyNote } from 'react-icons/fa';
import Swal from 'sweetalert2';

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

const WasteEditPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        pickupDate: new Date(),
        location: '',
        wasteType: 'General Waste',
        estimatedWeight: '',
        notes: ''
    });

    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                const response = await apiGetSingleScheduledProducts(id);
                const schedule = response.data;
                setFormData({
                    pickupDate: new Date(schedule.pickupDate),
                    location: schedule.location || '',
                    wasteType: schedule.wasteType || 'General Waste',
                    estimatedWeight: schedule.estimatedWeight || '',
                    notes: schedule.notes || ''
                });
            } catch (error) {
                Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to load schedule details' });
            } finally {
                setLoading(false);
            }
        };
        fetchSchedule();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await apiEditProduct(id, {
                ...formData,
                pickupDate: formData.pickupDate.toISOString(),
                estimatedWeight: formData.estimatedWeight ? parseFloat(formData.estimatedWeight) : 0
            });
            await Swal.fire({
                icon: 'success',
                title: 'Rescheduled!',
                text: 'Your pickup has been rescheduled successfully',
                confirmButtonColor: '#026937'
            });
            navigate(-1);
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'Failed', text: error.message || 'Failed to update schedule' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-4 bg-gray-50 min-h-screen">

            {/* Back Button */}
            <button onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium">
                <FaArrowLeft /> Back
            </button>

            {/* Header */}
            <div className="rounded-2xl p-6 text-white"
                style={{ background: 'linear-gradient(135deg, #026937, #00BFA5)' }}>
                <h1 className="text-2xl font-bold">Reschedule Pickup</h1>
                <p className="text-green-200 text-sm mt-1">Update your waste pickup details</p>
            </div>

            {/* Form */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Pickup Date */}
                    <div>
                        <label className="flex items-center gap-2 text-gray-700 text-sm font-semibold mb-2">
                            <FaCalendarAlt className="text-green-500" /> Pickup Date & Time
                        </label>
                        <DatePicker
                            selected={formData.pickupDate}
                            onChange={(date) => setFormData(prev => ({ ...prev, pickupDate: date }))}
                            showTimeSelect
                            timeFormat="HH:mm"
                            timeIntervals={15}
                            dateFormat="MMMM d, yyyy h:mm aa"
                            minDate={new Date()}
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700"
                            required
                        />
                    </div>

                    {/* Location */}
                    <div>
                        <label className="flex items-center gap-2 text-gray-700 text-sm font-semibold mb-2">
                            <FaMapMarkerAlt className="text-green-500" /> Location
                        </label>
                        <input
                            type="text"
                            value={formData.location}
                            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700"
                            placeholder="Enter pickup location"
                            required
                        />
                    </div>

                    {/* Waste Type */}
                    <div>
                        <label className="flex items-center gap-2 text-gray-700 text-sm font-semibold mb-2">
                            <FaRecycle className="text-green-500" /> Waste Type
                        </label>
                        <select
                            value={formData.wasteType}
                            onChange={(e) => setFormData(prev => ({ ...prev, wasteType: e.target.value }))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700"
                        >
                            {WASTE_TYPES.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>

                    {/* Estimated Weight */}
                    <div>
                        <label className="flex items-center gap-2 text-gray-700 text-sm font-semibold mb-2">
                            ⚖️ Estimated Weight (kg) <span className="text-gray-400 font-normal">Optional</span>
                        </label>
                        <input
                            type="number"
                            value={formData.estimatedWeight}
                            onChange={(e) => setFormData(prev => ({ ...prev, estimatedWeight: e.target.value }))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700"
                            placeholder="e.g. 5"
                            min="0"
                        />
                        {formData.estimatedWeight > 0 && (
                            <p className="text-xs text-green-600 mt-1">
                                🏆 You'll earn approximately {Math.round(formData.estimatedWeight * 10)} points on completion
                            </p>
                        )}
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="flex items-center gap-2 text-gray-700 text-sm font-semibold mb-2">
                            <FaStickyNote className="text-green-500" /> Notes <span className="text-gray-400 font-normal">Optional</span>
                        </label>
                        <textarea
                            value={formData.notes}
                            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700 resize-none"
                            placeholder="Any special instructions..."
                            rows={3}
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium disabled:opacity-50">
                            {saving ? 'Saving...' : '✓ Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default WasteEditPage;