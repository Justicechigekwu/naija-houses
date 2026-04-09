export const CATEGORY_TREE = {
  PROPERTY: {
    label: "Property",
    subcategories: {
      HOUSE: {
        label: "House",
        fields: [
          { key: "bedrooms", label: "Bedrooms", type: "number" },
          { key: "bathrooms", label: "Bathrooms", type: "number" },
          { key: "toilets", label: "Toilets", type: "number" },
          { key: "parkingSpaces", label: "Parking Spaces", type: "number" },
          { key: "floors", label: "Number of Floors", type: "number" },
          { key: "furnishing", label: "Furnishing", type: "select", options: ["Fully Furnished", "Semi Furnished", "Unfurnished"] },
          { key: "condition", label: "Condition", type: "select", options: ["Serviced", "Newly Built", "Under Construction", "Renovated"] },
          { key: "compoundSize", label: "Compound Size", type: "number" },
          { key: "size", label: "Building Size (sqm)", type: "number" },
          { key: "titleDocument", label: "Title Document", type: "select", options: ["C of O", "Gazette", "Deed", "Receipt", "Governor Consent"] },
        ],
      },
  
      APARTMENT: {
        label: "Apartment",
        fields: [
          { key: "bedrooms", label: "Bedrooms", type: "number" },
          { key: "bathrooms", label: "Bathrooms", type: "number" },
          { key: "toilets", label: "Toilets", type: "number" },
          { key: "parkingSpaces", label: "Parking Spaces", type: "number" },
          { key: "floorNumber", label: "Floor Number", type: "number" },
          { key: "totalFloors", label: "Total Floors", type: "number" },
          { key: "furnishing", label: "Furnishing", type: "select", options: ["Fully Furnished", "Semi Furnished", "Unfurnished"] },
          { key: "serviceCharge", label: "Service Charge", type: "number" },
          { key: "condition", label: "Condition", type: "select", options: ["Serviced", "Newly Built", "Under Construction", "Renovated"] },
          { key: "size", label: "Apartment Size (sqm)", type: "number" },
        ],
      },
  
      FLAT: {
        label: "Flat",
        fields: [
          { key: "bedrooms", label: "Bedrooms", type: "number" },
          { key: "bathrooms", label: "Bathrooms", type: "number" },
          { key: "toilets", label: "Toilets", type: "number" },
          { key: "parkingSpaces", label: "Parking Spaces", type: "number" },
          { key: "floorNumber", label: "Floor Number", type: "number" },
          { key: "furnishing", label: "Furnishing", type: "select", options: ["Fully Furnished", "Semi Furnished", "Unfurnished"] },
          { key: "serviceCharge", label: "Service Charge", type: "number" },
          { key: "condition", label: "Condition", type: "select", options: ["Serviced", "Newly Built", "Under Construction", "Renovated"] },
          { key: "size", label: "Flat Size (sqm)", type: "number" },
        ],
      },
  
      MINI_FLAT: {
        label: "Mini Flat",
        fields: [
          { key: "bedrooms", label: "Bedrooms", type: "number" },
          { key: "bathrooms", label: "Bathrooms", type: "number" },
          { key: "toilets", label: "Toilets", type: "number" },
          { key: "floorNumber", label: "Floor Number", type: "number" },
          { key: "furnishing", label: "Furnishing", type: "select", options: ["Fully Furnished", "Semi Furnished", "Unfurnished"] },
          { key: "serviceCharge", label: "Service Charge", type: "number" },
          { key: "condition", label: "Condition", type: "select", options: ["Serviced", "Newly Built", "Under Construction", "Renovated"] },
          { key: "size", label: "Unit Size (sqm)", type: "number" },
        ],
      },
  
      SELF_CONTAIN: {
        label: "Self Contain",
        fields: [
          { key: "bathrooms", label: "Bathrooms", type: "number" },
          { key: "toilets", label: "Toilets", type: "number" },
          { key: "furnishing", label: "Furnishing", type: "select", options: ["Fully Furnished", "Semi Furnished", "Unfurnished"] },
          { key: "serviceCharge", label: "Service Charge", type: "number" },
          { key: "condition", label: "Condition", type: "select", options: ["Serviced", "Newly Built", "Under Construction", "Renovated"] },
          { key: "size", label: "Unit Size (sqm)", type: "number" },
        ],
      },
  
      STUDIO_APARTMENT: {
        label: "Studio Apartment",
        fields: [
          { key: "bathrooms", label: "Bathrooms", type: "number" },
          { key: "toilets", label: "Toilets", type: "number" },
          { key: "floorNumber", label: "Floor Number", type: "number" },
          { key: "furnishing", label: "Furnishing", type: "select", options: ["Fully Furnished", "Semi Furnished", "Unfurnished"] },
          { key: "serviceCharge", label: "Service Charge", type: "number" },
          { key: "condition", label: "Condition", type: "select", options: ["Serviced", "Newly Built", "Under Construction", "Renovated"] },
          { key: "size", label: "Studio Size (sqm)", type: "number" },
        ],
      },
  
      DUPLEX: {
        label: "Duplex",
        fields: [
          { key: "bedrooms", label: "Bedrooms", type: "number" },
          { key: "bathrooms", label: "Bathrooms", type: "number" },
          { key: "toilets", label: "Toilets", type: "number" },
          { key: "parkingSpaces", label: "Parking Spaces", type: "number" },
          { key: "floors", label: "Number of Floors", type: "number" },
          { key: "boysQuarter", label: "Boys Quarter", type: "select", options: ["Yes", "No"] },
          { key: "furnishing", label: "Furnishing", type: "select", options: ["Fully Furnished", "Semi Furnished", "Unfurnished"] },
          { key: "condition", label: "Condition", type: "select", options: ["Serviced", "Newly Built", "Under Construction", "Renovated"] },
          { key: "compoundSize", label: "Compound Size", type: "number" },
          { key: "size", label: "Building Size (sqm)", type: "number" },
        ],
      },
  
      BUNGALOW: {
        label: "Bungalow",
        fields: [
          { key: "bedrooms", label: "Bedrooms", type: "number" },
          { key: "bathrooms", label: "Bathrooms", type: "number" },
          { key: "toilets", label: "Toilets", type: "number" },
          { key: "parkingSpaces", label: "Parking Spaces", type: "number" },
          { key: "boysQuarter", label: "Boys Quarter", type: "select", options: ["Yes", "No"] },
          { key: "furnishing", label: "Furnishing", type: "select", options: ["Fully Furnished", "Semi Furnished", "Unfurnished"] },
          { key: "condition", label: "Condition", type: "select", options: ["Serviced", "Newly Built", "Under Construction", "Renovated"] },
          { key: "compoundSize", label: "Compound Size", type: "number" },
          { key: "size", label: "Building Size (sqm)", type: "number" },
        ],
      },
  
      TERRACE: {
        label: "Terrace",
        fields: [
          { key: "bedrooms", label: "Bedrooms", type: "number" },
          { key: "bathrooms", label: "Bathrooms", type: "number" },
          { key: "toilets", label: "Toilets", type: "number" },
          { key: "parkingSpaces", label: "Parking Spaces", type: "number" },
          { key: "floors", label: "Number of Floors", type: "number" },
          { key: "furnishing", label: "Furnishing", type: "select", options: ["Fully Furnished", "Semi Furnished", "Unfurnished"] },
          { key: "serviceCharge", label: "Service Charge", type: "number" },
          { key: "condition", label: "Condition", type: "select", options: ["Serviced", "Newly Built", "Under Construction", "Renovated"] },
          { key: "size", label: "Building Size (sqm)", type: "number" },
        ],
      },
  
      SEMI_DETACHED: {
        label: "Semi Detached",
        fields: [
          { key: "bedrooms", label: "Bedrooms", type: "number" },
          { key: "bathrooms", label: "Bathrooms", type: "number" },
          { key: "toilets", label: "Toilets", type: "number" },
          { key: "parkingSpaces", label: "Parking Spaces", type: "number" },
          { key: "floors", label: "Number of Floors", type: "number" },
          { key: "boysQuarter", label: "Boys Quarter", type: "select", options: ["Yes", "No"] },
          { key: "furnishing", label: "Furnishing", type: "select", options: ["Fully Furnished", "Semi Furnished", "Unfurnished"] },
          { key: "condition", label: "Condition", type: "select", options: ["Serviced", "Newly Built", "Under Construction", "Renovated"] },
          { key: "size", label: "Building Size (sqm)", type: "number" },
        ],
      },
  
      DETACHED_HOUSE: {
        label: "Detached House",
        fields: [
          { key: "bedrooms", label: "Bedrooms", type: "number" },
          { key: "bathrooms", label: "Bathrooms", type: "number" },
          { key: "toilets", label: "Toilets", type: "number" },
          { key: "parkingSpaces", label: "Parking Spaces", type: "number" },
          { key: "floors", label: "Number of Floors", type: "number" },
          { key: "boysQuarter", label: "Boys Quarter", type: "select", options: ["Yes", "No"] },
          { key: "furnishing", label: "Furnishing", type: "select", options: ["Fully Furnished", "Semi Furnished", "Unfurnished"] },
          { key: "condition", label: "Condition", type: "select", options: ["Serviced", "Newly Built", "Under Construction", "Renovated"] },
          { key: "compoundSize", label: "Compound Size", type: "number" },
          { key: "size", label: "Building Size (sqm)", type: "number" },
        ],
      },
  
      MANSION: {
        label: "Mansion",
        fields: [
          { key: "bedrooms", label: "Bedrooms", type: "number" },
          { key: "bathrooms", label: "Bathrooms", type: "number" },
          { key: "toilets", label: "Toilets", type: "number" },
          { key: "parkingSpaces", label: "Parking Spaces", type: "number" },
          { key: "floors", label: "Number of Floors", type: "number" },
          { key: "swimmingPool", label: "Swimming Pool", type: "select", options: ["Yes", "No"] },
          { key: "gym", label: "Gym", type: "select", options: ["Yes", "No"] },
          { key: "cinema", label: "Cinema", type: "select", options: ["Yes", "No"] },
          { key: "boysQuarter", label: "Boys Quarter", type: "select", options: ["Yes", "No"] },
          { key: "furnishing", label: "Furnishing", type: "select", options: ["Fully Furnished", "Semi Furnished", "Unfurnished"] },
          { key: "condition", label: "Condition", type: "select", options: ["Serviced", "Newly Built", "Under Construction", "Renovated"] },
          { key: "compoundSize", label: "Compound Size", type: "number" },
          { key: "size", label: "Building Size (sqm)", type: "number" },
        ],
      },
  
      PENTHOUSE: {
        label: "Penthouse",
        fields: [
          { key: "bedrooms", label: "Bedrooms", type: "number" },
          { key: "bathrooms", label: "Bathrooms", type: "number" },
          { key: "toilets", label: "Toilets", type: "number" },
          { key: "parkingSpaces", label: "Parking Spaces", type: "number" },
          { key: "floorNumber", label: "Floor Number", type: "number" },
          { key: "privateElevator", label: "Private Elevator", type: "select", options: ["Yes", "No"] },
          { key: "serviceCharge", label: "Service Charge", type: "number" },
          { key: "furnishing", label: "Furnishing", type: "select", options: ["Fully Furnished", "Semi Furnished", "Unfurnished"] },
          { key: "condition", label: "Condition", type: "select", options: ["Serviced", "Newly Built", "Under Construction", "Renovated"] },
          { key: "size", label: "Penthouse Size (sqm)", type: "number" },
        ],
      },
  
      TOWNHOUSE: {
        label: "Townhouse",
        fields: [
          { key: "bedrooms", label: "Bedrooms", type: "number" },
          { key: "bathrooms", label: "Bathrooms", type: "number" },
          { key: "toilets", label: "Toilets", type: "number" },
          { key: "parkingSpaces", label: "Parking Spaces", type: "number" },
          { key: "floors", label: "Number of Floors", type: "number" },
          { key: "serviceCharge", label: "Service Charge", type: "number" },
          { key: "furnishing", label: "Furnishing", type: "select", options: ["Fully Furnished", "Semi Furnished", "Unfurnished"] },
          { key: "condition", label: "Condition", type: "select", options: ["Serviced", "Newly Built", "Under Construction", "Renovated"] },
          { key: "size", label: "Building Size (sqm)", type: "number" },
        ],
      },
  
      VILLA: {
        label: "Villa",
        fields: [
          { key: "bedrooms", label: "Bedrooms", type: "number" },
          { key: "bathrooms", label: "Bathrooms", type: "number" },
          { key: "toilets", label: "Toilets", type: "number" },
          { key: "parkingSpaces", label: "Parking Spaces", type: "number" },
          { key: "floors", label: "Number of Floors", type: "number" },
          { key: "swimmingPool", label: "Swimming Pool", type: "select", options: ["Yes", "No"] },
          { key: "boysQuarter", label: "Boys Quarter", type: "select", options: ["Yes", "No"] },
          { key: "furnishing", label: "Furnishing", type: "select", options: ["Fully Furnished", "Semi Furnished", "Unfurnished"] },
          { key: "condition", label: "Condition", type: "select", options: ["Serviced", "Newly Built", "Under Construction", "Renovated"] },
          { key: "compoundSize", label: "Compound Size", type: "number" },
          { key: "size", label: "Building Size (sqm)", type: "number" },
        ],
      },
  
      COTTAGE: {
        label: "Cottage",
        fields: [
          { key: "bedrooms", label: "Bedrooms", type: "number" },
          { key: "bathrooms", label: "Bathrooms", type: "number" },
          { key: "toilets", label: "Toilets", type: "number" },
          { key: "parkingSpaces", label: "Parking Spaces", type: "number" },
          { key: "furnishing", label: "Furnishing", type: "select", options: ["Fully Furnished", "Semi Furnished", "Unfurnished"] },
          { key: "condition", label: "Condition", type: "select", options: ["Serviced", "Newly Built", "Under Construction", "Renovated"] },
          { key: "compoundSize", label: "Compound Size", type: "number" },
          { key: "size", label: "Building Size (sqm)", type: "number" },
        ],
      },
  
      FARM_HOUSE: {
        label: "Farm House",
        fields: [
          { key: "bedrooms", label: "Bedrooms", type: "number" },
          { key: "bathrooms", label: "Bathrooms", type: "number" },
          { key: "toilets", label: "Toilets", type: "number" },
          { key: "farmSize", label: "Farm Size", type: "number" },
          { key: "unit", label: "Unit", type: "select", options: ["sqm", "plot", "hectare", "acre"] },
          { key: "waterSupply", label: "Water Supply", type: "select", options: ["Yes", "No"] },
          { key: "electricity", label: "Electricity", type: "select", options: ["Yes", "No"] },
          { key: "condition", label: "Condition", type: "select", options: ["Serviced", "Newly Built", "Under Construction", "Renovated"] },
        ],
      },
  
      OFFICE_SPACE: {
        label: "Office Space",
        fields: [
          { key: "officeType", label: "Office Type", type: "select", options: ["Open Plan", "Private Office", "Co-working", "Serviced Office"] },
          { key: "numberOfRooms", label: "Number of Rooms", type: "number" },
          { key: "meetingRooms", label: "Meeting Rooms", type: "number" },
          { key: "restrooms", label: "Restrooms", type: "number" },
          { key: "parkingSpaces", label: "Parking Spaces", type: "number" },
          { key: "floorNumber", label: "Floor Number", type: "number" },
          { key: "serviceCharge", label: "Service Charge", type: "number" },
          { key: "size", label: "Office Size (sqm)", type: "number" },
          { key: "internetReady", label: "Internet Ready", type: "select", options: ["Yes", "No"] },
          { key: "powerSupply", label: "Power Supply", type: "select", options: ["Stable", "Moderate", "Poor"] },
        ],
      },
  
      SHOP: {
        label: "Shop",
        fields: [
          { key: "shopType", label: "Shop Type", type: "select", options: ["Mall Shop", "Standalone Shop", "Plaza Shop", "Kiosk"] },
          { key: "numberOfRooms", label: "Number of Rooms", type: "number" },
          { key: "restrooms", label: "Restrooms", type: "number" },
          { key: "parkingSpaces", label: "Parking Spaces", type: "number" },
          { key: "size", label: "Shop Size (sqm)", type: "number" },
          { key: "frontage", label: "Road Frontage", type: "select", options: ["Yes", "No"] },
          { key: "serviceCharge", label: "Service Charge", type: "number" },
          { key: "powerSupply", label: "Power Supply", type: "select", options: ["Stable", "Moderate", "Poor"] },
        ],
      },
  
      WAREHOUSE: {
        label: "Warehouse",
        fields: [
          { key: "warehouseType", label: "Warehouse Type", type: "select", options: ["Storage", "Distribution", "Cold Room", "Factory Storage"] },
          { key: "size", label: "Warehouse Size (sqm)", type: "number" },
          { key: "loadingBay", label: "Loading Bay", type: "select", options: ["Yes", "No"] },
          { key: "ceilingHeight", label: "Ceiling Height", type: "text" },
          { key: "officeSpaceIncluded", label: "Office Space Included", type: "select", options: ["Yes", "No"] },
          { key: "restrooms", label: "Restrooms", type: "number" },
          { key: "parkingSpaces", label: "Parking Spaces", type: "number" },
          { key: "powerSupply", label: "Power Supply", type: "select", options: ["Stable", "Moderate", "Poor"] },
        ],
      },
  
      FACTORY: {
        label: "Factory",
        fields: [
          { key: "factoryType", label: "Factory Type", type: "select", options: ["Manufacturing", "Processing", "Assembly", "Packaging"] },
          { key: "size", label: "Factory Size (sqm)", type: "number" },
          { key: "productionHalls", label: "Production Halls", type: "number" },
          { key: "officeBlocks", label: "Office Blocks", type: "number" },
          { key: "restrooms", label: "Restrooms", type: "number" },
          { key: "parkingSpaces", label: "Parking Spaces", type: "number" },
          { key: "loadingBay", label: "Loading Bay", type: "select", options: ["Yes", "No"] },
          { key: "powerSupply", label: "Power Supply", type: "select", options: ["Stable", "Moderate", "Poor"] },
        ],
      },
  
      SCHOOL_BUILDING: {
        label: "School Building",
        fields: [
          { key: "schoolType", label: "School Type", type: "select", options: ["Nursery", "Primary", "Secondary", "Combined", "Tutorial Center"] },
          { key: "classRooms", label: "Class Rooms", type: "number" },
          { key: "officeRooms", label: "Office Rooms", type: "number" },
          { key: "laboratories", label: "Laboratories", type: "number" },
          { key: "hostelAvailable", label: "Hostel Available", type: "select", options: ["Yes", "No"] },
          { key: "hallAvailable", label: "Assembly Hall", type: "select", options: ["Yes", "No"] },
          { key: "playground", label: "Playground", type: "select", options: ["Yes", "No"] },
          { key: "restrooms", label: "Restrooms", type: "number" },
          { key: "compoundSize", label: "Compound Size", type: "number" },
          { key: "titleDocument", label: "Title Document", type: "select", options: ["C of O", "Gazette", "Deed", "Receipt", "Governor Consent"] },
        ],
      },
  
      HOSPITAL_BUILDING: {
        label: "Hospital Building",
        fields: [
          { key: "hospitalType", label: "Hospital Type", type: "select", options: ["Clinic", "Hospital", "Maternity", "Diagnostic Center"] },
          { key: "wards", label: "Wards", type: "number" },
          { key: "consultingRooms", label: "Consulting Rooms", type: "number" },
          { key: "operatingTheatres", label: "Operating Theatres", type: "number" },
          { key: "laboratories", label: "Laboratories", type: "number" },
          { key: "pharmacySpace", label: "Pharmacy Space", type: "select", options: ["Yes", "No"] },
          { key: "restrooms", label: "Restrooms", type: "number" },
          { key: "parkingSpaces", label: "Parking Spaces", type: "number" },
          { key: "compoundSize", label: "Compound Size", type: "number" },
        ],
      },
  
      HOTEL: {
        label: "Hotel",
        fields: [
          { key: "numberOfRooms", label: "Number of Rooms", type: "number" },
          { key: "conferenceRooms", label: "Conference Rooms", type: "number" },
          { key: "restaurant", label: "Restaurant", type: "select", options: ["Yes", "No"] },
          { key: "bar", label: "Bar", type: "select", options: ["Yes", "No"] },
          { key: "swimmingPool", label: "Swimming Pool", type: "select", options: ["Yes", "No"] },
          { key: "parkingSpaces", label: "Parking Spaces", type: "number" },
          { key: "laundryRoom", label: "Laundry Room", type: "select", options: ["Yes", "No"] },
          { key: "size", label: "Hotel Size (sqm)", type: "number" },
        ],
      },
  
      GUEST_HOUSE: {
        label: "Guest House",
        fields: [
          { key: "numberOfRooms", label: "Number of Rooms", type: "number" },
          { key: "receptionArea", label: "Reception Area", type: "select", options: ["Yes", "No"] },
          { key: "restaurant", label: "Restaurant", type: "select", options: ["Yes", "No"] },
          { key: "bar", label: "Bar", type: "select", options: ["Yes", "No"] },
          { key: "parkingSpaces", label: "Parking Spaces", type: "number" },
          { key: "laundryRoom", label: "Laundry Room", type: "select", options: ["Yes", "No"] },
          { key: "size", label: "Guest House Size (sqm)", type: "number" },
        ],
      },
  
      EVENT_CENTER: {
        label: "Event Center",
        fields: [
          { key: "hallCapacity", label: "Hall Capacity", type: "number" },
          { key: "numberOfHalls", label: "Number of Halls", type: "number" },
          { key: "changingRooms", label: "Changing Rooms", type: "number" },
          { key: "restrooms", label: "Restrooms", type: "number" },
          { key: "parkingSpaces", label: "Parking Spaces", type: "number" },
          { key: "outdoorSpace", label: "Outdoor Space", type: "select", options: ["Yes", "No"] },
          { key: "generatorRoom", label: "Generator Room", type: "select", options: ["Yes", "No"] },
          { key: "size", label: "Event Center Size (sqm)", type: "number" },
        ],
      },
  
      COMMERCIAL_BUILDING: {
        label: "Commercial Building",
        fields: [
          { key: "commercialType", label: "Commercial Type", type: "select", options: ["Mixed Use", "Plaza", "Business Complex", "Mall"] },
          { key: "numberOfUnits", label: "Number of Units", type: "number" },
          { key: "officeSpaces", label: "Office Spaces", type: "number" },
          { key: "shops", label: "Shops", type: "number" },
          { key: "restrooms", label: "Restrooms", type: "number" },
          { key: "parkingSpaces", label: "Parking Spaces", type: "number" },
          { key: "elevator", label: "Elevator", type: "select", options: ["Yes", "No"] },
          { key: "size", label: "Building Size (sqm)", type: "number" },
        ],
      },
    },
  },
  
  LAND: {
    label: "Lands",
    subcategories: {
      RESIDENTIAL_PLOT: {
        label: "Residential Plot",
        fields: [
          { key: "landSize", label: "Land Size", type: "number" },
          { key: "unit", label: "Unit", type: "select", options: ["sqm", "plot", "hectare", "acre"] },
          { key: "titleDocument", label: "Title Document", type: "select", options: ["C of O", "Gazette", "Deed", "Receipt", "Governor Consent"] },
          { key: "serviced", label: "Serviced", type: "select", options: ["Yes", "No"] },
          { key: "fenced", label: "Fenced", type: "select", options: ["Yes", "No"] },
          { key: "gatedEstate", label: "Gated Estate", type: "select", options: ["Yes", "No"] },
          { key: "surveyAvailable", label: "Survey Available", type: "select", options: ["Yes", "No"] },
          { key: "topography", label: "Topography", type: "select", options: ["Dry", "Swampy", "Mixed"] },
          { key: "roadAccess", label: "Road Access", type: "select", options: ["Tarred", "Untarred", "Partly Tarred"] },
        ],
      },
  
      COMMERCIAL_PLOT: {
        label: "Commercial Plot",
        fields: [
          { key: "landSize", label: "Land Size", type: "number" },
          { key: "unit", label: "Unit", type: "select", options: ["sqm", "plot", "hectare", "acre"] },
          { key: "titleDocument", label: "Title Document", type: "select", options: ["C of O", "Gazette", "Deed", "Receipt", "Governor Consent"] },
          { key: "serviced", label: "Serviced", type: "select", options: ["Yes", "No"] },
          { key: "fenced", label: "Fenced", type: "select", options: ["Yes", "No"] },
          { key: "surveyAvailable", label: "Survey Available", type: "select", options: ["Yes", "No"] },
          { key: "cornerPiece", label: "Corner Piece", type: "select", options: ["Yes", "No"] },
          { key: "roadAccess", label: "Road Access", type: "select", options: ["Tarred", "Untarred", "Partly Tarred"] },
          { key: "purpose", label: "Purpose", type: "select", options: ["Office", "Shop", "Plaza", "Warehouse", "Mixed Use"] },
        ],
      },
  
      INDUSTRIAL_LAND: {
        label: "Industrial Land",
        fields: [
          { key: "landSize", label: "Land Size", type: "number" },
          { key: "unit", label: "Unit", type: "select", options: ["sqm", "plot", "hectare", "acre"] },
          { key: "titleDocument", label: "Title Document", type: "select", options: ["C of O", "Gazette", "Deed", "Receipt", "Governor Consent"] },
          { key: "fenced", label: "Fenced", type: "select", options: ["Yes", "No"] },
          { key: "surveyAvailable", label: "Survey Available", type: "select", options: ["Yes", "No"] },
          { key: "roadAccess", label: "Road Access", type: "select", options: ["Tarred", "Untarred", "Partly Tarred"] },
          { key: "heavyDutyAccess", label: "Heavy Duty Vehicle Access", type: "select", options: ["Yes", "No"] },
          { key: "purpose", label: "Purpose", type: "select", options: ["Factory", "Warehouse", "Depot", "Industrial Estate"] },
        ],
      },
  
      AGRICULTURAL_LAND: {
        label: "Agricultural Land",
        fields: [
          { key: "landSize", label: "Land Size", type: "number" },
          { key: "unit", label: "Unit", type: "select", options: ["sqm", "plot", "hectare", "acre"] },
          { key: "soilType", label: "Soil Type", type: "select", options: ["Loamy", "Sandy", "Clay", "Mixed"] },
          { key: "waterSupply", label: "Water Supply", type: "select", options: ["Yes", "No"] },
          { key: "fenced", label: "Fenced", type: "select", options: ["Yes", "No"] },
          { key: "surveyAvailable", label: "Survey Available", type: "select", options: ["Yes", "No"] },
          { key: "titleDocument", label: "Title Document", type: "select", options: ["C of O", "Gazette", "Deed", "Receipt", "Governor Consent"] },
          { key: "cropSuitableFor", label: "Suitable For", type: "text" },
        ],
      },
  
      MIXED_USE_LAND: {
        label: "Mixed Use Land",
        fields: [
          { key: "landSize", label: "Land Size", type: "number" },
          { key: "unit", label: "Unit", type: "select", options: ["sqm", "plot", "hectare", "acre"] },
          { key: "titleDocument", label: "Title Document", type: "select", options: ["C of O", "Gazette", "Deed", "Receipt", "Governor Consent"] },
          { key: "serviced", label: "Serviced", type: "select", options: ["Yes", "No"] },
          { key: "fenced", label: "Fenced", type: "select", options: ["Yes", "No"] },
          { key: "surveyAvailable", label: "Survey Available", type: "select", options: ["Yes", "No"] },
          { key: "roadAccess", label: "Road Access", type: "select", options: ["Tarred", "Untarred", "Partly Tarred"] },
          { key: "purpose", label: "Purpose", type: "select", options: ["Residential", "Commercial", "Industrial"] },
        ],
      },
    },
  },

  VEHICLES: {
    label: "Vehicles",
    subcategories: {

      CARS: {
        label: "Cars",
        fields: [
          { key: "make", label: "Make", type: "text" },
          { key: "model", label: "Model", type: "text" },
          { key: "year", label: "Year", type: "number" },
          { key: "condition", label: "Condition", type: "select", options: ["New","Local Used","Foreign Used"] },
          { key: "mileage", label: "Mileage (km)", type: "number" },
          { key: "fuelType", label: "Fuel Type", type: "select", options: ["Petrol","Diesel","Hybrid","Electric"] },
          { key: "transmission", label: "Transmission", type: "select", options: ["Automatic","Manual", "DCT", "CVT"] },
          { key: "bodyType", label: "Body Type", type: "select", options: ["Sedan","SUV","Pickup","Truck","Van","Bus", "Hatch Back", "Coupe", "Hypercar", "Supercar", "Mini Van"] },
          { key: "engineSize", label: "Engine Size", type: "text" },
          { key: "color", label: "Color", type: "text" },
          { key: "trim", label: "Trim", type: "text" },
          { key: "interiorColor", label: "Interior color", type: "text" },
          { key: "drivetrain", label: "Drivetrain", type: "select", options: ["FOUR WHEEL DRIVE","REAR WHEEL DRIVE","ALL WHEEL DRIVE","4X4"] },
          { key: "wheels", label: "wheels", type: "select", options: ["Alloy", "Iron", "Cabon Fibre"]},
          { key: "vinChassisNumber", label: "VIN / Chasis number", type: "text" },
          { key: "registered", label: "Registered", type: "select", options: ["Yes","No"] },
          { key: "numberOfOwners", label: "Number of Previous Owners", type: "number" },
          { key: "exchangePossible", label: "Exchange Possible", type: "select", options: ["Yes","No"] },
        ],
      },

      TRUCKS: {
        label: "Trucks",
        fields: [
          { key: "truckType", label: "Truck Type", type: "select", options: [
            "Pickup",
            "Flatbed",
            "Tipper",
            "Box Truck",
            "Refrigerated Truck",
            "Tanker",
            "Dump Truck",
            "Tow Truck",
            "Lowbed",
            "Mini Truck",
            "Other"
          ]},
      
          { key: "brand", label: "Brand", type: "text" },
          { key: "model", label: "Model", type: "text" },
          { key: "year", label: "Year", type: "number" },
      
          { key: "condition", label: "Condition", type: "select", options: [
            "New",
            "Foreign Used",
            "Local Used"
          ]},
      
          { key: "mileage", label: "Mileage (km)", type: "number" },
      
          { key: "fuelType", label: "Fuel Type", type: "select", options: [
            "Diesel",
            "Petrol",
            "Hybrid",
            "Electric"
          ]},
      
          { key: "transmission", label: "Transmission", type: "select", options: [
            "Manual",
            "Automatic"
          ]},
      
          { key: "engineCapacity", label: "Engine Capacity (cc)", type: "text" },
      
          { key: "loadCapacity", label: "Load Capacity (tons)", type: "text" },
      
          { key: "numberOfAxles", label: "Number of Axles", type: "number" },
      
          { key: "driveType", label: "Drive Type", type: "select", options: [
            "4x2",
            "6x4",
            "6x6",
            "8x4",
            "Other"
          ]},
      
          { key: "bodyCondition", label: "Body Condition", type: "select", options: [
            "Excellent",
            "Good",
            "Needs Repair"
          ]},
      
          { key: "interiorCondition", label: "Interior Condition", type: "select", options: [
            "Excellent",
            "Good",
            "Needs Repair"
          ]},
      
          { key: "vinChassisNumber", label: "VIN / Chassis Number", type: "text" },
      
          { key: "registered", label: "Registered", type: "select", options: [
            "Yes",
            "No"
          ]},
      
          { key: "numberOfOwners", label: "Number of Previous Owners", type: "number" },
      
          { key: "color", label: "Color", type: "text" },
      
          { key: "exchangePossible", label: "Exchange Possible", type: "select", options: [
            "Yes",
            "No"
          ]}
        ]
      },

      BOATS: {
        label: "Boats",
        fields: [
          { key: "boatType", label: "Boat Type", type: "select", options: ["Speedboat","Fishing Boat","Yacht","Canoe","Jet Ski","Pontoon","Sailboat","Other"] },
          { key: "brand", label: "Brand", type: "text" },
          { key: "model", label: "Model", type: "text" },
          { key: "year", label: "Year", type: "number" },
          { key: "condition", label: "Condition", type: "select", options: ["New","Foreign Used","Local Used"] },
          { key: "engineType", label: "Engine Type", type: "select", options: ["Outboard","Inboard","Jet","Electric"] },
          { key: "enginePower", label: "Engine Power (HP)", type: "number" },
          { key: "fuelType", label: "Fuel Type", type: "select", options: ["Petrol","Diesel","Electric"] },
          { key: "length", label: "Length (ft)", type: "number" },
          { key: "color", label: "Color", type: "text" },
          { key: "registrationStatus", label: "Registered", type: "select", options: ["Yes","No"] },
        ],
      },

      BUSES: {
        label: "Buses",
        fields: [
          { key: "busType", label: "Bus Type", type: "select", options: [
            "Mini Bus",
            "City Bus",
            "Coach Bus",
            "School Bus",
            "Luxury Bus",
            "Shuttle Bus",
            "Staff Bus",
            "Other"
          ]},
      
          { key: "brand", label: "Brand", type: "text" },
          { key: "model", label: "Model", type: "text" },
          { key: "year", label: "Year", type: "number" },
      
          { key: "condition", label: "Condition", type: "select", options: [
            "New",
            "Foreign Used",
            "Local Used"
          ]},
      
          { key: "mileage", label: "Mileage (km)", type: "number" },
      
          { key: "fuelType", label: "Fuel Type", type: "select", options: [
            "Diesel",
            "Petrol",
            "Hybrid",
            "Electric"
          ]},
      
          { key: "transmission", label: "Transmission", type: "select", options: [
            "Manual",
            "Automatic"
          ]},
      
          { key: "engineCapacity", label: "Engine Capacity (cc)", type: "text" },
      
          { key: "seatingCapacity", label: "Seating Capacity", type: "number" },
      
          { key: "numberOfDoors", label: "Number of Doors", type: "number" },
      
          { key: "airConditioning", label: "Air Conditioning", type: "select", options: [
            "Yes",
            "No"
          ]},
      
          { key: "entertainmentSystem", label: "Entertainment System", type: "select", options: [
            "Yes",
            "No"
          ]},
      
          { key: "luggageSpace", label: "Luggage Space", type: "select", options: [
            "Yes",
            "No"
          ]},
      
          { key: "bodyCondition", label: "Body Condition", type: "select", options: [
            "Excellent",
            "Good",
            "Needs Repair"
          ]},
      
          { key: "interiorCondition", label: "Interior Condition", type: "select", options: [
            "Excellent",
            "Good",
            "Needs Repair"
          ]},
      
          { key: "vinChassisNumber", label: "VIN / Chassis Number", type: "text" },
      
          { key: "registered", label: "Registered", type: "select", options: [
            "Yes",
            "No"
          ]},
      
          { key: "numberOfOwners", label: "Number of Previous Owners", type: "number" },
      
          { key: "color", label: "Color", type: "text" },
      
          { key: "exchangePossible", label: "Exchange Possible", type: "select", options: [
            "Yes",
            "No"
          ]}
        ]
      },

      MOTORCYCLES: {
        label: "Motorcycles",
        fields: [
          { key: "make", label: "Make", type: "text" },
          { key: "model", label: "Model", type: "text" },
          { key: "year", label: "Year", type: "number" },
          { key: "condition", label: "Condition", type: "select", options: ["New", "foreign Used", "Local Used"] },
          { key: "mileage", label: "Mileage", type: "number" },
          { key: "engineCapacity", label: "Engine Capacity (cc)", type: "number" },
          { key: "fuelType", label: "Fuel Type", type: "select", options: ["Petrol","Electric"] },
          { key: "color", label: "Color", type: "text" },
          { key: "rims", label: "Rims", type: "select", options: ["Alloy", "Iron", "Cabon Fibre"]},
          { key: "registrationStatus", label: "Registration Status", type: "select", options: ["Registered","Unregistered"] },
        ],
      },

      BICYCLES: {
        label: "Bicycles",
        fields: [
          { key: "brand", label: "Brand", type: "text" },
          { key: "model", label: "Model", type: "text" },
          { key: "bicycleType", label: "Type", type: "select", options: ["Mountain","Road","BMX","Electric","Kids"] },
          { key: "frameMaterial", label: "Frame Material", type: "select", options: ["Steel","Aluminum","Carbon"] },
          { key: "condition", label: "Condition", type: "select", options: ["New", "foreign Used", "Local Used"] },
          { key: "wheelSize", label: "Wheel Size", type: "text" },
          { key: "numberOfGears", label: "Number of Gears", type: "number" },
          { key: "color", label: "Color", type: "text" },
        ],
      },

      TRAILERS: {
        label: "Trailers",
        fields: [
          { key: "trailerType", label: "Trailer Type", type: "select", options: ["Flatbed","Tanker","Container","Lowbed","Tipper"] },
          { key: "make", label: "Make", type: "text" },
          { key: "model", label: "Model", type: "text" },
          { key: "year", label: "Year", type: "number" },
          { key: "condition", label: "Condition", type: "select", options: ["New", "foreign Used", "Local Used"] },
          { key: "axles", label: "Number of Axles", type: "number" },
          { key: "payloadCapacity", label: "Payload Capacity", type: "text" },
          { key: "color", label: "Color", type: "text" },
        ],
      },

      CAR_PARTS_ACCESSORIES: {
        label: "Car Parts & Accessories",
        fields: [
          { key: "partType", label: "Part Type", type: "select", options: ["Tyres","Rims","Engine Parts","Brake Parts","Lights","Interior","Audio"] },
          { key: "brand", label: "Brand", type: "text" },
          { key: "compatibleWith", label: "Compatible With", type: "text" },
          { key: "condition", label: "Condition", type: "select", options: ["New", "foreign Used", "Local Used"] },
          { key: "color", label: "Color", type: "text" },
          { key: "warranty", label: "Warranty", type: "select", options: ["Yes","No"] },
        ],
      },

    },
  },

  ELECTRONICS: {
    label: "Electronics",
    subcategories: {

      TELEVISIONS: {
        label: "Televisions",
        fields: [
          { key: "brand", label: "Brand", type: "text" },
          { key: "model", label: "Model", type: "text" },
          { key: "condition", label: "Condition", type: "select", options: ["New", "foreign Used", "Local Used"] },
          { key: "screenSize", label: "Screen Size", type: "text" },
          { key: "displayType", label: "Display Type", type: "select", options: ["LED","OLED","QLED","LCD","Plasma"] },
          { key: "resolution", label: "Resolution", type: "select", options: ["HD","Full HD","4K","8K"] },
          { key: "smartTv", label: "Smart TV", type: "select", options: ["Yes","No"] },
        ],
      },
      
      LAPTOPS_COMPUTERS: {
        label: "Laptops & Computers",
        fields: [
          { key: "brand", label: "Brand", type: "text" },
          { key: "model", label: "Model", type: "text" },
          { key: "condition", label: "Condition", type: "select", options: ["New","Forein Used", "Local Used", "Refurbished"] },
          { key: "processor", label: "Processor", type: "text" },
          { key: "ram", label: "RAM", type: "text" },
          { key: "storage", label: "Storage", type: "text" },
          { key: "storageType", label: "Storage Type", type: "select", options: ["HDD","SSD"] },
          { key: "screenSize", label: "Screen Size", type: "text" },
          { key: "graphicsCard", label: "Graphics Card", type: "text" },
          { key: "operatingSystem", label: "Operating System", type: "text" },
          { key: "batteryLife", label: "Battery Life", type: "text" },
        ],
      },

      HEADPHONES: {
        label: "Headphones",
        fields: [
          { key: "brand", label: "Brand", type: "text" },
          { key: "model", label: "Model", type: "text" },
          { key: "type", label: "Type", type: "select", options: ["In-Ear","On-Ear","Over-Ear"] },
          { key: "condition", label: "Condition", type: "select", options: ["New", "foreign Used", "Local Used"] },
          { key: "connectivity", label: "Connectivity", type: "select", options: ["Wired","Wireless","Bluetooth"] },
          { key: "noiseCancellation", label: "Noise Cancellation", type: "select", options: ["Yes","No"] },
          { key: "batteryLife", label: "Battery Life", type: "text" },
        ],
      },

      GAMING_CONSOLES: {
        label: "Gaming Consoles",
        fields: [
          { key: "brand", label: "Brand", type: "select", options: ["Sony", "Microsoft", "Nintendo", "Other"] },
          { key: "model", label: "Model", type: "text" },
          { key: "condition", label: "Condition", type: "select", options: ["New", "Used", "Refurbished"] },
          { key: "consoleType", label: "Console Type", type: "select", options: ["Home Console", "Handheld Console"] },
          { key: "storage", label: "Storage", type: "select", options: ["256GB", "512GB", "1TB", "2TB", "Other"] },
          { key: "edition", label: "Edition", type: "select", options: ["Standard", "Digital", "Slim", "Pro", "Limited Edition", "Other"] },
          { key: "color", label: "Color", type: "text" },
          { key: "numberOfControllers", label: "Number of Controllers", type: "number" },
          { key: "controllersIncluded", label: "Controllers Included", type: "select", options: ["Yes", "No"] },
          { key: "gamesIncluded", label: "Games Included", type: "select", options: ["Yes", "No"] },
          { key: "numberOfGames", label: "Number of Games", type: "number" },
          { key: "onlineCapable", label: "Online Capable", type: "select", options: ["Yes", "No"] },
          { key: "resolutionSupport", label: "Resolution Support", type: "select", options: ["1080p", "1440p", "4K", "8K"] },
          { key: "hdmiIncluded", label: "HDMI Cable Included", type: "select", options: ["Yes", "No"] },
          { key: "powerCableIncluded", label: "Power Cable Included", type: "select", options: ["Yes", "No"] },
          { key: "boxIncluded", label: "Box Included", type: "select", options: ["Yes", "No"] },
          { key: "warranty", label: "Warranty", type: "select", options: ["Yes", "No"] },
        ],
      },

      AUDIO_MUSIC_EQUIPMENT: {
        label: "Audio & Music Equipment",
        fields: [
          { key: "deviceType", label: "Device Type", type: "select", options: ["Speaker","Soundbar","Subwoofer","Amplifier","Mixer","Microphone","Studio Monitor","DJ Controller","Audio Interface","Other"] },
          { key: "brand", label: "Brand", type: "text" },
          { key: "model", label: "Model", type: "text" },
          { key: "condition", label: "Condition", type: "select", options: ["New","Used","Refurbished"] },
          { key: "connectivity", label: "Connectivity", type: "select", options: ["Bluetooth","Wired","Wi-Fi","Bluetooth + Wired"] },
          { key: "powerSource", label: "Power Source", type: "select", options: ["Battery","Electric","Both"] },
          { key: "batteryLife", label: "Battery Life", type: "text" },
          { key: "color", label: "Color", type: "text" },
          { key: "warranty", label: "Warranty", type: "select", options: ["Yes","No"] },
        ],
      },

      CAMERAS_PHOTOGRAPHY: {
        label: "Cameras & Photography",
        fields: [
          { key: "cameraType", label: "Camera Type", type: "select", options: ["DSLR","Mirrorless","Point & Shoot","Action Camera","Camcorder","Drone Camera"] },
          { key: "brand", label: "Brand", type: "text" },
          { key: "model", label: "Model", type: "text" },
          { key: "condition", label: "Condition", type: "select", options: ["New","Used","Refurbished"] },
          { key: "megapixels", label: "Megapixels", type: "number" },
          { key: "videoResolution", label: "Video Resolution", type: "select", options: ["1080p","2K","4K","8K"] },
          { key: "sensorType", label: "Sensor Type", type: "select", options: ["Full Frame","APS-C","Micro Four Thirds","1 inch","Other"] },
          { key: "lensIncluded", label: "Lens Included", type: "select", options: ["Yes","No"] },
          { key: "batteryIncluded", label: "Battery Included", type: "select", options: ["Yes","No"] },
          { key: "memoryCardIncluded", label: "Memory Card Included", type: "select", options: ["Yes","No"] },
        ],
      },

      TV_EQUIPMENT: {
        label: "TV Equipment",
        fields: [
          { key: "deviceType", label: "Device Type", type: "select", options: ["Decoder","Streaming Box","Android TV Box","Firestick","Apple TV","Satellite Dish","Remote Control"] },
          { key: "brand", label: "Brand", type: "text" },
          { key: "model", label: "Model", type: "text" },
          { key: "condition", label: "Condition", type: "select", options: ["New","Used"] },
          { key: "supportedResolution", label: "Supported Resolution", type: "select", options: ["HD","Full HD","4K"] },
          { key: "wifiEnabled", label: "WiFi Enabled", type: "select", options: ["Yes","No"] },
          { key: "hdmiIncluded", label: "HDMI Cable Included", type: "select", options: ["Yes","No"] },
          { key: "remoteIncluded", label: "Remote Included", type: "select", options: ["Yes","No"] },
        ],
      },

      NETWORKING_EQUIPMENT: {
        label: "Networking Equipment",
        fields: [
          { key: "deviceType", label: "Device Type", type: "select", options: ["Router","Modem","Access Point","Range Extender","Network Switch"] },
          { key: "brand", label: "Brand", type: "text" },
          { key: "model", label: "Model", type: "text" },
          { key: "condition", label: "Condition", type: "select", options: ["New","Used"] },
          { key: "wifiStandard", label: "WiFi Standard", type: "select", options: ["WiFi 4","WiFi 5","WiFi 6","WiFi 6E"] },
          { key: "maxSpeed", label: "Max Speed", type: "text" },
          { key: "numberOfPorts", label: "Number of LAN Ports", type: "number" },
        ],
      },

      COMPUTER_MONITORS: {
        label: "Computer Monitors",
        fields: [
          { key: "brand", label: "Brand", type: "text" },
          { key: "model", label: "Model", type: "text" },
          { key: "screenSize", label: "Screen Size", type: "text" },
          { key: "resolution", label: "Resolution", type: "select", options: ["HD","Full HD","2K","4K"] },
          { key: "panelType", label: "Panel Type", type: "select", options: ["IPS","VA","TN","OLED"] },
          { key: "refreshRate", label: "Refresh Rate", type: "text" },
          { key: "condition", label: "Condition", type: "select", options: ["New","Used"] },
        ],
      },

      COMPUTER_ACCESSORIES: {
        label: "Computer Accessories",
        fields: [
          { key: "accessoryType", label: "Accessory Type", type: "select", options: ["Keyboard","Mouse","Webcam","External Hard Drive","USB Hub","Cooling Pad","Docking Station"] },
          { key: "brand", label: "Brand", type: "text" },
          { key: "model", label: "Model", type: "text" },
          { key: "condition", label: "Condition", type: "select", options: ["New","Used"] },
          { key: "connectivity", label: "Connectivity", type: "select", options: ["USB","Bluetooth","Wireless","Wired"] },
        ],
      },

      CCTV_SECURITY_CAMERAS: {
        label: "CCTV & Security Cameras",
        fields: [
          { key: "cameraType", label: "Camera Type", type: "select", options: ["Indoor","Outdoor","Dome","Bullet","PTZ","Wireless"] },
          { key: "brand", label: "Brand", type: "text" },
          { key: "model", label: "Model", type: "text" },
          { key: "resolution", label: "Resolution", type: "select", options: ["720p","1080p","2K","4K"] },
          { key: "nightVision", label: "Night Vision", type: "select", options: ["Yes","No"] },
          { key: "motionDetection", label: "Motion Detection", type: "select", options: ["Yes","No"] },
          { key: "storageType", label: "Storage Type", type: "select", options: ["Cloud","SD Card","DVR","NVR"] },
          { key: "condition", label: "Condition", type: "select", options: ["New","Used"] },
        ],
      },



      ELECTRONICS_OTHER: {
        label: "Other Electronics",
        fields: [
          { key: "deviceType", label: "Device Type", type: "text" },
          { key: "brand", label: "Brand", type: "text" },
          { key: "model", label: "Model", type: "text" },
          { key: "condition", label: "Condition", type: "select", options: ["New","Forein Used", "Local Used", "Refurbished"] },
          { key: "specifications", label: "Specifications", type: "textarea" },
        ],
      },

    },
  },

  PHONES: {
    label: "Phones",
    subcategories: {

      SMART_PHONES: {
        label: "Smart Phones",
        fields: [
          // { key: "deviceType", label: "Device Type", type: "select", options: ["Phone","Tablet"] },
          { key: "brand", label: "Brand", type: "text" },
          { key: "model", label: "Model", type: "text" },
          { key: "condition", label: "Condition", type: "select", options: ["New","Forein Used", "Local Used", "Refurbished"] },
          { key: "ram", label: "ram", type: "select", options: ["2GB", "3GB", "4GB", "6GB", "8GB", "12GB", "16GB"] },
          { key: "storage", label: "storage", type: "select", options: ["16GB", "32GB", "64GB", "128GB", "256GB", "512GB", "1TB"] },
          { key: "color", label: "Color", type: "text" },
          { key: "battery", label: "Battery ", type: "text" },
          { key: "network", label: "Network", type: "select", options: ["2G + Wifi", "3G + Wifi", "4G + Wifi","5G + Wifi","WiFi Only"] },
          { key: "simSlots", label: "SIM Slots", type: "number" },
          { key: "chargerIncluded", label: "Charger Included", type: "select", options: ["Yes","No"] },
        ],
      },

      TABLETS: {
        label: "Tablets",
        fields: [
          {
            key: "tabletType",
            label: "Tablet Type",
            type: "select",
            options: [
              "Smart Tablet",
              "Kids Tablet",
              "Drawing Tablet",
              "Gaming Tablet",
              "2-in-1 Tablet",
              "E-Reader Tablet"
            ]
          },
      
          {
            key: "brand",
            label: "Brand",
            type: "text"
          },
      
          {
            key: "model",
            label: "Model",
            type: "text"
          },
      
          {
            key: "condition",
            label: "Condition",
            type: "select",
            options: ["New", "Foreign Used", "Local Used", "Refurbished"]
          },
      
          {
            key: "operatingSystem",
            label: "Operating System",
            type: "select",
            options: ["Android", "iPadOS", "Windows", "Amazon Fire OS", "Other"]
          },
      
          {
            key: "screenSize",
            label: "Screen Size",
            type: "text"
          },
      
          {
            key: "ram",
            label: "RAM",
            type: "select",
            options: ["2GB", "3GB", "4GB", "6GB", "8GB", "12GB", "16GB"]
          },
      
          {
            key: "storage",
            label: "Storage",
            type: "select",
            options: [
              "16GB",
              "32GB",
              "64GB",
              "128GB",
              "256GB",
              "512GB",
              "1TB"
            ]
          },
      
          {
            key: "connectivity",
            label: "Connectivity",
            type: "select",
            options: [
              "WiFi Only",
              "WiFi + 2G",
              "WiFi + 3G",
              "WiFi + 4G",
              "WiFi + 5G"
            ]
          },
      
          {
            key: "batteryCapacity",
            label: "Battery Size",
            type: "text"
          },
      
          {
            key: "stylusSupport",
            label: "Stylus Support",
            type: "select",
            options: ["Yes", "No"]
          },
      
          {
            key: "physicalKeyboard",
            label: "Keyboard Support",
            type: "select",
            options: ["Yes", "No"]
          },
      
          {
            key: "color",
            label: "Color",
            type: "text"
          },
      
          {
            key: "chargerIncluded",
            label: "Charger Included",
            type: "select",
            options: ["Yes", "No"]
          }
        ]
      },

      BUTTON_PHONES: {
        label: "Button Phones",
        fields: [
          { key: "brand", label: "Brand", type: "text" },
          { key: "model", label: "Model", type: "text" },
          { key: "condition", label: "Condition", type: "select", options: ["New", "Foreign Used", "Local Used", "Refurbished"] },
          { key: "network", label: "Network", type: "select", options: ["2G", "3G", "4G"] },
          { key: "simType", label: "SIM Type", type: "select", options: ["Single SIM", "Dual SIM"] },
          { key: "batteryCapacity", label: "Battery Capacity", type: "text" },
          { key: "storage", label: "Storage", type: "text" },
          { key: "memoryCardSupport", label: "Memory Card Support", type: "select", options: ["Yes", "No"] },
          { key: "wirelessRadio", label: "Wireless Radio", type: "select", options: ["Yes", "No"] },
          { key: "torchLight", label: "Torch Light", type: "select", options: ["Yes", "No"] },
          { key: "camera", label: "Camera", type: "select", options: ["Yes", "No"] },
          { key: "chargerIncluded", label: "Charger Included", type: "select", options: ["Yes", "No"] },
          { key: "color", label: "Color", type: "text" }
        ]
      },
      
      PHONE_PARTS: {
        label: "Phone Parts",
        fields: [
          { key: "partType", label: "Part Type", type: "select", options: [
            "Screen",
            "Touchscreen",
            "Battery",
            "Charging Port",
            "Back Cover",
            "Housing",
            "Motherboard",
            "Camera",
            "Speaker",
            "Mic",
            "Earpiece",
            "Flex Cable",
            "SIM Tray",
            "Buttons",
            "Fingerprint Sensor",
            "Face ID Parts",
            "IC",
            "Connector",
            "Other"
          ]},
          { key: "brand", label: "Phone Brand", type: "text" },
          { key: "model", label: "Compatible Model", type: "text" },
          { key: "condition", label: "Condition", type: "select", options: ["New", "Used", "Refurbished"] },
          { key: "originality", label: "Originality", type: "select", options: ["Original", "OEM", "Replacement"] },
          { key: "compatibleWith", label: "Compatible With", type: "text" },
          { key: "warranty", label: "Warranty", type: "select", options: ["Yes", "No"] },
          { key: "installationRequired", label: "Installation Required", type: "select", options: ["Yes", "No"] }
        ]
      },

      MOBILE_ACCESSORIES: {
        label: "Mobile Accessories",
        fields: [
          { key: "accessoryType", label: "Accessory Type", type: "select", options: [
            "Charger",
            "Fast Charger",
            "Cable",
            "OTG Cable",
            "Power Bank",
            "Case",
            "Screen Guard",
            "Tempered Glass",
            "Earbuds",
            "Headset",
            "Bluetooth Earphones",
            "Phone Holder",
            "Car Mount",
            "Car Charger",
            "Wireless Charger",
            "Adapter",
            "Memory Card",
            "Card Reader",
            "Stylus Pen",
            "Selfie Stick",
            "Ring Light",
            "Phone Stand",
            "Battery Pack",
            "Other"
          ]},
          { key: "brand", label: "Brand", type: "text" },
          { key: "model", label: "Model", type: "text" },
          { key: "compatibleWith", label: "Compatible With", type: "text" },
          { key: "condition", label: "Condition", type: "select", options: ["New", "Foreign Used", "Local Used"] },
          { key: "wireless", label: "Wireless", type: "select", options: ["Yes", "No"] },
          { key: "fastCharging", label: "Fast Charging", type: "select", options: ["Yes", "No"] },
          { key: "color", label: "Color", type: "text" },
          { key: "warranty", label: "Warranty", type: "select", options: ["Yes", "No"] }
        ]
      },

      SMART_WATCHES: {
        label: "Smart Watches",
        fields: [
          { key: "brand", label: "Brand", type: "text" },
          { key: "model", label: "Model", type: "text" },
          { key: "condition", label: "Condition", type: "select", options: ["New", "Used", "Refurbished"] },
          { key: "color", label: "Color", type: "text" },
          { key: "strapMaterial", label: "Strap Material", type: "select", options: ["Rubber", "Silicone", "Leather", "Metal", "Fabric"] },
          { key: "caseSize", label: "Case Size", type: "text" },
          { key: "displayType", label: "Display Type", type: "select", options: ["AMOLED", "OLED", "LCD", "Retina", "Other"] },
          { key: "connectivity", label: "Connectivity", type: "select", options: ["Bluetooth", "Wi-Fi", "Bluetooth + Wi-Fi", "Bluetooth + Cellular", "Cellular"] },
          { key: "compatibleWith", label: "Compatible With", type: "select", options: ["Android", "iPhone", "Android & iPhone", "Other"] },
          { key: "operatingSystem", label: "Operating System", type: "text" },
          { key: "batteryLife", label: "Battery Life", type: "text" },
          { key: "waterResistant", label: "Water Resistant", type: "select", options: ["Yes", "No"] },
          { key: "heartRateMonitor", label: "Heart Rate Monitor", type: "select", options: ["Yes", "No"] },
          { key: "gps", label: "GPS", type: "select", options: ["Yes", "No"] },
          { key: "chargerIncluded", label: "Charger Included", type: "select", options: ["Yes", "No"] },
          { key: "boxIncluded", label: "Box Included", type: "select", options: ["Yes", "No"] },
        ],
      },
    }
  },

  HOME: {
    label: "Home",
    subcategories: {

      FURNITURE: {
        label: "Furniture",
        fields: [
          { key: "furnitureType", label: "Furniture Type", type: "select", options: ["Sofa","Bed","Chair","Table","Wardrobe","Cabinet","Shelf"] },
          { key: "material", label: "Material", type: "select", options: ["Wood","Metal","Plastic","Glass","Leather"] },
          { key: "condition", label: "Condition", type: "select", options: ["New","Used"] },
          { key: "color", label: "Color", type: "text" },
          { key: "dimensions", label: "Dimensions", type: "text" },
        ],
      },

      HOME_APPLIANCES: {
        label: "Home Appliances",
        fields: [
          { key: "applianceType", label: "Appliance Type", type: "select", options: ["Fridge","Freezer","AC","Washing Machine","Cooker","Microwave","Blender"] },
          { key: "brand", label: "Brand", type: "text" },
          { key: "model", label: "Model", type: "text" },
          { key: "condition", label: "Condition", type: "select", options: ["New", "foreign Used", "Local Used"] },
          { key: "powerSource", label: "Power Source", type: "select", options: ["Electric","Gas","Battery"] },
          { key: "capacity", label: "Capacity", type: "text" },
          { key: "color", label: "Color", type: "text" },
        ],
      },

      HOME_DECOR: {
        label: "Home Decor",
        fields: [
          { key: "decorType", label: "Decor Type", type: "select", options: [
            "Wall Art",
            "Painting",
            "Mirror",
            "Clock",
            "Vase",
            "Artificial Plant",
            "Curtain",
            "Rug",
            "Carpet",
            "Wallpaper",
            "Photo Frame",
            "Decorative Lamp",
            "Statue",
            "Other"
          ]},
          { key: "material", label: "Material", type: "select", options: ["Wood","Metal","Glass","Plastic","Ceramic","Fabric","Mixed"] },
          { key: "condition", label: "Condition", type: "select", options: ["New","Used"] },
          { key: "color", label: "Color", type: "text" },
          { key: "dimensions", label: "Dimensions", type: "text" }
        ]
      },
      
      KITCHEN_DINING: {
        label: "Kitchen & Dining",
        fields: [
          { key: "itemType", label: "Item Type", type: "select", options: [
            "Cookware",
            "Pot Set",
            "Frying Pan",
            "Plate Set",
            "Cup",
            "Glass",
            "Cutlery",
            "Knife Set",
            "Food Flask",
            "Cooler",
            "Storage Container",
            "Serving Tray",
            "Dining Table Set",
            "Other"
          ]},
          { key: "material", label: "Material", type: "select", options: ["Steel","Aluminium","Plastic","Glass","Ceramic","Wood","Mixed"] },
          { key: "brand", label: "Brand", type: "text" },
          { key: "condition", label: "Condition", type: "select", options: ["New","Used"] },
          { key: "color", label: "Color", type: "text" },
          { key: "quantity", label: "Quantity", type: "number" }
        ]
      },
      
      BEDDING: {
        label: "Bedding",
        fields: [
          { key: "itemType", label: "Item Type", type: "select", options: [
            "Bedsheet",
            "Duvet",
            "Blanket",
            "Pillow",
            "Pillowcase",
            "Mattress Protector",
            "Bed Cover",
            "Comforter",
            "Foam",
            "Other"
          ]},
          { key: "size", label: "Size", type: "select", options: ["Baby","Single","Small Double","Double","Queen","King"] },
          { key: "material", label: "Material", type: "select", options: ["Cotton","Silk","Polyester","Foam","Memory Foam","Mixed"] },
          { key: "brand", label: "Brand", type: "text" },
          { key: "condition", label: "Condition", type: "select", options: ["New","Used"] },
          { key: "color", label: "Color", type: "text" }
        ]
      },
      
      LIGHTING: {
        label: "Lighting",
        fields: [
          { key: "lightType", label: "Light Type", type: "select", options: [
            "Bulb",
            "Ceiling Light",
            "Chandelier",
            "Wall Light",
            "Lamp",
            "Standing Lamp",
            "Table Lamp",
            "Flood Light",
            "Solar Light",
            "Outdoor Light",
            "LED Strip",
            "Other"
          ]},
          { key: "brand", label: "Brand", type: "text" },
          { key: "powerSource", label: "Power Source", type: "select", options: ["Electric","Battery","Solar","Rechargeable"] },
          { key: "wattage", label: "Wattage", type: "text" },
          { key: "condition", label: "Condition", type: "select", options: ["New","Used"] },
          { key: "color", label: "Color", type: "text" }
        ]
      },
      
      BATHROOM_SUPPLIES: {
        label: "Bathroom Supplies",
        fields: [
          { key: "itemType", label: "Item Type", type: "select", options: [
            "Shower",
            "Toilet Seat",
            "Wash Hand Basin",
            "Bathroom Cabinet",
            "Mirror",
            "Towel Rack",
            "Shower Curtain",
            "Bathroom Shelf",
            "Soap Dispenser",
            "Bathroom Set",
            "Other"
          ]},
          { key: "material", label: "Material", type: "select", options: ["Ceramic","Plastic","Glass","Steel","Aluminium","Mixed"] },
          { key: "brand", label: "Brand", type: "text" },
          { key: "condition", label: "Condition", type: "select", options: ["New","Used"] },
          { key: "color", label: "Color", type: "text" }
        ]
      },
      
      CLEANING_SUPPLIES: {
        label: "Cleaning Supplies",
        fields: [
          { key: "itemType", label: "Item Type", type: "select", options: [
            "Broom",
            "Mop",
            "Bucket",
            "Vacuum Cleaner",
            "Cleaning Brush",
            "Dustbin",
            "Laundry Basket",
            "Detergent",
            "Disinfectant",
            "Cleaning Kit",
            "Other"
          ]},
          { key: "brand", label: "Brand", type: "text" },
          { key: "condition", label: "Condition", type: "select", options: ["New","Used"] },
          { key: "size", label: "Size", type: "text" },
          { key: "color", label: "Color", type: "text" }
        ]
      },
      
      OUTDOOR_GARDEN: {
        label: "Outdoor & Garden",
        fields: [
          { key: "itemType", label: "Item Type", type: "select", options: [
            "Garden Chair",
            "Garden Table",
            "Umbrella",
            "Flower Pot",
            "Watering Can",
            "Hose",
            "Lawn Mower",
            "Garden Tools",
            "Outdoor Swing",
            "Fence Decor",
            "Grill",
            "Other"
          ]},
          { key: "material", label: "Material", type: "select", options: ["Plastic","Metal","Wood","Mixed"] },
          { key: "brand", label: "Brand", type: "text" },
          { key: "condition", label: "Condition", type: "select", options: ["New","Used"] },
          { key: "weatherResistant", label: "Weather Resistant", type: "select", options: ["Yes","No"] },
          { key: "color", label: "Color", type: "text" }
        ]
      },
      
      HOME_IMPROVEMENT: {
        label: "Home Improvement",
        fields: [
          { key: "itemType", label: "Item Type", type: "select", options: [
            "Paint",
            "Door",
            "Window",
            "Tiles",
            "Sink",
            "Tap",
            "Cabinet Fittings",
            "Door Lock",
            "Wall Panel",
            "Ceiling Materials",
            "Flooring",
            "Other"
          ]},
          { key: "brand", label: "Brand", type: "text" },
          { key: "material", label: "Material", type: "text" },
          { key: "condition", label: "Condition", type: "select", options: ["New","Used"] },
          { key: "dimensions", label: "Dimensions", type: "text" },
          { key: "color", label: "Color", type: "text" }
        ]
      },
      
      HOME_SECURITY: {
        label: "Home Security",
        fields: [
          { key: "deviceType", label: "Device Type", type: "select", options: [
            "Door Lock",
            "Smart Lock",
            "Padlock",
            "Alarm System",
            "Door Bell",
            "Video Doorbell",
            "Motion Sensor",
            "Smoke Detector",
            "Fire Alarm",
            "Safe Box",
            "Other"
          ]},
          { key: "brand", label: "Brand", type: "text" },
          { key: "powerSource", label: "Power Source", type: "select", options: ["Battery","Electric","Rechargeable","Manual"] },
          { key: "smartFeature", label: "Smart Feature", type: "select", options: ["Yes","No"] },
          { key: "condition", label: "Condition", type: "select", options: ["New","Used"] },
          { key: "warranty", label: "Warranty", type: "select", options: ["Yes","No"] }
        ]
      },
      
      HOME_OFFICE: {
        label: "Home Office",
        fields: [
          { key: "itemType", label: "Item Type", type: "select", options: [
            "Office Desk",
            "Office Chair",
            "Bookshelf",
            "Filing Cabinet",
            "Study Table",
            "Desk Lamp",
            "Whiteboard",
            "Office Organizer",
            "Printer Stand",
            "Other"
          ]},
          { key: "material", label: "Material", type: "select", options: ["Wood","Metal","Plastic","Glass","Mixed"] },
          { key: "brand", label: "Brand", type: "text" },
          { key: "condition", label: "Condition", type: "select", options: ["New","Used"] },
          { key: "color", label: "Color", type: "text" },
          { key: "dimensions", label: "Dimensions", type: "text" }
        ]
      },
      
      STORAGE_ORGANIZATION: {
        label: "Storage & Organization",
        fields: [
          { key: "itemType", label: "Item Type", type: "select", options: [
            "Wardrobe Organizer",
            "Storage Box",
            "Plastic Drawer",
            "Shelf Organizer",
            "Hanger",
            "Shoe Rack",
            "Kitchen Organizer",
            "Closet Storage",
            "Laundry Organizer",
            "Other"
          ]},
          { key: "material", label: "Material", type: "select", options: ["Plastic","Wood","Metal","Fabric","Mixed"] },
          { key: "condition", label: "Condition", type: "select", options: ["New","Used"] },
          { key: "color", label: "Color", type: "text" },
          { key: "dimensions", label: "Dimensions", type: "text" }
        ]
      },
      
      CURTAINS_BLINDS: {
        label: "Curtains & Blinds",
        fields: [
          { key: "itemType", label: "Item Type", type: "select", options: [
            "Curtain",
            "Window Blind",
            "Roman Blind",
            "Vertical Blind",
            "Curtain Rod",
            "Curtain Accessory",
            "Other"
          ]},
          { key: "material", label: "Material", type: "select", options: ["Cotton","Polyester","Velvet","Linen","PVC","Mixed"] },
          { key: "size", label: "Size", type: "text" },
          { key: "condition", label: "Condition", type: "select", options: ["New","Used"] },
          { key: "color", label: "Color", type: "text" },
          { key: "blackout", label: "Blackout", type: "select", options: ["Yes","No"] }
        ]
      },

      GENERATORS: {
        label: "Generators",
        fields: [
          { key: "generatorType", label: "Generator Type", type: "select", options: ["Petrol", "Diesel", "Inverter Generator", "Industrial Generator"] },
          { key: "brand", label: "Brand", type: "text" },
          { key: "model", label: "Model", type: "text" },
          { key: "capacity", label: "Capacity (kVA)", type: "text" },
          { key: "phase", label: "Phase", type: "select", options: ["Single Phase", "Three Phase"] },
          { key: "condition", label: "Condition", type: "select", options: ["New", "Foreign Used", "Local Used"] },
          { key: "fuelTankCapacity", label: "Fuel Tank Capacity", type: "text" },
          { key: "runtime", label: "Runtime (hours)", type: "text" },
          { key: "electricStart", label: "Electric Start", type: "select", options: ["Yes", "No"] },
          { key: "soundproof", label: "Soundproof", type: "select", options: ["Yes", "No"] },
          { key: "color", label: "Color", type: "text" }
        ]
      },
      
      MATTRESSES: {
        label: "Mattresses",
        fields: [
          { key: "mattressType", label: "Mattress Type", type: "select", options: [
            "Foam Mattress",
            "Spring Mattress",
            "Orthopedic Mattress",
            "Memory Foam Mattress",
            "Baby Mattress",
            "Air Mattress",
            "Other"
          ]},
          { key: "size", label: "Size", type: "select", options: ["Baby","Single","Small Double","Double","Queen","King"] },
          { key: "brand", label: "Brand", type: "text" },
          { key: "thickness", label: "Thickness", type: "text" },
          { key: "condition", label: "Condition", type: "select", options: ["New","Used"] },
          { key: "color", label: "Color", type: "text" }
        ]
      },
      
    },
  },
  
  BABY: {
    label: "Baby Store",
    subcategories: {
  
      BABY_CLOTHING: {
        label: "Baby Clothing",
        fields: [
          { key: "gender", label: "Gender", type: "select", options: ["Boy","Girl","Unisex"] },
          { key: "clothingType", label: "Clothing Type", type: "select", options: ["Onesie","Dress","T-Shirt","Shorts","Pajamas","Jacket","Sweater"] },
          { key: "size", label: "Size", type: "select", options: ["0-3 Months","3-6 Months","6-12 Months","1-2 Years","2-3 Years"] },
          { key: "brand", label: "Brand", type: "text" },
          { key: "condition", label: "Condition", type: "select", options: ["New","Used"] }
        ]
      },
  
      BABY_GEAR: {
        label: "Baby Gear",
        fields: [
          { key: "gearType", label: "Gear Type", type: "select", options: ["Stroller","Baby Carrier","Car Seat","Walker","Playpen","High Chair"] },
          { key: "brand", label: "Brand", type: "text" },
          { key: "condition", label: "Condition", type: "select", options: ["New","Used"] },
          { key: "color", label: "Color", type: "text" }
        ]
      },
  
      BABY_FEEDING: {
        label: "Baby Feeding",
        fields: [
          { key: "productType", label: "Product Type", type: "select", options: ["Baby Bottle","Feeding Chair","Breast Pump","Bottle Warmer","Baby Food Maker"] },
          { key: "brand", label: "Brand", type: "text" },
          { key: "condition", label: "Condition", type: "select", options: ["New","Used"] }
        ]
      }
  
    }
  },

  SPORTS_FITNESS: {
    label: "Sports & Fitness",
    subcategories: {
  
      GYM_EQUIPMENT: {
        label: "Gym Equipment",
        fields: [
          { key: "equipmentType", label: "Equipment Type", type: "select", options: [
            "Treadmill","Dumbbells","Bench Press","Exercise Bike","Rowing Machine","Pull-up Bar","Elliptical","Smith Machine","Cable Machine","Leg Press"
          ]},
          { key: "brand", label: "Brand", type: "text" },
          { key: "condition", label: "Condition", type: "select", options: ["New","Used","Refurbished"] },
          { key: "weightCapacity", label: "Weight Capacity", type: "text" },
          { key: "foldable", label: "Foldable", type: "select", options: ["Yes","No"] }
        ]
      },
  
      SPORTS_EQUIPMENT: {
        label: "Sports Equipment",
        fields: [
          { key: "sportType", label: "Sport Type", type: "select", options: [
            "Football","Basketball","Tennis","Boxing","Swimming","Cycling","Table Tennis","Volleyball","Badminton","Athletics"
          ]},
          { key: "itemType", label: "Item Type", type: "text" },
          { key: "brand", label: "Brand", type: "text" },
          { key: "condition", label: "Condition", type: "select", options: ["New","Used"] }
        ]
      },
  
      FITNESS_ACCESSORIES: {
        label: "Fitness Accessories",
        fields: [
          { key: "accessoryType", label: "Accessory Type", type: "select", options: [
            "Yoga Mat","Resistance Bands","Skipping Rope","Fitness Tracker","Foam Roller","Waist Trainer","Hand Grips","Ankle Weights","Gloves","Massage Ball"
          ]},
          { key: "brand", label: "Brand", type: "text" },
          { key: "condition", label: "Condition", type: "select", options: ["New","Used"] }
        ]
      },
  
      EXERCISE_MACHINES: {
        label: "Exercise Machines",
        fields: [
          { key: "machineType", label: "Machine Type", type: "select", options: [
            "Treadmill","Exercise Bike","Elliptical","Stepper","Rowing Machine","Vibration Machine","Home Gym","Air Walker"
          ]},
          { key: "brand", label: "Brand", type: "text" },
          { key: "motorPower", label: "Motor Power", type: "text" },
          { key: "condition", label: "Condition", type: "select", options: ["New","Used","Refurbished"] }
        ]
      },
  
      OUTDOOR_SPORTS: {
        label: "Outdoor Sports",
        fields: [
          { key: "sportType", label: "Sport Type", type: "select", options: [
            "Cycling","Camping","Hiking","Fishing","Running","Skating","Climbing"
          ]},
          { key: "itemType", label: "Item Type", type: "text" },
          { key: "brand", label: "Brand", type: "text" },
          { key: "condition", label: "Condition", type: "select", options: ["New","Used"] }
        ]
      },
  
      TEAM_SPORTS: {
        label: "Team Sports",
        fields: [
          { key: "sportType", label: "Sport Type", type: "select", options: [
            "Football","Basketball","Volleyball","Handball","Rugby"
          ]},
          { key: "itemType", label: "Item Type", type: "select", options: [
            "Ball","Boots","Jersey","Gloves","Goal Post","Net","Shin Guard","Training Cone","Whistle","Other"
          ]},
          { key: "brand", label: "Brand", type: "text" },
          { key: "size", label: "Size", type: "text" },
          { key: "condition", label: "Condition", type: "select", options: ["New","Used"] }
        ]
      },
  
      RACQUET_SPORTS: {
        label: "Racquet Sports",
        fields: [
          { key: "sportType", label: "Sport Type", type: "select", options: ["Tennis","Badminton","Squash","Table Tennis"] },
          { key: "itemType", label: "Item Type", type: "select", options: [
            "Racket","Ball","Shuttlecock","Net","Table Tennis Bat","Table","Bag","Grip"
          ]},
          { key: "brand", label: "Brand", type: "text" },
          { key: "condition", label: "Condition", type: "select", options: ["New","Used"] }
        ]
      },
  
      COMBAT_SPORTS: {
        label: "Combat Sports",
        fields: [
          { key: "sportType", label: "Sport Type", type: "select", options: ["Boxing","MMA","Karate","Taekwondo","Judo"] },
          { key: "itemType", label: "Item Type", type: "select", options: [
            "Gloves","Punching Bag","Head Guard","Mouth Guard","Shin Guard","Uniform","Pads","Other"
          ]},
          { key: "brand", label: "Brand", type: "text" },
          { key: "size", label: "Size", type: "text" },
          { key: "condition", label: "Condition", type: "select", options: ["New","Used"] }
        ]
      },
  
      WATER_SPORTS_SWIMMING: {
        label: "Water Sports & Swimming",
        fields: [
          { key: "itemType", label: "Item Type", type: "select", options: [
            "Swimsuit","Goggles","Swim Cap","Kickboard","Float","Life Jacket","Snorkel","Pool Accessory"
          ]},
          { key: "brand", label: "Brand", type: "text" },
          { key: "size", label: "Size", type: "text" },
          { key: "condition", label: "Condition", type: "select", options: ["New","Used"] }
        ]
      },
  
      SPORTSWEAR: {
        label: "Sportswear",
        fields: [
          { key: "wearType", label: "Wear Type", type: "select", options: [
            "Jersey","Shorts","Tracksuit","Leggings","Sports Bra","Compression Wear","Jacket","Socks"
          ]},
          { key: "gender", label: "Gender", type: "select", options: ["Male","Female","Unisex"] },
          { key: "size", label: "Size", type: "select", options: ["XS","S","M","L","XL","XXL"] },
          { key: "brand", label: "Brand", type: "text" },
          { key: "condition", label: "Condition", type: "select", options: ["New","Used"] },
          { key: "color", label: "Color", type: "text" }
        ]
      },
  
      SPORTS_SHOES: {
        label: "Sports Shoes",
        fields: [
          { key: "shoeType", label: "Shoe Type", type: "select", options: [
            "Running Shoes","Football Boots","Basketball Shoes","Training Shoes","Tennis Shoes","Hiking Boots","Cycling Shoes"
          ]},
          { key: "gender", label: "Gender", type: "select", options: ["Male","Female","Unisex"] },
          { key: "size", label: "Size", type: "text" },
          { key: "brand", label: "Brand", type: "text" },
          { key: "condition", label: "Condition", type: "select", options: ["New","Used"] },
          { key: "color", label: "Color", type: "text" }
        ]
      }
  
    }
  },

  AGRICULTURE: {
    label: "Agriculture",
    subcategories: {
  
      FARM_MACHINERY: {
        label: "Farm Machinery",
        fields: [
          { key: "machineType", label: "Machine Type", type: "select", options: [
            "Tractor","Harvester","Plough","Sprayer","Irrigation Pump","Seeder","Cultivator","Planter","Thresher","Rice Mill"
          ]},
          { key: "brand", label: "Brand", type: "text" },
          { key: "model", label: "Model", type: "text" },
          { key: "powerSource", label: "Power Source", type: "select", options: ["Diesel","Petrol","Electric","Manual"] },
          { key: "condition", label: "Condition", type: "select", options: ["New","Used","Refurbished"] },
          { key: "capacity", label: "Capacity", type: "text" }
        ]
      },
  
      FARM_TOOLS: {
        label: "Farm Tools",
        fields: [
          { key: "toolType", label: "Tool Type", type: "select", options: [
            "Hoe","Shovel","Cutlass","Wheelbarrow","Watering Can","Rake","Pruning Shears","Spade","Sickle","Axe"
          ]},
          { key: "brand", label: "Brand", type: "text" },
          { key: "material", label: "Material", type: "text" },
          { key: "condition", label: "Condition", type: "select", options: ["New","Used"] }
        ]
      },
  
      FARM_PRODUCE: {
        label: "Farm Produce",
        fields: [
          { key: "produceType", label: "Produce Type", type: "select", options: [
            "Maize","Rice","Cassava","Yam","Beans","Vegetables","Fruits","Pepper","Tomatoes","Onions","Plantain"
          ]},
          { key: "quantity", label: "Quantity", type: "text" },
          { key: "unit", label: "Unit", type: "select", options: ["Bag","Kg","Ton","Basket","Crate"] },
          { key: "organic", label: "Organic", type: "select", options: ["Yes","No"] },
          { key: "freshness", label: "Freshness", type: "select", options: ["Fresh","Dried","Processed"] }
        ]
      },
  
      SEEDS_SEEDLINGS: {
        label: "Seeds & Seedlings",
        fields: [
          { key: "seedType", label: "Seed Type", type: "select", options: [
            "Maize Seed","Rice Seed","Vegetable Seed","Fruit Seedling","Cassava Stem","Yam Seed","Pepper Seed","Tomato Seed"
          ]},
          { key: "brand", label: "Brand", type: "text" },
          { key: "variety", label: "Variety", type: "text" },
          { key: "quantity", label: "Quantity", type: "text" },
          { key: "unit", label: "Unit", type: "select", options: ["Pack","Bag","Kg","Bundle","Tray"] }
        ]
      },
  
      FERTILIZERS_SOIL_IMPROVERS: {
        label: "Fertilizers & Soil Improvers",
        fields: [
          { key: "productType", label: "Product Type", type: "select", options: ["NPK Fertilizer","Urea","Organic Fertilizer","Compost","Manure","Lime","Soil Conditioner"] },
          { key: "brand", label: "Brand", type: "text" },
          { key: "packageSize", label: "Package Size", type: "text" },
          { key: "organic", label: "Organic", type: "select", options: ["Yes","No"] },
          { key: "applicationType", label: "Application Type", type: "select", options: ["Soil","Foliar","Both"] }
        ]
      },
  
      PESTICIDES_HERBICIDES: {
        label: "Pesticides & Herbicides",
        fields: [
          { key: "productType", label: "Product Type", type: "select", options: ["Insecticide","Herbicide","Fungicide","Rodenticide","Pest Repellent"] },
          { key: "brand", label: "Brand", type: "text" },
          { key: "targetUse", label: "Target Use", type: "text" },
          { key: "packageSize", label: "Package Size", type: "text" },
          { key: "expiryDate", label: "Expiry Date", type: "date" }
        ]
      },
  
      IRRIGATION_WATERING: {
        label: "Irrigation & Watering",
        fields: [
          { key: "itemType", label: "Item Type", type: "select", options: ["Irrigation Pump","Hose","Sprinkler","Drip Kit","Water Tank","Nozzle","Watering Can"] },
          { key: "brand", label: "Brand", type: "text" },
          { key: "powerSource", label: "Power Source", type: "select", options: ["Manual","Electric","Petrol","Diesel","Solar"] },
          { key: "condition", label: "Condition", type: "select", options: ["New","Used"] }
        ]
      },
  
      ANIMAL_FEED_SUPPLEMENTS: {
        label: "Animal Feed & Supplements",
        fields: [
          { key: "feedType", label: "Feed Type", type: "select", options: ["Poultry Feed","Fish Feed","Pig Feed","Cattle Feed","Dog Feed","Supplements","Premix"] },
          { key: "brand", label: "Brand", type: "text" },
          { key: "packageSize", label: "Package Size", type: "text" },
          { key: "animalType", label: "Animal Type", type: "select", options: ["Poultry","Fish","Pig","Cattle","Goat","Sheep","Dog","Cat"] },
          { key: "expiryDate", label: "Expiry Date", type: "date" }
        ]
      },
  
      POULTRY_FISHING_EQUIPMENT: {
        label: "Poultry & Fishing Equipment",
        fields: [
          { key: "equipmentType", label: "Equipment Type", type: "select", options: [
            "Brooder","Feeder","Drinker","Incubator","Fish Net","Fish Tank","Pond Liner","Aerator","Cage","Other"
          ]},
          { key: "brand", label: "Brand", type: "text" },
          { key: "condition", label: "Condition", type: "select", options: ["New","Used"] },
          { key: "capacity", label: "Capacity", type: "text" }
        ]
      },
  
      LIVESTOCK_AGRIC_ANIMALS: {
        label: "Livestock & Agricultural Animals",
        fields: [
          { key: "animalType", label: "Animal Type", type: "select", options: ["Goat","Sheep","Cow","Pig","Rabbit","Chicken","Turkey","Duck","Fish"] },
          { key: "breed", label: "Breed", type: "text" },
          { key: "age", label: "Age", type: "text" },
          { key: "gender", label: "Gender", type: "select", options: ["Male","Female"] },
          { key: "quantity", label: "Quantity", type: "number" },
          { key: "vaccinated", label: "Vaccinated", type: "select", options: ["Yes","No"] }
        ]
      },
  
      STORAGE_PROCESSING: {
        label: "Storage & Processing",
        fields: [
          { key: "itemType", label: "Item Type", type: "select", options: [
            "Silo","Storage Drum","Crate","Grinding Machine","Peeling Machine","Dryer","Processing Machine","Cold Storage"
          ]},
          { key: "brand", label: "Brand", type: "text" },
          { key: "powerSource", label: "Power Source", type: "select", options: ["Manual","Electric","Diesel","Petrol"] },
          { key: "condition", label: "Condition", type: "select", options: ["New","Used","Refurbished"] }
        ]
      }
  
    }
  },
  
  FOOD: {
    label: "Food & Groceries",
    subcategories: {
  
      CEREALS_GRAINS: {
        label: "Cereals & Grains",
        fields: [
          { key: "productType", label: "Product Type", type: "select", options: ["Rice","Wheat","Oats","Millet","Sorghum","Cornflakes","Barley","Semolina"] },
          { key: "brand", label: "Brand", type: "text" },
          { key: "packageSize", label: "Package Size", type: "text" },
          { key: "grainType", label: "Grain Type", type: "select", options: ["Whole","Refined","Fortified"] },
          { key: "organic", label: "Organic", type: "select", options: ["Yes","No"] },
          { key: "expiryDate", label: "Expiry Date", type: "date" }
        ]
      },
  
      PACKAGED_FOODS: {
        label: "Packaged Foods",
        fields: [
          { key: "foodType", label: "Food Type", type: "select", options: ["Noodles","Biscuits","Snacks","Canned Food","Instant Meals","Pasta","Breakfast Meals"] },
          { key: "brand", label: "Brand", type: "text" },
          { key: "flavor", label: "Flavor", type: "text" },
          { key: "packageSize", label: "Package Size", type: "text" },
          { key: "expiryDate", label: "Expiry Date", type: "date" }
        ]
      },
  
      BEVERAGES: {
        label: "Beverages",
        fields: [
          { key: "drinkType", label: "Drink Type", type: "select", options: ["Soft Drink","Juice","Tea","Coffee","Energy Drink","Malt","Water","Milk Drink"] },
          { key: "brand", label: "Brand", type: "text" },
          { key: "volume", label: "Volume", type: "text" },
          { key: "packType", label: "Pack Type", type: "select", options: ["Bottle","Can","Sachet","Carton"] },
          { key: "expiryDate", label: "Expiry Date", type: "date" }
        ]
      },
  
      FRESH_FOOD: {
        label: "Fresh Food",
        fields: [
          { key: "foodType", label: "Food Type", type: "select", options: ["Vegetables","Fruits","Meat","Fish","Poultry"] },
          { key: "category", label: "Category", type: "text" },
          { key: "quantity", label: "Quantity", type: "text" },
          { key: "unit", label: "Unit", type: "select", options: ["Kg","Bag","Basket","Piece"] },
          { key: "organic", label: "Organic", type: "select", options: ["Yes","No"] }
        ]
      },
  
      MEAT_SEAFOOD: {
        label: "Meat & Seafood",
        fields: [
          { key: "type", label: "Type", type: "select", options: ["Beef","Chicken","Turkey","Goat Meat","Fish","Shrimp","Crab","Snail"] },
          { key: "cutType", label: "Cut Type", type: "text" },
          { key: "freshOrFrozen", label: "Fresh or Frozen", type: "select", options: ["Fresh","Frozen"] },
          { key: "quantity", label: "Quantity", type: "text" },
          { key: "unit", label: "Unit", type: "select", options: ["Kg","Piece","Pack"] }
        ]
      },
  
      DAIRY_PRODUCTS: {
        label: "Dairy Products",
        fields: [
          { key: "productType", label: "Product Type", type: "select", options: ["Milk","Yogurt","Cheese","Butter","Cream"] },
          { key: "brand", label: "Brand", type: "text" },
          { key: "fatContent", label: "Fat Content", type: "select", options: ["Full Cream","Low Fat","Skimmed"] },
          { key: "packageSize", label: "Package Size", type: "text" },
          { key: "expiryDate", label: "Expiry Date", type: "date" }
        ]
      },
  
      BAKERY: {
        label: "Bakery",
        fields: [
          { key: "productType", label: "Product Type", type: "select", options: ["Bread","Cake","Pastries","Doughnuts","Cookies"] },
          { key: "flavor", label: "Flavor", type: "text" },
          { key: "freshOrPackaged", label: "Fresh or Packaged", type: "select", options: ["Fresh","Packaged"] },
          { key: "quantity", label: "Quantity", type: "number" },
          { key: "expiryDate", label: "Expiry Date", type: "date" }
        ]
      },
  
      COOKING_INGREDIENTS: {
        label: "Cooking Ingredients",
        fields: [
          { key: "ingredientType", label: "Ingredient Type", type: "select", options: ["Flour","Sugar","Salt","Spices","Seasoning","Baking Powder","Yeast","Palm Oil","Vegetable Oil"] },
          { key: "brand", label: "Brand", type: "text" },
          { key: "packageSize", label: "Package Size", type: "text" },
          { key: "organic", label: "Organic", type: "select", options: ["Yes","No"] },
          { key: "expiryDate", label: "Expiry Date", type: "date" }
        ]
      },
  
      FROZEN_FOODS: {
        label: "Frozen Foods",
        fields: [
          { key: "foodType", label: "Food Type", type: "select", options: ["Frozen Chicken","Frozen Fish","Frozen Snacks","Frozen Vegetables","Frozen Meals"] },
          { key: "brand", label: "Brand", type: "text" },
          { key: "storage", label: "Storage Requirement", type: "select", options: ["Frozen","Chilled"] },
          { key: "packageSize", label: "Package Size", type: "text" },
          { key: "expiryDate", label: "Expiry Date", type: "date" }
        ]
      },
  
      BABY_FOOD: {
        label: "Baby Food",
        fields: [
          { key: "productType", label: "Product Type", type: "select", options: ["Baby Cereal","Formula","Puree","Snacks"] },
          { key: "ageRange", label: "Age Range", type: "select", options: ["0-6 Months","6-12 Months","1-3 Years"] },
          { key: "brand", label: "Brand", type: "text" },
          { key: "packageSize", label: "Package Size", type: "text" },
          { key: "expiryDate", label: "Expiry Date", type: "date" }
        ]
      },
  
      CONDIMENTS_SAUCES: {
        label: "Condiments & Sauces",
        fields: [
          { key: "productType", label: "Product Type", type: "select", options: ["Ketchup","Mayonnaise","Salad Cream","Hot Sauce","Soy Sauce","Pepper Sauce"] },
          { key: "brand", label: "Brand", type: "text" },
          { key: "spicyLevel", label: "Spicy Level", type: "select", options: ["Mild","Medium","Hot"] },
          { key: "packageSize", label: "Package Size", type: "text" },
          { key: "expiryDate", label: "Expiry Date", type: "date" }
        ]
      },
  
      SWEETS_CONFECTIONERY: {
        label: "Sweets & Confectionery",
        fields: [
          { key: "productType", label: "Product Type", type: "select", options: ["Chocolate","Candy","Gum","Toffee","Marshmallow"] },
          { key: "brand", label: "Brand", type: "text" },
          { key: "flavor", label: "Flavor", type: "text" },
          { key: "packageSize", label: "Package Size", type: "text" },
          { key: "expiryDate", label: "Expiry Date", type: "date" }
        ]
      },
  
      BULK_FOOD_SUPPLIES: {
        label: "Bulk Food Supplies",
        fields: [
          { key: "productType", label: "Product Type", type: "select", options: ["Rice","Beans","Garri","Flour","Sugar","Oil"] },
          { key: "quantity", label: "Quantity", type: "text" },
          { key: "unit", label: "Unit", type: "select", options: ["Bag","Ton","Kg"] },
          { key: "wholesale", label: "Wholesale", type: "select", options: ["Yes","No"] }
        ]
      }
  
    }
  },

  PETS_ANIMALS: {
    label: "Pets & Animals",
    subcategories: {
  
      DOGS: {
        label: "Dogs",
        fields: [
          { key: "breed", label: "Breed", type: "text" },
          { key: "age", label: "Age", type: "text" },
          { key: "gender", label: "Gender", type: "select", options: ["Male","Female"] },
          { key: "vaccinated", label: "Vaccinated", type: "select", options: ["Yes","No"] },
          { key: "dewormed", label: "Dewormed", type: "select", options: ["Yes","No"] },
          { key: "trained", label: "Trained", type: "select", options: ["Yes","No"] },
          { key: "registered", label: "Registered", type: "select", options: ["Yes","No"] },
          { key: "healthStatus", label: "Health Status", type: "select", options: ["Healthy","Special Needs","Under Treatment"] },
          { key: "color", label: "Color", type: "text" },
          { key: "size", label: "Size", type: "select", options: ["Small","Medium","Large"] }
        ]
      },
  
      CATS: {
        label: "Cats",
        fields: [
          { key: "breed", label: "Breed", type: "text" },
          { key: "age", label: "Age", type: "text" },
          { key: "gender", label: "Gender", type: "select", options: ["Male","Female"] },
          { key: "vaccinated", label: "Vaccinated", type: "select", options: ["Yes","No"] },
          { key: "dewormed", label: "Dewormed", type: "select", options: ["Yes","No"] },
          { key: "litterTrained", label: "Litter Trained", type: "select", options: ["Yes","No"] },
          { key: "healthStatus", label: "Health Status", type: "select", options: ["Healthy","Special Needs","Under Treatment"] },
          { key: "color", label: "Color", type: "text" }
        ]
      },
  
      BIRDS: {
        label: "Birds",
        fields: [
          { key: "birdType", label: "Bird Type", type: "select", options: ["Parrot","Canary","Pigeon","Lovebird","Chicken","Turkey","Duck","Other"] },
          { key: "breed", label: "Breed", type: "text" },
          { key: "age", label: "Age", type: "text" },
          { key: "gender", label: "Gender", type: "select", options: ["Male","Female","Unknown"] },
          { key: "vaccinated", label: "Vaccinated", type: "select", options: ["Yes","No"] },
          { key: "color", label: "Color", type: "text" }
        ]
      },
  
      FISH_AQUATICS: {
        label: "Fish & Aquatics",
        fields: [
          { key: "aquaticType", label: "Aquatic Type", type: "select", options: ["Goldfish","Koi","Catfish","Tilapia","Aquarium Fish","Shrimp","Snail","Other"] },
          { key: "breed", label: "Breed/Species", type: "text" },
          { key: "size", label: "Size", type: "text" },
          { key: "waterType", label: "Water Type", type: "select", options: ["Freshwater","Saltwater"] },
          { key: "quantity", label: "Quantity", type: "number" }
        ]
      },
  
      RABBITS_SMALL_PETS: {
        label: "Rabbits & Small Pets",
        fields: [
          { key: "petType", label: "Pet Type", type: "select", options: ["Rabbit","Hamster","Guinea Pig","Ferret","Other"] },
          { key: "breed", label: "Breed", type: "text" },
          { key: "age", label: "Age", type: "text" },
          { key: "gender", label: "Gender", type: "select", options: ["Male","Female"] },
          { key: "vaccinated", label: "Vaccinated", type: "select", options: ["Yes","No"] },
          { key: "color", label: "Color", type: "text" }
        ]
      },
  
      LIVESTOCK: {
        label: "Livestock",
        fields: [
          { key: "animalType", label: "Animal Type", type: "select", options: ["Goat","Sheep","Cow","Pig","Ram","Other"] },
          { key: "breed", label: "Breed", type: "text" },
          { key: "age", label: "Age", type: "text" },
          { key: "gender", label: "Gender", type: "select", options: ["Male","Female"] },
          { key: "weight", label: "Weight", type: "text" },
          { key: "healthStatus", label: "Health Status", type: "select", options: ["Healthy","Under Treatment"] }
        ]
      },
  
      PET_FOOD: {
        label: "Pet Food",
        fields: [
          { key: "foodType", label: "Food Type", type: "select", options: ["Dog Food","Cat Food","Bird Feed","Fish Food","Rabbit Feed","Livestock Feed"] },
          { key: "brand", label: "Brand", type: "text" },
          { key: "packageSize", label: "Package Size", type: "text" },
          { key: "lifeStage", label: "Life Stage", type: "select", options: ["Baby","Adult","Senior","All Stages"] },
          { key: "expiryDate", label: "Expiry Date", type: "date" }
        ]
      },
  
      PET_ACCESSORIES: {
        label: "Pet Accessories",
        fields: [
          { key: "accessoryType", label: "Accessory Type", type: "select", options: [
            "Cage",
            "Collar",
            "Leash",
            "Harness",
            "Aquarium",
            "Pet Bed",
            "Pet Bowl",
            "Pet Carrier",
            "Litter Box",
            "Scratching Post",
            "Toy",
            "Grooming Kit"
          ]},
          { key: "brand", label: "Brand", type: "text" },
          { key: "material", label: "Material", type: "text" },
          { key: "condition", label: "Condition", type: "select", options: ["New","Used"] },
          { key: "size", label: "Size", type: "text" }
        ]
      },
  
      PET_HEALTH_GROOMING: {
        label: "Pet Health & Grooming",
        fields: [
          { key: "productType", label: "Product Type", type: "select", options: [
            "Shampoo",
            "Soap",
            "Tick Treatment",
            "Flea Treatment",
            "Supplements",
            "Vitamins",
            "Nail Clipper",
            "Brush",
            "Tooth Care",
            "Other"
          ]},
          { key: "brand", label: "Brand", type: "text" },
          { key: "animalType", label: "Animal Type", type: "select", options: ["Dog","Cat","Bird","Fish","Rabbit","All"] },
          { key: "expiryDate", label: "Expiry Date", type: "date" },
          { key: "condition", label: "Condition", type: "select", options: ["New"] }
        ]
      }
  
    }
  },

  TOYS_GAMES: {
    label: "Toys & Games",
    subcategories: {
  
      KIDS_TOYS: {
        label: "Kids Toys",
        fields: [
          { key: "toyType", label: "Toy Type", type: "select", options: [
            "Educational Toy",
            "Building Blocks",
            "Action Figure",
            "Puzzle",
            "Doll",
            "Stuffed Toy",
            "Musical Toy",
            "Interactive Toy",
            "Learning Toy",
            "Montessori Toy"
          ]},
          { key: "ageGroup", label: "Age Group", type: "select", options: ["0-2","3-5","6-9","10+"] },
          { key: "brand", label: "Brand", type: "text" },
          { key: "material", label: "Material", type: "select", options: ["Plastic","Wood","Fabric","Rubber","Mixed"] },
          { key: "batteryRequired", label: "Battery Required", type: "select", options: ["Yes","No"] },
          { key: "condition", label: "Condition", type: "select", options: ["New","Used"] }
        ]
      },
  
      BOARD_GAMES: {
        label: "Board Games",
        fields: [
          { key: "gameType", label: "Game Type", type: "select", options: [
            "Chess",
            "Ludo",
            "Monopoly",
            "Scrabble",
            "Puzzle Game",
            "Strategy Game",
            "Card Game",
            "Trivia Game",
            "Family Game"
          ]},
          { key: "players", label: "Number of Players", type: "text" },
          { key: "ageGroup", label: "Age Group", type: "select", options: ["Kids","Teens","Adults","All Ages"] },
          { key: "brand", label: "Brand", type: "text" },
          { key: "condition", label: "Condition", type: "select", options: ["New","Used"] }
        ]
      },
  
      EDUCATIONAL_STEM_TOYS: {
        label: "Educational & STEM Toys",
        fields: [
          { key: "toyType", label: "Toy Type", type: "select", options: [
            "Science Kit",
            "Math Learning Kit",
            "Coding Toy",
            "Robotics Kit",
            "Engineering Kit",
            "Electronics Kit",
            "Language Learning Toy",
            "Flash Cards",
            "Abacus"
          ]},
          { key: "ageGroup", label: "Age Group", type: "select", options: ["3-5","6-9","10+","Teens"] },
          { key: "skillFocus", label: "Skill Focus", type: "select", options: ["STEM","Creativity","Logic","Language","Motor Skills"] },
          { key: "brand", label: "Brand", type: "text" },
          { key: "condition", label: "Condition", type: "select", options: ["New","Used"] }
        ]
      },
  
      ELECTRONIC_TOYS: {
        label: "Electronic Toys",
        fields: [
          { key: "toyType", label: "Toy Type", type: "select", options: [
            "Remote Control Toy",
            "Interactive Toy",
            "Robot Toy",
            "Talking Toy",
            "Gaming Toy",
            "Educational Tablet",
            "Mini Console"
          ]},
          { key: "powerSource", label: "Power Source", type: "select", options: ["Battery","Rechargeable","Electric"] },
          { key: "brand", label: "Brand", type: "text" },
          { key: "batteryIncluded", label: "Battery Included", type: "select", options: ["Yes","No"] },
          { key: "condition", label: "Condition", type: "select", options: ["New","Used","Refurbished"] }
        ]
      },
  
      OUTDOOR_PLAY: {
        label: "Outdoor Play",
        fields: [
          { key: "itemType", label: "Item Type", type: "select", options: [
            "Bicycle",
            "Tricycle",
            "Scooter",
            "Skateboard",
            "Swing",
            "Slide",
            "Playhouse",
            "Inflatable Bouncer",
            "Ball",
            "Water Toy",
            "Ride-on Toy"
          ]},
          { key: "ageGroup", label: "Age Group", type: "select", options: ["0-2","3-5","6-9","10+"] },
          { key: "material", label: "Material", type: "select", options: ["Plastic","Metal","Wood","Rubber","Mixed"] },
          { key: "condition", label: "Condition", type: "select", options: ["New","Used"] }
        ]
      },
  
      RC_TOYS: {
        label: "RC (Remote Control) Toys",
        fields: [
          { key: "rcType", label: "RC Type", type: "select", options: [
            "RC Car",
            "RC Truck",
            "RC Boat",
            "RC Drone",
            "RC Helicopter",
            "RC Bike"
          ]},
          { key: "controlRange", label: "Control Range", type: "text" },
          { key: "batteryLife", label: "Battery Life", type: "text" },
          { key: "brand", label: "Brand", type: "text" },
          { key: "condition", label: "Condition", type: "select", options: ["New","Used","Refurbished"] }
        ]
      },
  
      PUZZLES_BRAIN_GAMES: {
        label: "Puzzles & Brain Games",
        fields: [
          { key: "puzzleType", label: "Puzzle Type", type: "select", options: [
            "Jigsaw Puzzle",
            "3D Puzzle",
            "Rubik's Cube",
            "Logic Puzzle",
            "Brain Teaser"
          ]},
          { key: "difficulty", label: "Difficulty Level", type: "select", options: ["Easy","Medium","Hard","Expert"] },
          { key: "pieces", label: "Number of Pieces", type: "number" },
          { key: "ageGroup", label: "Age Group", type: "select", options: ["Kids","Teens","Adults"] },
          { key: "condition", label: "Condition", type: "select", options: ["New","Used"] }
        ]
      },
  
      VIDEO_GAMES_ACCESSORIES: {
        label: "Video Games & Accessories",
        fields: [
          { key: "itemType", label: "Item Type", type: "select", options: [
            "Game Disc",
            "Game Cartridge",
            "Controller",
            "Gaming Accessory",
            "VR Headset",
            "Gaming Chair"
          ]},
          { key: "platform", label: "Platform", type: "select", options: ["PlayStation","Xbox","Nintendo","PC","Mobile","Other"] },
          { key: "genre", label: "Genre", type: "select", options: ["Action","Sports","Adventure","Racing","Fighting","Simulation"] },
          { key: "condition", label: "Condition", type: "select", options: ["New","Used"] }
        ]
      },
  
      COLLECTIBLES_HOBBIES: {
        label: "Collectibles & Hobbies",
        fields: [
          { key: "itemType", label: "Item Type", type: "select", options: [
            "Action Figures",
            "Model Kits",
            "Trading Cards",
            "Miniatures",
            "Comics",
            "Collector Toys",
            "DIY Kits",
            "Craft Kits"
          ]},
          { key: "brand", label: "Brand", type: "text" },
          { key: "ageGroup", label: "Age Group", type: "select", options: ["Kids","Teens","Adults"] },
          { key: "condition", label: "Condition", type: "select", options: ["New","Used"] },
          { key: "limitedEdition", label: "Limited Edition", type: "select", options: ["Yes","No"] }
        ]
      },
  
      PARTY_GAMES: {
        label: "Party & Group Games",
        fields: [
          { key: "gameType", label: "Game Type", type: "select", options: [
            "Card Game",
            "Drinking Game (Non-alcohol focus)",
            "Trivia Game",
            "Charades",
            "Truth or Dare (Non-adult)",
            "Family Party Game"
          ]},
          { key: "players", label: "Number of Players", type: "text" },
          { key: "ageGroup", label: "Age Group", type: "select", options: ["Teens","Adults","All Ages"] },
          { key: "condition", label: "Condition", type: "select", options: ["New","Used"] }
        ]
      }
  
    }
  },
  
  FASHION: {
    label: "Fashion",
    subcategories: {

      WATCHES: {
        label: "Watches",
        fields: [
          { key: "brand", label: "Brand", type: "text" },
          { key: "model", label: "Model", type: "text" },
          { key: "gender", label: "Gender", type: "select", options: ["Men","Women","Unisex"] },
          { key: "condition", label: "Condition", type: "select", options: ["New", "foreign Used", "Local Used"] },
          { key: "strapMaterial", label: "Strap Material", type: "select", options: ["Leather","Rubber","Steel","Fabric"] },
          { key: "displayType", label: "Display Type", type: "select", options: ["Analog","Digital","Smartwatch"] },
          { key: "movement", label: "Movement", type: "select", options: ["Quartz","Automatic","Mechanical"] },
          { key: "color", label: "Color", type: "text" },
          { key: "waterResistant", label: "Water Resistant", type: "select", options: ["Yes","No"] },
        ],
      },

      CLOTHING: {
        label: "Clothing",
        fields: [
          { key: "gender", label: "Gender", type: "select", options: ["Men","Women","Unisex","Kids"] },
          { key: "clothingType", label: "Clothing Type", type: "select", options: [
            "T-Shirt","Shirt","Polo","Hoodie","Sweater","Jacket","Coat",
            "Jeans","Trousers","Shorts","Skirt","Dress",
            "Suit","Blazer","Native Wear","Sportswear","Underwear","Sleepwear","Other"
          ]},
          { key: "brand", label: "Brand", type: "text" },
          { key: "size", label: "Size", type: "select", options: ["XS","S","M","L","XL","XXL","XXXL"] },
          { key: "material", label: "Material", type: "text" },
          { key: "color", label: "Color", type: "text" },
          { key: "condition", label: "Condition", type: "select", options: ["New","Used"] },
          { key: "pattern", label: "Pattern", type: "select", options: ["Plain","Striped","Printed","Checked","Other"] },
          { key: "sleeveLength", label: "Sleeve Length", type: "select", options: ["Short Sleeve","Long Sleeve","Sleeveless"] },
        ],
      },

      FOOTWEAR: {
        label: "Footwear",
        fields: [
          { key: "gender", label: "Gender", type: "select", options: ["Men","Women","Unisex","Kids"] },
          { key: "footwearType", label: "Footwear Type", type: "select", options: [
            "Sneakers","Running Shoes","Boots","Sandals","Slippers","Heels",
            "Loafers","Flat Shoes","Work Shoes","Sports Shoes","Other"
          ]},
          { key: "brand", label: "Brand", type: "text" },
          { key: "size", label: "Size", type: "text" },
          { key: "material", label: "Material", type: "text" },
          { key: "color", label: "Color", type: "text" },
          { key: "condition", label: "Condition", type: "select", options: ["New","Used"] },
        ],
      },

      BAGS: {
        label: "Bags",
        fields: [
          { key: "bagType", label: "Bag Type", type: "select", options: [
            "Handbag","Backpack","Travel Bag","Laptop Bag","School Bag",
            "Wallet Bag","Clutch","Duffel Bag","Messenger Bag"
          ]},
          { key: "gender", label: "Gender", type: "select", options: ["Men","Women","Unisex"] },
          { key: "brand", label: "Brand", type: "text" },
          { key: "material", label: "Material", type: "select", options: ["Leather","Canvas","Fabric","Nylon","Synthetic"] },
          { key: "color", label: "Color", type: "text" },
          { key: "condition", label: "Condition", type: "select", options: ["New","Used"] },
        ],
      },

      JEWELRY: {
        label: "Jewelry",
        fields: [
          { key: "jewelryType", label: "Jewelry Type", type: "select", options: [
            "Chain","Necklace","Bracelet","Ring","Earrings","Anklet","Pendant"
          ]},
          { key: "gender", label: "Gender", type: "select", options: ["Men","Women","Unisex"] },
          { key: "material", label: "Material", type: "select", options: ["Gold","Silver","Diamond","Stainless Steel","Other"] },
          { key: "brand", label: "Brand", type: "text" },
          { key: "color", label: "Color", type: "text" },
          { key: "condition", label: "Condition", type: "select", options: ["New","Used"] },
        ],
      },

      HATS_CAPS: {
        label: "Hats & Caps",
        fields: [
          { key: "hatType", label: "Type", type: "select", options: [
            "Baseball Cap","Snapback","Beanie","Bucket Hat","Fedora","Sun Hat","Other"
          ]},
          { key: "gender", label: "Gender", type: "select", options: ["Men","Women","Unisex"] },
          { key: "brand", label: "Brand", type: "text" },
          { key: "material", label: "Material", type: "text" },
          { key: "color", label: "Color", type: "text" },
          { key: "condition", label: "Condition", type: "select", options: ["New","Used"] },
        ],
      },

      SUNGLASSES: {
        label: "Sunglasses",
        fields: [
          { key: "gender", label: "Gender", type: "select", options: ["Men","Women","Unisex"] },
          { key: "frameType", label: "Frame Type", type: "select", options: [
            "Aviator","Round","Square","Cat Eye","Sport","Oversized"
          ]},
          { key: "brand", label: "Brand", type: "text" },
          { key: "lensColor", label: "Lens Color", type: "text" },
          { key: "frameMaterial", label: "Frame Material", type: "text" },
          { key: "condition", label: "Condition", type: "select", options: ["New","Used"] },
        ],
      },

      BELTS: {
        label: "Belts",
        fields: [
          { key: "gender", label: "Gender", type: "select", options: ["Men","Women","Unisex"] },
          { key: "beltType", label: "Belt Type", type: "select", options: ["Leather Belt","Casual Belt","Designer Belt"] },
          { key: "brand", label: "Brand", type: "text" },
          { key: "material", label: "Material", type: "text" },
          { key: "color", label: "Color", type: "text" },
          { key: "condition", label: "Condition", type: "select", options: ["New","Used"] },
        ],
      },

      WALLETS: {
        label: "Wallets",
        fields: [
          { key: "walletType", label: "Wallet Type", type: "select", options: [
            "Leather Wallet","Card Holder","Travel Wallet","Clutch Wallet"
          ]},
          { key: "gender", label: "Gender", type: "select", options: ["Men","Women","Unisex"] },
          { key: "brand", label: "Brand", type: "text" },
          { key: "material", label: "Material", type: "text" },
          { key: "color", label: "Color", type: "text" },
          { key: "condition", label: "Condition", type: "select", options: ["New","Used"] },
        ],
      },
    },
  },

  MEN_FASHION: {
    label: "Men Fashion",
    subcategories: {
  
      CLOTHING: {
        label: "Clothing",
        fields: [
          { key: "clothingType", label: "Clothing Type", type: "select", options: ["Shirts","T-Shirts","Jeans","Trousers","Shorts","Suits","Jackets","Hoodies","Native Wear"] },
          { key: "size", label: "Size", type: "select", options: ["XS","S","M","L","XL","XXL"] },
          { key: "brand", label: "Brand", type: "text" },
          { key: "material", label: "Material", type: "select", options: ["Cotton","Denim","Leather","Polyester","Wool"] },
          { key: "condition", label: "Condition", type: "select", options: ["New","Used"] },
          { key: "color", label: "Color", type: "text" }
        ]
      },
  
      SHOES: {
        label: "Shoes",
        fields: [
          { key: "shoeType", label: "Shoe Type", type: "select", options: ["Sneakers","Formal Shoes","Boots","Sandals","Slippers","Loafers"] },
          { key: "size", label: "Size", type: "number" },
          { key: "brand", label: "Brand", type: "text" },
          { key: "material", label: "Material", type: "select", options: ["Leather","Rubber","Canvas","Synthetic"] },
          { key: "condition", label: "Condition", type: "select", options: ["New","Used"] },
          { key: "color", label: "Color", type: "text" }
        ]
      },
  
      BAGS: {
        label: "Bags",
        fields: [
          { key: "bagType", label: "Bag Type", type: "select", options: ["Backpack","Laptop Bag","Travel Bag","Briefcase","Crossbody"] },
          { key: "brand", label: "Brand", type: "text" },
          { key: "material", label: "Material", type: "select", options: ["Leather","Fabric","Synthetic"] },
          { key: "condition", label: "Condition", type: "select", options: ["New","Used"] },
          { key: "color", label: "Color", type: "text" }
        ]
      },
  
      WATCHES: {
        label: "Watches",
        fields: [
          { key: "watchType", label: "Watch Type", type: "select", options: ["Analog","Digital","Smartwatch"] },
          { key: "brand", label: "Brand", type: "text" },
          { key: "strapMaterial", label: "Strap Material", type: "select", options: ["Leather","Metal","Rubber"] },
          { key: "condition", label: "Condition", type: "select", options: ["New","Used"] },
          { key: "waterResistant", label: "Water Resistant", type: "select", options: ["Yes","No"] }
        ]
      },
  
      JEWELRY: {
        label: "Jewelry",
        fields: [
          { key: "jewelryType", label: "Jewelry Type", type: "select", options: ["Necklace","Bracelet","Ring","Chain","Cufflinks"] },
          { key: "material", label: "Material", type: "select", options: ["Gold","Silver","Diamond","Steel","Beads"] },
          { key: "condition", label: "Condition", type: "select", options: ["New","Used"] }
        ]
      },
  
      SUNGLASSES: {
        label: "Sunglasses",
        fields: [
          { key: "brand", label: "Brand", type: "text" },
          { key: "frameType", label: "Frame Type", type: "select", options: ["Full Rim","Half Rim","Rimless"] },
          { key: "lensType", label: "Lens Type", type: "select", options: ["Polarized","UV Protection","Standard"] },
          { key: "condition", label: "Condition", type: "select", options: ["New","Used"] }
        ]
      }
  
    }
  },

  WOMEN_FASHION: {
    label: "Women Fashion",
    subcategories: {
  
      CLOTHING: {
        label: "Clothing",
        fields: [
          { key: "clothingType", label: "Clothing Type", type: "select", options: ["Dresses","Tops","Jeans","Skirts","Leggings","Jumpsuits","Blazers","Native Wear"] },
          { key: "size", label: "Size", type: "select", options: ["XS","S","M","L","XL","XXL"] },
          { key: "brand", label: "Brand", type: "text" },
          { key: "material", label: "Material", type: "select", options: ["Cotton","Silk","Denim","Lace","Polyester"] },
          { key: "condition", label: "Condition", type: "select", options: ["New","Used"] },
          { key: "color", label: "Color", type: "text" }
        ]
      },
  
      SHOES: {
        label: "Shoes",
        fields: [
          { key: "shoeType", label: "Shoe Type", type: "select", options: ["Heels","Flats","Sneakers","Boots","Sandals","Slippers"] },
          { key: "size", label: "Size", type: "number" },
          { key: "brand", label: "Brand", type: "text" },
          { key: "material", label: "Material", type: "select", options: ["Leather","Rubber","Canvas","Synthetic"] },
          { key: "condition", label: "Condition", type: "select", options: ["New","Used"] },
          { key: "color", label: "Color", type: "text" }
        ]
      },
  
      BAGS: {
        label: "Bags",
        fields: [
          { key: "bagType", label: "Bag Type", type: "select", options: ["Handbag","Clutch","Backpack","Tote","Crossbody"] },
          { key: "brand", label: "Brand", type: "text" },
          { key: "material", label: "Material", type: "select", options: ["Leather","Fabric","Synthetic"] },
          { key: "condition", label: "Condition", type: "select", options: ["New","Used"] },
          { key: "color", label: "Color", type: "text" }
        ]
      },
  
      WATCHES: {
        label: "Watches",
        fields: [
          { key: "watchType", label: "Watch Type", type: "select", options: ["Analog","Digital","Smartwatch"] },
          { key: "brand", label: "Brand", type: "text" },
          { key: "strapMaterial", label: "Strap Material", type: "select", options: ["Leather","Metal","Rubber"] },
          { key: "condition", label: "Condition", type: "select", options: ["New","Used"] }
        ]
      },
  
      JEWELRY: {
        label: "Jewelry",
        fields: [
          { key: "jewelryType", label: "Jewelry Type", type: "select", options: ["Earrings","Necklace","Bracelet","Ring","Anklet"] },
          { key: "material", label: "Material", type: "select", options: ["Gold","Silver","Diamond","Beads","Pearls"] },
          { key: "condition", label: "Condition", type: "select", options: ["New","Used"] }
        ]
      },
  
      SUNGLASSES: {
        label: "Sunglasses",
        fields: [
          { key: "brand", label: "Brand", type: "text" },
          { key: "frameType", label: "Frame Type", type: "select", options: ["Cat Eye","Oversized","Aviator","Round"] },
          { key: "lensType", label: "Lens Type", type: "select", options: ["Polarized","UV Protection"] },
          { key: "condition", label: "Condition", type: "select", options: ["New","Used"] }
        ]
      }
  
    }
  },

  BEAUTY_PERSONAL_CARE: {
    label: "Beauty & Personal Care",
    subcategories: {
  
      SKINCARE: {
        label: "Skincare",
        fields: [
          { key: "productType", label: "Product Type", type: "select", options: [
            "Face Cleanser","Face Wash","Face Scrub","Face Mask","Moisturizer","Serum",
            "Toner","Sunscreen","Eye Cream","Body Lotion","Body Butter","Body Scrub"
          ]},
          { key: "skinType", label: "Skin Type", type: "select", options: ["Normal","Oily","Dry","Combination","Sensitive"] },
          { key: "brand", label: "Brand", type: "text" },
          { key: "ingredients", label: "Key Ingredients", type: "text" },
          { key: "concern", label: "Skin Concern", type: "select", options: ["Acne","Dark Spots","Anti-aging","Hydration","Brightening"] },
          { key: "spf", label: "SPF", type: "number" },
          { key: "size", label: "Size (ml)", type: "number" },
          { key: "organic", label: "Organic/Natural", type: "select", options: ["Yes","No"] },
          { key: "condition", label: "Condition", type: "select", options: ["New"] }
        ]
      },
      
      HAIR_PRODUCTS: {
        label: "Hair Products",
        fields: [
          { key: "productType", label: "Product Type", type: "select", options: [
            "Shampoo","Conditioner","Hair Oil","Hair Cream","Hair Gel","Hair Spray",
            "Hair Serum","Hair Mask","Hair Dye","Relaxer"
          ]},
          { key: "hairType", label: "Hair Type", type: "select", options: ["Natural","Relaxed","Curly","Straight","Wavy"] },
          { key: "brand", label: "Brand", type: "text" },
          { key: "ingredients", label: "Ingredients", type: "text" },
          { key: "volume", label: "Volume (ml)", type: "number" },
          { key: "purpose", label: "Purpose", type: "select", options: ["Growth","Moisture","Repair","Anti-dandruff","Styling"] },
          { key: "condition", label: "Condition", type: "select", options: ["New"] }
        ]
      },
  
      MAKEUP: {
        label: "Makeup",
        fields: [
          { key: "productType", label: "Product Type", type: "select", options: [
            "Foundation","Concealer","Powder","Blush","Highlighter","Bronzer",
            "Lipstick","Lip Gloss","Mascara","Eyeliner","Eyeshadow","Primer"
          ]},
          { key: "shade", label: "Shade", type: "text" },
          { key: "brand", label: "Brand", type: "text" },
          { key: "finish", label: "Finish", type: "select", options: ["Matte","Glossy","Dewy","Satin"] },
          { key: "coverage", label: "Coverage", type: "select", options: ["Light","Medium","Full"] },
          { key: "skinType", label: "Suitable Skin Type", type: "select", options: ["All","Oily","Dry","Combination"] },
          { key: "waterproof", label: "Waterproof", type: "select", options: ["Yes","No"] },
          { key: "condition", label: "Condition", type: "select", options: ["New"] }
        ]
      },
  
      PERFUMES: {
        label: "Perfumes",
        fields: [
          { key: "fragranceType", label: "Fragrance Type", type: "select", options: ["Perfume","Eau de Parfum","Eau de Toilette","Body Spray"] },
          { key: "brand", label: "Brand", type: "text" },
          { key: "gender", label: "Gender", type: "select", options: ["Male","Female","Unisex"] },
          { key: "volume", label: "Volume (ml)", type: "number" },
          { key: "scentNotes", label: "Scent Notes", type: "text" },
          { key: "longevity", label: "Longevity", type: "select", options: ["Short","Moderate","Long-lasting"] },
          { key: "condition", label: "Condition", type: "select", options: ["New"] }
        ]
      },
  
      SALON_EQUIPMENT: {
        label: "Salon Equipment",
        fields: [
          { key: "equipmentType", label: "Equipment Type", type: "select", options: [
            "Hair Dryer","Hair Straightener","Curling Iron","Barber Clipper",
            "Salon Chair","Mirror","Sterilizer","Facial Steamer"
          ]},
          { key: "brand", label: "Brand", type: "text" },
          { key: "powerSource", label: "Power Source", type: "select", options: ["Electric","Battery"] },
          { key: "condition", label: "Condition", type: "select", options: ["New","Used"] },
          { key: "warranty", label: "Warranty", type: "select", options: ["Yes","No"] }
        ]
      },
  
      HAIR_EXTENSIONS_WIGS: {
        label: "Hair Extensions & Wigs",
        fields: [
          { key: "hairType", label: "Hair Type", type: "select", options: ["Human Hair","Synthetic"] },
          { key: "style", label: "Style", type: "select", options: ["Straight","Curly","Wavy","Bob","Frontal","Closure"] },
          { key: "length", label: "Length (inches)", type: "number" },
          { key: "color", label: "Color", type: "text" },
          { key: "density", label: "Density", type: "select", options: ["130%","150%","180%","200%"] },
          { key: "condition", label: "Condition", type: "select", options: ["New","Used"] }
        ]
      },
  
      NAILS: {
        label: "Nails",
        fields: [
          { key: "productType", label: "Product Type", type: "select", options: ["Nail Polish","Gel Polish","Acrylic Kit","Press-on Nails","Nail Tools"] },
          { key: "color", label: "Color", type: "text" },
          { key: "brand", label: "Brand", type: "text" },
          { key: "finish", label: "Finish", type: "select", options: ["Matte","Glossy","Glitter"] },
          { key: "condition", label: "Condition", type: "select", options: ["New"] }
        ]
      },
  
      PERSONAL_CARE: {
        label: "Personal Care",
        fields: [
          { key: "productType", label: "Product Type", type: "select", options: [
            "Toothpaste","Toothbrush","Deodorant","Body Wash","Soap",
            "Shaving Kit","Feminine Care","Tissue","Wipes"
          ]},
          { key: "brand", label: "Brand", type: "text" },
          { key: "gender", label: "Gender", type: "select", options: ["Male","Female","Unisex"] },
          { key: "size", label: "Size", type: "text" },
          { key: "condition", label: "Condition", type: "select", options: ["New"] }
        ]
      },
  
      BEAUTY_TOOLS: {
        label: "Beauty Tools",
        fields: [
          { key: "toolType", label: "Tool Type", type: "select", options: [
            "Makeup Brush","Beauty Blender","Facial Roller","Tweezers",
            "Eyelash Curler","Mirror","Makeup Organizer"
          ]},
          { key: "material", label: "Material", type: "select", options: ["Plastic","Metal","Wood","Silicone"] },
          { key: "brand", label: "Brand", type: "text" },
          { key: "condition", label: "Condition", type: "select", options: ["New","Used"] }
        ]
      }
  
    }
  },

  INDUSTRIAL_TOOLS: {
    label: "Industrial Tools & Equipment",
    subcategories: {
  
      POWER_TOOLS: {
        label: "Power Tools",
        fields: [
          { key: "toolType", label: "Tool Type", type: "select", options: [
            "Drill",
            "Impact Drill",
            "Hammer Drill",
            "Angle Grinder",
            "Circular Saw",
            "Jigsaw",
            "Router",
            "Sander",
            "Heat Gun",
            "Electric Planer",
            "Rotary Hammer",
            "Polisher",
            "Concrete Cutter",
            "Nailer",
            "Other"
          ]},
          { key: "brand", label: "Brand", type: "text" },
          { key: "model", label: "Model", type: "text" },
          { key: "powerSource", label: "Power Source", type: "select", options: ["Corded", "Battery", "Pneumatic"] },
          { key: "voltage", label: "Voltage", type: "text" },
          { key: "condition", label: "Condition", type: "select", options: ["New", "Used", "Refurbished"] },
          { key: "warranty", label: "Warranty", type: "select", options: ["Yes", "No"] }
        ]
      },
  
      HAND_TOOLS: {
        label: "Hand Tools",
        fields: [
          { key: "toolType", label: "Tool Type", type: "select", options: [
            "Hammer",
            "Screwdriver",
            "Spanner",
            "Wrench",
            "Pliers",
            "Socket Set",
            "Chisel",
            "Measuring Tape",
            "Saw",
            "Level",
            "Crowbar",
            "Cutter",
            "Tool Set",
            "Other"
          ]},
          { key: "brand", label: "Brand", type: "text" },
          { key: "material", label: "Material", type: "select", options: ["Steel", "Alloy", "Carbon Steel", "Mixed"] },
          { key: "condition", label: "Condition", type: "select", options: ["New", "Used"] },
          { key: "quantity", label: "Quantity", type: "number" }
        ]
      },
  
      WELDING_EQUIPMENT: {
        label: "Welding Equipment",
        fields: [
          { key: "equipmentType", label: "Equipment Type", type: "select", options: [
            "Welding Machine",
            "Inverter Welder",
            "MIG Welder",
            "TIG Welder",
            "Arc Welder",
            "Welding Helmet",
            "Welding Cable",
            "Electrode Holder",
            "Gas Regulator",
            "Cutting Torch",
            "Other"
          ]},
          { key: "brand", label: "Brand", type: "text" },
          { key: "powerRating", label: "Power Rating", type: "text" },
          { key: "powerSource", label: "Power Source", type: "select", options: ["Electric", "Gas", "Both"] },
          { key: "condition", label: "Condition", type: "select", options: ["New", "Used", "Refurbished"] },
          { key: "warranty", label: "Warranty", type: "select", options: ["Yes", "No"] }
        ]
      },
  
      ELECTRICAL_TOOLS: {
        label: "Electrical Tools",
        fields: [
          { key: "toolType", label: "Tool Type", type: "select", options: [
            "Multimeter",
            "Clamp Meter",
            "Voltage Tester",
            "Cable Cutter",
            "Wire Stripper",
            "Crimping Tool",
            "Insulation Tester",
            "Soldering Iron",
            "Extension Reel",
            "Other"
          ]},
          { key: "brand", label: "Brand", type: "text" },
          { key: "model", label: "Model", type: "text" },
          { key: "condition", label: "Condition", type: "select", options: ["New", "Used"] },
          { key: "digital", label: "Digital", type: "select", options: ["Yes", "No"] }
        ]
      },
  
      PLUMBING_TOOLS: {
        label: "Plumbing Tools",
        fields: [
          { key: "toolType", label: "Tool Type", type: "select", options: [
            "Pipe Wrench",
            "Pipe Cutter",
            "Threading Machine",
            "Drain Snake",
            "Basin Wrench",
            "Plunger",
            "Pipe Bender",
            "Pressure Tester",
            "Other"
          ]},
          { key: "brand", label: "Brand", type: "text" },
          { key: "material", label: "Material", type: "select", options: ["Steel", "Alloy", "Mixed"] },
          { key: "condition", label: "Condition", type: "select", options: ["New", "Used"] }
        ]
      },
  
      CONSTRUCTION_EQUIPMENT: {
        label: "Construction Equipment",
        fields: [
          { key: "equipmentType", label: "Equipment Type", type: "select", options: [
            "Concrete Mixer",
            "Compactor",
            "Vibrator",
            "Scaffolding",
            "Ladder",
            "Wheelbarrow",
            "Jack Hammer",
            "Block Moulding Machine",
            "Tile Cutter",
            "Other"
          ]},
          { key: "brand", label: "Brand", type: "text" },
          { key: "capacity", label: "Capacity", type: "text" },
          { key: "powerSource", label: "Power Source", type: "select", options: ["Manual", "Electric", "Petrol", "Diesel"] },
          { key: "condition", label: "Condition", type: "select", options: ["New", "Used", "Refurbished"] }
        ]
      },
  
      SAFETY_EQUIPMENT: {
        label: "Safety Equipment",
        fields: [
          { key: "equipmentType", label: "Equipment Type", type: "select", options: [
            "Safety Helmet",
            "Safety Boots",
            "Hand Gloves",
            "Reflective Vest",
            "Goggles",
            "Face Shield",
            "Ear Protection",
            "Respirator",
            "Safety Harness",
            "Fire Extinguisher",
            "Other"
          ]},
          { key: "brand", label: "Brand", type: "text" },
          { key: "size", label: "Size", type: "text" },
          { key: "material", label: "Material", type: "text" },
          { key: "condition", label: "Condition", type: "select", options: ["New", "Used"] }
        ]
      },
  
      GENERATORS_POWER_EQUIPMENT: {
        label: "Generators & Power Equipment",
        fields: [
          { key: "equipmentType", label: "Equipment Type", type: "select", options: [
            "Generator",
            "Inverter Generator",
            "Water Pump",
            "Pressure Washer",
            "Air Compressor",
            "Stabilizer",
            "UPS",
            "Battery Charger",
            "Other"
          ]},
          { key: "brand", label: "Brand", type: "text" },
          { key: "model", label: "Model", type: "text" },
          { key: "fuelType", label: "Fuel Type", type: "select", options: ["Petrol", "Diesel", "Electric", "Battery"] },
          { key: "powerOutput", label: "Power Output", type: "text" },
          { key: "condition", label: "Condition", type: "select", options: ["New", "Used", "Refurbished"] },
          { key: "electricStart", label: "Electric Start", type: "select", options: ["Yes", "No"] }
        ]
      },
  
      MEASURING_TESTING_TOOLS: {
        label: "Measuring & Testing Tools",
        fields: [
          { key: "toolType", label: "Tool Type", type: "select", options: [
            "Laser Level",
            "Spirit Level",
            "Measuring Tape",
            "Caliper",
            "Micrometer",
            "Distance Meter",
            "Thermometer",
            "Pressure Gauge",
            "Moisture Meter",
            "Other"
          ]},
          { key: "brand", label: "Brand", type: "text" },
          { key: "measurementType", label: "Measurement Type", type: "text" },
          { key: "digital", label: "Digital", type: "select", options: ["Yes", "No"] },
          { key: "condition", label: "Condition", type: "select", options: ["New", "Used"] }
        ]
      },

      SOLAR_POWER: {
        label: "Solar Power",
        fields: [
          { key: "solarType", label: "Solar Type", type: "select", options: ["Solar Panel", "Solar Inverter", "Solar Battery", "Complete Solar System"] },
          { key: "brand", label: "Brand", type: "text" },
          { key: "model", label: "Model", type: "text" },
          { key: "powerRating", label: "Power Rating (Watts)", type: "text" },
          { key: "panelType", label: "Panel Type", type: "select", options: ["Monocrystalline", "Polycrystalline", "Thin Film"] },
          { key: "batteryIncluded", label: "Battery Included", type: "select", options: ["Yes", "No"] },
          { key: "inverterIncluded", label: "Inverter Included", type: "select", options: ["Yes", "No"] },
          { key: "installationAvailable", label: "Installation Available", type: "select", options: ["Yes", "No"] },
          { key: "condition", label: "Condition", type: "select", options: ["New", "Used"] },
          { key: "warranty", label: "Warranty", type: "select", options: ["Yes", "No"] }
        ]
      },
    
      INVERTERS_BATTERIES: {
        label: "Inverters & Batteries",
        fields: [
          { key: "deviceType", label: "Device Type", type: "select", options: ["Inverter", "Battery", "Inverter + Battery Combo"] },
          { key: "brand", label: "Brand", type: "text" },
          { key: "model", label: "Model", type: "text" },
          { key: "capacity", label: "Capacity (kVA / Ah)", type: "text" },
          { key: "batteryType", label: "Battery Type", type: "select", options: ["Lead Acid", "Gel", "Lithium", "Tubular"] },
          { key: "voltage", label: "Voltage", type: "text" },
          { key: "backupTime", label: "Backup Time", type: "text" },
          { key: "condition", label: "Condition", type: "select", options: ["New", "Used", "Refurbished"] },
          { key: "installationAvailable", label: "Installation Available", type: "select", options: ["Yes", "No"] },
          { key: "warranty", label: "Warranty", type: "select", options: ["Yes", "No"] }
        ]
      },
      
      SEWING_MACHINES: {
        label: "Sewing Machines",
        fields: [
          { key: "machineType", label: "Machine Type", type: "select", options: ["Manual", "Electric", "Industrial", "Embroidery"] },
          { key: "brand", label: "Brand", type: "text" },
          { key: "model", label: "Model", type: "text" },
          { key: "stitchTypes", label: "Stitch Types", type: "text" },
          { key: "condition", label: "Condition", type: "select", options: ["New", "Used"] },
          { key: "portable", label: "Portable", type: "select", options: ["Yes", "No"] },
          { key: "powerSource", label: "Power Source", type: "select", options: ["Manual", "Electric"] },
          { key: "color", label: "Color", type: "text" }
        ]
      },
  
      INDUSTRIAL_MACHINERY: {
        label: "Industrial Machinery",
        fields: [
          { key: "machineType", label: "Machine Type", type: "select", options: [
            "Lathe Machine",
            "Milling Machine",
            "Drilling Machine",
            "Cutting Machine",
            "Packaging Machine",
            "Sealing Machine",
            "Filling Machine",
            "Compressing Machine",
            "Workshop Machine",
            "Other"
          ]},
          { key: "brand", label: "Brand", type: "text" },
          { key: "model", label: "Model", type: "text" },
          { key: "powerSource", label: "Power Source", type: "select", options: ["Electric", "Diesel", "Petrol", "Manual"] },
          { key: "capacity", label: "Capacity", type: "text" },
          { key: "condition", label: "Condition", type: "select", options: ["New", "Used", "Refurbished"] }
        ]
      },
  
      TOOL_STORAGE_WORKSHOP: {
        label: "Tool Storage & Workshop",
        fields: [
          { key: "itemType", label: "Item Type", type: "select", options: [
            "Tool Box",
            "Tool Cabinet",
            "Tool Bag",
            "Work Bench",
            "Vice",
            "Shelving",
            "Workshop Stool",
            "Parts Organizer",
            "Other"
          ]},
          { key: "brand", label: "Brand", type: "text" },
          { key: "material", label: "Material", type: "select", options: ["Metal", "Plastic", "Wood", "Mixed"] },
          { key: "condition", label: "Condition", type: "select", options: ["New", "Used"] },
          { key: "portable", label: "Portable", type: "select", options: ["Yes", "No"] }
        ]
      }
  
    }
  },

  KIDS: {
    label: "Kids & Toys",
    subcategories: {
  
      TOYS: {
        label: "Toys",
        fields: [
          { key: "toyType", label: "Toy Type", type: "select", options: [
            "Action Figure",
            "Doll",
            "Building Blocks",
            "Puzzle",
            "Board Game",
            "Remote Control Toy",
            "Educational Toy",
            "Outdoor Toy",
            "Stuffed Toy",
            "Other"
          ]},
          { key: "ageRange", label: "Age Range", type: "select", options: [
            "0-2 years",
            "3-5 years",
            "6-9 years",
            "10-12 years",
            "13+"
          ]},
          { key: "material", label: "Material", type: "select", options: [
            "Plastic",
            "Wood",
            "Fabric",
            "Metal",
            "Mixed"
          ]},
          { key: "condition", label: "Condition", type: "select", options: [
            "New",
            "Used"
          ]},
          { key: "brand", label: "Brand", type: "text" },
          { key: "batteryRequired", label: "Battery Required", type: "select", options: ["Yes","No"] }
        ]
      },
  
      EDUCATIONAL_MATERIALS: {
        label: "Educational Materials",
        fields: [
          { key: "materialType", label: "Material Type", type: "select", options: [
            "Flash Cards",
            "Learning Board",
            "Alphabet Kit",
            "Math Kit",
            "Science Kit",
            "Activity Book",
            "Other"
          ]},
          { key: "ageRange", label: "Age Range", type: "select", options: [
            "0-2 years",
            "3-5 years",
            "6-9 years",
            "10-12 years"
          ]},
          { key: "subject", label: "Subject", type: "text" },
          { key: "condition", label: "Condition", type: "select", options: [
            "New",
            "Used"
          ]},
          { key: "brand", label: "Brand", type: "text" }
        ]
      },
  
      SCHOOL_BAGS: {
        label: "School Bags",
        fields: [
          { key: "bagType", label: "Bag Type", type: "select", options: [
            "Backpack",
            "Trolley Bag",
            "Lunch Bag",
            "School Set"
          ]},
          { key: "brand", label: "Brand", type: "text" },
          { key: "size", label: "Size", type: "select", options: [
            "Small",
            "Medium",
            "Large"
          ]},
          { key: "gender", label: "Gender", type: "select", options: [
            "Boys",
            "Girls",
            "Unisex"
          ]},
          { key: "condition", label: "Condition", type: "select", options: [
            "New",
            "Used"
          ]},
          { key: "color", label: "Color", type: "text" }
        ]
      },
  
      KIDS_FURNITURE: {
        label: "Kids Furniture",
        fields: [
          { key: "furnitureType", label: "Furniture Type", type: "select", options: [
            "Kids Bed",
            "Study Table",
            "Chair",
            "Wardrobe",
            "Bookshelf",
            "Playpen",
            "Other"
          ]},
          { key: "material", label: "Material", type: "select", options: [
            "Wood",
            "Plastic",
            "Metal",
            "Mixed"
          ]},
          { key: "condition", label: "Condition", type: "select", options: [
            "New",
            "Used"
          ]},
          { key: "color", label: "Color", type: "text" },
          { key: "dimensions", label: "Dimensions", type: "text" }
        ]
      }
  
    }
  },

  BOOKS_EDUCATION: {
    label: "Books & Education",
    subcategories: {
  
      BOOKS: {
        label: "Books",
        fields: [
          { key: "genre", label: "Genre", type: "select", options: [
            "Fiction",
            "Non-Fiction",
            "Biography",
            "Religious",
            "Self-Help",
            "Children",
            "Other"
          ]},
          { key: "author", label: "Author", type: "text" },
          { key: "publisher", label: "Publisher", type: "text" },
          { key: "condition", label: "Condition", type: "select", options: [
            "New",
            "Used"
          ]},
          { key: "language", label: "Language", type: "text" }
        ]
      },
  
      TEXTBOOKS: {
        label: "Textbooks",
        fields: [
          { key: "subject", label: "Subject", type: "text" },
          { key: "level", label: "Level", type: "select", options: [
            "Primary",
            "Secondary",
            "University",
            "Professional"
          ]},
          { key: "author", label: "Author", type: "text" },
          { key: "edition", label: "Edition", type: "text" },
          { key: "condition", label: "Condition", type: "select", options: [
            "New",
            "Used"
          ]}
        ]
      },
  
      COURSES: {
        label: "Courses",
        fields: [
          { key: "courseType", label: "Course Type", type: "select", options: [
            "Online",
            "Offline",
            "Recorded",
            "Live"
          ]},
          { key: "category", label: "Category", type: "select", options: [
            "Programming",
            "Business",
            "Design",
            "Marketing",
            "Finance",
            "Language",
            "Other"
          ]},
          { key: "duration", label: "Duration", type: "text" },
          { key: "certificate", label: "Certificate Included", type: "select", options: [
            "Yes",
            "No"
          ]},
          { key: "provider", label: "Provider", type: "text" }
        ]
      },
  
      STUDY_MATERIALS: {
        label: "Study Materials",
        fields: [
          { key: "materialType", label: "Material Type", type: "select", options: [
            "Past Questions",
            "Notes",
            "Handouts",
            "Exam Prep",
            "Worksheets",
            "Other"
          ]},
          { key: "subject", label: "Subject", type: "text" },
          { key: "level", label: "Level", type: "select", options: [
            "Primary",
            "Secondary",
            "University",
            "Professional"
          ]},
          { key: "format", label: "Format", type: "select", options: [
            "Physical",
            "Digital (PDF)"
          ]},
          { key: "condition", label: "Condition", type: "select", options: [
            "New",
            "Used"
          ]}
        ]
      }
    }
  },

  SERVICES: {
    label: "Services",
    subcategories: {
  
      HOME_SERVICES: {
        label: "Home Services",
        fields: [
          { key: "serviceType", label: "Service Type", type: "select", options: [
            "Plumbing",
            "Electrical",
            "Cleaning",
            "Painting",
            "Carpentry",
            "Tiling",
            "POP Installation",
            "AC Repair",
            "Generator Repair",
            "Home Appliance Repair",
            "Interior Decoration",
            "Pest Control",
            "Moving Service",
            "Laundry Service",
            "Other"
          ]},
          { key: "experienceLevel", label: "Experience Level", type: "select", options: ["Beginner","Intermediate","Expert"] },
          { key: "pricingType", label: "Pricing Type", type: "select", options: ["Per Job","Per Hour","Per Day","Negotiable"] },
          { key: "serviceArea", label: "Service Area", type: "text" },
          { key: "availability", label: "Availability", type: "select", options: ["Weekdays","Weekends","Any Day"] },
          { key: "onSiteService", label: "On-site Service", type: "select", options: ["Yes","No"] }
        ]
      },
  
      BEAUTY_SERVICES: {
        label: "Beauty Services",
        fields: [
          { key: "serviceType", label: "Service Type", type: "select", options: [
            "Makeup",
            "Hair Styling",
            "Barbing",
            "Nail Service",
            "Facial",
            "Massage",
            "Lash Installation",
            "Wig Installation",
            "Spa Service",
            "Other"
          ]},
          { key: "experienceLevel", label: "Experience Level", type: "select", options: ["Beginner","Intermediate","Expert"] },
          { key: "pricingType", label: "Pricing Type", type: "select", options: ["Per Session","Per Service","Negotiable"] },
          { key: "serviceArea", label: "Service Area", type: "text" },
          { key: "homeService", label: "Home Service", type: "select", options: ["Yes","No"] },
          { key: "availability", label: "Availability", type: "select", options: ["Weekdays","Weekends","Any Day"] }
        ]
      },
  
      TECH_SERVICES: {
        label: "Tech Services",
        fields: [
          { key: "serviceType", label: "Service Type", type: "select", options: [
            "Phone Repair",
            "Laptop Repair",
            "Software Installation",
            "Website Design",
            "Graphics Design",
            "CCTV Installation",
            "Networking",
            "Data Recovery",
            "Printer Repair",
            "Other"
          ]},
          { key: "experienceLevel", label: "Experience Level", type: "select", options: ["Beginner","Intermediate","Expert"] },
          { key: "pricingType", label: "Pricing Type", type: "select", options: ["Per Job","Per Hour","Negotiable"] },
          { key: "serviceArea", label: "Service Area", type: "text" },
          { key: "remoteService", label: "Remote Service", type: "select", options: ["Yes","No"] },
          { key: "onSiteService", label: "On-site Service", type: "select", options: ["Yes","No"] }
        ]
      },
  
      EVENT_SERVICES: {
        label: "Event Services",
        fields: [
          { key: "serviceType", label: "Service Type", type: "select", options: [
            "Photography",
            "Videography",
            "Catering",
            "Decoration",
            "MC",
            "DJ",
            "Event Planning",
            "Ushering",
            "Canopy Rental",
            "Sound Setup",
            "Lighting Setup",
            "Other"
          ]},
          { key: "experienceLevel", label: "Experience Level", type: "select", options: ["Beginner","Intermediate","Expert"] },
          { key: "pricingType", label: "Pricing Type", type: "select", options: ["Per Event","Per Day","Negotiable"] },
          { key: "serviceArea", label: "Service Area", type: "text" },
          { key: "travelAvailable", label: "Travel Available", type: "select", options: ["Yes","No"] },
          { key: "availability", label: "Availability", type: "select", options: ["Weekdays","Weekends","Any Day"] }
        ]
      },
  
      AUTOMOTIVE_SERVICES: {
        label: "Automotive Services",
        fields: [
          { key: "serviceType", label: "Service Type", type: "select", options: [
            "Mechanic",
            "Car Diagnostics",
            "Panel Beating",
            "Auto Electrical",
            "Car Wash",
            "Car Detailing",
            "Towing",
            "Tyre Service",
            "Battery Service",
            "AC Repair",
            "Other"
          ]},
          { key: "experienceLevel", label: "Experience Level", type: "select", options: ["Beginner","Intermediate","Expert"] },
          { key: "pricingType", label: "Pricing Type", type: "select", options: ["Per Job","Per Visit","Negotiable"] },
          { key: "serviceArea", label: "Service Area", type: "text" },
          { key: "mobileService", label: "Mobile Service", type: "select", options: ["Yes","No"] },
          { key: "emergencyService", label: "Emergency Service", type: "select", options: ["Yes","No"] }
        ]
      },
  
      BUSINESS_SERVICES: {
        label: "Business Services",
        fields: [
          { key: "serviceType", label: "Service Type", type: "select", options: [
            "Accounting",
            "Bookkeeping",
            "Business Registration",
            "Tax Service",
            "Branding",
            "Printing",
            "Digital Marketing",
            "Social Media Management",
            "Virtual Assistant",
            "Consulting",
            "Other"
          ]},
          { key: "experienceLevel", label: "Experience Level", type: "select", options: ["Beginner","Intermediate","Expert"] },
          { key: "pricingType", label: "Pricing Type", type: "select", options: ["Per Project","Per Month","Per Hour","Negotiable"] },
          { key: "serviceArea", label: "Service Area", type: "text" },
          { key: "remoteService", label: "Remote Service", type: "select", options: ["Yes","No"] },
          { key: "onSiteService", label: "On-site Service", type: "select", options: ["Yes","No"] }
        ]
      },
  
      CONSTRUCTION_SERVICES: {
        label: "Construction Services",
        fields: [
          { key: "serviceType", label: "Service Type", type: "select", options: [
            "Building Construction",
            "Renovation",
            "Welding",
            "Roofing",
            "POP Ceiling",
            "Flooring",
            "Borehole Drilling",
            "Land Survey",
            "Architectural Design",
            "Other"
          ]},
          { key: "experienceLevel", label: "Experience Level", type: "select", options: ["Beginner","Intermediate","Expert"] },
          { key: "pricingType", label: "Pricing Type", type: "select", options: ["Per Project","Per Day","Negotiable"] },
          { key: "serviceArea", label: "Service Area", type: "text" },
          { key: "onSiteService", label: "On-site Service", type: "select", options: ["Yes","No"] },
          { key: "availability", label: "Availability", type: "select", options: ["Weekdays","Weekends","Any Day"] }
        ]
      },
  
      DELIVERY_LOGISTICS: {
        label: "Delivery & Logistics",
        fields: [
          { key: "serviceType", label: "Service Type", type: "select", options: [
            "Dispatch Rider",
            "Moving Service",
            "Truck Hire",
            "Courier Service",
            "Interstate Delivery",
            "Local Delivery",
            "Furniture Moving",
            "Other"
          ]},
          { key: "pricingType", label: "Pricing Type", type: "select", options: ["Per Delivery","Per Trip","Per Distance","Negotiable"] },
          { key: "serviceArea", label: "Service Area", type: "text" },
          { key: "sameDayDelivery", label: "Same Day Delivery", type: "select", options: ["Yes","No"] },
          { key: "vehicleType", label: "Vehicle Type", type: "select", options: ["Bike","Car","Van","Truck","Other"] },
          { key: "availability", label: "Availability", type: "select", options: ["Weekdays","Weekends","Any Day"] }
        ]
      }
    }
  },

  JOBS: {
    label: "Jobs",
    subcategories: {
  
      DOMESTIC_HELP: {
        label: "Domestic Help",
        fields: [
          { key: "jobRole", label: "Job Role", type: "select", options: [
            "Cleaner",
            "Housekeeper",
            "Cook",
            "Laundry Helper",
            "Dishwasher",
            "Home Assistant",
            "House Help",
            "Steward",
            "Other"
          ]},
          { key: "experienceYears", label: "Years of Experience", type: "number" },
          { key: "employmentType", label: "Employment Type", type: "select", options: ["Full-time","Part-time","Contract","Temporary"] },
          { key: "availability", label: "Availability", type: "select", options: ["Immediately","1 Week","2 Weeks","Negotiable"] },
          { key: "workPreference", label: "Work Preference", type: "select", options: ["Live-in","Live-out","Either"] },
          { key: "salaryExpectation", label: "Salary Expectation", type: "text" },
          { key: "canTravel", label: "Can Travel", type: "select", options: ["Yes","No"] },
          { key: "referencesAvailable", label: "References Available", type: "select", options: ["Yes","No"] }
        ]
      },
  
      BEAUTY_FASHION_WORKERS: {
        label: "Beauty & Fashion Workers",
        fields: [
          { key: "jobRole", label: "Job Role", type: "select", options: [
            "Hair Stylist",
            "Braider",
            "Barber",
            "Makeup Artist",
            "Nail Technician",
            "Lash Technician",
            "Wig Installer",
            "Fashion Designer",
            "Tailor",
            "Other"
          ]},
          { key: "experienceYears", label: "Years of Experience", type: "number" },
          { key: "employmentType", label: "Employment Type", type: "select", options: ["Full-time","Part-time","Contract","Freelance"] },
          { key: "availability", label: "Availability", type: "select", options: ["Immediately","1 Week","2 Weeks","Negotiable"] },
          { key: "serviceMode", label: "Service Mode", type: "select", options: ["On-site","Home Service","Salon/Shop Only","Either"] },
          { key: "salaryExpectation", label: "Salary Expectation", type: "text" },
          { key: "portfolioAvailable", label: "Portfolio Available", type: "select", options: ["Yes","No"] },
          { key: "certified", label: "Certified", type: "select", options: ["Yes","No"] }
        ]
      },
  
      HOSPITALITY_FOOD_WORKERS: {
        label: "Hospitality & Food Workers",
        fields: [
          { key: "jobRole", label: "Job Role", type: "select", options: [
            "Chef",
            "Cook",
            "Baker",
            "Caterer",
            "Waiter",
            "Waitress",
            "Kitchen Assistant",
            "Hotel Attendant",
            "Bar Attendant",
            "Other"
          ]},
          { key: "experienceYears", label: "Years of Experience", type: "number" },
          { key: "employmentType", label: "Employment Type", type: "select", options: ["Full-time","Part-time","Contract","Temporary"] },
          { key: "availability", label: "Availability", type: "select", options: ["Immediately","1 Week","2 Weeks","Negotiable"] },
          { key: "specialty", label: "Specialty", type: "text" },
          { key: "salaryExpectation", label: "Salary Expectation", type: "text" },
          { key: "canTravel", label: "Can Travel", type: "select", options: ["Yes","No"] },
          { key: "referencesAvailable", label: "References Available", type: "select", options: ["Yes","No"] }
        ]
      },
  
      CAREGIVERS_NANNIES: {
        label: "Caregivers & Nannies",
        fields: [
          { key: "jobRole", label: "Job Role", type: "select", options: [
            "Nanny",
            "Babysitter",
            "Caregiver",
            "Elderly Care Assistant",
            "Special Needs Assistant",
            "Other"
          ]},
          { key: "experienceYears", label: "Years of Experience", type: "number" },
          { key: "employmentType", label: "Employment Type", type: "select", options: ["Full-time","Part-time","Contract","Temporary"] },
          { key: "availability", label: "Availability", type: "select", options: ["Immediately","1 Week","2 Weeks","Negotiable"] },
          { key: "workPreference", label: "Work Preference", type: "select", options: ["Live-in","Live-out","Either"] },
          { key: "canCook", label: "Can Cook", type: "select", options: ["Yes","No"] },
          { key: "firstAidKnowledge", label: "First Aid Knowledge", type: "select", options: ["Yes","No"] },
          { key: "salaryExpectation", label: "Salary Expectation", type: "text" }
        ]
      },
  
      DRIVERS_LOGISTICS: {
        label: "Drivers & Logistics",
        fields: [
          { key: "jobRole", label: "Job Role", type: "select", options: [
            "Private Driver",
            "Company Driver",
            "Dispatch Rider",
            "Truck Driver",
            "Bus Driver",
            "Delivery Assistant",
            "Logistics Assistant",
            "Other"
          ]},
          { key: "experienceYears", label: "Years of Experience", type: "number" },
          { key: "licenseType", label: "License Type", type: "text" },
          { key: "employmentType", label: "Employment Type", type: "select", options: ["Full-time","Part-time","Contract","Temporary"] },
          { key: "availability", label: "Availability", type: "select", options: ["Immediately","1 Week","2 Weeks","Negotiable"] },
          { key: "canTravel", label: "Can Travel", type: "select", options: ["Yes","No"] },
          { key: "salaryExpectation", label: "Salary Expectation", type: "text" },
          { key: "referencesAvailable", label: "References Available", type: "select", options: ["Yes","No"] }
        ]
      },
  
      ARTISANS_TECHNICIANS: {
        label: "Artisans & Technicians",
        fields: [
          { key: "jobRole", label: "Job Role", type: "select", options: [
            "Plumber",
            "Electrician",
            "Welder",
            "Painter",
            "Carpenter",
            "POP Installer",
            "Tiler",
            "AC Technician",
            "Generator Technician",
            "Appliance Repair Technician",
            "Phone Repair Technician",
            "Laptop Repair Technician",
            "Other"
          ]},
          { key: "experienceYears", label: "Years of Experience", type: "number" },
          { key: "employmentType", label: "Employment Type", type: "select", options: ["Full-time","Part-time","Contract","Freelance"] },
          { key: "availability", label: "Availability", type: "select", options: ["Immediately","1 Week","2 Weeks","Negotiable"] },
          { key: "serviceMode", label: "Service Mode", type: "select", options: ["On-site","Workshop Only","Either"] },
          { key: "salaryExpectation", label: "Salary Expectation", type: "text" },
          { key: "toolsAvailable", label: "Tools Available", type: "select", options: ["Yes","No"] },
          { key: "certified", label: "Certified", type: "select", options: ["Yes","No"] }
        ]
      },
  
      OFFICE_ADMIN_SUPPORT: {
        label: "Office & Admin Support",
        fields: [
          { key: "jobRole", label: "Job Role", type: "select", options: [
            "Secretary",
            "Receptionist",
            "Office Assistant",
            "Clerk",
            "Administrative Assistant",
            "Front Desk Officer",
            "Customer Service Representative",
            "Other"
          ]},
          { key: "experienceYears", label: "Years of Experience", type: "number" },
          { key: "employmentType", label: "Employment Type", type: "select", options: ["Full-time","Part-time","Contract","Temporary"] },
          { key: "availability", label: "Availability", type: "select", options: ["Immediately","1 Week","2 Weeks","Negotiable"] },
          { key: "computerSkills", label: "Computer Skills", type: "select", options: ["Basic","Intermediate","Advanced"] },
          { key: "salaryExpectation", label: "Salary Expectation", type: "text" },
          { key: "englishLevel", label: "English Level", type: "select", options: ["Basic","Conversational","Fluent"] },
          { key: "referencesAvailable", label: "References Available", type: "select", options: ["Yes","No"] }
        ]
      },
  
      SALES_RETAIL_WORKERS: {
        label: "Sales & Retail Workers",
        fields: [
          { key: "jobRole", label: "Job Role", type: "select", options: [
            "Sales Representative",
            "Shop Attendant",
            "Cashier",
            "Storekeeper",
            "Merchandiser",
            "Retail Assistant",
            "Other"
          ]},
          { key: "experienceYears", label: "Years of Experience", type: "number" },
          { key: "employmentType", label: "Employment Type", type: "select", options: ["Full-time","Part-time","Contract","Temporary"] },
          { key: "availability", label: "Availability", type: "select", options: ["Immediately","1 Week","2 Weeks","Negotiable"] },
          { key: "salaryExpectation", label: "Salary Expectation", type: "text" },
          { key: "customerServiceSkills", label: "Customer Service Skills", type: "select", options: ["Basic","Intermediate","Advanced"] },
          { key: "referencesAvailable", label: "References Available", type: "select", options: ["Yes","No"] }
        ]
      },
  
      SECURITY_WORKERS: {
        label: "Security Workers",
        fields: [
          { key: "jobRole", label: "Job Role", type: "select", options: [
            "Security Guard",
            "Gatekeeper",
            "Bouncer",
            "Private Security Assistant",
            "Other"
          ]},
          { key: "experienceYears", label: "Years of Experience", type: "number" },
          { key: "employmentType", label: "Employment Type", type: "select", options: ["Full-time","Part-time","Contract","Temporary"] },
          { key: "availability", label: "Availability", type: "select", options: ["Immediately","1 Week","2 Weeks","Negotiable"] },
          { key: "shiftPreference", label: "Shift Preference", type: "select", options: ["Day","Night","Any"] },
          { key: "salaryExpectation", label: "Salary Expectation", type: "text" },
          { key: "trained", label: "Trained", type: "select", options: ["Yes","No"] },
          { key: "referencesAvailable", label: "References Available", type: "select", options: ["Yes","No"] }
        ]
      },
  
      DIGITAL_FREELANCE: {
        label: "Digital & Freelance Workers",
        fields: [
          { key: "jobRole", label: "Job Role", type: "select", options: [
            "Graphic Designer",
            "Social Media Manager",
            "Video Editor",
            "Photographer",
            "Content Writer",
            "Web Designer",
            "Virtual Assistant",
            "Data Entry Clerk",
            "Other"
          ]},
          { key: "experienceYears", label: "Years of Experience", type: "number" },
          { key: "employmentType", label: "Employment Type", type: "select", options: ["Full-time","Part-time","Contract","Freelance"] },
          { key: "availability", label: "Availability", type: "select", options: ["Immediately","1 Week","2 Weeks","Negotiable"] },
          { key: "workMode", label: "Work Mode", type: "select", options: ["Remote","Hybrid","On-site"] },
          { key: "salaryExpectation", label: "Salary Expectation", type: "text" },
          { key: "portfolioAvailable", label: "Portfolio Available", type: "select", options: ["Yes","No"] },
          { key: "englishLevel", label: "English Level", type: "select", options: ["Basic","Conversational","Fluent"] }
        ]
      }
  
    }
  },

} as const;