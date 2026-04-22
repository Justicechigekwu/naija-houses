import { useEffect, useRef } from "react";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import { registerPushToken } from "@/features/notifications/push-api";
import { getExpoPushToken } from "@/libs/push-notifications";
import { buildExpoRouteFromBackendPath } from "@/libs/navigation";
import { useAuthStore } from "@/store/auth-store";

export default function usePushNotifications() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const ranRef = useRef(false);

  useEffect(() => {
    if (!user || ranRef.current) return;

    ranRef.current = true;

    (async () => {
      try {
        const token = await getExpoPushToken();
        await registerPushToken(token);
      } catch (error) {
        console.log("Push registration skipped:", error);
      }
    })();
  }, [user]);

  useEffect(() => {
    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response.notification.request.content.data as {
          route?: string;
          listingId?: string;
          chatId?: string;
          reviewId?: string;
          type?: string;
        };

        if (data?.route) {
          router.push(buildExpoRouteFromBackendPath(String(data.route)) as any);
          return;
        }

        if (data?.reviewId) {
          router.push({
            pathname: "/feedback/[reviewId]",
            params: { reviewId: data.reviewId },
          } as any);
          return;
        }

        if (data?.chatId) {
          router.push({
            pathname: "/messages/[chatId]",
            params: { chatId: data.chatId },
          } as any);
          return;
        }

        if (data?.type === "REVIEW_RECEIVED" || data?.type === "REVIEW_REPLY" || data?.type === "REVIEW_COMMENT") {
          router.push("/feedback" as any);
          return;
        }

        if (data?.type === "LISTING_EXPIRED") {
          router.push("/expired" as any);
          return;
        }

        if (data?.type === "DRAFT_REMINDER") {
          router.push("/drafts" as any);
          return;
        }

        if (data?.type === "LISTING_APPEAL_SUBMITTED") {
          router.push("/pending" as any);
          return;
        }

        router.push("/notification" as any);
      });

    return () => {
      responseListener.remove();
    };
  }, [router]);
}