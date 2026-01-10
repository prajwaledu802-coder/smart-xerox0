"use client";

import { useState, useRef } from "react";
import { Upload, FileText, X } from "lucide-react";

export default function FileUpload({ onFileSelect }) {
    const [dragActive, setDragActive] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const inputRef = useRef(null);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (file) => {
        // Validate file type/size if needed
        setSelectedFile(file);
        onFileSelect(file);
    };

    const removeFile = () => {
        setSelectedFile(null);
        onFileSelect(null);
        if (inputRef.current) {
            inputRef.current.value = "";
        }
    };

    return (
        <div className="w-full">
            {!selectedFile ? (
                <div
                    className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer
            ${dragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-secondary/50"}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => inputRef.current?.click()}
                >
                    <input
                        ref={inputRef}
                        type="file"
                        className="hidden"
                        onChange={handleChange}
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    />

                    <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-primary">
                            <Upload size={24} />
                        </div>
                        <h3 className="font-bold text-lg">Upload Document</h3>
                        <p className="text-sm opacity-60">
                            Drag & drop or click to browse<br />
                            (PDF, DOC, JPG supported)
                        </p>
                    </div>
                </div>
            ) : (
                <div className="card p-4 flex items-center justify-between bg-primary/5 border-primary/20 animate-fade-in">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-10 h-10 bg-primary/10 rounded flex items-center justify-center text-primary shrink-0">
                            <FileText size={20} />
                        </div>
                        <div className="truncate">
                            <p className="font-bold text-sm truncate">{selectedFile.name}</p>
                            <p className="text-xs opacity-60">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                    </div>
                    <button
                        onClick={removeFile}
                        className="p-2 hover:bg-destructive/10 text-destructive rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>
            )}
        </div>
    );
}
