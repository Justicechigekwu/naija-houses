"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import type { Listing } from "@/types/listing";
import ListingCard from "./ListingCard";

type Props = {
  items: Listing[];
  hasNextPage?: boolean;
  fetchNextPage?: () => void;
  isFetchingNextPage?: boolean;
  emptyText?: string;
};

const CARD_ROW_HEIGHT = 360;

function getColumnCount(width: number) {
  if (width >= 1280) return 5;
  if (width >= 1024) return 4;
  if (width >= 768) return 4;
  if (width >= 640) return 2;
  return 2;
}

export default function VirtualizedListingGrid({
  items,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
  emptyText = "No listings found",
}: Props) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [columns, setColumns] = useState(2);
  const [scrollMargin, setScrollMargin] = useState(0);

  useEffect(() => {
    const update = () => {
      if (typeof window === "undefined") return;
      setColumns(getColumnCount(window.innerWidth));

      if (wrapperRef.current) {
        const rect = wrapperRef.current.getBoundingClientRect();
        setScrollMargin(rect.top + window.scrollY);
      }
    };

    update();
    window.addEventListener("resize", update);

    return () => window.removeEventListener("resize", update);
  }, []);

  const rows = useMemo(() => {
    const grouped: Listing[][] = [];
    for (let i = 0; i < items.length; i += columns) {
      grouped.push(items.slice(i, i + columns));
    }
    return grouped;
  }, [items, columns]);

  const rowVirtualizer = useWindowVirtualizer({
    count: rows.length,
    estimateSize: () => CARD_ROW_HEIGHT,
    overscan: 4,
    scrollMargin,
  });

  const virtualRows = rowVirtualizer.getVirtualItems();

  useEffect(() => {
    if (!virtualRows.length || !hasNextPage || !fetchNextPage || isFetchingNextPage) {
      return;
    }

    const lastRow = virtualRows[virtualRows.length - 1];
    if (lastRow.index >= rows.length - 2) {
      fetchNextPage();
    }
  }, [virtualRows, rows.length, hasNextPage, fetchNextPage, isFetchingNextPage]);

  if (!items.length) {
    return <p>{emptyText}</p>;
  }

  return (
    <div ref={wrapperRef} className="w-full">
      <div
        className="relative w-full"
        style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
      >
        {virtualRows.map((virtualRow) => {
          const rowItems = rows[virtualRow.index] || [];

          return (
            <div
              key={virtualRow.key}
              className="absolute left-0 top-0 w-full"
              style={{
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {rowItems.map((listing) => (
                  <ListingCard key={listing._id} listing={listing} />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {isFetchingNextPage ? (
        <p className="mt-6 text-center text-sm text-gray-500">
          Loading more listings...
        </p>
      ) : null}
    </div>
  );
}