import React, { useState, useEffect, useRef } from 'react';
import { 
  CloudUpload, 
  File, 
  CheckCircle2, 
  X,
  History,
  MoreVertical,
  Play,
  FileText,
  Loader2,
  AlertCircle,
  ShieldCheck,
  ShieldAlert
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { StatusBadge } from '@/src/components/ui/Cards';
import { AssetService } from '@/src/lib/firebaseService';
import { BackendService } from '@/src/lib/backendService';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '@/src/lib/firebase';

export default function UploadPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [recentAssets, setRecentAssets] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [assetTitle, setAssetTitle] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // New States for Integration & UX
  const [uploadMode, setUploadMode] = useState<'scan' | 'register'>('scan');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<any | null>(null);

  useEffect(() => {
    fetchAssets();
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const fetchAssets = async () => {
    const assets = await AssetService.getMyAssets();
    if (assets) setRecentAssets(assets);
  };

  const handleFileSelect = (file?: File) => {
    setUploadError(null);
    setUploadSuccess(null);
    if (!file) return;
    
    // Strict Validation: Size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("File size exceeds 5MB limit.");
      return;
    }
    
    // Strict Validation: Type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setUploadError("Only .jpg and .png files are supported for processing.");
      return;
    }

    setSelectedFile(file);
    setAssetTitle(file.name);
    
    // Create object URL for preview
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setAssetTitle('');
    setUploadError(null);
    setUploadSuccess(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(null);
    
    try {
      const isVideo = selectedFile.type.startsWith('video/');
      const assetType = isVideo ? 'Video' : 'Archive';
      const name = assetTitle || selectedFile.name;
      const size = `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`;
      
      if (uploadMode === 'register') {
        // 1. Register Official Baseline
        await BackendService.registerBaseline(selectedFile);
        
        // 2. Save Metadata to Firebase for History
        await AssetService.uploadAsset({ name, type: assetType, size });
        
        setUploadSuccess({ 
            message: "Official Asset Registered successfully!", 
            type: "success" 
        });
        await fetchAssets();
      } else {
        // 1. Scan Media via Robust Backend
        const analysis = await BackendService.analyzeMedia(selectedFile);
        
        // 2. Decision Engine: Map Risk to Recommended Action
        let action = "✅ No action needed";
        let status = "Resolved"; // Must match Firestore rules
        
        if (analysis.similarity >= 90 || analysis.risk === 'High') {
            action = "🚨 Immediate takedown";
            status = "Open";
        } else if (analysis.similarity >= 70 || analysis.risk === 'Medium') {
            action = "⚠️ Monitor";
            status = "Open";
        }

        // 3. Save ALL Scans to Firebase (Rich Analytics)
        if (auth.currentUser) {
            // Must create asset first to satisfy Firestore relational rule!
            const assetId = await AssetService.uploadAsset({ name, type: assetType, size });
            
            if (assetId) {
                await addDoc(collection(db, 'violations'), {
                    assetId: assetId,
                    assetName: name,
                    platform: "Upload Portal",
                    matchScore: analysis.similarity,
                    riskLevel: analysis.risk,
                    status: status, // "Open" or "Resolved"
                    detectedOn: serverTimestamp(),
                    ownerId: auth.currentUser.uid,
                    insights: analysis.ai_explanation,
                    recommendedAction: action
                });
            }
        }
        
        setUploadSuccess({ 
            message: `Scan Complete: ${status === 'Open' ? 'Violation' : 'Safe'}`, 
            similarity: analysis.similarity,
            risk: analysis.risk,
            action: action,
            explanation: analysis.ai_explanation,
            type: status === "Open" ? "warning" : "success" 
        });
      }
    } catch (error: any) {
      console.error("Upload process failed", error);
      setUploadError(error.message || "An unexpected error occurred.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-8 space-y-8 animate-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Area */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Error Banner */}
          {uploadError && (
             <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 px-4 py-3 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-bold">{uploadError}</p>
             </div>
          )}

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-1 w-full shadow-sm dark:shadow-none transition-colors">
            {!selectedFile ? (
              <div 
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => { 
                  e.preventDefault(); 
                  setIsDragging(false); 
                  const file = e.dataTransfer.files?.[0];
                  if (file) handleFileSelect(file);
                }}
                className={cn(
                  "border-2 border-dashed rounded-[calc(1.5rem-4px)] p-12 transition-all duration-300 flex flex-col items-center justify-center group relative overflow-hidden",
                  isDragging 
                    ? "border-blue-500 bg-blue-50/50 dark:bg-blue-500/5 shadow-[inset_0_0_40px_rgba(59,130,246,0.1)]" 
                    : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/10",
                  isUploading && "opacity-50 pointer-events-none"
                )}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05),transparent)] pointer-events-none"></div>
                
                <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center mb-6 border border-slate-200 dark:border-slate-700 group-hover:scale-110 group-hover:border-blue-500/50 transition-all duration-500 shadow-sm">
                  <CloudUpload className={cn("w-10 h-10 transition-colors", isDragging ? "text-blue-400" : "text-slate-400 dark:text-slate-500")} />
                </div>
                
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2 selection:bg-blue-500/30">
                  Drag & Drop Assets
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs text-center mb-8 leading-relaxed">
                  Upload official media to build your registry, or scan assets to check for violations.
                </p>
                
                <div className="flex gap-4">
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/jpeg, image/png, image/jpg"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileSelect(file);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }} 
                  />
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="px-8 py-3 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-500 transition-all hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] active:scale-95 shadow-lg shadow-blue-500/20"
                  >
                    Select File
                  </button>
                </div>

                <div className="mt-12 flex items-center gap-8 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  <span className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-emerald-500" /> JPG/PNG Supported</span>
                  <span className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-emerald-500" /> Max 5MB Per File</span>
                  <span className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-emerald-500" /> End-to-End Encryption</span>
                </div>
              </div>
            ) : (
              <div className="border-2 border-slate-200 dark:border-slate-800 rounded-[calc(1.5rem-4px)] p-6 md:p-8 flex flex-col group relative overflow-hidden bg-slate-50/50 dark:bg-slate-900/30">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white">Review Asset</h3>
                  <button onClick={handleCancel} disabled={isUploading} className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors bg-slate-100 dark:bg-slate-800 rounded-full disabled:opacity-50">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Preview Container */}
                  <div className="bg-slate-100 dark:bg-slate-950 rounded-2xl overflow-hidden aspect-video flex items-center justify-center border border-slate-200 dark:border-slate-800 relative shadow-inner">
                    {selectedFile.type.startsWith('image/') ? (
                      <img src={previewUrl!} alt="Preview" className="w-full h-full object-contain" />
                    ) : (
                      <div className="flex flex-col items-center text-slate-400">
                        <FileText className="w-12 h-12 mb-2" />
                        <span className="text-sm font-medium">No preview available</span>
                      </div>
                    )}
                    
                    {/* Success Overlay */}
                    {uploadSuccess && (
                       <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500 z-10">
                          {uploadSuccess.type === 'success' ? (
                             <ShieldCheck className="w-16 h-16 text-emerald-400 mb-4 animate-bounce" />
                          ) : (
                             <ShieldAlert className="w-16 h-16 text-rose-400 mb-4 animate-pulse" />
                          )}
                          <h4 className="text-white font-bold text-lg mb-2">{uploadSuccess.message}</h4>
                          {uploadSuccess.explanation && (
                            <p className="text-slate-300 text-xs leading-relaxed max-w-xs">{uploadSuccess.explanation}</p>
                          )}
                       </div>
                    )}
                  </div>

                  {/* Metadata Input */}
                  <div className="flex flex-col justify-center space-y-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Asset Title</label>
                      <input 
                        type="text"
                        value={assetTitle}
                        onChange={(e) => setAssetTitle(e.target.value)}
                        disabled={isUploading || uploadSuccess}
                        className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium disabled:opacity-50"
                      />
                    </div>

                    {/* Mode Toggle */}
                    <div>
                       <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Action Type</label>
                       <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
                          <button 
                             onClick={() => setUploadMode('scan')}
                             disabled={isUploading || uploadSuccess}
                             className={cn(
                                "flex-1 py-2 text-xs font-bold rounded-lg transition-all",
                                uploadMode === 'scan' ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                             )}
                          >
                             Scan for Violations
                          </button>
                          <button 
                             onClick={() => setUploadMode('register')}
                             disabled={isUploading || uploadSuccess}
                             className={cn(
                                "flex-1 py-2 text-xs font-bold rounded-lg transition-all",
                                uploadMode === 'register' ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                             )}
                          >
                             Register Official
                          </button>
                       </div>
                    </div>

                    {/* Action Results (if any) */}
                    {uploadSuccess && uploadMode === 'scan' ? (
                       <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3 animate-in fade-in slide-in-from-bottom-2">
                          <div className="flex justify-between items-center text-xs">
                             <span className="font-bold text-slate-500">Similarity</span>
                             <span className={cn("font-black text-sm", uploadSuccess.similarity >= 70 ? "text-rose-500" : "text-emerald-500")}>
                               {uploadSuccess.similarity.toFixed(1)}%
                             </span>
                          </div>
                          <div className="flex justify-between items-center text-xs">
                             <span className="font-bold text-slate-500">Risk Level</span>
                             <StatusBadge status={uploadSuccess.risk} />
                          </div>
                          <div className="flex justify-between items-center text-xs">
                             <span className="font-bold text-slate-500">Action</span>
                             <span className="font-bold text-slate-700 dark:text-slate-300">{uploadSuccess.action}</span>
                          </div>
                       </div>
                    ) : (
                      <button 
                        onClick={handleUpload}
                        disabled={isUploading || !assetTitle.trim() || uploadSuccess}
                        className="w-full flex items-center justify-center gap-2 px-8 py-3.5 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-500 transition-all active:scale-95 shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:active:scale-100 disabled:hover:bg-blue-600"
                      >
                        {isUploading ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Analyzing media fingerprint...
                          </>
                        ) : (
                          <>
                            <CloudUpload className="w-5 h-5" />
                            {uploadMode === 'scan' ? 'Scan Now' : 'Submit for Fingerprinting'}
                          </>
                        )}
                      </button>
                    )}
                    
                    {uploadSuccess && (
                       <button 
                         onClick={handleCancel}
                         className="w-full flex items-center justify-center gap-2 px-8 py-3 text-slate-600 dark:text-slate-300 font-bold text-sm rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border border-slate-200 dark:border-slate-700 shadow-sm"
                       >
                         Scan Another Asset
                       </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm dark:shadow-none transition-colors">
             <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                <h2 className="text-sm font-bold text-slate-800 dark:text-white tracking-widest flex items-center gap-2">
                  <History className="w-4 h-4 text-blue-500" />
                  RECENT UPLOADS (OFFICIAL REGISTRY)
                </h2>
             </div>
             <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
               {recentAssets.length === 0 ? (
                 <div className="p-12 text-center text-slate-400 italic">
                    <p className="text-sm font-medium">No assets registered yet.</p>
                 </div>
               ) : recentAssets.map((file, i) => (
                 <div key={file.id || i} className="p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center border border-slate-200 dark:border-slate-700 group-hover:border-blue-500/50 transition-colors shadow-sm">
                        {file.type === 'Video' ? <Play className="w-5 h-5 text-blue-600 dark:text-blue-400" /> : <FileText className="w-5 h-5 text-slate-400 dark:text-slate-500" />}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{file.name}</h4>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">{file.size}</span>
                          <span className="w-1 h-1 bg-slate-200 dark:bg-slate-700 rounded-full"></span>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500">
                             {file.createdAt && 'toDate' in file.createdAt ? (file.createdAt as any).toDate().toLocaleDateString() : 'Just now'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <StatusBadge status={file.status || 'Active'} />
                    </div>
                 </div>
               ))}
             </div>
          </div>
        </div>

        {/* Requirements Sidebar */}
        <div className="space-y-6">
           <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-6">
              <h3 className="text-emerald-400 font-bold text-sm mb-4">Upload Guidelines</h3>
              <ul className="space-y-4">
                {[
                  'Only .JPG or .PNG formats supported',
                  'File size strictly under 5MB',
                  'Ensure high contrast for accurate hashing',
                  'Original metadata preserved'
                ].map((req, i) => (
                  <li key={i} className="flex items-start gap-3 text-xs text-slate-300">
                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0"></div>
                    {req}
                  </li>
                ))}
              </ul>
           </div>

           <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 transition-colors shadow-sm dark:shadow-none">
              <h3 className="text-slate-800 dark:text-white font-bold text-sm mb-4 tracking-widest">WHY UPLOAD?</h3>
              <div className="space-y-6">
                <div>
                   <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-1 italic">Scan for Violations</h4>
                   <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                     Instantly check if an asset matches anything in our global registry. Results are appended to your analytics dashboard.
                   </p>
                </div>
                <div>
                   <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-1 italic">Register Official Media</h4>
                   <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                     Adding an asset to the registry creates an immutable fingerprint, protecting it globally.
                   </p>
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
