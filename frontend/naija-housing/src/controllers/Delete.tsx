'use client'

import api from "@/libs/api";
import { AxiosError } from "axios";

export default async function deleteListing(listingId: string) {
  try {
    const res = await api.delete(`/listings/${listingId}`);
    return res.data;
  } catch (err: unknown) {
    if (err instanceof AxiosError) {
      throw new Error(err.response?.data?.message || "Failed to delete listing");
    } else if (err instanceof Error) {
      throw new Error(err.message);
    } else {
      throw new Error("Something went wrong");
    }
  }
}

 