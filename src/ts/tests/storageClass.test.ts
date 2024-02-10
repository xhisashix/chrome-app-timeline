import storageClass from "../storageClass";

const storage = new storageClass();

describe("test chrome_app_timeline", function () {
  it("test chrome-app-timeline.storageClass.getStorage", function (done) {
    storage.getStorage("storage", (result) => {
      expect(result).toBe("value");
      done();
    });
  });

  it("test chrome-app-timeline.storageClass.saveToStorage", function (done) {
    let key = "test_key";
    let value = "test_value";
    storage.saveToStorage(key, value);
    chrome.storage.local.get(key, function (items) {
      expect(items[key]).toBe("value");
      done();
    });
  });
});
