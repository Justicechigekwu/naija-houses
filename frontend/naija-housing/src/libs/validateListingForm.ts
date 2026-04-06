type FormValue = string | number | boolean | string[] | null | undefined;

type FormDataShape = Record<string, FormValue>;
type AttributesShape = Record<string, FormValue>;

export function validateListingForm(
  formData: FormDataShape,
  attributes: AttributesShape
) {
  const nextErrors: Record<string, string> = {};

  const requiredBaseFields = [
    { key: "title", label: "Title" },
    { key: "listingType", label: "Listing Type" },
    { key: "price", label: "Price" },
    { key: "state", label: "State" },
    { key: "description", label: "Description" },
    { key: "postedBy", label: "Posted By" },
    { key: "category", label: "Category" },
    { key: "subcategory", label: "Subcategory" },
  ];

  const isEmpty = (value: FormValue) => {
    if (value == null) return true;
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === "string") return value.trim() === "";
    return false;
  };

  requiredBaseFields.forEach(({ key, label }) => {
    const value = formData[key];
    if (isEmpty(value)) {
      nextErrors[key] = `${label} is required`;
    }
  });

  const requiredDynamicFieldsBySubcategory: Record<
    string,
    { key: string; label: string }[]
  > = {
    HOUSE: [
      { key: "bedrooms", label: "Bedrooms" },
      { key: "bathrooms", label: "Bathrooms" },
      { key: "toilets", label: "Toilets" },
    ],

    APARTMENT: [
      { key: "bedrooms", label: "Bedrooms" },
      { key: "bathrooms", label: "Bathrooms" },
      { key: "toilets", label: "Toilets" },
    ],

    FLAT: [
      { key: "bedrooms", label: "Bedrooms" },
      { key: "bathrooms", label: "Bathrooms" },
      { key: "toilets", label: "Toilets" },
    ],

    MINI_FLAT: [
      { key: "bedrooms", label: "Bedrooms" },
      { key: "bathrooms", label: "Bathrooms" },
      { key: "toilets", label: "Toilets" },
    ],

    SELF_CONTAIN: [
      { key: "bathrooms", label: "Bathrooms" },
      { key: "toilets", label: "Toilets" },
    ],

    STUDIO_APARTMENT: [
      { key: "bathrooms", label: "Bathrooms" },
      { key: "toilets", label: "Toilets" },
    ],

    DUPLEX: [
      { key: "bedrooms", label: "Bedrooms" },
      { key: "bathrooms", label: "Bathrooms" },
      { key: "toilets", label: "Toilets" },
    ],

    BUNGALOW: [
      { key: "bedrooms", label: "Bedrooms" },
      { key: "bathrooms", label: "Bathrooms" },
      { key: "toilets", label: "Toilets" },
    ],

    TERRACE: [
      { key: "bedrooms", label: "Bedrooms" },
      { key: "bathrooms", label: "Bathrooms" },
      { key: "toilets", label: "Toilets" },
    ],

    SEMI_DETACHED: [
      { key: "bedrooms", label: "Bedrooms" },
      { key: "bathrooms", label: "Bathrooms" },
      { key: "toilets", label: "Toilets" },
    ],

    DETACHED_HOUSE: [
      { key: "bedrooms", label: "Bedrooms" },
      { key: "bathrooms", label: "Bathrooms" },
      { key: "toilets", label: "Toilets" },
    ],

    MANSION: [
      { key: "bedrooms", label: "Bedrooms" },
      { key: "bathrooms", label: "Bathrooms" },
      { key: "toilets", label: "Toilets" },
    ],

    PENTHOUSE: [
      { key: "bedrooms", label: "Bedrooms" },
      { key: "bathrooms", label: "Bathrooms" },
      { key: "toilets", label: "Toilets" },
    ],

    TOWNHOUSE: [
      { key: "bedrooms", label: "Bedrooms" },
      { key: "bathrooms", label: "Bathrooms" },
      { key: "toilets", label: "Toilets" },
    ],

    VILLA: [
      { key: "bedrooms", label: "Bedrooms" },
      { key: "bathrooms", label: "Bathrooms" },
      { key: "toilets", label: "Toilets" },
    ],

    COTTAGE: [
      { key: "bedrooms", label: "Bedrooms" },
      { key: "bathrooms", label: "Bathrooms" },
      { key: "toilets", label: "Toilets" },
    ],

    FARM_HOUSE: [
      { key: "bedrooms", label: "Bedrooms" },
      { key: "bathrooms", label: "Bathrooms" },
      { key: "toilets", label: "Toilets" },
      { key: "farmSize", label: "Farm Size" },
      { key: "unit", label: "Unit" },
    ],

    OFFICE_SPACE: [
      { key: "officeType", label: "Office Type" },
      { key: "numberOfRooms", label: "Number of Rooms" },
      { key: "restrooms", label: "Restrooms" },
    ],

    SHOP: [
      { key: "shopType", label: "Shop Type" },
      { key: "size", label: "Shop Size (sqm)" },
    ],

    WAREHOUSE: [
      { key: "warehouseType", label: "Warehouse Type" },
      { key: "size", label: "Warehouse Size (sqm)" },
    ],

    FACTORY: [
      { key: "factoryType", label: "Factory Type" },
      { key: "size", label: "Factory Size (sqm)" },
    ],

    SCHOOL_BUILDING: [
      { key: "schoolType", label: "School Type" },
      { key: "classRooms", label: "Class Rooms" },
    ],

    HOSPITAL_BUILDING: [
      { key: "hospitalType", label: "Hospital Type" },
      { key: "wards", label: "Wards" },
    ],

    HOTEL: [
      { key: "numberOfRooms", label: "Number of Rooms" },
    ],

    GUEST_HOUSE: [
      { key: "numberOfRooms", label: "Number of Rooms" },
    ],

    EVENT_CENTER: [
      { key: "hallCapacity", label: "Hall Capacity" },
      { key: "numberOfHalls", label: "Number of Halls" },
    ],

    COMMERCIAL_BUILDING: [
      { key: "commercialType", label: "Commercial Type" },
      { key: "numberOfUnits", label: "Number of Units" },
    ],

    RESIDENTIAL_PLOT: [
      { key: "landSize", label: "Land Size" },
      { key: "unit", label: "Unit" },
      { key: "titleDocument", label: "Title Document" },
    ],

    COMMERCIAL_PLOT: [
      { key: "landSize", label: "Land Size" },
      { key: "unit", label: "Unit" },
      { key: "titleDocument", label: "Title Document" },
    ],

    INDUSTRIAL_LAND: [
      { key: "landSize", label: "Land Size" },
      { key: "unit", label: "Unit" },
      { key: "titleDocument", label: "Title Document" },
    ],

    AGRICULTURAL_LAND: [
      { key: "landSize", label: "Land Size" },
      { key: "unit", label: "Unit" },
      { key: "soilType", label: "Soil Type" },
    ],

    MIXED_USE_LAND: [
      { key: "landSize", label: "Land Size" },
      { key: "unit", label: "Unit" },
      { key: "titleDocument", label: "Title Document" },
    ],

    CARS: [
      { key: "make", label: "Make" },
      { key: "model", label: "Model" },
      { key: "year", label: "Year" },
      { key: "condition", label: "Condition" },
      { key: "fuelType", label: "Fuel Type" },
      { key: "transmission", label: "Transmission" },
    ],

    TRUCKS_TRAILERS: [
      { key: "make", label: "Make" },
      { key: "model", label: "Model" },
      { key: "year", label: "Year" },
      { key: "condition", label: "Condition" },
      { key: "fuelType", label: "Fuel Type" },
      { key: "transmission", label: "Transmission" },
    ],

    BOATS: [
      { key: "boatType", label: "Boat Type" },
      { key: "brand", label: "Brand" },
      { key: "model", label: "Model" },
      { key: "year", label: "Year" },
      { key: "condition", label: "Condition" },
    ],

    MOTORCYCLES: [
      { key: "make", label: "Make" },
      { key: "model", label: "Model" },
      { key: "year", label: "Year" },
      { key: "condition", label: "Condition" },
    ],

    BICYCLES: [
      { key: "brand", label: "Brand" },
      { key: "model", label: "Model" },
      { key: "bicycleType", label: "Type" },
      { key: "condition", label: "Condition" },
    ],

    TRAILERS: [
      { key: "trailerType", label: "Trailer Type" },
      { key: "make", label: "Make" },
      { key: "model", label: "Model" },
      { key: "year", label: "Year" },
      { key: "condition", label: "Condition" },
    ],

    CAR_PARTS_ACCESSORIES: [
      { key: "partType", label: "Part Type" },
      { key: "brand", label: "Brand" },
      { key: "condition", label: "Condition" },
    ],

    TELEVISIONS: [
      { key: "brand", label: "Brand" },
      { key: "model", label: "Model" },
      { key: "condition", label: "Condition" },
      { key: "screenSize", label: "Screen Size" },
    ],

    LAPTOPS_COMPUTERS: [
      { key: "brand", label: "Brand" },
      { key: "model", label: "Model" },
      { key: "condition", label: "Condition" },
      { key: "processor", label: "Processor" },
      { key: "ram", label: "RAM" },
      { key: "storage", label: "Storage" },
    ],

    HEADPHONES: [
      { key: "brand", label: "Brand" },
      { key: "model", label: "Model" },
      { key: "type", label: "Type" },
      { key: "condition", label: "Condition" },
    ],

    GAMING_CONSOLES: [
      { key: "brand", label: "Brand" },
      { key: "model", label: "Model" },
      { key: "condition", label: "Condition" },
      { key: "consoleType", label: "Console Type" },
    ],

    AUDIO_MUSIC_EQUIPMENT: [
      { key: "deviceType", label: "Device Type" },
      { key: "brand", label: "Brand" },
      { key: "model", label: "Model" },
      { key: "condition", label: "Condition" },
    ],

    CAMERAS_PHOTOGRAPHY: [
      { key: "cameraType", label: "Camera Type" },
      { key: "brand", label: "Brand" },
      { key: "model", label: "Model" },
      { key: "condition", label: "Condition" },
    ],

    TV_EQUIPMENT: [
      { key: "deviceType", label: "Device Type" },
      { key: "brand", label: "Brand" },
      { key: "model", label: "Model" },
      { key: "condition", label: "Condition" },
    ],

    NETWORKING_EQUIPMENT: [
      { key: "deviceType", label: "Device Type" },
      { key: "brand", label: "Brand" },
      { key: "model", label: "Model" },
      { key: "condition", label: "Condition" },
    ],

    COMPUTER_MONITORS: [
      { key: "brand", label: "Brand" },
      { key: "model", label: "Model" },
      { key: "screenSize", label: "Screen Size" },
      { key: "resolution", label: "Resolution" },
      { key: "condition", label: "Condition" },
    ],

    COMPUTER_ACCESSORIES: [
      { key: "accessoryType", label: "Accessory Type" },
      { key: "brand", label: "Brand" },
      { key: "model", label: "Model" },
      { key: "condition", label: "Condition" },
    ],

    CCTV_SECURITY_CAMERAS: [
      { key: "cameraType", label: "Camera Type" },
      { key: "brand", label: "Brand" },
      { key: "model", label: "Model" },
      { key: "resolution", label: "Resolution" },
      { key: "condition", label: "Condition" },
    ],

    ELECTRONICS_OTHER: [
      { key: "deviceType", label: "Device Type" },
      { key: "condition", label: "Condition" },
    ],

    SMART_PHONES: [
      { key: "brand", label: "Brand" },
      { key: "model", label: "Model" },
      { key: "condition", label: "Condition" },
      { key: "ram", label: "RAM" },
      { key: "storage", label: "Storage" },
    ],

    TABLETS: [
      { key: "tabletType", label: "Tablet Type" },
      { key: "brand", label: "Brand" },
      { key: "model", label: "Model" },
      { key: "condition", label: "Condition" },
      { key: "operatingSystem", label: "Operating System" },
    ],

    MOBILE_ACCESSORIES: [
      { key: "accessoryType", label: "Accessory Type" },
      { key: "brand", label: "Brand" },
      { key: "condition", label: "Condition" },
    ],

    SMART_WATCHES: [
      { key: "brand", label: "Brand" },
      { key: "model", label: "Model" },
      { key: "condition", label: "Condition" },
      { key: "displayType", label: "Display Type" },
    ],

    FURNITURE: [
      { key: "furnitureType", label: "Furniture Type" },
      { key: "material", label: "Material" },
      { key: "condition", label: "Condition" },
    ],

    HOME_APPLIANCES: [
      { key: "applianceType", label: "Appliance Type" },
      { key: "brand", label: "Brand" },
      { key: "condition", label: "Condition" },
    ],

    BABY_CLOTHING: [
      { key: "gender", label: "Gender" },
      { key: "clothingType", label: "Clothing Type" },
      { key: "size", label: "Size" },
      { key: "brand", label: "Brand" },
      { key: "condition", label: "Condition" },
    ],

    BABY_GEAR: [
      { key: "gearType", label: "Gear Type" },
      { key: "brand", label: "Brand" },
      { key: "condition", label: "Condition" },
    ],

    BABY_FEEDING: [
      { key: "productType", label: "Product Type" },
      { key: "brand", label: "Brand" },
      { key: "condition", label: "Condition" },
    ],

    GYM_EQUIPMENT: [
      { key: "equipmentType", label: "Equipment Type" },
      { key: "brand", label: "Brand" },
      { key: "condition", label: "Condition" },
    ],

    SPORTS_EQUIPMENT: [
      { key: "sportType", label: "Sport Type" },
      { key: "brand", label: "Brand" },
      { key: "condition", label: "Condition" },
    ],

    FITNESS_ACCESSORIES: [
      { key: "accessoryType", label: "Accessory Type" },
      { key: "brand", label: "Brand" },
      { key: "condition", label: "Condition" },
    ],

    FARM_MACHINERY: [
      { key: "machineType", label: "Machine Type" },
      { key: "brand", label: "Brand" },
      { key: "condition", label: "Condition" },
    ],

    FARM_TOOLS: [
      { key: "toolType", label: "Tool Type" },
      { key: "brand", label: "Brand" },
      { key: "condition", label: "Condition" },
    ],

    FARM_PRODUCE: [
      { key: "produceType", label: "Produce Type" },
      { key: "quantity", label: "Quantity" },
      { key: "unit", label: "Unit" },
    ],

    CEREALS_GRAINS: [
      { key: "productType", label: "Product Type" },
      { key: "brand", label: "Brand" },
      { key: "packageSize", label: "Package Size" },
      { key: "expiryDate", label: "Expiry Date" },
    ],

    PACKAGED_FOODS: [
      { key: "foodType", label: "Food Type" },
      { key: "brand", label: "Brand" },
      { key: "packageSize", label: "Package Size" },
      { key: "expiryDate", label: "Expiry Date" },
    ],

    DOGS: [
      { key: "breed", label: "Breed" },
      { key: "age", label: "Age" },
      { key: "gender", label: "Gender" },
    ],

    CATS: [
      { key: "breed", label: "Breed" },
      { key: "age", label: "Age" },
      { key: "gender", label: "Gender" },
    ],

    PET_ACCESSORIES: [
      { key: "accessoryType", label: "Accessory Type" },
      { key: "brand", label: "Brand" },
    ],

    KIDS_TOYS: [
      { key: "toyType", label: "Toy Type" },
      { key: "ageGroup", label: "Age Group" },
      { key: "brand", label: "Brand" },
      { key: "condition", label: "Condition" },
    ],

    BOARD_GAMES: [
      { key: "gameType", label: "Game Type" },
      { key: "players", label: "Number of Players" },
      { key: "condition", label: "Condition" },
    ],

    WATCHES: [
      { key: "brand", label: "Brand" },
      { key: "condition", label: "Condition" },
      { key: "displayType", label: "Display Type" },
    ],

    CLOTHING: [
      { key: "gender", label: "Gender" },
      { key: "clothingType", label: "Clothing Type" },
      { key: "brand", label: "Brand" },
      { key: "size", label: "Size" },
      { key: "condition", label: "Condition" },
    ],

    FOOTWEAR: [
      { key: "gender", label: "Gender" },
      { key: "footwearType", label: "Footwear Type" },
      { key: "brand", label: "Brand" },
      { key: "size", label: "Size" },
      { key: "condition", label: "Condition" },
    ],

    BAGS: [
      { key: "bagType", label: "Bag Type" },
      { key: "gender", label: "Gender" },
      { key: "brand", label: "Brand" },
      { key: "material", label: "Material" },
      { key: "condition", label: "Condition" },
    ],

    JEWELRY: [
      { key: "jewelryType", label: "Jewelry Type" },
      { key: "gender", label: "Gender" },
      { key: "material", label: "Material" },
      { key: "condition", label: "Condition" },
    ],

    HATS_CAPS: [
      { key: "hatType", label: "Type" },
      { key: "gender", label: "Gender" },
      { key: "brand", label: "Brand" },
      { key: "condition", label: "Condition" },
    ],

    SUNGLASSES: [
      { key: "frameType", label: "Frame Type" },
      { key: "lensType", label: "Lens Type" },
      { key: "brand", label: "Brand" },
      { key: "condition", label: "Condition" },
    ],

    BELTS: [
      { key: "material", label: "Material" },
      { key: "brand", label: "Brand" },
      { key: "condition", label: "Condition" },
    ],

    WALLETS: [
      { key: "material", label: "Material" },
      { key: "brand", label: "Brand" },
      { key: "condition", label: "Condition" },
    ],
  };

  const selectedSubcategory = String(formData.subcategory || "");
  const requiredDynamicFields =
    requiredDynamicFieldsBySubcategory[selectedSubcategory] || [];

  requiredDynamicFields.forEach(({ key, label }) => {
    const value = attributes[key];
    if (isEmpty(value)) {
      nextErrors[key] = `${label} is required`;
    }
  });

  return nextErrors;
}