import { useMemo, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import DraggableFlatList, {
  RenderItemParams,
} from "react-native-draggable-flatlist";
import {
  Alert,
  Modal,
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { Image } from "expo-image";
import {
  Camera,
  Check,
  ChevronDown,
  GripVertical,
  ImagePlus,
  Plus,
  X,
} from "lucide-react-native";
import type { LocalListingImage } from "@/types/listing-form";
import { useUI } from "@/hooks/useUI";
import { useTheme } from "@/hooks/useTheme";

type Props = {
  images: LocalListingImage[];
  onChange: (images: LocalListingImage[]) => void;
  max?: number;
  error?: string;
};

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const FOCUS_RING_COLOR = "#8A715D";

export default function ListingImagePicker({
  images,
  onChange,
  max = 20,
  error,
}: Props) {
  const { showToast } = useUI();
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const CARD_GAP = 10;
  const NUM_COLUMNS = 4;
  const HORIZONTAL_PADDING = 0;
  const itemSize = useMemo(() => {
    const totalGap = CARD_GAP * (NUM_COLUMNS - 1);
    return Math.floor((width - HORIZONTAL_PADDING - totalGap - 16) / NUM_COLUMNS);
  }, [width]);

  const normalizeAssets = (
    assets: ImagePicker.ImagePickerAsset[]
  ): LocalListingImage[] => {
    return assets
      .filter((asset) => {
        const mime = asset.mimeType || "image/jpeg";
        const fileSizeOk = !asset.fileSize || asset.fileSize <= MAX_IMAGE_SIZE;
        const typeOk = ALLOWED_IMAGE_TYPES.includes(mime);

        if (!typeOk) {
          showToast("Only JPG, JPEG, PNG and WEBP are allowed", "error");
          return false;
        }

        if (!fileSizeOk) {
          showToast("One of the images is larger than 5MB", "error");
          return false;
        }

        return true;
      })
      .map((asset, index) => ({
        id: `${Date.now()}-${index}-${asset.fileName || "image"}`,
        uri: asset.uri,
        name: asset.fileName || `image-${index}.jpg`,
        type: asset.mimeType || "image/jpeg",
        isRemote: false,
      }));
  };

  const mergeImages = (next: LocalListingImage[]) => {
    const merged = [...images, ...next].slice(0, max);

    if (images.length + next.length > max) {
      showToast(`You can upload a maximum of ${max} images.`, "error");
    }

    onChange(merged);
  };

  const pickFromGallery = async () => {
    setPickerOpen(false);

    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        showToast("Photo permission is required", "error");
        return;
      }

      const remaining = Math.max(1, max - images.length);

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsMultipleSelection: true,
        selectionLimit: remaining,
        quality: 0.9,
      });

      if (result.canceled) return;

      mergeImages(normalizeAssets(result.assets));
    } catch {
      showToast("Failed to pick images", "error");
    }
  };

  const takePhoto = async () => {
    setPickerOpen(false);

    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();

      if (!permission.granted) {
        showToast("Camera permission is required", "error");
        return;
      }

      if (images.length >= max) {
        showToast(`You can upload a maximum of ${max} images.`, "error");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        quality: 0.9,
      });

      if (result.canceled) return;

      mergeImages(normalizeAssets(result.assets));
    } catch {
      showToast("Failed to open camera", "error");
    }
  };

  const removeImage = (id: string) => {
    onChange(images.filter((img) => img.id !== id));
  };

  const visibleImages = expanded ? images : images.slice(0, 8);

  const renderAddTile = () => (
    <Pressable
      onPress={() => setPickerOpen(true)}
      className="items-center justify-center rounded-2xl"
      style={{
        width: itemSize,
        height: itemSize,
        backgroundColor: "#001B0E",
      }}
    >
      <Plus size={28} color={colors.brand} />
    </Pressable>
  );

  const renderItem = ({
    item,
    drag,
    isActive,
    getIndex,
  }: RenderItemParams<LocalListingImage>) => {
    const index = getIndex() ?? 0;

    return (
      <Pressable
        onLongPress={drag}
        delayLongPress={150}
        style={{
          width: itemSize,
          opacity: isActive ? 0.9 : 1,
        }}
      >
        <View
          className="overflow-hidden rounded-2xl"
          style={{
            width: itemSize,
            height: itemSize,
            backgroundColor: colors.surface,
          }}
        >
          <Image
            source={{ uri: item.uri }}
            style={{ width: "100%", height: "100%" }}
            contentFit="cover"
          />

          <Pressable
            onPress={() => removeImage(item.id)}
            className="absolute right-1 top-1 items-center justify-center rounded-full"
            style={{
              width: 24,
              height: 24,
              backgroundColor: "rgba(0,0,0,0.65)",
            }}
          >
            <X size={14} color="#fff" />
          </Pressable>

          <Pressable
            onLongPress={drag}
            delayLongPress={150}
            className="absolute bottom-1 right-1 items-center justify-center rounded-full"
            style={{
              width: 24,
              height: 24,
              backgroundColor: "rgba(0,0,0,0.55)",
            }}
          >
            <GripVertical size={14} color="#fff" />
          </Pressable>
        </View>
      </Pressable>
    );
  };

  return (
    <View className="mt-4">
      <Text className="mb-2 text-[14px] font-medium" style={{ color: colors.text }}>
        Add at least 1 photos
      </Text>

      <View
        className="rounded-2xl"
        style={{
          borderWidth: error ? 1 : 0,
          borderColor: error ? colors.danger : "transparent",
        }}
      >
        <View
          pointerEvents="none"
          className="absolute inset-0 rounded-2xl"
          style={{
            borderWidth: 0,
            borderColor: error ? colors.danger : FOCUS_RING_COLOR,
          }}
        />

        <View className="flex-row flex-wrap" style={{ gap: CARD_GAP }}>
          {renderAddTile()}

          <DraggableFlatList
            data={visibleImages}
            onDragEnd={({ data }) => {
              const finalData = expanded
                ? data
                : [...data, ...images.slice(8)];
              onChange(finalData);
            }}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            activationDistance={8}
            containerStyle={{ flexGrow: 0 }}
            contentContainerStyle={{ gap: CARD_GAP }}
            numColumns={4}
            scrollEnabled={false}
          />
        </View>

        {images.length > 8 ? (
          <Pressable
            onPress={() => setExpanded((prev) => !prev)}
            className="mt-4 items-center justify-center rounded-2xl py-4"
            style={{ backgroundColor: colors.surface }}
          >
            <Text style={{ color: colors.brand, fontSize: 16, fontWeight: "500" }}>
              {expanded ? `Show less` : `Show all ${images.length} pictures`}
            </Text>
            <ChevronDown
              size={18}
              color={colors.brand}
              style={{
                transform: [{ rotate: expanded ? "180deg" : "0deg" }],
                marginTop: 4,
              }}
            />
          </Pressable>
        ) : null}

        {error ? (
          <Text className="mt-2 text-sm" style={{ color: colors.danger }}>
            {error}
          </Text>
        ) : null}
      </View>

      <Modal
        visible={pickerOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setPickerOpen(false)}
      >
        <Pressable
          className="flex-1 justify-end bg-black/30"
          onPress={() => setPickerOpen(false)}
        >
          <Pressable
            className="rounded-t-3xl px-4 pb-8 pt-5"
            style={{ backgroundColor: colors.surface }}
          >
            <Text className="mb-4 text-lg font-semibold" style={{ color: colors.text }}>
              Add photo
            </Text>

            <Pressable
              onPress={pickFromGallery}
              className="mb-3 flex-row items-center rounded-2xl border px-4 py-4"
              style={{ borderColor: colors.border }}
            >
              <ImagePlus size={18} color={colors.text} />
              <Text className="ml-3" style={{ color: colors.text }}>
                Select photos
              </Text>
            </Pressable>

            <Pressable
              onPress={takePhoto}
              className="flex-row items-center rounded-2xl border px-4 py-4"
              style={{ borderColor: colors.border }}
            >
              <Camera size={18} color={colors.text} />
              <Text className="ml-3" style={{ color: colors.text }}>
                Use camera
              </Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}