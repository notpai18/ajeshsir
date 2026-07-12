import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PDFViewer } from '../components/pdf/PDFViewer';

export default function PDFViewerPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { url?: string; name?: string } | null;

  if (!state?.url) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-lg font-bold">Invalid Document</p>
          <button 
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-[#4A0E1B] text-white rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        html,
        body,
        #root {
          height: 100%;
          margin: 0;
          overflow: hidden;
        }
      `}</style>
      <div 
        className="fixed inset-0 z-[99999] w-[100vw] h-[100vh] bg-[#f5f5f5]"
      >
        <PDFViewer 
          docInfo={{
            title: state.name || 'Document',
            fileUrl: state.url,
            entityType: 'note'
          }}
          onClose={() => navigate(-1)}
        />
      </div>
    </>
  );
}
