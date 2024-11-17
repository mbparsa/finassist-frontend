import React, { useState , useEffect} from 'react';
import Papa from 'papaparse';
import './LandingPage.css';


const LandingPage = () => {
  const [csvFile, setCsvFile] = useState(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [serverResponse, setServerResponse] = useState(null); // State variable for server response

  const expectedHeaders = ['Transaction Date','Clearing Date', 'Description','Merchant', 'Category', 'Type', 'Amount (USD)', 'Purchased By'];
  //const normalizedExpectedHeaders = expectedHeaders.map(header => expectedHeaders.trim().toLowerCase());
  
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
    getUserName();
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file && file.length > 0 && (file.type === 'text/csv'|| file.name.endsWith('.csv'))) {
      setCsvFile(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }else{
        setErrorMessage('Please upload a valid CSV file.');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const validateHeaders = (headers) => {
    const normalizedExpectedHeaders = expectedHeaders.map(header => header.trim().toLowerCase());
    const normalizedHeaders = headers.map(header => header.trim().toLowerCase());
    const i = 0;
    const isValid = normalizedExpectedHeaders.every(header => normalizedHeaders.includes(header));
    console.log('isValid:', isValid);
    return isValid;
  };

  useEffect(() => {
    if(!csvFile){
        console.log('No file selected');
        return;
    } else {
        console.log('csvFile state updated:', csvFile);
        setIsUploadModalOpen(false);
  
        const reader = new FileReader();
        reader.onload = (event) => {
          const csvData = event.target.result;
          console.log('CSV File Content:', csvData.slice(0, 200)); // Log the first 200 characters of the file content
          Papa.parse(csvData, {
            header: true,
            complete: function(results) {
              try {
                const headers = results.meta.fields;
                console.log('Parsed CSV Headers:', headers); // Log the headers
                if (validateHeaders(headers)) {
                    console.log(results.data);
                    const selectedData = results.data.map(row => ({
                      transactionDate: row['Transaction Date'],
                      merchant: row['Merchant'],
                      category: row['Category'],
                      amount: row['Amount (USD)'],
                      type: row['Type'],
                    }));
                  console.log('Selected Data:', selectedData.slice(0, 5)); // Log the first 5 rows of selected data
                  sendDataToBackend(selectedData);
                } else {
                  setErrorMessage('Invalid CSV format. Please upload an Apple Pay CSV extract.');
                }
              } catch (error) {
                console.error('Error parsing CSV:', error);
                setErrorMessage('An error occurred while parsing the CSV file.');
              }
            },
            error: function(error) {
              console.error('Error reading CSV file:', error);
              setErrorMessage('An error occurred while reading the CSV file.');
            }
          });
        };
        reader.readAsText(csvFile, 'UTF-8'); // Ensure the file is read as text with UTF-8 encoding
      }
    }, [csvFile]);

    const getUserName = async () => {
        try {
            const response = await fetch('http://localhost:8000/users/');
            if (response.ok) {
                const data = await response.json();
                console.log('User Data:', data);
            } else {
                alert('Error fetching user data');
            }
        } catch (error) {
            alert('Error fetching user data');
            console.error('Error fetching user data:', error);
        }
    };



    const sendDataToBackend = async (data) => {
        try {
            console.log('Outgoing Data:', data); // Log the outgoing data
            const response = await fetch('http://localhost:8000/transactions/applepayscv/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            if (response.ok) {
                alert('Data uploaded successfully');
            } else {

                alert('Error uploading data');
            }
            const responseData = await response.json();
            setServerResponse(responseData); // Update state with server response
        } catch (error) {
            alert('Error uploading data');
            console.error('Error uploading data:', error );
        }
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
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {serverResponse && (
        <div className="server-response">
          <h3>Server Response</h3>
          <p>{serverResponse.message}</p>
          <pre>{JSON.stringify(serverResponse.data, null, 2)}</pre>
          {serverResponse.plot && (
            <img src={`data:image/png;base64,${serverResponse.plot}`} alt="Plot" />
          )}
        </div>
      )}
    </div>
  );
};

export default LandingPage;
