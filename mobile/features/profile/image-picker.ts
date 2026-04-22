import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";

export type PickedAvatarFile = {
  uri: string;
  name: string;
  type: string;
};

function buildAvatarFile(uri: string): PickedAvatarFile {
  const filename = uri.split("/").pop() || `avatar-${Date.now()}.jpg`;
  const ext = filename.split(".").pop()?.toLowerCase();

  let mimeType = "image/jpeg";

  if (ext === "png") mimeType = "image/png";
  if (ext === "webp") mimeType = "image/webp";
  if (ext === "jpg" || ext === "jpeg") mimeType = "image/jpeg";

  return {
    uri,
    name: filename,
    type: mimeType,
  };
}

export async function pickAvatarFromLibrary(): Promise<PickedAvatarFile | null> {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permission.granted) {
    Alert.alert(
      "Permission needed",
      "Please allow photo library access to choose an avatar."
    );
    return null;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  });

  if (result.canceled || !result.assets?.length) {
    return null;
  }

  return buildAvatarFile(result.assets[0].uri);
}

export async function pickAvatarFromCamera(): Promise<PickedAvatarFile | null> {
  const permission = await ImagePicker.requestCameraPermissionsAsync();

  if (!permission.granted) {
    Alert.alert(
      "Permission needed",
      "Please allow camera access to take an avatar photo."
    );
    return null;
  }

  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ["images"],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  });

  if (result.canceled || !result.assets?.length) {
    return null;
  }

  return buildAvatarFile(result.assets[0].uri);
}