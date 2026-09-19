import { updateProfile, User } from "firebase/auth";
import {
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import {
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { auth, db, storage } from "./firebase";


export const uploadProfilePhoto = async (
  user: User,
  imageUri: string
) => {
  if (!user) {
    throw new Error("User is not signed in.");
  }

  if (!imageUri) {
    throw new Error("Profile image not selected.");
  }

  const response = await fetch(imageUri);

  if (!response.ok) {
    throw new Error("Unable to read selected image.");
  }

  const blob = await response.blob();

  const extension =
    imageUri.split(".").pop()?.split("?")[0] ||
    "jpg";

  const storageRef = ref(
    storage,
    `users/${user.uid}/profile.${extension}`
  );

  await uploadBytes(storageRef, blob, {
    contentType:
      blob.type || "image/jpeg",
  });

  const downloadURL =
    await getDownloadURL(storageRef);

  await updateProfile(user, {
    photoURL: downloadURL,
  });

  await updateDoc(
    doc(db, "users", user.uid),
    {
      photoURL: downloadURL,
      updatedAt: serverTimestamp(),
    }
  );

  return downloadURL;
};