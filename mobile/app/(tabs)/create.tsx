import { useRouter } from "expo-router";
import ListingForm from "@/components/listings/ListingForm";
import { createListing } from "@/features/listings/form-api";
import { useUI } from "@/hooks/useUI";
import AppScreen from "@/components/ui/AppScreen";

export default function CreateListingScreen() {
  const router = useRouter();
  const { showToast } = useUI();

  const handleCreateListing = async (formData: FormData) => {
    try {
      const res = await createListing(formData);

      const listingId = res?.listingId || res?.listing?._id;

      if (!listingId) {
        throw new Error("Listing ID not returned");
      }

      showToast("Listing created successfully", "success");
      router.replace(`/listing-actions/${listingId}/payment` as any);
    } catch (error: any) {
      showToast(
        error?.response?.data?.message || error?.message || "Failed to create listing",
        "error"
      );
      throw error;
    }
  };

  return (
    <AppScreen scroll={false} padded={false}>
      <ListingForm onSubmit={handleCreateListing} isEditMode={false} />
    </AppScreen>
  );
}