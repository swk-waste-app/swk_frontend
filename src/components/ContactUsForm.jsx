import { useState } from 'react';
import { apiSendMessage } from '../services/product';
import Swal from 'sweetalert2';

const ContactUsForm = () => {
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    email: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await apiSendMessage({
        ...formData,
        user: localStorage.getItem('userId') // Assuming you store userId in localStorage
      });

      Swal.fire({
        icon: 'success',
        title: 'Message Sent!',
        text: 'We will get back to you soon.',
        confirmButtonColor: '#10B981'
      });

      // Clear form
      setFormData({
        subject: '',
        message: '',
        email: ''
      });

    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.message || 'Failed to send message',
        confirmButtonColor: '#10B981'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] px-4">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Contact Us</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Subject Field */}
          <div>
            <label 
              htmlFor="subject" 
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Subject
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 
                         focus:ring-2 focus:ring-green-500 focus:border-transparent
                         transition duration-200"
              placeholder="Enter subject"
            />
          </div>

          {/* Email Field */}
          <div>
            <label 
              htmlFor="email" 
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 
                         focus:ring-2 focus:ring-green-500 focus:border-transparent
                         transition duration-200"
              placeholder="your@email.com"
            />
          </div>

          {/* Message Field */}
          <div>
            <label 
              htmlFor="message" 
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows="4"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 
                         focus:ring-2 focus:ring-green-500 focus:border-transparent
                         transition duration-200 resize-none"
              placeholder="Type your message here..."
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-6 rounded-lg text-white font-medium
                       transition duration-200 ${
                         loading 
                           ? 'bg-green-400 cursor-not-allowed' 
                           : 'bg-green-600 hover:bg-green-700'
                       }`}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin" />
                Sending...
              </div>
            ) : (
              'Send Message'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactUsForm;
