import React, { useState , useEffect} from 'react';
import Papa from 'papaparse';
import BarPlot from './BarPlot';
import './Setting_Page.css';
import '../components/Menu';
import { DisabledByDefault } from '@mui/icons-material';
import Menu from '../components/Menu';




const Setting_Page = () => {
  const [csvFile, setCsvFile] = useState(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [serverResponse, setServerResponse] = useState(null); // State variable for server response
  const [successMessage, setSuccessMessage] = useState(''); // State variable for success message
  const [failedMessage, setFailedMessage] = useState(''); // State variable for failed message
  const expectedHeaders = ['Transaction Date','Clearing Date', 'Description','Merchant', 'Category', 'Type', 'Amount (USD)', 'Purchased By'];
  const [selectedCategory, setSelectedCategory] = useState(''); // State variable for selected category
  const [selectedOption, setSelectedOption] = useState('Dashboard'); // State variable for selected option

  const [plotData, setPlotData] = useState([]); // State variable for plot data
  //const normalizedExpectedHeaders = expectedHeaders.map(header => expectedHeaders.trim().toLowerCase());
  
  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

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
        setIsUploadModalOpen(false);
        readCSVFile(csvFile)
        .then((data) => {
            setPlotData(data);
            sendDataToBackend(data);
        }).catch((error) => {
            console.error('Error reading CSV file:', error);
        });
      }
    }, [csvFile]);

    function readCSVFile (file){
        return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const csvData = event.target.result;
          console.log('CSV File Content:', csvData.slice(0, 200)); // Log the first 200 characters of the file content
          Papa.parse(csvData, {
            header: true,
            skipEmptyLines: true,
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
                    resolve(selectedData);
                } else {
                    setErrorMessage('Invalid CSV format. Please upload an Apple Pay CSV extract.');
                    reject('Invalid CSV format');
                }
              } catch (error) {
                    console.error('Error parsing CSV:', error);
                    setErrorMessage('An error occurred while parsing the CSV file.');
                    reject(error);
              }
            },
            error: function(error) {
                console.error('Error reading CSV file:', error);
                setErrorMessage('An error occurred while reading the CSV file.');
                reject(error);
            }
          });
        };
        reader.readAsText(csvFile, 'UTF-8'); // Ensure the file is read as text with UTF-8 encoding
    });
    };

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
                setSuccessMessage('Data uploaded successfully!'); // Set success message
            } else {
                setFailedMessage('We could not upload the data!'); // Set Failed message
            }
            const responseData = await response.json();
            setServerResponse(responseData); // Update state with server response

        } catch (error) {
            alert('Error uploading data');
            console.error('Error uploading data:', error );
        }
    };

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
      };
    
      const filteredData = selectedCategory
        ? plotData.filter(item => item.category === selectedCategory)
        : plotData;



  return (
    
    <div className="landing-page">
      {!isUploadModalOpen && (
        <div className="content">
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
      {successMessage && <div className="success-message">{successMessage}</div>}
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
      {plotData.length > 0 && (
        <div className="plot-container">
        <label htmlFor="category-select">Select Category:</label>
        <div className="category-buttons">
            <button onClick={() => handleCategoryChange('')}>All</button>
            <button onClick={() => handleCategoryChange('Others')}>Others</button>
            <button onClick={() => handleCategoryChange('Grocery')}>Grocery</button>
            <button onClick={() => handleCategoryChange('Entertainment')}>Entertainment</button>
            <button onClick={() => handleCategoryChange('Sports')}>Sports</button>
            <button onClick={() => handleCategoryChange('Subscriptions')}>Subscriptions</button>
          </div>
        <h3>Spending by Merchant</h3>
        <BarPlot data={filteredData} />
        </div>
      )}
    </div>
  );
};

export default Setting_Page;
