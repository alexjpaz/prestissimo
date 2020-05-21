export default class FileHelper {
  static async readAsDataURL(file) {
    return await new Promise((res, rej) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const dataURL = e.target.result;
          return res(dataURL);
        } catch(e) {
          return rej(e);
        }
      };

      reader.onerror = rej;

      reader.readAsDataURL(file);
    });
  };
}
