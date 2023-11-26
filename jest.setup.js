// Mock the Chrome local storage function
global.chrome = {
  storage: {
    local: {
      get: jest.fn((keys, callback) => {
        // Implement your logic to get the local storage value here
        const data = {};
        data[keys] = "value";
        callback(data);
      }),
      set: jest.fn((keys, callback) => {
        const obj = {};
        obj[keys] = "value";
        // Implement local storage value setter here
        for (const [key, value] of Object.entries(obj)) {
          // サンプル値をセットする（実際のストレージへの設定は行わない）
          global.chrome.storage.local[key] = value;
        }
      }),
      remove: jest.fn(),
      clear: jest.fn(),
    },
  },
};
