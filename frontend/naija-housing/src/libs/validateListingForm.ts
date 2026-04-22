import { CATEGORY_TREE } from "@/libs/listingFormConfig";
import {
  categoryUsesListingType,
  categoryUsesPostedBy,
} from "@/libs/listingFieldRules";

type FormValue = string | number | boolean | string[] | null | undefined;

type FormDataShape = Record<string, FormValue>;
type AttributesShape = Record<string, FormValue>;
type ValidationErrors = Record<string, string>;

type CategoryField = {
  key: string;
  label: string;
  type?: string;
  options?: string[];
  required?: boolean;
};

const categoryTree = CATEGORY_TREE;

const OPTIONAL_DYNAMIC_FIELD_KEYS = new Set<string>([
  "description",
  "color",
  "trim",
  "interiorColor",
  "vinChassisNumber",
  "exchangePossible",
  "numberOfOwners",
  "warranty",
  "boxIncluded",
  "hdmiIncluded",
  "powerCableIncluded",
  "gamesIncluded",
  "numberOfGames",
  "controllersIncluded",
  "onlineCapable",
  "batteryLife",
  "graphicsCard",
  "compatibleWith",
  "referencesAvailable",
  "salaryExpectation",
  "serviceArea",
  "availability",
  "experienceLevel",
  "experienceYears",
  "spf"
]);

const ALWAYS_REQUIRED_DYNAMIC_FIELD_KEYS = new Set<string>([
  "breed",
  "age",
  "gender",
  "jobRole",
  "employmentType",
  "serviceType",
  "pricingType",
  "condition",
  "brand",
  "model",
  "year",
  "landSize",
  "unit",
  "titleDocument",
]);

function normalizeString(value: FormValue): string {
  return typeof value === "string" ? value.trim() : "";
}

function isEmpty(value: FormValue): boolean {
  if (value == null) return true;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "string") return value.trim() === "";
  return false;
}

function isValidNumber(value: FormValue): boolean {
  if (typeof value === "number") return Number.isFinite(value);
  if (typeof value === "string" && value.trim() !== "") {
    const normalized =
      typeof value === "string"
        ? value.replace(/[^\d]/g, "").trim()
        : value;
    
    return Number.isFinite(Number(normalized));
  }
  return false;
}

function shouldRequireDynamicField(field: CategoryField): boolean {
  if (field.required === true) return true;
  if (OPTIONAL_DYNAMIC_FIELD_KEYS.has(field.key)) return false;
  if (ALWAYS_REQUIRED_DYNAMIC_FIELD_KEYS.has(field.key)) return true;

  if (
    field.type === "select" ||
    field.type === "number" ||
    field.type === "date"
  ) {
    return true;
  }

  return false;
}

function getSubcategoryFields(
  categoryKey: string,
  subcategoryKey: string
): CategoryField[] {
  const categoryNode = categoryTree[categoryKey as keyof typeof categoryTree];
  if (!categoryNode?.subcategories) return [];

  const rawSubcategoryNode = categoryNode.subcategories[
    subcategoryKey as keyof typeof categoryNode.subcategories
  ] as {
    fields?: Array<{
      key: string;
      label: string;
      type?: string;
      options?: readonly string[];
      required?: boolean;
    }>;
  } | undefined;

  if (!rawSubcategoryNode?.fields) return [];

  return rawSubcategoryNode.fields.map((field) => ({
    key: field.key,
    label: field.label,
    type: field.type,
    options: field.options ? [...field.options] : undefined,
    required: field.required,
  }));
}

function getRequiredDynamicFields(
  categoryKey: string,
  subcategoryKey: string
): CategoryField[] {
  return getSubcategoryFields(categoryKey, subcategoryKey).filter(
    shouldRequireDynamicField
  );
}

function addError(
  errors: ValidationErrors,
  key: string,
  message: string
) {
  if (!errors[key]) {
    errors[key] = message;
  }
}

export function validateListingForm(
  formData: FormDataShape,
  attributes: AttributesShape
): ValidationErrors {
  const nextErrors: ValidationErrors = {};

  const categoryKey = normalizeString(formData.category);
  const subcategoryKey = normalizeString(formData.subcategory);
  
  const requiredBaseFields = [
    { key: "title", label: "Title" },
    { key: "price", label: "Price" },
    { key: "state", label: "State" },
    { key: "city", label: "City" },
    { key: "description", label: "Description" },
    { key: "category", label: "Category" },
    { key: "subcategory", label: "Subcategory" },
  ];
  
  if (categoryUsesListingType(categoryKey)) {
    requiredBaseFields.push({ key: "listingType", label: "Listing Type" });
  }
  
  if (categoryUsesPostedBy(categoryKey)) {
    requiredBaseFields.push({ key: "postedBy", label: "Posted By" });
  }

  for (const { key, label } of requiredBaseFields) {
    const value = formData[key];
    if (isEmpty(value)) {
      addError(nextErrors, key, `${label} is required`);
    }
  }

  if (!categoryUsesListingType(categoryKey)) {
    delete nextErrors.listingType;
  }
  
  if (!categoryUsesPostedBy(categoryKey)) {
    delete nextErrors.postedBy;
  }

  if (categoryKey && !(categoryKey in categoryTree)) {
    addError(nextErrors, "category", "Selected category is invalid");
    return nextErrors;
  }

  if (categoryKey && subcategoryKey) {
    const categoryNode =
      categoryTree[categoryKey as keyof typeof categoryTree];

    if (
      !categoryNode?.subcategories ||
      !(subcategoryKey in categoryNode.subcategories)
    ) {
      addError(nextErrors, "subcategory", "Selected subcategory is invalid");
      return nextErrors;
    }
  }

  if (!isEmpty(formData.price) && !isValidNumber(formData.price)) {
    addError(nextErrors, "price", "Price must be a valid number");
  }

  const requiredDynamicFields = getRequiredDynamicFields(
    categoryKey,
    subcategoryKey
  );

  for (const field of requiredDynamicFields) {
    const value = attributes[field.key];

    if (isEmpty(value)) {
      addError(nextErrors, `attributes.${field.key}`, `${field.label} is required`);
      continue;
    }

    if (field.type === "number" && !isValidNumber(value)) {
          addError(
      nextErrors,
      `attributes.${field.key}`,
      `${field.label} must be a valid number`
    );
      continue;
    }

    if (
      field.type === "select" &&
      Array.isArray(field.options) &&
      field.options.length > 0 &&
      typeof value === "string" &&
      !field.options.includes(value)
    ) {
      addError(
        nextErrors,
        `attributes.${field.key}`,
        `Please select a valid ${field.label.toLowerCase()}`
      );
    }
  }

  return nextErrors;
}