// popup.js

document.addEventListener('DOMContentLoaded', () => {
    const buttons = ['score1', 'score2', 'score3', 'score4', 'score5'];
  
    buttons.forEach((buttonId, index) => {
      const button = document.getElementById(buttonId);
      if (button) {
        button.addEventListener('click', async () => {
          try {
            const score = (index + 1).toString();
            console.log(`Score ${score} button clicked`);
  
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            console.log('Current tab:', tab);
  
            // 向內容腳本發送消息
            chrome.tabs.sendMessage(tab.id, { 
              action: "fillForm",
              score: score
            }, (response) => {
              if (chrome.runtime.lastError) {
                console.error('Error:', chrome.runtime.lastError);
                alert('Error: Could not connect to the page. Please make sure you are on the correct page.');
              } else {
                console.log('Response:', response);
                if (response && response.success) {
                  console.log('Form filled successfully!');
                }
              }
            });
          } catch (error) {
            console.error('Error in popup:', error);
            alert('An error occurred. Please try again.');
          }
        });
      }
    });
  });