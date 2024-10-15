import React, { useState } from 'react';
import { Upload, File, Video, X } from 'lucide-react';
import { useNotification } from '../contexts/NotificationContext';

interface FileVideoUploadProps {
  caseId: string;
  onUploadComplete: () => void;
}

interface FileMetadata {
  file: File;
  isVideo: boolean;
  dewarpingTool?: string;
  systemDetails?: string;
}

const FileVideoUpload: React.FC<FileVideoUploadProps> = ({ caseId, onUploadComplete }) => {
  const [files, setFiles] = useState<FileMetadata[]>([]);
  const [uploading, setUploading] = useState(false);
  const [storageType, setStorageType] = useState('local');
  const { addNotification } = useNotification();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(file => ({
        file,
        isVideo: file.type.startsWith('video/'),
      }));
      setFiles([...files, ...newFiles]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleMetadataChange = (index: number, field: string, value: string) => {
    setFiles(files.map((file, i) => 
      i === index ? { ...file, [field]: value } : file
    ));
  };

  const handleUpload = async () => {
    setUploading(true);
    try {
      const formData = new FormData();
      files.forEach((fileData, index) => {
        formData.append(`files`, fileData.file);
        formData.append(`metadata${index}`, JSON.stringify({
          isVideo: fileData.isVideo,
          dewarpingTool: fileData.dewarpingTool,
          systemDetails: fileData.systemDetails,
        }));
      });
      formData.append('caseId', caseId);
      formData.append('storageType', storageType);

      // In a real application, you would make an API call here
      // const response = await axios.post('/api/upload', formData);

      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      addNotification('Files uploaded successfully', 'success');
      onUploadComplete();
    } catch (error) {
      addNotification('Error uploading files', 'error');
    } finally {
      setUploading(false);
      setFiles([]);
    }
  };

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Upload Files and Videos</h3>
      <div className="flex items-center space-x-4 mb-4">
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 flex items-center"
        >
          <Upload className="mr-2" size={18} />
          Select Files
        </label>
        <select
          value={storageType}
          onChange={(e) => setStorageType(e.target.value)}
          className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="local">Local Storage</option>
          <option value="onedrive">OneDrive</option>
          <option value="googledrive">Google Drive</option>
        </select>
      </div>
      {files.length > 0 && (
        <div className="mb-4">
          <h4 className="font-semibold mb-2">Selected Files:</h4>
          <ul className="space-y-2">
            {files.map((fileData, index) => (
              <li key={index} className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  {fileData.isVideo ? (
                    <Video className="mr-2" size={18} />
                  ) : (
                    <File className="mr-2" size={18} />
                  )}
                </div>
                <div className="flex-grow">
                  <div className="flex items-center justify-between">
                    <span>{fileData.file.name}</span>
                    <button
                      onClick={() => handleRemoveFile(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={18} />
                    </button>
                  </div>
                  {fileData.isVideo && (
                    <div className="mt-2 space-y-2">
                      <input
                        type="text"
                        placeholder="Dewarping Tool"
                        className="w-full px-2 py-1 text-sm border rounded"
                        value={fileData.dewarpingTool || ''}
                        onChange={(e) => handleMetadataChange(index, 'dewarpingTool', e.target.value)}
                      />
                      <textarea
                        placeholder="System Details"
                        className="w-full px-2 py-1 text-sm border rounded"
                        rows={2}
                        value={fileData.systemDetails || ''}
                        onChange={(e) => handleMetadataChange(index, 'systemDetails', e.target.value)}
                      ></textarea>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      <button
        onClick={handleUpload}
        disabled={files.length === 0 || uploading}
        className={`bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300 ${
          (files.length === 0 || uploading) && 'opacity-50 cursor-not-allowed'
        }`}
      >
        {uploading ? 'Uploading...' : 'Upload Files'}
      </button>
    </div>
  );
};

export default FileVideoUpload;