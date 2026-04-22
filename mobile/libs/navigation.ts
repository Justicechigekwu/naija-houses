export function buildExpoRouteFromBackendPath(route?: string) {
  if (!route) return "/notification";

  const clean = String(route).trim();

  const chatMatch = clean.match(/^\/messages\/([^/?#]+)$/);
  if (chatMatch) {
    return {
      pathname: "/messages/[chatId]",
      params: { chatId: chatMatch[1] },
    } as const;
  }

  const listingMatch = clean.match(/^\/listings\/([^/?#]+)$/);
  if (listingMatch) {
    return {
      pathname: "/listings/[slug]",
      params: { slug: listingMatch[1] },
    } as const;
  }

  const feedbackMatch = clean.match(/^\/feedback\/([^/?#]+)$/);
  if (feedbackMatch) {
    return {
      pathname: "/feedback/[reviewId]",
      params: { reviewId: feedbackMatch[1] },
    } as const;
  }

  const rejectedPaymentMatch = clean.match(
    /^\/listing-actions\/([^/?#]+)\/rejected-payment$/
  );
  if (rejectedPaymentMatch) {
    return {
      pathname: "/listing-actions/[id]/rejected-payment",
      params: { id: rejectedPaymentMatch[1] },
    } as const;
  }

  const paymentDetailsMatch = clean.match(
    /^\/listing-actions\/([^/?#]+)\/payment-details$/
  );
  if (paymentDetailsMatch) {
    return {
      pathname: "/listing-actions/[id]/payment-details",
      params: { id: paymentDetailsMatch[1] },
    } as const;
  }

  const webAppealMatch = clean.match(/^\/appeals\/([^/?#]+)$/);
  if (webAppealMatch) {
    return {
      pathname: "/listing-actions/[id]/appeal",
      params: { id: webAppealMatch[1] },
    } as const;
  }

  const appealMatch = clean.match(/^\/listing-actions\/([^/?#]+)\/appeal$/);
  if (appealMatch) {
    return {
      pathname: "/listing-actions/[id]/appeal",
      params: { id: appealMatch[1] },
    } as const;
  }

  if (clean === "/drafts") return "/drafts";
  if (clean === "/expired") return "/expired";
  if (clean === "/pending") return "/pending";
  if (clean === "/notification") return "/notification";
  if (clean === "/feedback") return "/feedback";

  return "/notification";
}