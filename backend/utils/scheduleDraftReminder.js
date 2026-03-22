const addMinutes = (date, minutes) =>
  new Date(date.getTime() + minutes * 60 * 1000);

export const scheduleDraftReminder = (listing, minutes = 30) => {
  listing.draftReminderAt = addMinutes(new Date(), minutes);
  listing.draftReminderSentAt = null;
};

export const clearDraftReminder = (listing) => {
  listing.draftReminderAt = null;
  listing.draftReminderSentAt = null;
};