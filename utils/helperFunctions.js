import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";
import app from "../config/firebaseConfig.js";
import { v4 as uuidv4 } from "uuid";

const storage = getStorage(app);

export async function uploadUserProfileImageToFirebaseStorage(req, res) {
  try {
    if (!req.file) {
      return res.status(400).send({ error: "Image file is required." });
    }

    const dateTime = giveCurrentDateTime();
    const uniqueFilename = `${uuidv4()}_${req.file.originalname}_${dateTime}`;
    const storageRef = ref(storage, `user-profile-images/${uniqueFilename}`);
    const metadata = { contentType: req.file.mimetype };

    const snapshot = await uploadBytesResumable(
      storageRef,
      req.file.buffer,
      metadata
    );
    const downloadURL = await getDownloadURL(snapshot.ref);

    console.log("File successfully uploaded");

    return {
      name: req.file.originalname,
      path: storageRef.fullPath,
      url: downloadURL,
    };
  } catch (error) {
    console.error(error);
    throw new Error("An error occurred while uploading the file.");
  }
}

export async function uploadBlogImageToFirebaseStorage(req, res) {
  try {
    if (!req.file) {
      return res.status(400).send({ error: "Image file is required." });
    }

    const dateTime = giveCurrentDateTime();
    const uniqueFilename = `${uuidv4()}_${req.file.originalname}_${dateTime}`;
    const storageRef = ref(storage, `styler-blog-images/${uniqueFilename}`);
    const metadata = { contentType: req.file.mimetype };

    const snapshot = await uploadBytesResumable(
      storageRef,
      req.file.buffer,
      metadata
    );
    const downloadURL = await getDownloadURL(snapshot.ref);

    console.log("File successfully uploaded");

    return {
      name: req.file.originalname,
      path: storageRef.fullPath,
      url: downloadURL,
    };
  } catch (error) {
    console.error(error);
    throw new Error("An error occurred while uploading the file.");
  }
}

function giveCurrentDateTime() {
  const today = new Date();
  const date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  const time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  const dateTime = date + " " + time;
  return dateTime;
}
