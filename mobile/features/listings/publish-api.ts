import * as DocumentPicker from "expo-document-picker";
import * as Clipboard from "expo-clipboard";
import { api } from "@/libs/api";
import type {
  AppealListing,
  ChoosePlanResponse,
  PaymentMethodsResponse,
  PublishOptionsResponse,
} from "@/types/marketplace";
import type { Listing } from "@/types/listing";

export async function getPublishOptions(listingId: string) {
  const response = await api.get<PublishOptionsResponse>(
    `/listings/${listingId}/publish-options`
  );
  return response.data;
}

export async function choosePublishPlan(
  listingId: string,
  plan: "TRIAL_14_DAYS" | "PAID_30_DAYS"
) {
  const response = await api.post<ChoosePlanResponse>(
    `/listings/${listingId}/choose-plan`,
    { plan }
  );
  return response.data;
}

export async function getPaymentMethods() {
  const response = await api.get<PaymentMethodsResponse>("/payments/methods");
  return response.data;
}

export async function notifyPayment(params: {
  listingId: string;
  reference?: string;
  note?: string;
  proofFiles?: Array<{
    uri: string;
    name: string;
    mimeType: string;
  }>;
}) {
  const formData = new FormData();

  formData.append("listingId", params.listingId);
  formData.append("method", "BANK_TRANSFER");
  formData.append("reference", params.reference || "");
  formData.append("note", params.note || "");

  (params.proofFiles || []).forEach((file, index) => {
    formData.append("proofAttachments", {
      uri: file.uri,
      name: file.name || `proof-${index + 1}`,
      type: file.mimeType || "application/octet-stream",
    } as any);
  });

  const response = await api.post("/payments/notify", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}

export async function getDraftListings() {
  const response = await api.get<Listing[]>("/listings/me/drafts");
  return response.data;
}

export async function deleteDraft(listingId: string) {
  const response = await api.delete<{ message: string }>(`/listings/drafts/${listingId}`);
  return response.data;
}

export async function getPendingListings() {
  const response = await api.get<Listing[]>("/listings/me/pending");
  return response.data;
}

export async function getExpiredListings() {
  const response = await api.get<Listing[]>("/listings/me/expired");
  return response.data;
}

export async function renewExpiredListing(listingId: string) {
  const response = await api.post<ChoosePlanResponse>(`/listings/${listingId}/renew`);
  return response.data;
}

export async function getRejectedPaymentListing(listingId: string) {
  const response = await api.get<Listing>(`/listings/${listingId}/rejected-payment`);
  return response.data;
}

export async function getAppealListing(listingId: string) {
  const response = await api.get<AppealListing>(`/listings/${listingId}/appeal`);
  return response.data;
}

export async function submitAppeal(params: {
  listingId: string;
  formData: FormData;
  appealMessage: string;
}) {
  await api.put(`/listings/${params.listingId}`, params.formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  const response = await api.post(`/listings/${params.listingId}/appeal`, {
    appealMessage: params.appealMessage,
  });

  return response.data;
}

export async function copyText(value: string) {
  await Clipboard.setStringAsync(value);
}

export async function pickProofDocuments() {
  const result = await DocumentPicker.getDocumentAsync({
    multiple: true,
    type: ["image/jpeg", "image/jpg", "image/png", "image/webp", "application/pdf"],
    copyToCacheDirectory: true,
  });

  if (result.canceled) return [];

  return result.assets.map((asset) => ({
    uri: asset.uri,
    name: asset.name,
    mimeType: asset.mimeType || "application/octet-stream",
  }));
}