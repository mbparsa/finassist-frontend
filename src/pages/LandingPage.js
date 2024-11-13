import React, { useState } from 'react';
import './LandingPage.css';

const LandingPage = () => {
  const [csvFile, setCsvFile] = useState(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const handleFileChange = (e) => {
    setCsvFile(e.target.files[0]);
  };

  const openUploadModal = () => {
    setIsUploadModalOpen(true);
  };

  const closeUploadModal = (e) => {
    if (e.target.className === 'upload-modal-overlay') {
      setIsUploadModalOpen(false);
    }
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setCsvFile(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className="landing-page">
      {!isUploadModalOpen && (
        <nav className="navbar">
          <div className="logo">FinAssist</div>
          <div className="user-menu">
            <img src="user-icon.png" alt="User Icon" className="user-icon" onClick={toggleProfileMenu} />
            {isProfileMenuOpen && (
              <div className="dropdown-content">
                <a href="#">Settings</a>
                <div className="bank-connect-section">
                  <h3>Connect to Banks/Cards</h3>
                  <button id="connect-bank-button">Connect with Plaid</button>
                </div>
                <a href="#">Logout</a>
                <a href="#">Plan (Free, Paid)</a>
              </div>
            )}
          </div>
        </nav>
      )}

      {!isUploadModalOpen && (
        <div className="content">
          <div className="graphs-section">
            <div className="graph" id="total-saving">
              <h3>Total Saving This Month</h3>
              <div className="placeholder-graph">[Graph Placeholder]</div>
            </div>
            <div className="graph" id="total-spending">
              <h3>Total Spending</h3>
              <div className="placeholder-graph">[Graph Placeholder]</div>
            </div>
            <div className="graph" id="total-invested">
              <h3>Total Invested</h3>
              <div className="placeholder-graph">[Graph Placeholder]</div>
            </div>
          </div>

          <div className="csv-upload-trigger">
            <button onClick={openUploadModal} className="open-upload-modal-button">
              Upload Apple Pay File
            </button>
          </div>
        </div>
      )}

      {isUploadModalOpen && (
        <div className="upload-modal-overlay" onClick={closeUploadModal}>
          <div className="upload-modal" onClick={(e) => e.stopPropagation()}>
            <div 
              className="upload-area" 
              onDrop={handleDrop} 
              onDragOver={handleDragOver}
            >
              <span className="upload-icon">&#8682;</span>
              <p>Drag and Drop file here or</p>
              <button className="browse-button" onClick={() => document.getElementById('csv-file-input').click()}>Browse</button>
              <input type="file" id="csv-file-input" onChange={handleFileChange} style={{ display: 'none' }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
