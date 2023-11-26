class storageClass {
  /**
   * @param {string} key - Key to save settings under
   * @param {string} value - Value to save settings under
   * @return {void}
   */
  saveToStorage(key: string, value: string) {
    chrome.storage.local.set({ [key]: value }),
      () => {
        console.log("Value is set to " + value);
      };
  }

  /**
   * @param {string} key - Key to get settings under
   * @param {strung} value - Value to get settings under
   * @return {void}
   */
  getStorage(key: string, callback: (result: string) => void) {
    chrome.storage.local.get([key], (result) => {
      callback(result[key]);
    });
  }
}

export default storageClass;
