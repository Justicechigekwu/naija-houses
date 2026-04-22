"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, MapPin, Search, X } from "lucide-react";
import { NIGERIA_STATES, getCitiesByState } from "@/libs/nigeriaLocations";

type Props = {
  selectedState: string;
  selectedCity: string;
  onApply: (payload: { state: string; city: string }) => void;
  onClear: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

type GlobalLocationItem =
  | {
      type: "state";
      state: string;
      label: string;
    }
  | {
      type: "city";
      state: string;
      city: string;
      label: string;
    };

export default function LocationFilter({
  selectedState,
  selectedCity,
  onApply,
  onClear,
  open: controlledOpen,
  onOpenChange,
}: Props) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [tempState, setTempState] = useState(selectedState || "");
  const [tempCity, setTempCity] = useState(selectedCity || "");
  const [view, setView] = useState<"states" | "cities">(
    selectedState ? "cities" : "states"
  );

  const isControlled = typeof controlledOpen === "boolean";
  const open = isControlled ? controlledOpen : internalOpen;

  const setOpen = (value: boolean) => {
    if (!isControlled) {
      setInternalOpen(value);
    }
    onOpenChange?.(value);
  };

  useEffect(() => {
    if (open) {
      setTempState(selectedState || "");
      setTempCity(selectedCity || "");
      setSearch("");
      setView(selectedState ? "cities" : "states");
    }
  }, [open, selectedState, selectedCity]);

  const globalLocations = useMemo<GlobalLocationItem[]>(() => {
    const items: GlobalLocationItem[] = [];

    for (const state of NIGERIA_STATES) {
      items.push({
        type: "state",
        state,
        label: state,
      });

      const cities = getCitiesByState(state);

      for (const city of cities) {
        items.push({
          type: "city",
          state,
          city,
          label: `${city}, ${state}`,
        });
      }
    }

    return items;
  }, []);

  const filteredStates = useMemo(() => {
    if (!search.trim()) return NIGERIA_STATES;

    return NIGERIA_STATES.filter((state) =>
      state.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const filteredCities = useMemo(() => {
    if (!tempState) return [];

    const cities = getCitiesByState(tempState);

    if (!search.trim()) return cities;

    return cities.filter((city) =>
      city.toLowerCase().includes(search.toLowerCase())
    );
  }, [tempState, search]);

  const globalSearchResults = useMemo(() => {
    if (!search.trim()) return [];

    const value = search.trim().toLowerCase();

    return globalLocations.filter((item) =>
      item.label.toLowerCase().includes(value)
    );
  }, [search, globalLocations]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleApply = () => {
    onApply({
      state: tempState,
      city: tempCity,
    });
    setOpen(false);
  };

  const handleClear = () => {
    setTempState("");
    setTempCity("");
    setSearch("");
    setView("states");
    onClear();
    setOpen(false);
  };

  const handleSelectState = (state: string) => {
    setTempState(state);
    setTempCity("");
    setSearch("");
    setView("cities");
  };

  const handleSelectGlobalResult = (item: GlobalLocationItem) => {
    if (item.type === "state") {
      setTempState(item.state);
      setTempCity("");
      setSearch("");
      setView("cities");
      return;
    }

    setTempState(item.state);
    setTempCity(item.city);
    setSearch("");
    onApply({
      state: item.state,
      city: item.city,
    });
    setOpen(false);
  };

  const handleBackToStates = () => {
    setSearch("");
    setView("states");
  };

  return (
    <div className="relative">
      <button
        onClick={handleOpen}
        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-gray-50"
      >
        <MapPin className="h-4 w-4" />
        {selectedState
          ? selectedCity
            ? `${selectedCity}, ${selectedState}`
            : selectedState
          : "Filter by location"}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 px-4 py-6 sm:py-10">
          <div className="mx-auto flex h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b px-5 py-4 shrink-0">
              <h2 className="text-lg font-semibold">Choose location</h2>
              <button onClick={() => setOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="border-b p-5 shrink-0">
              <div className="flex items-center gap-2 rounded-lg border px-3 py-3">
                <Search className="h-4 w-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search state, city or district..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full outline-none text-sm"
                />
              </div>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto">
              {search.trim() ? (
                <div>
                  <div className="sticky top-0 z-10 border-b bg-gray-50 px-4 py-3 text-sm font-semibold">
                    Search results
                  </div>

                  <div className="divide-y">
                    {globalSearchResults.length > 0 ? (
                      globalSearchResults.map((item) => (
                        <button
                          key={
                            item.type === "state"
                              ? `state-${item.state}`
                              : `city-${item.state}-${item.city}`
                          }
                          onClick={() => handleSelectGlobalResult(item)}
                          className="w-full px-4 py-3 text-left hover:bg-gray-50"
                        >
                          <div className="font-medium">{item.label}</div>
                          <div className="text-xs text-gray-500">
                            {item.type === "state" ? "State" : "City / LGA / District"}
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-6 text-sm text-gray-500">
                        No location found for &quot;{search}&quot;
                      </div>
                    )}
                  </div>
                </div>
              ) : view === "states" ? (
                <div>
                  <div className="sticky top-0 z-10 border-b bg-gray-50 px-4 py-3 text-sm font-semibold">
                    States
                  </div>

                  <div className="divide-y">
                    {filteredStates.map((state) => (
                      <button
                        key={state}
                        onClick={() => handleSelectState(state)}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50"
                      >
                        {state}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <div className="sticky top-0 z-10 flex items-center gap-2 border-b bg-gray-50 px-4 py-3">
                    <button
                      onClick={handleBackToStates}
                      className="inline-flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-black"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Back
                    </button>

                    <span className="text-sm font-semibold">{tempState}</span>
                  </div>

                  <div className="divide-y">
                    <button
                      onClick={() => setTempCity("")}
                      className={`w-full px-4 py-3 text-left hover:bg-gray-50 ${
                        tempCity === "" ? "bg-green-50 font-medium" : ""
                      }`}
                    >
                      All of {tempState}
                    </button>

                    {filteredCities.map((city) => (
                      <button
                        key={city}
                        onClick={() => setTempCity(city)}
                        className={`w-full px-4 py-3 text-left hover:bg-gray-50 ${
                          tempCity === city ? "bg-green-50 font-medium" : ""
                        }`}
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between border-t px-5 py-4 shrink-0">
              <button
                onClick={handleClear}
                className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
              >
                My location
              </button>

              <button
                onClick={handleApply}
                disabled={!tempState}
                className="rounded-lg bg-[#8A715D] px-4 py-2 text-sm text-white hover:bg-[#7A6352] disabled:opacity-50"
              >
                Apply filter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}