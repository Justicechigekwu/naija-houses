'use client'

import api from "@/libs/api";
import { AxiosError } from 'axios';

export default async function editListing(listingId: string, formData: FormData) {
  try {
    const res = await api.put(`/listings/${listingId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (err: unknown) {
    if (err instanceof AxiosError) {
      throw new Error(err.response?.data?.message || "Failed to update listing");
    } else if (err instanceof Error) {
      throw new Error(err.message);
    } else {
      throw new Error('Something went wrong');
    }
  }
}
