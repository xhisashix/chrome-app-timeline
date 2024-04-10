import storageClass from "./storageClass";

interface TagInterface {
  id: number;
  name: string;
}

class TagClass implements TagInterface {
  public id: number;
  public name: string;

  storage: storageClass;

  constructor() {
    this.storage = new storageClass();
    this.id = 0;
    this.name = "";
  }

  /**
   * タグを追加する
   * @param {string} tagName
   * @return {void}
   */
  public addTag(tagName: string): void {
    let tagList: TagInterface[] = [];

    this.storage.getStorage("tagList", (result: string) => {
      tagList = this.getResultTagList(result);
      const newTag: TagInterface = {
        id: tagList.length,
        name: tagName,
      };

      tagList.push(newTag);
      this.storage.saveToStorage("tagList", JSON.stringify(tagList));
    });
  }

  /**
   * 追加した結果と既存のタグリストを取得する
   * @param {string} result
   * @return {TagInterface[]}
   */
  public getResultTagList(result: string): TagInterface[] {
    return JSON.parse(result) as TagInterface[];
  }

  /**
   * タグリストを取得する
   */
  public getTagList(): Promise<TagInterface[]> {
    return new Promise((resolve) => {
      this.storage.getStorage("tagList", (result: string) => {
        resolve(this.getResultTagList(result));
      });
    });
  }

  /**
   * idをもとにタグの取得
   * @param {number} id
   * @return {Promise<TagInterface>}
   */
  public async getTagById(id: number): Promise<TagInterface | undefined> {
    return new Promise<TagInterface | undefined>((resolve) => {
      this.storage.getStorage("tagList", (result: string) => {
        const tagList = this.getResultTagList(result);
        resolve(tagList.find((tag) => tag.id === id));
      });
    });
  }

  /**
   * タグを編集する
   * @param {number} id
   * @param {string} tagName
   * @return {void}
   */
  public editTag(id: number, tagName: string): void {
    this.getTagList().then((tagList) => {
      const targetTag = tagList.find((tag) => tag.id === id);
      if (targetTag) {
        targetTag.name = tagName;
        this.storage.saveToStorage("tagList", JSON.stringify(tagList));
      }
    });
  }

  /**
   * タグを削除する
   * @param {number} id
   * @return {void}
   */
  public deleteTag(id: number): void {
    this.getTagList().then((tagList) => {
      const newTagList = tagList.filter((tag) => tag.id !== id);
      this.storage.saveToStorage("tagList", JSON.stringify(newTagList));
    });
  }
}

export default TagClass;
