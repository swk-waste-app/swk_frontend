import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { apiAddEducationResource } from "../../services/education";

const CATEGORIES = ['Recycling Tips', 'Composting', 'Waste Sorting', 'Sustainability', 'Workshops', 'General'];

const AddEducationForm = () => {
    const navigate = useNavigate();

    const saveResource = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);

        try {
            await apiAddEducationResource(formData);
            Swal.fire({
                icon: 'success',
                title: 'Resource Published',
                text: 'Your education resource is now live!',
                confirmButtonColor: '#026937',
            });
            navigate("/education");
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `Failed to publish resource: ${error.response?.data?.message || error.message || 'An unexpected error occurred.'}`,
            });
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen p-4">
            <div className="max-w-2xl mx-auto">
                <div className="rounded-2xl p-6 text-white mb-6"
                    style={{ background: 'linear-gradient(135deg, #026937, #00BFA5)' }}>
                    <h2 className="text-2xl font-bold">Add Education Resource</h2>
                    <p className="text-green-100 text-sm mt-1">Publish a guide, tip or workshop update</p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <form onSubmit={saveResource} className="space-y-5">
                        <div>
                            <label className="block text-gray-700 text-sm font-semibold mb-2">Title *</label>
                            <input type="text" name="title" required
                                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700"
                                placeholder="e.g. 5 Tips for Sorting Household Waste" />
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm font-semibold mb-2">Category</label>
                            <select name="category"
                                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700">
                                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm font-semibold mb-2">Summary *</label>
                            <textarea name="summary" rows={2} required maxLength={300}
                                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700 resize-none"
                                placeholder="A short teaser shown on the resource list (max 300 characters)" />
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm font-semibold mb-2">Content *</label>
                            <textarea name="content" rows={8} required
                                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700"
                                placeholder="Write the full article, guide or workshop details..." />
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm font-semibold mb-2">Cover Image</label>
                            <input type="file" name="image" accept="image/*"
                                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700" />
                        </div>

                        <div className="flex gap-3 pt-2">
                            <Link to="/education"
                                className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium text-center">
                                Cancel
                            </Link>
                            <button type="submit"
                                className="flex-1 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium">
                                Publish Resource
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddEducationForm;
