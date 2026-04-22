import { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import { CircleAlert, ExternalLink } from "lucide-react-native";

import { CATEGORY_TREE } from "@/libs/listingFormConfig";
import { NIGERIA_STATES, getCitiesByState } from "@/libs/nigeriaLocation";
import { validateListingForm } from "@/libs/validateListingForm";
import {
  categoryUsesListingType,
  categoryUsesPostedBy,
  getListingTypeOptions,
} from "@/libs/listingHelpers";
import { useUI } from "@/hooks/useUI";
import ListingImagePicker from "@/components/listings/ListingImagePicker";
import SearchableSelectMobile from "@/components/listings/SearchableSelectMobile";
import AppInput from "@/components/ui/AppInput";
import type {
  Listing,
  ListingFormShape,
  DynamicField,
  FormValue,
  PostedBy,
} from "@/types/listing";
import type { LocalListingImage } from "@/types/listing-form";
import { useTheme } from "@/hooks/useTheme";

type Props = {
  initialData?: Listing | null;
  onSubmit: (formData: FormData) => Promise<void>;
  isEditMode?: boolean;
};

const POSTED_BY_OPTIONS: PostedBy[] = ["Owner", "Agent", "Dealer", "Seller"];

function getFirstSubcategory(category?: string) {
  const categoryNode =
    CATEGORY_TREE[
      String(category || "").toUpperCase() as keyof typeof CATEGORY_TREE
    ];

  if (!categoryNode?.subcategories) return "";

  return Object.keys(categoryNode.subcategories)[0] || "";
}

function buildEmptyForm(category = "PROPERTY"): ListingFormShape {
  return {
    title: "",
    listingType: categoryUsesListingType(category)
      ? category === "LAND"
        ? "Sale"
        : ""
      : "",
    price: "",
    city: "",
    state: "",
    description: "",
    postedBy: "",
    category,
    subcategory: getFirstSubcategory(category),
  };
}

export default function ListingForm({
  initialData = null,
  onSubmit,
  isEditMode = false,
}: Props) {
  const router = useRouter();
  const { showToast, showConfirm } = useUI();
  const { colors, resolvedTheme } = useTheme();

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const initialCategory = initialData?.category || "PROPERTY";
  const initialSubcategory =
    initialData?.subcategory || getFirstSubcategory(initialCategory);

  const [form, setForm] = useState<ListingFormShape>({
    ...buildEmptyForm(initialCategory),
    category: initialCategory,
    subcategory: initialSubcategory,
    title: initialData?.title || "",
    listingType: initialData?.listingType || "",
    price:
      initialData?.price !== undefined && initialData?.price !== null
        ? String(initialData.price)
        : "",
    city: initialData?.city || "",
    state: initialData?.state || "",
    description: initialData?.description || "",
    postedBy: initialData?.postedBy || "",
  });

  const [attributes, setAttributes] = useState<Record<string, FormValue>>(
    initialData?.attributes || {}
  );

  const [images, setImages] = useState<LocalListingImage[]>([]);

  useEffect(() => {
    if (!initialData) return;

    const nextCategory = initialData.category || "PROPERTY";
    const nextSubcategory =
      initialData.subcategory || getFirstSubcategory(nextCategory);

    setForm({
      ...buildEmptyForm(nextCategory),
      category: nextCategory,
      subcategory: nextSubcategory,
      title: initialData.title || "",
      listingType: initialData.listingType || "",
      price:
        initialData.price !== undefined && initialData.price !== null
          ? String(initialData.price)
          : "",
      city: initialData.city || "",
      state: initialData.state || "",
      description: initialData.description || "",
      postedBy: initialData.postedBy || "",
    });

    setAttributes(initialData.attributes || {});
  }, [initialData]);

  useEffect(() => {
    if (!initialData?.images?.length) return;

    const mapped = initialData.images.map((img, index) => ({
      id: `${img.public_id || img.url}-${index}`,
      uri: img.url,
      public_id: img.public_id,
      name: `image-${index}.jpg`,
      type: "image/jpeg",
      isRemote: true,
    }));

    setImages(mapped);
  }, [initialData?.images]);

  const categoryOptions = useMemo(() => {
    return Object.entries(CATEGORY_TREE).map(([key, value]) => ({
      value: key,
      label: value.label,
    }));
  }, []);

  const categoryConfig = useMemo(() => {
    return CATEGORY_TREE[form.category as keyof typeof CATEGORY_TREE];
  }, [form.category]);

  const subcategoryOptions = useMemo(() => {
    if (!categoryConfig?.subcategories) return [];

    return Object.entries(categoryConfig.subcategories).map(([key, value]) => ({
      value: key,
      label: value.label,
    }));
  }, [categoryConfig]);

  const dynamicFields = useMemo<DynamicField[]>(() => {
    if (!categoryConfig?.subcategories) return [];

    const sub = categoryConfig.subcategories[
      form.subcategory as keyof typeof categoryConfig.subcategories
    ] as { fields: DynamicField[] } | undefined;

    return sub?.fields ?? [];
  }, [categoryConfig, form.subcategory]);

  const showListingType = useMemo(
    () => categoryUsesListingType(form.category),
    [form.category]
  );

  const showPostedBy = useMemo(
    () => categoryUsesPostedBy(form.category),
    [form.category]
  );

  const listingTypeOptions = useMemo(() => {
    return getListingTypeOptions(form.category).map((item) => ({
      value: item,
      label: item,
    }));
  }, [form.category]);

  const postedByOptions = useMemo(() => {
    return POSTED_BY_OPTIONS.map((item) => ({
      value: item,
      label: item,
    }));
  }, []);

  const stateOptions = useMemo(() => {
    return NIGERIA_STATES.map((item) => ({
      value: item,
      label: item,
    }));
  }, []);

  const cityOptions = useMemo(() => {
    return getCitiesByState(form.state).map((item) => ({
      value: item,
      label: item,
    }));
  }, [form.state]);

  const canGoNext =
    !!form.category &&
    !!form.subcategory &&
    (!showListingType || !!form.listingType) &&
    (!showPostedBy || !!form.postedBy);

  const clearError = (key: string) => {
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const clearAllAttributeErrors = () => {
    setErrors((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((key) => {
        if (key.startsWith("attributes.")) {
          delete next[key];
        }
      });
      return next;
    });
  };

  function formatPriceInput(value: string) {
    const match = value.match(/^([\d\s,\.]*)(.*)$/);
    if (!match) return value;

    const rawNum = match[1].replace(/[^\d]/g, "");
    const tail = match[2] ?? "";
    const formattedNum = rawNum ? Number(rawNum).toLocaleString() : "";
    const trimmedTail = tail.replace(/^\s+/, "");

    return trimmedTail ? `${formattedNum} ${trimmedTail}`.trim() : formattedNum;
  }

  const handleClearForm = () => {
    if (submitting) return;

    showConfirm(
      {
        title: "Clear form?",
        message: "This will remove everything you have entered.",
        confirmText: "Clear form",
        cancelText: "Cancel",
        confirmVariant: "danger",
      },
      () => {
        const resetCategory = "PROPERTY";

        setForm(buildEmptyForm(resetCategory));
        setAttributes({});
        setImages([]);
        setErrors({});
        setStep(1);
        showToast("Form cleared", "success");
      }
    );
  };

  const buildFormData = () => {
    const formData = new FormData();

    formData.append("title", form.title);
    formData.append("price", form.price.replace(/[^\d]/g, ""));
    formData.append("city", form.city);
    formData.append("state", form.state);
    formData.append("description", form.description);
    formData.append("category", form.category);
    formData.append("subcategory", form.subcategory);

    if (showListingType && form.listingType) {
      formData.append("listingType", form.listingType);
    }

    if (showPostedBy && form.postedBy) {
      formData.append("postedBy", form.postedBy);
    }

    formData.append("attributes", JSON.stringify(attributes));

    images
      .filter((img) => img.isRemote)
      .forEach((img) => {
        formData.append(
          "keepImages",
          JSON.stringify({
            url: img.uri,
            public_id: img.public_id,
          })
        );
      });

    formData.append(
      "imageOrder",
      JSON.stringify(
        images.map((img) => ({
          public_id: img.public_id,
          name: img.name,
          isRemote: img.isRemote,
        }))
      )
    );

    images
      .filter((img) => !img.isRemote)
      .forEach((img, index) => {
        formData.append("images", {
          uri: img.uri,
          name: img.name || `image-${index}.jpg`,
          type: img.type || "image/jpeg",
        } as any);
      });

    return formData;
  };

  const handleSubmit = async () => {
    const nextErrors = validateListingForm(form, attributes);

    if (!images.length) {
      nextErrors.images = "At least one image is required";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      showToast("Please fix the highlighted fields", "error");
      return;
    }

    try {
      setSubmitting(true);
      await onSubmit(buildFormData());
    } catch {
      //
    } finally {
      setSubmitting(false);
    }
  };

  const renderDynamicField = (field: DynamicField) => {
    const value =
      attributes[field.key] !== undefined && attributes[field.key] !== null
        ? String(attributes[field.key])
        : "";

    const errorKey = `attributes.${field.key}`;
    const error = errors[errorKey];

    if (field.type === "select") {
      return (
        <SearchableSelectMobile
          key={field.key}
          value={value}
          onChange={(next) => {
            clearError(errorKey);
            setAttributes((prev) => ({
              ...prev,
              [field.key]: next,
            }));
          }}
          options={(field.options || []).map((item) => ({
            value: item,
            label: item,
          }))}
          placeholder={`Select ${field.label}`}
          label={field.label}
          error={!!error}
        />
      );
    }

    if (field.type === "textarea") {
      return (
        <View key={field.key} className="mb-4">
          <Text
            className="mb-2 text-[14px] font-medium"
            style={{ color: colors.text }}
          >
            {field.label}
          </Text>

          <View
            className="min-h-[120px] rounded-xl border px-4 py-4"
            style={{
              borderColor: error ? colors.danger : colors.border,
              backgroundColor: colors.surface,
            }}
          >
            <TextInput
              value={value}
              onChangeText={(text) => {
                clearError(errorKey);
                setAttributes((prev) => ({
                  ...prev,
                  [field.key]: text,
                }));
              }}
              placeholder={`Enter ${field.label}`}
              placeholderTextColor={colors.muted}
              multiline
              textAlignVertical="top"
              className="text-[15px]"
              style={{
                color: colors.text,
                minHeight: 90,
              }}
            />
          </View>

          {error ? (
            <Text className="mt-2 text-sm" style={{ color: colors.danger }}>
              {error}
            </Text>
          ) : null}
        </View>
      );
    }

    return (
      <AppInput
        key={field.key}
        label={field.label}
        value={value}
        onChangeText={(text) => {
          clearError(errorKey);
          setAttributes((prev) => ({
            ...prev,
            [field.key]: field.type === "number" ? text : text,
          }));
        }}
        placeholder={`Enter ${field.label}`}
        keyboardType={field.type === "number" ? "numeric" : "default"}
        error={error}
      />
    );
  };

  return (
    <View
      className="flex-1 overflow-hidden rounded-3xl"
      style={{
        backgroundColor: colors.surface,
        marginTop: 6,
        marginBottom: 0,
      }}
    >
      <View
        className="border-b px-4 py-4"
        style={{ borderColor: colors.border }}
      >
        <Text
          className="text-center text-xl font-semibold"
          style={{ color: colors.text }}
        >
          {isEditMode ? "Edit Listing" : "Create Listing"}
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={{ padding: 16, paddingBottom: 28 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {step === 1 ? (
          <>
            {!isEditMode ? (
              <View className="mb-4 items-end">
                <Pressable
                  onPress={handleClearForm}
                  className="rounded-xl border px-4 py-3"
                  style={{
                    borderColor: "rgba(239,68,68,0.25)",
                    backgroundColor: colors.surface,
                  }}
                >
                  <Text
                    className="text-sm font-medium"
                    style={{ color: colors.danger }}
                  >
                    Clear form
                  </Text>
                </Pressable>
              </View>
            ) : null}

            <SearchableSelectMobile
              label="Category"
              value={form.category}
              onChange={(value) => {
                if (isEditMode) return;

                clearError("category");
                clearError("subcategory");
                clearError("listingType");
                clearError("postedBy");
                clearAllAttributeErrors();

                const firstSubcategory = getFirstSubcategory(value);

                setForm((prev) => ({
                  ...prev,
                  category: value,
                  subcategory: firstSubcategory,
                  listingType: categoryUsesListingType(value)
                    ? value === "LAND"
                      ? "Sale"
                      : ""
                    : "",
                  postedBy: categoryUsesPostedBy(value) ? prev.postedBy : "",
                }));

                setAttributes({});
              }}
              options={categoryOptions}
              placeholder="Select category"
              disabled={isEditMode}
              error={!!errors.category}
            />

            <SearchableSelectMobile
              label="Subcategory"
              value={form.subcategory}
              onChange={(value) => {
                if (isEditMode) return;

                clearError("subcategory");
                clearError("listingType");
                clearAllAttributeErrors();

                setForm((prev) => ({
                  ...prev,
                  subcategory: value,
                  listingType: categoryUsesListingType(prev.category)
                    ? prev.category === "LAND"
                      ? "Sale"
                      : prev.listingType
                    : "",
                }));

                setAttributes({});
              }}
              options={subcategoryOptions}
              placeholder="Select subcategory"
              disabled={isEditMode}
              error={!!errors.subcategory}
            />

            {showListingType ? (
              <SearchableSelectMobile
                label="Listing Type"
                value={form.listingType}
                onChange={(value) => {
                  clearError("listingType");
                  setForm((prev) => ({
                    ...prev,
                    listingType: value as any,
                  }));
                }}
                options={listingTypeOptions}
                placeholder="Select Listing Type"
                error={!!errors.listingType}
              />
            ) : null}

            {showPostedBy ? (
              <SearchableSelectMobile
                label="Posted By"
                value={form.postedBy}
                onChange={(value) => {
                  clearError("postedBy");
                  setForm((prev) => ({
                    ...prev,
                    postedBy: value as any,
                  }));
                }}
                options={postedByOptions}
                placeholder="Select"
                error={!!errors.postedBy}
              />
            ) : null}

            <Pressable
              onPress={() => setStep(2)}
              disabled={!canGoNext || submitting}
              className="mt-2 items-center rounded-xl py-4"
              style={{
                backgroundColor:
                  !canGoNext || submitting
                    ? "rgba(138,113,93,0.45)"
                    : colors.brand,
              }}
            >
              <Text className="font-semibold text-white">Continue</Text>
            </Pressable>
          </>
        ) : (
          <>
            <Pressable
              onPress={() => setStep(1)}
              className="mb-4 self-start rounded-xl border px-4 py-2"
              style={{
                borderColor: colors.border,
                backgroundColor: colors.surface,
              }}
            >
              <Text style={{ color: colors.text }}>Back</Text>
            </Pressable>

            <AppInput
              label="Title"
              value={form.title}
              onChangeText={(text) => {
                clearError("title");
                setForm((prev) => ({ ...prev, title: text }));
              }}
              placeholder="Enter title"
              error={errors.title}
            />

            <AppInput
              label="Price"
              value={form.price}
              onChangeText={(text) => {
                clearError("price");
                setForm((prev) => ({
                  ...prev,
                  price: formatPriceInput(text),
                }));
              }}
              placeholder="Enter price"
              keyboardType="numeric"
              error={errors.price}
            />

            <SearchableSelectMobile
              label="State"
              value={form.state}
              onChange={(value) => {
                clearError("state");
                clearError("city");
                setForm((prev) => ({
                  ...prev,
                  state: value,
                  city: "",
                }));
              }}
              options={stateOptions}
              placeholder="Select state"
              error={!!errors.state}
            />

            <SearchableSelectMobile
              label="City"
              value={form.city}
              onChange={(value) => {
                clearError("city");
                setForm((prev) => ({
                  ...prev,
                  city: value,
                }));
              }}
              options={cityOptions}
              placeholder={form.state ? "Select city" : "Select state first"}
              disabled={!form.state}
              error={!!errors.city}
            />

            <View className="mb-4">
              <Text
                className="mb-2 text-[14px] font-medium"
                style={{ color: colors.text }}
              >
                Description
              </Text>

              <View
                className="min-h-[120px] rounded-xl border px-4 py-4"
                style={{
                  borderColor: errors.description ? colors.danger : colors.border,
                  backgroundColor: colors.surface,
                }}
              >
                <TextInput
                  value={form.description}
                  onChangeText={(text) => {
                    clearError("description");
                    setForm((prev) => ({ ...prev, description: text }));
                  }}
                  placeholder="Describe your listing"
                  placeholderTextColor={colors.muted}
                  multiline
                  textAlignVertical="top"
                  className="text-[15px]"
                  style={{
                    color: colors.text,
                    minHeight: 90,
                  }}
                />
              </View>

              {errors.description ? (
                <Text className="mt-2 text-sm" style={{ color: colors.danger }}>
                  {errors.description}
                </Text>
              ) : null}
            </View>


            {dynamicFields.length ? (
              <View className="mb-2">
                <Text
                  className="mb-3 text-base font-semibold"
                  style={{ color: colors.text }}
                >
                  More Details
                </Text>
                {dynamicFields.map(renderDynamicField)}
              </View>
            ) : null}

            <ListingImagePicker
              images={images}
              onChange={(next) => {
                clearError("images");
                setImages(next);
              }}
              error={errors.images}
            />
            <View className="mt-6">
              <Text
                className="text-sm leading-6"
                style={{ color: colors.text }}
              >
                I agree that this listing follows Velora Marketplace rules and does not
                contain{" "}
                <Text
                  onPress={() => router.push("/help/prohibited-items" as any)}
                  style={{
                    color: colors.brand,
                    textDecorationLine: "underline",
                    fontWeight: "600",
                  }}
                >
                  prohibited items
                </Text>
                {" "}or fraudulent content. Please also review the{" "}
                <Text
                  onPress={() => router.push("/help/community-guidelines" as any)}
                  style={{
                    color: colors.brand,
                    textDecorationLine: "underline",
                    fontWeight: "600",
                  }}
                >
                  community guidelines
                </Text>
                .
              </Text>
            </View>

            <Pressable
              onPress={handleSubmit}
              disabled={submitting}
              className="mt-6 items-center rounded-xl py-4"
              style={{
                backgroundColor: submitting
                  ? "rgba(138,113,93,0.45)"
                  : colors.brand,
              }}
            >
              <Text className="font-semibold text-white">
                {submitting
                  ? isEditMode
                    ? "Updating..."
                    : "Creating..."
                  : isEditMode
                  ? "Update Listing"
                  : "Create Listing"}
              </Text>
            </Pressable>
          </>
        )}
      </ScrollView>
    </View>
  );
}