import { useMemo } from "react";
import { View } from "react-native";
import type { Listing } from "@/types/listing";
import ListingCard from "./ListingCard";

type Props = {
  items: Listing[];
};

function estimateCardHeight(item: Listing) {
  const titleLength = item.title?.length || 0;
  const hasCondition = !!item.attributes?.condition;
  const hasListingType = !!item.listingType;

  let height = 250;

  if (titleLength > 26) height += 20;
  if (titleLength > 52) height += 20;
  if (hasCondition) height += 14;
  if (hasListingType) height += 10;

  return height;
}

export default function MasonryListingGrid({ items }: Props) {
  const { leftColumn, rightColumn } = useMemo(() => {
    const left: Listing[] = [];
    const right: Listing[] = [];

    let leftHeight = 0;
    let rightHeight = 0;

    for (const item of items) {
      const estimatedHeight = estimateCardHeight(item);

      if (leftHeight <= rightHeight) {
        left.push(item);
        leftHeight += estimatedHeight;
      } else {
        right.push(item);
        rightHeight += estimatedHeight;
      }
    }

    return {
      leftColumn: left,
      rightColumn: right,
    };
  }, [items]);

  return (
    <View style={{ paddingHorizontal: 4 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <View style={{ width: "49.4%" }}>
          {leftColumn.map((listing) => (
            <ListingCard key={listing._id} listing={listing} />
          ))}
        </View>

        <View style={{ width: "49.4%" }}>
          {rightColumn.map((listing) => (
            <ListingCard key={listing._id} listing={listing} />
          ))}
        </View>
      </View>
    </View>
  );
}