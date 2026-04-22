import { Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useUI } from "@/hooks/useUI";

type Props = {
  listingId: string;
  onDelete: () => Promise<void>;
  deleting?: boolean;
};

export default function OwnerListingActions({
  listingId,
  onDelete,
  deleting = false,
}: Props) {
  const router = useRouter();
  const { showConfirm } = useUI();

  return (
    <View className="mt-6 gap-3">
      <Pressable
        onPress={() => router.push(`/listings/edit/${listingId}` as any)}
        className="items-center rounded-xl bg-[#EAB308] py-3.5"
      >
        <Text className="font-semibold text-white">Edit</Text>
      </Pressable>

      <Pressable
        onPress={() =>
          showConfirm(
            {
              title: "Delete ad",
              message: "Are you sure you want to delete this advert?",
              confirmText: "Delete",
              cancelText: "Cancel",
              confirmVariant: "danger",
            },
            () => {
              onDelete();
            }
          )
        }
        className={`items-center rounded-xl py-3.5 ${
          deleting ? "bg-[#FCA5A5]" : "bg-[#DC2626]"
        }`}
      >
        <Text className="font-semibold text-white">
          {deleting ? "Deleting..." : "Delete"}
        </Text>
      </Pressable>
    </View>
  );
}