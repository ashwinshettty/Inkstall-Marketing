import React, { useState } from 'react';
import MainCard from '../../ui/MainCard';
import InnerCard from '../../ui/InnerCard';
import CanvaScreen from './CanvaScreen';

const CreativesLibrary = () => {
  const [showCanvaEditor, setShowCanvaEditor] = useState(false);
  
  const handleOpenCanva = () => {
    setShowCanvaEditor(true);
  };
  
  const handleCloseCanva = () => {
    setShowCanvaEditor(false);
  };

  // Function to handle saving the design (to be implemented)
  const handleSaveDesign = () => {
    // Here you would implement the save functionality
    console.log('Saving design...');
    // After saving, you might want to close the editor
    setShowCanvaEditor(false);
  };
  return (
    <div className="p-8">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Creatives Library</h2>
          <p className="text-gray-400 mt-1">All marketing assets centralised for campaigns.</p>
        </div>
        <div className="flex gap-3">
          <button 
            className="px-4 py-2 rounded-md font-medium text-white transition-colors hover:opacity-90"
            style={{ backgroundColor: '#FBBF24' }}
          >
            + Upload Creative
          </button>
          <button 
            onClick={handleOpenCanva}
            className="px-4 py-2 rounded-md font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            + Create in Studio
          </button>
        </div>
      </div>

      {/* Creative Cards */}
      {/* <InnerCard> */}
        <div className="grid grid-cols-3 gap-6">
          {/* Creative Card 1 */}
          <MainCard>
            <div className="space-y-4">
              {/* Image Placeholder */}
              <div className="bg-gray-700 rounded-lg h-48 flex items-center justify-center">
                <p className="text-gray-400">Image placeholder</p>
              </div>
              
              {/* Creative Info */}
              <div className="space-y-2">
                <h3 className="text-white font-medium">IGCSE Science Carousel 01</h3>
                <p className="text-gray-400">Meta • 1080×1080</p>
                <div className="flex items-center justify-between">
                  <span className="text-green-400 font-medium">Approved</span>
                  <span className="text-gray-400">Usage: 5 campaigns</span>
                </div>
                <button className="text-blue-400 hover:text-blue-300 transition-colors">
                  View details
                </button>
              </div>
            </div>
          </MainCard>

          {/* Creative Card 2 */}
          <MainCard>
            <div className="space-y-4">
              {/* Image Placeholder */}
              <div className="bg-gray-700 rounded-lg h-48 flex items-center justify-center">
                <p className="text-gray-400">Image placeholder</p>
              </div>
              
              {/* Creative Info */}
              <div className="space-y-2">
                <h3 className="text-white font-medium">IBDP Math Carousel 01</h3>
                <p className="text-gray-400">Google Ads • 1200×628</p>
                <div className="flex items-center justify-between">
                  <span className="text-green-400 font-medium">Approved</span>
                  <span className="text-gray-400">Usage: 3 campaigns</span>
                </div>
                <button className="text-blue-400 hover:text-blue-300 transition-colors">
                  View details
                </button>
              </div>
            </div>
          </MainCard>

          {/* Creative Card 3 */}
          <MainCard>
            <div className="space-y-4">
              {/* Image Placeholder */}
              <div className="bg-gray-700 rounded-lg h-48 flex items-center justify-center">
                <p className="text-gray-400">Image placeholder</p>
              </div>
              
              {/* Creative Info */}
              <div className="space-y-2">
                <h3 className="text-white font-medium">ICSE 10th Banner 01</h3>
                <p className="text-gray-400">Meta • 1080×1080</p>
                <div className="flex items-center justify-between">
                  <span className="text-yellow-400 font-medium">In Review</span>
                  <span className="text-gray-400">Usage: 2 campaigns</span>
                </div>
                <button className="text-blue-400 hover:text-blue-300 transition-colors">
                  View details
                </button>
              </div>
            </div>
          </MainCard>
        </div>
      
      {/* Canva Editor Modal */}
      {showCanvaEditor && (
        <CanvaScreen 
          onClose={handleCloseCanva}
          onSave={handleSaveDesign}
        />
      )}
    </div>
  );
};

export default CreativesLibrary;
