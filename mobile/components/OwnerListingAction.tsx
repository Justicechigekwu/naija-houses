import { Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useUI } from "@/hooks/useUI";

type Props = {
  listingId: string;
  slug?: string;
  onDelete: () => Promise<void>;
  deleting?: boolean;
};

export default function OwnerListingActions({
  listingId,
  slug,
  onDelete,
  deleting = false,
}: Props) {
  const router = useRouter();
  const { showConfirm } = useUI();

  return (
    <View className="mt-4 flex-row gap-3">
      <Pressable
        onPress={() => router.push(`/listings/edit/${listingId}` as any)}
        className="flex-1 items-center rounded-2xl border border-[#D0D5DD] bg-white py-4"
      >
        <Text className="font-semibold text-[#111827]">Edit</Text>
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
        className={`flex-1 items-center rounded-2xl py-4 ${
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