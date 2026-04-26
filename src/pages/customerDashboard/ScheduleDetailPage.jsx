import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { apiGetSingleScheduledProducts, apiGetProfile, apiEditScheduledProduct } from '../../services/product';
import { FaCalendar, FaMapMarkerAlt, FaRecycle, FaUser, FaArrowLeft, FaStar, FaWeight } from 'react-icons/fa';
import Swal from 'sweetalert2';

const STATUS_STEPS = ['Scheduled', 'In Progress', 'Completed'];

const ScheduleDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [schedule, setSchedule] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [scheduleResponse, profileResponse] = await Promise.all([
          apiGetSingleScheduledProducts(id),
          apiGetProfile()
        ]);
        setSchedule(scheduleResponse.data);
        setUserProfile(profileResponse.data);
      } catch (error) {
        Swal.fire({ icon: 'error', title: 'Error', text: error.message || 'Failed to fetch details' });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const currentStep = STATUS_STEPS.indexOf(schedule?.status) !== -1
    ? STATUS_STEPS.indexOf(schedule?.status)
    : 0;

  const handleRating = (star) => {
    setRating(star);
    Swal.fire({
      icon: 'success',
      title: 'Thank you!',
      text: `You rated this pickup ${star} star${star > 1 ? 's' : ''}`,
      confirmButtonColor: '#026937',
      timer: 2000,
      showConfirmButton: false
    });
  };

  const estimatedPoints = schedule?.estimatedWeight
    ? Math.round(schedule.estimatedWeight * 10)
    : 50;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!schedule) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl text-gray-600">Schedule not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 bg-gray-50 min-h-screen">

      {/* Back Button */}
      <button onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium">
        <FaArrowLeft /> Back to Waste Collection
      </button>

      {/* Header */}
      <div className="rounded-2xl p-6 text-white"
        style={{ background: 'linear-gradient(135deg, #026937, #00BFA5)' }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-200 text-sm">Pickup Schedule</p>
            <h1 className="text-2xl font-bold mt-1">
              {schedule.wasteType || 'General'} Waste Pickup
            </h1>
            <p className="text-green-200 text-sm mt-1">ID: {schedule._id?.slice(-8)}</p>
          </div>
          <div className="text-right">
            <span className={`px-4 py-2 rounded-full text-sm font-bold ${
              schedule.status === 'Completed' ? 'bg-green-500' :
              schedule.status === 'In Progress' ? 'bg-yellow-500' :
              schedule.status === 'Cancelled' ? 'bg-red-500' : 'bg-blue-500'
            } text-white`}>
              {schedule.status}
            </span>
            <p className="text-green-200 text-xs mt-2">🏆 ~{estimatedPoints} points on completion</p>
          </div>
        </div>
      </div>

      {/* Status Tracker */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">📍 Pickup Progress</h2>
        <div className="relative">
          <div className="flex items-center justify-between">
            {STATUS_STEPS.map((step, index) => (
              <div key={step} className="flex flex-col items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 ${
                  index < currentStep ? 'bg-green-500 border-green-500 text-white' :
                  index === currentStep ? 'bg-white border-green-500 text-green-600' :
                  'bg-gray-100 border-gray-300 text-gray-400'
                }`}>
                  {index < currentStep ? '✓' : index + 1}
                </div>
                <p className={`text-xs mt-2 font-medium text-center ${
                  index <= currentStep ? 'text-green-600' : 'text-gray-400'
                }`}>{step}</p>
                {index < STATUS_STEPS.length - 1 && (
                  <div className={`absolute h-0.5 top-5 ${
                    index < currentStep ? 'bg-green-500' : 'bg-gray-200'
                  }`} style={{
                    left: `${(index + 1) * (100 / STATUS_STEPS.length)}%`,
                    width: `${100 / STATUS_STEPS.length}%`,
                    transform: 'translateX(-100%)'
                  }}></div>
                )}
              </div>
            ))}
          </div>
          {/* Progress Line */}
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 -z-10"></div>
          <div className="absolute top-5 left-0 h-0.5 bg-green-500 -z-10 transition-all duration-500"
            style={{ width: `${(currentStep / (STATUS_STEPS.length - 1)) * 100}%` }}></div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Pickup Details */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">📋 Pickup Details</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
              <FaCalendar className="text-green-500 mt-1" />
              <div>
                <p className="text-xs text-gray-500">Pickup Date & Time</p>
                <p className="font-medium text-gray-800">
                  {new Date(schedule.pickupDate).toLocaleDateString('en-GB', {
                    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
                  })}
                </p>
                <p className="text-sm text-gray-600">
                  {new Date(schedule.pickupDate).toLocaleTimeString('en-GB', {
                    hour: '2-digit', minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
              <FaMapMarkerAlt className="text-green-500 mt-1" />
              <div>
                <p className="text-xs text-gray-500">Location</p>
                <p className="font-medium text-gray-800">{schedule.location}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
              <FaRecycle className="text-green-500 mt-1" />
              <div>
                <p className="text-xs text-gray-500">Waste Type</p>
                <p className="font-medium text-gray-800">{schedule.wasteType || 'General'}</p>
              </div>
            </div>
            {schedule.estimatedWeight > 0 && (
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                <FaWeight className="text-green-500 mt-1" />
                <div>
                  <p className="text-xs text-gray-500">Estimated Weight</p>
                  <p className="font-medium text-gray-800">{schedule.estimatedWeight} kg</p>
                </div>
              </div>
            )}
            {schedule.notes && (
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                <p className="text-xs text-blue-500 mb-1">Notes</p>
                <p className="text-sm text-gray-700">{schedule.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Contact & Points */}
        <div className="space-y-6">
          {/* Contact Info */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">👤 Contact Information</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <FaUser className="text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Name</p>
                  <p className="font-medium text-gray-800">{userProfile?.name || 'N/A'}</p>
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500">Email</p>
                <p className="text-sm text-gray-800">{userProfile?.email || 'N/A'}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500">Phone</p>
                <p className="text-sm text-gray-800">{userProfile?.contactNumber || 'Not provided'}</p>
              </div>
            </div>
          </div>

          {/* Points Preview */}
          <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl p-6 border border-green-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">🏆 Points Preview</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-green-600">~{estimatedPoints}</p>
                <p className="text-sm text-gray-600">points on completion</p>
              </div>
              <div className="text-right text-sm text-gray-500">
                <p>Based on {schedule.estimatedWeight || 5}kg</p>
                <p>10 pts per kg</p>
              </div>
            </div>
            {schedule.status !== 'Completed' && (
              <p className="text-xs text-green-600 mt-3 bg-green-100 px-3 py-2 rounded-lg">
                ✨ Complete this pickup to earn your points and level up!
              </p>
            )}
          </div>

          {/* Rating (only if completed) */}
          {schedule.status === 'Completed' && (
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">⭐ Rate this Pickup</h2>
              <p className="text-sm text-gray-500 mb-4">How was your pickup experience?</p>
              <div className="flex gap-2 justify-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="text-3xl transition-transform hover:scale-110"
                  >
                    <FaStar className={`${
                      star <= (hoverRating || rating)
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                    }`} />
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <p className="text-center text-sm text-green-600 mt-2">
                  You rated this {rating} star{rating > 1 ? 's' : ''} ✓
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      {schedule.status === 'Scheduled' && (
        <div className="flex gap-4">
          <Link to={`/customerDashboard/editSchedule/${schedule._id}`}
            className="flex-1 py-3 bg-green-600 text-white rounded-xl text-center font-medium hover:bg-green-700 transition-colors">
            ✏️ Reschedule Pickup
          </Link>
          <button
            onClick={async () => {
              const result = await Swal.fire({
                title: 'Cancel this pickup?',
                text: 'Please select a reason:',
                input: 'select',
                inputOptions: {
                  'change_of_plans': 'Change of plans',
                  'already_collected': 'Already collected',
                  'wrong_date': 'Wrong date selected',
                  'other': 'Other reason'
                },
                inputPlaceholder: 'Select a reason',
                showCancelButton: true,
                confirmButtonColor: '#EF4444',
                cancelButtonColor: '#6B7280',
                confirmButtonText: 'Cancel Pickup',
                cancelButtonText: 'Go Back',
              });
              if (result.isConfirmed) {
                try {
                  await apiEditScheduledProduct(schedule._id, { status: 'Cancelled' });
                  setSchedule(prev => ({ ...prev, status: 'Cancelled' }));
                  Swal.fire({ icon: 'success', title: 'Pickup Cancelled', timer: 1500, showConfirmButton: false });
                } catch {
                  Swal.fire({ icon: 'error', title: 'Failed to cancel pickup', confirmButtonColor: '#026937' });
                }
              }
            }}
            className="flex-1 py-3 bg-red-50 text-red-600 border border-red-200 rounded-xl font-medium hover:bg-red-100 transition-colors">
            ✕ Cancel Pickup
          </button>
        </div>
      )}

      {/* Schedule ID Footer */}
      <div className="text-center text-xs text-gray-400 pb-4">
        Schedule ID: {schedule._id}
      </div>
    </div>
  );
};

export default ScheduleDetailPage;