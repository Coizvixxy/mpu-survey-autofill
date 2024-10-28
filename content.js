// contentScript.js

// 監聽來自 popup 的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Message received:', request);
  if (request.action === "fillForm") {
    try {
      // 獲取 iframe 內的文檔
      const iframe = document.querySelector('iframe');
      if (iframe && iframe.contentDocument) {
        fillFormInIframe(iframe.contentDocument, request.score);
        sendResponse({ success: true });
      } else {
        // 如果在 iframe 內部，直接使用當前文檔
        fillFormInIframe(document, request.score);
        sendResponse({ success: true });
      }
    } catch (error) {
      console.error('Error in fillForm:', error);
      sendResponse({ success: false, error: error.message });
    }
  }
  return true;
});

function fillFormInIframe(doc, score) {
  console.log('Starting fillFormInIframe with score:', score);

  const questions = {
    // Teacher evaluation
    'radioq1': score,  'radioq2': score,  'radioq3': score,  'radioq4': score,
    'radioq5': score,  'radioq6': score,  'radioq7': score,  'radioq8': score,
    'radioq9': score,  'radioq10': score, 'radioq11': score, 'radioq12': score,
    'radioq13': score, 'radioq14': score, 'radioq15': score, 'radioq16': score,
    'radioq17': score, 'radioq18': score,

    // Course evaluation
    'radioq20': score, 'radioq21': score, 'radioq22': score, 'radioq23': score,
    'radioq24': score, 'radioq25': score,

    // Additional information
    'radioq27': score,
    'radioq28': '1', // Weekly study hours (8 hours or more)
    'radioq29': '1'  // Attendance rate (90-100%)
  };

  // 模擬滑鼠點擊
  for (let id in questions) {
    const radios = doc.getElementsByName(id);
    for (let radio of radios) {
      if (radio.value === questions[id]) {
        // 創建並觸發滑鼠事件
        const mouseEvent = new MouseEvent('click', {
          view: window,
          bubbles: true,
          cancelable: true
        });
        radio.dispatchEvent(mouseEvent);
        break;
      }
    }
  }

  // 填寫文字意見
  try {
    const textArea19 = doc.getElementsByName('q19')[0];
    const textArea26 = doc.getElementsByName('q26')[0];
    
    if (textArea19) {
      textArea19.value = score === '1' ? 
        'The teacher is professional and responsible. The lectures are clear and engaging.' : 
        'The teaching methods could be improved.';
      // 觸發 input 事件
      textArea19.dispatchEvent(new Event('input', { bubbles: true }));
    }
    if (textArea26) {
      textArea26.value = score === '1' ? 
        'The course content is enriching and helpful for learning.' : 
        'The course content needs improvement.';
      // 觸發 input 事件
      textArea26.dispatchEvent(new Event('input', { bubbles: true }));
    }
  } catch (e) {
    console.error('Error filling text areas:', e);
  }
}