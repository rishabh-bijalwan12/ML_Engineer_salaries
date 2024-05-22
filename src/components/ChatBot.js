import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom

function ChatBot() {
  const [inputMsg, setInputMsg] = useState('');
  const [response, setResponse] = useState('');
  const [isGeneratingResponse, setIsGeneratingResponse] = useState(false);
  const navigate = useNavigate(); // Initialize navigate

  const handleInputChange = (e) => {
    setInputMsg(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsGeneratingResponse(true);

    try {
      const response = await fetch('https://newml-salaries.onrender.com/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query: inputMsg })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch response');
      }

      const responseData = await response.json();
      setResponse(responseData.text);
    } catch (error) {
      console.error('Error:', error);
      setResponse('Error fetching response. Please try again.');
    } finally {
      setIsGeneratingResponse(false);
    }
  };

  // Function to handle back button click
  const handleBack = () => {
    navigate('/'); // Navigate back to the home page
  };

  return (
    <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md overflow-hidden border-2 border-black mt-4">
      <div className="p-8">
        <h1 className="text-4xl font-bold mb-6 text-indigo-600 text-center">ChatBot</h1>
        <form onSubmit={handleSubmit} className="mb-6">
          <input 
            type="text" 
            value={inputMsg} 
            onChange={handleInputChange} 
            className="w-full border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 shadow-sm p-4 text-lg"
            placeholder="Type your message..."
          />
          <button 
            type="submit" 
            className={`block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold p-4 mt-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isGeneratingResponse ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isGeneratingResponse}
          >
            {isGeneratingResponse ? 'Generating Response...' : 'Send'}
          </button>
        </form>
        <div className="bg-gray-100 p-6 rounded-lg">
          <p className={`text-lg ${response ? 'text-gray-900' : 'text-gray-500'}`}>
            {response || 'No response yet...'}
          </p>
        </div>
      </div>
      <div className="flex justify-center"> {/* Center the button */}
        <button onClick={handleBack} className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded inline-flex items-center"> {/* Set color to indigo */}
          <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-2.293-6.707a1 1 0 011.414-1.414L10 11.586l1.879-1.879a1 1 0 111.414 1.414l-2.5 2.5a1 1 0 01-1.414 0l-2.5-2.5a1 1 0 011.414-1.414L10 11.586l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          Back
        </button>
      </div>
    </div>
  );
}

export default ChatBot;
