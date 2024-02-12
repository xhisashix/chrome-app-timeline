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

  /**
   * @param {string} key - Key to save settings under
   * @param {string} value - Value to save settings under
   * @return {void}
   */
  saveReportToStorage(key: string, value: string) {
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
  getReportFromStorage(key: string, callback: (result: string) => void) {
    chrome.storage.local.get([key], (result) => {
      callback(result[key]);
    });
  }

  /**
   * @param {string} key - Key to get settings under
   * @return {string} - Value to get settings under
   * @description - ストレージの値のみ取得する
   */
  async getReportFromStorageValue(key: string) {
    // ストレージの値のみ取得する
    return new Promise<string>((resolve) => {
      chrome.storage.local.get([key], (result) => {
        resolve(result[key]);
      });
    });
  }

  /**
   * ストレージから値を取得し配列にセットする
   * @param {Array} keys - Key to get settings under
   * @return {void}
   */
  async getReportSetting(key: Array<string>) {
    const report_settings: Array<ReportSettings> = [];

    interface ReportSettings {
      to?: string;
      cc?: string;
      report_head?: string;
      name?: string;
      report_footer?: string;
    }

    for (const value of key) {
      const result = await this.getReportFromStorageValue(value);
      let report_setting: ReportSettings = {};
      report_setting[value as keyof ReportSettings] = result;
      report_settings.push(report_setting);
    }

    return report_settings;
  }
}

export default storageClass;
