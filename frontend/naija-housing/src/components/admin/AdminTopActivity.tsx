"use client";

type CategoryItem = {
  category?: string;
  subcategory?: string;
  interactions: number;
};

export default function AdminTopActivity({
  title,
  items,
  type,
}: {
  title: string;
  items: CategoryItem[];
  type: "category" | "subcategory";
}) {
  return (
    <div className="bg-white border rounded-xl p-4 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>

      <div className="space-y-3">
        {items.length === 0 && (
          <p className="text-sm text-gray-500">No data yet.</p>
        )}

        {items.map((item, index) => (
          <div
            key={`${type}-${index}`}
            className="flex items-center justify-between border rounded-lg px-3 py-2"
          >
            <span className="font-medium">
              {type === "category" ? item.category : item.subcategory}
            </span>
            <span className="text-sm text-gray-600">
              {item.interactions} interactions
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}