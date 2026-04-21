'use client';

import { useState, useEffect } from 'react';
import { getMediaLibrary, getFolders, uploadMediaAction, deleteMediaAction, createFolderAction, deleteFolderAction, deleteMultipleMediaAction } from './actions';
import { Upload, Trash2, Image as ImageIcon, Loader2, Folder, Plus, Copy, ExternalLink, X, Info, Check, Square, CheckSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MediaLibraryPage() {
  const [media, setMedia] = useState<any[]>([]);
  const [folders, setFolders] = useState<any[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    loadFolders();
  }, []);

  useEffect(() => {
    loadMedia();
  }, [selectedFolderId]);

  const loadFolders = async () => {
    const data = await getFolders();
    setFolders(data);
  };

  const loadMedia = async () => {
    setIsLoading(true);
    const data = await getMediaLibrary(selectedFolderId === 'all' ? undefined : selectedFolderId);
    setMedia(data);
    setIsLoading(false);
  };

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    
    await createFolderAction(newFolderName);
    setNewFolderName('');
    setShowFolderModal(false);
    loadFolders();
  };

  const handleDeleteFolder = async (id: string) => {
    if (!confirm('Are you sure you want to delete this folder? Files will be moved to "All Media".')) return;
    await deleteFolderAction(id);
    if (selectedFolderId === id) setSelectedFolderId('all');
    loadFolders();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append('file', files[i]);
        if (selectedFolderId !== 'all') {
            formData.append('folderId', selectedFolderId);
        }
        await uploadMediaAction(formData);
    }
    
    await loadMedia();
    setIsUploading(false);
    e.target.value = '';
  };

  const handleDeleteMedia = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this file?')) return;
    await deleteMediaAction(id);
    if (selectedFile?.id === id) setSelectedFile(null);
    setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
    await loadMedia();
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedIds.length} items?`)) return;
    
    setIsLoading(true);
    await deleteMultipleMediaAction(selectedIds);
    setSelectedIds([]);
    await loadMedia();
    setIsLoading(false);
  };

  const toggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === media.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(media.map(item => item.id));
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 min-h-[80vh]">
      {/* Sidebar: Categories/Folders */}
      <div className="w-full lg:w-72 shrink-0 space-y-6">
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Categories</h2>
            <button 
                onClick={() => setShowFolderModal(true)}
                className="p-1.5 bg-gray-50 hover:bg-amber-50 text-gray-400 hover:text-amber-600 rounded-lg transition-colors"
                title="New Folder"
            >
                <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-1">
            <button
                onClick={() => setSelectedFolderId('all')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                    selectedFolderId === 'all' 
                      ? 'bg-slate-900 text-white shadow-lg' 
                      : 'text-gray-500 hover:bg-gray-50'
                }`}
            >
                <ImageIcon className="w-4 h-4" />
                All Media
            </button>
            {folders.map(folder => (
                <div key={folder.id} className="group relative flex items-center">
                    <button
                        onClick={() => setSelectedFolderId(folder.id)}
                        className={`flex-grow flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                            selectedFolderId === folder.id 
                            ? 'bg-amber-500 text-white shadow-lg shadow-amber-200' 
                            : 'text-gray-500 hover:bg-gray-50'
                        }`}
                    >
                        <Folder className="w-4 h-4" />
                        {folder.name}
                    </button>
                    <button 
                        onClick={() => handleDeleteFolder(folder.id)}
                        className="absolute right-2 opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:bg-red-50 rounded-lg transition-all"
                    >
                        <Trash2 className="w-3 h-3" />
                    </button>
                </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="flex-grow space-y-6">
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
                <h1 className="text-2xl font-black text-slate-900 leading-tight">
                    {selectedFolderId === 'all' ? 'Your Media Library' : folders.find(f => f.id === selectedFolderId)?.name}
                </h1>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">
                    {media.length} items found
                </p>
            </div>

            <div className="flex items-center gap-4">
                {selectedIds.length > 0 && (
                    <button 
                        onClick={handleBulkDelete}
                        className="flex items-center gap-3 bg-red-50 text-red-600 px-6 py-4 rounded-2xl font-black text-sm hover:bg-red-600 hover:text-white transition-all shadow-sm"
                    >
                        <Trash2 className="w-5 h-5" />
                        Delete ({selectedIds.length})
                    </button>
                )}
                
                {media.length > 0 && (
                    <button 
                        onClick={toggleSelectAll}
                        className="flex items-center gap-3 bg-gray-50 text-slate-900 px-6 py-4 rounded-2xl font-black text-sm hover:bg-gray-100 transition-all border border-gray-100"
                    >
                        {selectedIds.length === media.length ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                        {selectedIds.length === media.length ? 'Deselect All' : 'Select All'}
                    </button>
                )}

                <input 
                    type="file" id="media-upload" 
                    multiple accept="image/*" 
                    className="hidden" onChange={handleFileUpload}
                    disabled={isUploading}
                />
                <label 
                    htmlFor="media-upload" 
                    className="flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-sm hover:shadow-2xl active:scale-95 transition-all cursor-pointer"
                >
                    {isUploading ? (
                        <><Loader2 className="w-5 h-5 animate-spin" /> Uploading...</>
                    ) : (
                        <><Upload className="w-5 h-5" /> Upload Media</>
                    )}
                </label>
            </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 min-h-[500px]">
            {isLoading ? (
                <div className="flex justify-center py-40">
                    <Loader2 className="w-10 h-10 animate-spin text-gray-200" />
                </div>
            ) : media.length === 0 ? (
                <div className="text-center py-40 border-4 border-dashed border-gray-50 rounded-[2rem]">
                    <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                        <ImageIcon className="w-10 h-10 text-gray-200" />
                    </div>
                    <h3 className="text-lg font-black text-slate-900">This collection is empty</h3>
                    <p className="text-gray-400 font-bold text-xs mt-2">Upload your first asset to bring this library to life.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-6">
                    {media.map((item) => (
                        <motion.div 
                            layoutId={item.id}
                            key={item.id} 
                            onClick={() => setSelectedFile(item)}
                            className={`group relative bg-gray-50 rounded-[2rem] overflow-hidden aspect-square cursor-pointer transition-all duration-500 ${
                                selectedIds.includes(item.id) 
                                ? 'ring-4 ring-amber-500' 
                                : 'hover:ring-4 hover:ring-amber-500/20'
                            }`}
                        >
                            <img src={`/api/media/${item.id}`} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                            
                            {/* Selection Overlay */}
                            <div 
                                onClick={(e) => toggleSelect(item.id, e)}
                                className={`absolute top-4 left-4 p-2 rounded-xl border-2 transition-all ${
                                    selectedIds.includes(item.id)
                                    ? 'bg-amber-500 border-amber-500 text-white translate-x-0 opacity-100'
                                    : 'bg-white/90 border-white text-gray-300 opacity-0 group-hover:opacity-100 -translate-x-2'
                                }`}
                            >
                                <Check className="w-4 h-4" />
                            </div>

                            {/* Fast Actions overlay */}
                            <div className="absolute top-4 right-4 flex gap-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                                <button 
                                    onClick={(e) => { e.stopPropagation(); copyToClipboard(item.url); }}
                                    className="p-2 bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-white hover:bg-white text-slate-900"
                                >
                                    <Copy className="w-4 h-4" />
                                </button>
                                <button 
                                    onClick={(e) => handleDeleteMedia(item.id, e)}
                                    className="p-2 bg-red-500 rounded-xl shadow-lg hover:bg-red-600 text-white"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
      </div>

      {/* Detail Overlay */}
      <AnimatePresence>
        {selectedFile && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-xl"
                onClick={() => setSelectedFile(null)}
            >
                <motion.div 
                    layoutId={selectedFile.id}
                    className="bg-white rounded-[3rem] shadow-2xl w-full max-w-4xl flex flex-col lg:flex-row overflow-hidden max-h-[90vh]"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Visual Area */}
                    <div className="flex-grow bg-slate-50 flex items-center justify-center p-12 min-h-[300px]">
                        <img src={`/api/media/${selectedFile.id}`} alt={selectedFile.name} className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl" />
                    </div>

                    {/* Meta Area */}
                    <div className="lg:w-96 bg-white p-10 flex flex-col gap-8 border-l border-gray-50">
                        <div className="flex justify-between items-start">
                            <h2 className="text-2xl font-black text-slate-900 leading-tight pr-8">{selectedFile.name}</h2>
                            <button onClick={() => setSelectedFile(null)} className="p-2 hover:bg-gray-100 rounded-2xl transition-all">
                                <X className="w-6 h-6 text-gray-400" />
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div className="p-6 bg-slate-50 rounded-2xl space-y-4">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">File Information</h3>
                                <div className="grid grid-cols-2 gap-y-4 text-sm font-bold">
                                    <div>
                                        <p className="text-[9px] uppercase tracking-widest text-gray-400 mb-1">Type</p>
                                        <p className="text-slate-900">{selectedFile.type.split('/')[1] === 'jpeg' ? 'JPG' : selectedFile.type.split('/')[1].toUpperCase()}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] uppercase tracking-widest text-gray-400 mb-1">Size</p>
                                        <p className="text-slate-900">{formatSize(selectedFile.size)}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-[9px] uppercase tracking-widest text-gray-400 mb-1">Created</p>
                                        <p className="text-slate-900">{new Date(selectedFile.createdAt).toLocaleDateString()} at {new Date(selectedFile.createdAt).toLocaleTimeString()}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Public URL</h3>
                                <div className="flex items-center gap-3">
                                    <div className="flex-grow px-5 py-4 bg-gray-50 rounded-2xl border border-gray-100 font-mono text-[10px] text-gray-400 truncate">
                                        {selectedFile.url}
                                    </div>
                                    <button 
                                        onClick={() => copyToClipboard(selectedFile.url)}
                                        className="p-4 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl shadow-xl shadow-amber-200 transition-all active:scale-95"
                                    >
                                        {copySuccess ? <Info className="w-5 h-5 animate-pulse" /> : <Copy className="w-5 h-5" />}
                                    </button>
                                </div>
                                {copySuccess && <p className="text-center text-[10px] font-black text-amber-600 uppercase tracking-widest animate-bounce">Url Copied to Clipboard!</p>}
                            </div>
                        </div>

                        <div className="mt-auto pt-8 flex gap-3">
                            <button 
                                onClick={() => handleDeleteMedia(selectedFile.id, { stopPropagation: () => {} } as any)}
                                className="flex-grow flex items-center justify-center gap-2 bg-red-50 text-red-500 p-5 rounded-2xl font-black text-sm hover:bg-red-500 hover:text-white transition-all"
                            >
                                <Trash2 className="w-5 h-5" /> Delete File
                            </button>
                            <a 
                                href={selectedFile.url} target="_blank"
                                className="p-5 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center"
                            >
                                <ExternalLink className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* New Folder Modal */}
      {showFolderModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
            <motion.form 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onSubmit={handleCreateFolder}
                className="bg-white rounded-[2.5rem] p-10 w-full max-w-md shadow-2xl"
            >
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-black text-slate-900">Create Folder</h2>
                    <button type="button" onClick={() => setShowFolderModal(false)} className="text-gray-400 hover:text-slate-900">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                <input 
                    autoFocus
                    type="text"
                    required
                    placeholder="Enter folder name (e.g. Products, Banners)"
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-amber-500 font-bold transition-all mb-8"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                />

                <div className="flex gap-3">
                    <button 
                        type="button" 
                        onClick={() => setShowFolderModal(false)}
                        className="flex-grow py-4 px-6 rounded-2xl font-black text-gray-500 hover:bg-gray-50 transition-all"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit"
                        className="flex-grow py-4 px-6 bg-slate-900 text-white rounded-2xl font-black shadow-xl hover:bg-amber-600 transition-all"
                    >
                        Create
                    </button>
                </div>
            </motion.form>
        </div>
      )}
    </div>
  );
}
