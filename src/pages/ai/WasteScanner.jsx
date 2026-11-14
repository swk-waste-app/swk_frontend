import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaCamera, FaRecycle, FaRobot, FaLightbulb, FaRedo, FaTrashAlt, FaShoppingBag } from 'react-icons/fa';
import { toast } from 'sonner';
import { apiAiStatus, apiClassifyWaste } from '../../services/ai';
import { Skeleton } from '../../components/Skeleton';

const CONFIDENCE_STYLE = {
  high: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300',
  low: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300',
};

// AI waste scanner: photograph an item and Claude identifies the waste type,
// whether it's recyclable, and how to dispose of it in Ghana.
const WasteScanner = () => {
  const [aiState, setAiState] = useState('loading'); // loading | enabled | disabled
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [result, setResult] = useState(null);
  const [scanning, setScanning] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    apiAiStatus()
      .then(({ data }) => setAiState(data.enabled ? 'enabled' : 'disabled'))
      .catch(() => setAiState('disabled'));
  }, []);

  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl); }, [previewUrl]);

  const onPickFile = (e) => {
    const picked = e.target.files?.[0];
    if (!picked) return;
    if (picked.size > 5 * 1024 * 1024) {
      toast.error('Please choose an image under 5 MB.');
      return;
    }
    setFile(picked);
    setResult(null);
    setPreviewUrl((old) => {
      if (old) URL.revokeObjectURL(old);
      return URL.createObjectURL(picked);
    });
  };

  const scan = async () => {
    if (!file || scanning) return;
    setScanning(true);
    setResult(null);
    try {
      const { data } = await apiClassifyWaste(file);
      setResult(data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not analyse the photo — please try again.');
    } finally {
      setScanning(false);
    }
  };

  const reset = () => {
    setFile(null);
    setResult(null);
    setPreviewUrl((old) => { if (old) URL.revokeObjectURL(old); return null; });
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-950 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-1">
          <span className="w-10 h-10 rounded-xl bg-green-600 text-white flex items-center justify-center"><FaRobot size={18} /></span>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">AI Waste Scanner</h1>
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 ml-13">
          Snap a photo of any item and Eco will tell you what it is, whether it&apos;s recyclable, and what to do with it.
        </p>

        {aiState === 'loading' && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-6 space-y-4">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-10 w-32" />
          </div>
        )}

        {aiState === 'disabled' && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-10 text-center">
            <FaRobot className="mx-auto text-5xl text-gray-300 dark:text-gray-700 mb-4" />
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">The AI scanner isn&apos;t switched on yet</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-md mx-auto">
              The server needs an Anthropic API key before Eco can analyse photos. Check back soon — or if you run this
              server, set <code className="font-mono text-xs bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">ANTHROPIC_API_KEY</code>.
            </p>
          </div>
        )}

        {aiState === 'enabled' && (
          <div className="grid md:grid-cols-2 gap-6 items-start">
            {/* Capture card */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-6">
              <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                capture="environment"
                onChange={onPickFile}
                className="hidden"
                id="waste-photo"
              />

              {!previewUrl ? (
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="w-full h-64 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-600 flex flex-col items-center justify-center gap-3 text-gray-400 dark:text-gray-500 hover:text-green-600 transition-colors"
                >
                  <FaCamera size={36} />
                  <span className="font-semibold text-sm">Take or upload a photo</span>
                  <span className="text-xs">JPEG, PNG or WebP — up to 5 MB</span>
                </button>
              ) : (
                <div>
                  <img src={previewUrl} alt="Waste to analyse" className="w-full h-64 object-cover rounded-xl" />
                  <div className="flex gap-3 mt-4">
                    <button
                      type="button"
                      onClick={scan}
                      disabled={scanning}
                      className="flex-1 py-3 rounded-xl bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
                    >
                      <FaRecycle className={scanning ? 'animate-spin' : ''} />
                      {scanning ? 'Analysing…' : 'Identify this waste'}
                    </button>
                    <button
                      type="button"
                      onClick={reset}
                      className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      aria-label="Start over"
                    >
                      <FaRedo />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Result card */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-6 min-h-[16rem]">
              {scanning && (
                <div className="space-y-4">
                  <Skeleton className="h-5 w-1/2" />
                  <Skeleton className="h-8 w-40" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              )}

              {!scanning && !result && (
                <div className="h-full flex flex-col items-center justify-center text-center py-10">
                  <FaRecycle className="text-4xl text-gray-200 dark:text-gray-700 mb-3" />
                  <p className="text-sm text-gray-400 dark:text-gray-500">The analysis will appear here.</p>
                </div>
              )}

              {!scanning && result && (
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-gray-400 dark:text-gray-500 font-semibold">Identified as</p>
                      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mt-0.5">{result.item}</h2>
                    </div>
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full capitalize ${CONFIDENCE_STYLE[result.confidence] || CONFIDENCE_STYLE.low}`}>
                      {result.confidence} confidence
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-4">
                    <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
                      {result.wasteType}
                    </span>
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 ${
                      result.recyclable
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                        : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                    }`}>
                      <FaRecycle size={11} /> {result.recyclable ? 'Recyclable' : 'Not recyclable'}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-4 leading-relaxed">{result.disposal}</p>

                  {result.upcyclingIdea && (
                    <div className="mt-4 p-3.5 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-start gap-2.5">
                      <FaLightbulb className="text-amber-500 mt-0.5 shrink-0" />
                      <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                        <span className="font-bold">Upcycling idea:</span> {result.upcyclingIdea}
                      </p>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-2.5 mt-5">
                    <Link
                      to="/customerDashboard/pickup"
                      className="flex-1 text-center py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
                    >
                      <FaTrashAlt size={12} /> Schedule a pickup
                    </Link>
                    <Link
                      to="/customerDashboard/products"
                      className="flex-1 text-center py-2.5 rounded-xl border border-green-600 text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
                    >
                      <FaShoppingBag size={12} /> Browse marketplace
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WasteScanner;
