import React, { useEffect, useRef } from 'react';

const CanvaScreen = ({ onClose }) => {
  const editorContainerRef = useRef(null);

  useEffect(() => {
    // This is a placeholder for Canva's SDK initialization
    // In a real implementation, you would use the actual Canva SDK
    const loadCanva = async () => {
      try {
        // This is a simplified example - you'll need to use the actual Canva SDK
        console.log('Initializing Canva editor...');
        
        // Here you would initialize the Canva SDK
        // const canva = await window.Canva.DesignButton.initialize({
        //   api: {
        //     // Your Canva API configuration
        //   },
        //   container: editorContainerRef.current,
        // });

        // For now, we'll just show a placeholder
        if (editorContainerRef.current) {
          editorContainerRef.current.innerHTML = `
            <div style="width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #1E293B; border-radius: 8px; padding: 20px; color: white;">
              <h2 style="font-size: 24px; margin-bottom: 16px;">Canva Editor</h2>
              <p style="margin-bottom: 24px; text-align: center;">The Canva editor will be embedded here.</p>
              <p style="color: #94A3B8; font-size: 14px; text-align: center; max-width: 400px;">
                In a real implementation, this would be the Canva design editor where users can create and edit designs.
              </p>
            </div>
          `;
        }
      } catch (error) {
        console.error('Error initializing Canva:', error);
      }
    };

    loadCanva();

    // Cleanup function
    return () => {
      // Clean up Canva instance if needed
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-[#0F172A] rounded-lg w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-slate-700">
          <h2 className="text-xl font-semibold text-white">Canva Design Studio</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-slate-700 transition-colors"
            aria-label="Close editor"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Canva Editor Container */}
        <div 
          ref={editorContainerRef}
          className="flex-1 overflow-hidden"
          style={{
            backgroundImage: 'linear-gradient(45deg, #1E293B 25%, #0F172A 25%, #0F172A 50%, #1E293B 50%, #1E293B 75%, #0F172A 75%, #0F172A 100%)',
            backgroundSize: '20px 20px',
          }}
        >
          {/* Canva editor will be mounted here */}
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-slate-700 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md text-white bg-slate-700 hover:bg-slate-600 transition-colors"
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded-md text-white"
            style={{ backgroundColor: '#FBBF24' }}
          >
            Save Design
          </button>
        </div>
      </div>
    </div>
  );
};

export default CanvaScreen;