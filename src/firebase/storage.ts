import { User } from "firebase/auth";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
  UploadTaskSnapshot,
} from "firebase/storage";
import app from "./init";

const storage = getStorage(app);
const userPhotosPath = "user_photos";

const uploadFile = (
  file: File,
  path: string,
  snapshotWatcher: (snapshot: UploadTaskSnapshot) => void,
  errorHandler: (error: any) => void,
  completeHandler: (url: string) => void
) => {
  const fileRef = ref(storage, path);
  const uploadTask = uploadBytesResumable(fileRef, file);
  uploadTask.on("state_changed", snapshotWatcher, errorHandler, () =>
    getDownloadURL(uploadTask.snapshot.ref).then(completeHandler)
  );
};

const uploadUserPhoto = (
  file: File,
  user: User,
  watcher: (snapshot: UploadTaskSnapshot) => void,
  errorHandler: (error: any) => void,
  completeHandler: (url: string) => void
) => {
    const fileName = user.uid + "." + (file.type ? file.type.split("/")[1] : "");
    const path = userPhotosPath + "/" + user.uid + "/" + fileName;
    uploadFile(file, path, watcher, errorHandler, completeHandler);
};

export {
    uploadUserPhoto,
}