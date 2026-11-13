export const LISTING_STATUS = {
  DRAFT: "draft",
  ACTIVE: "active",
  RESERVED: "reserved",
  SOLD: "sold",
  FLAGGED: "flagged",
  REMOVED: "removed",
};

export const LISTING_STATUSES = Object.values(LISTING_STATUS);

export const LISTING_STATUS_LABELS = {
  draft: "Draft",
  active: "Live",
  reserved: "Reserved",
  sold: "Sold",
  flagged: "Under review",
  removed: "Removed",
};

// SRS LST-03: a seller can edit drafts and active listings, not sold ones
export const EDITABLE_LISTING_STATUSES = [LISTING_STATUS.DRAFT, LISTING_STATUS.ACTIVE];

export const isEditableListing = (status) => EDITABLE_LISTING_STATUSES.includes(status);
export const isBuyable = (status) => status === LISTING_STATUS.ACTIVE;