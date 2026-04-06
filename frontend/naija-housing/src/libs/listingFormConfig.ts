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
          { key: "vinChassisNumber", label: "Vin chasis number", type: "number" },
          { key: "registered", label: "Registered", type: "select", options: ["Yes","No"] },
          { key: "numberOfOwners", label: "Number of Owners", type: "number" },
          { key: "exchangePossible", label: "Exchange Possible", type: "select", options: ["Yes","No"] },
        ],
      },

      TRUCKS_TRAILERS: {
        label: "Trucks & Trailers",
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
          { key: "drivetrain", label: "Drivetrain", type: "select", options: ["FWD","RWD","AWD","4WD"] },
          { key: "wheels", label: "wheels", type: "select", options: ["Alloy", "Iron", "Cabon Fibre"]},
          { key: "vinChassisNumber", label: "Vin chasis number", type: "number" },
          { key: "registered", label: "Registered", type: "select", options: ["Yes","No"] },
          { key: "numberOfOwners", label: "Number of Owners", type: "number" },
          { key: "exchangePossible", label: "Exchange Possible", type: "select", options: ["Yes","No"] },
        ],
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

      MOTORCYCLES: {
        label: "Motorcycles",
        fields: [
          { key: "make", label: "Make", type: "text" },
          { key: "model", label: "Model", type: "text" },
          { key: "year", label: "Year", type: "number" },
          { key: "condition", label: "Condition", type: "select", options: ["New", "forein used", "Local used"] },
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
          { key: "condition", label: "Condition", type: "select", options: ["New", "forein used", "Local used"] },
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
          { key: "condition", label: "Condition", type: "select", options: ["New", "forein used", "Local used"] },
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
          { key: "condition", label: "Condition", type: "select", options: ["New", "forein used", "Local used"] },
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
          { key: "condition", label: "Condition", type: "select", options: ["New", "forein used", "Local used"] },
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
          { key: "condition", label: "Condition", type: "select", options: ["New","Forein used", "Local used", "Refurbished"] },
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
          { key: "condition", label: "Condition", type: "select", options: ["New", "forein used", "Local used"] },
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
          { key: "condition", label: "Condition", type: "select", options: ["New","Forein used", "Local used", "Refurbished"] },
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
          { key: "condition", label: "Condition", type: "select", options: ["New","Forein used", "Local used", "Refurbished"] },
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
            options: ["New", "Foreign used", "Local used", "Refurbished"]
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

      MOBILE_ACCESSORIES: {
        label: "Mobile Accessories",
        fields: [
          { key: "accessoryType", label: "Accessory Type", type: "select", options: ["Charger","Cable","Power Bank","Case","Screen Guard","Earbuds"] },
          { key: "brand", label: "Brand", type: "text" },
          { key: "compatibleWith", label: "Compatible With", type: "text" },
          { key: "condition", label: "Condition", type: "select", options: ["New", "forein used", "Local used"] },
          { key: "color", label: "Color", type: "text" },
          { key: "wireless", label: "Wireless", type: "select", options: ["Yes","No"] },
        ],
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
          { key: "condition", label: "Condition", type: "select", options: ["New", "forein used", "Local used"] },
          { key: "powerSource", label: "Power Source", type: "select", options: ["Electric","Gas","Battery"] },
          { key: "capacity", label: "Capacity", type: "text" },
          { key: "color", label: "Color", type: "text" },
        ],
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
          { key: "equipmentType", label: "Equipment Type", type: "select", options: ["Treadmill","Dumbbells","Bench Press","Exercise Bike","Rowing Machine","Pull-up Bar"] },
          { key: "brand", label: "Brand", type: "text" },
          { key: "condition", label: "Condition", type: "select", options: ["New","Used"] }
        ]
      },
  
      SPORTS_EQUIPMENT: {
        label: "Sports Equipment",
        fields: [
          { key: "sportType", label: "Sport Type", type: "select", options: ["Football","Basketball","Tennis","Boxing","Swimming","Cycling"] },
          { key: "brand", label: "Brand", type: "text" },
          { key: "condition", label: "Condition", type: "select", options: ["New","Used"] }
        ]
      },
  
      FITNESS_ACCESSORIES: {
        label: "Fitness Accessories",
        fields: [
          { key: "accessoryType", label: "Accessory Type", type: "select", options: ["Yoga Mat","Resistance Bands","Skipping Rope","Fitness Tracker","Foam Roller"] },
          { key: "brand", label: "Brand", type: "text" },
          { key: "condition", label: "Condition", type: "select", options: ["New","Used"] }
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
          { key: "machineType", label: "Machine Type", type: "select", options: ["Tractor","Harvester","Plough","Sprayer","Irrigation Pump"] },
          { key: "brand", label: "Brand", type: "text" },
          { key: "condition", label: "Condition", type: "select", options: ["New","Used"] }
        ]
      },
  
      FARM_TOOLS: {
        label: "Farm Tools",
        fields: [
          { key: "toolType", label: "Tool Type", type: "select", options: ["Hoe","Shovel","Cutlass","Wheelbarrow","Watering Can"] },
          { key: "brand", label: "Brand", type: "text" },
          { key: "condition", label: "Condition", type: "select", options: ["New","Used"] }
        ]
      },
  
      FARM_PRODUCE: {
        label: "Farm Produce",
        fields: [
          { key: "produceType", label: "Produce Type", type: "select", options: ["Maize","Rice","Cassava","Yam","Beans","Vegetables","Fruits"] },
          { key: "quantity", label: "Quantity", type: "text" },
          { key: "unit", label: "Unit", type: "select", options: ["Bag","Kg","Ton","Basket"] }
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
          { key: "productType", label: "Product Type", type: "select", options: ["Cornflakes","Oats","Rice","Wheat","Millet"] },
          { key: "brand", label: "Brand", type: "text" },
          { key: "packageSize", label: "Package Size", type: "text" },
          { key: "expiryDate", label: "Expiry Date", type: "date" }
        ]
      },
  
      PACKAGED_FOODS: {
        label: "Packaged Foods",
        fields: [
          { key: "foodType", label: "Food Type", type: "select", options: ["Noodles","Biscuits","Snacks","Canned Food","Instant Meals"] },
          { key: "brand", label: "Brand", type: "text" },
          { key: "packageSize", label: "Package Size", type: "text" },
          { key: "expiryDate", label: "Expiry Date", type: "date" }
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
          { key: "vaccinated", label: "Vaccinated", type: "select", options: ["Yes","No"] }
        ]
      },
  
      CATS: {
        label: "Cats",
        fields: [
          { key: "breed", label: "Breed", type: "text" },
          { key: "age", label: "Age", type: "text" },
          { key: "gender", label: "Gender", type: "select", options: ["Male","Female"] }
        ]
      },
  
      PET_ACCESSORIES: {
        label: "Pet Accessories",
        fields: [
          { key: "accessoryType", label: "Accessory Type", type: "select", options: ["Pet Food","Cage","Collar","Aquarium","Pet Bed"] },
          { key: "brand", label: "Brand", type: "text" }
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
          { key: "toyType", label: "Toy Type", type: "select", options: ["Educational Toy","Building Blocks","Action Figure","Puzzle","Doll"] },
          { key: "ageGroup", label: "Age Group", type: "select", options: ["0-2","3-5","6-9","10+"] },
          { key: "brand", label: "Brand", type: "text" },
          { key: "condition", label: "Condition", type: "select", options: ["New","Used"] }
        ]
      },
  
      BOARD_GAMES: {
        label: "Board Games",
        fields: [
          { key: "gameType", label: "Game Type", type: "select", options: ["Chess","Ludo","Monopoly","Scrabble","Puzzle Game"] },
          { key: "players", label: "Number of Players", type: "text" },
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
          { key: "condition", label: "Condition", type: "select", options: ["New", "forein used", "Local used"] },
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

} as const;