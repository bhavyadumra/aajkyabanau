import { Ingredient } from '@/types';

export const ingredients: Ingredient[] = [
  // Vegetables
  { id: 'onion', name: 'Onion', nameHindi: 'प्याज़', category: 'Vegetables', emoji: '🧅', common: true },
  { id: 'tomato', name: 'Tomato', nameHindi: 'टमाटर', category: 'Vegetables', emoji: '🍅', common: true },
  { id: 'potato', name: 'Potato', nameHindi: 'आलू', category: 'Vegetables', emoji: '🥔', common: true },
  { id: 'garlic', name: 'Garlic', nameHindi: 'लहसुन', category: 'Vegetables', emoji: '🧄', common: true },
  { id: 'ginger', name: 'Ginger', nameHindi: 'अदरक', category: 'Vegetables', emoji: '🫚', common: true },
  { id: 'green-chilli', name: 'Green Chilli', nameHindi: 'हरी मिर्च', category: 'Vegetables', emoji: '🌶️', common: true },
  { id: 'capsicum', name: 'Capsicum', nameHindi: 'शिमला मिर्च', category: 'Vegetables', emoji: '🫑' },
  { id: 'cauliflower', name: 'Cauliflower', nameHindi: 'गोभी', category: 'Vegetables', emoji: '🥦' },
  { id: 'peas', name: 'Peas', nameHindi: 'मटर', category: 'Vegetables', emoji: '🟢' },
  { id: 'spinach', name: 'Spinach', nameHindi: 'पालक', category: 'Vegetables', emoji: '🥬' },
  { id: 'brinjal', name: 'Brinjal/Baingan', nameHindi: 'बैंगन', category: 'Vegetables', emoji: '🍆' },
  { id: 'bottle-gourd', name: 'Bottle Gourd', nameHindi: 'लौकी', category: 'Vegetables', emoji: '🥒' },
  { id: 'bitter-gourd', name: 'Bitter Gourd', nameHindi: 'करेला', category: 'Vegetables', emoji: '🟩' },
  { id: 'ridge-gourd', name: 'Ridge Gourd', nameHindi: 'तोरई', category: 'Vegetables', emoji: '🥒' },
  { id: 'carrot', name: 'Carrot', nameHindi: 'गाजर', category: 'Vegetables', emoji: '🥕' },
  { id: 'beans', name: 'French Beans', nameHindi: 'फ्रेंच बींस', category: 'Vegetables', emoji: '🫘' },
  { id: 'corn', name: 'Corn', nameHindi: 'मक्का', category: 'Vegetables', emoji: '🌽' },
  { id: 'mushroom', name: 'Mushroom', nameHindi: 'मशरूम', category: 'Vegetables', emoji: '🍄' },
  { id: 'cabbage', name: 'Cabbage', nameHindi: 'पत्ता गोभी', category: 'Vegetables', emoji: '🥬' },
  { id: 'sweet-potato', name: 'Sweet Potato', nameHindi: 'शकरकंद', category: 'Vegetables', emoji: '🍠' },
  { id: 'radish', name: 'Radish', nameHindi: 'मूली', category: 'Vegetables', emoji: '🔴' },
  { id: 'drumstick', name: 'Drumstick', nameHindi: 'सहजन', category: 'Vegetables', emoji: '🌿' },
  { id: 'raw-banana', name: 'Raw Banana', nameHindi: 'कच्चा केला', category: 'Vegetables', emoji: '🍌' },
  { id: 'colocasia', name: 'Colocasia/Arbi', nameHindi: 'अरबी', category: 'Vegetables', emoji: '🟤' },
  { id: 'cucumber', name: 'Cucumber', nameHindi: 'खीरा', category: 'Vegetables', emoji: '🥒' },
  { id: 'pumpkin', name: 'Pumpkin', nameHindi: 'कद्दू', category: 'Vegetables', emoji: '🎃' },
  { id: 'raw-mango', name: 'Raw Mango', nameHindi: 'कच्चा आम', category: 'Vegetables', emoji: '🥭' },

  // Pulses & Dal
  { id: 'toor-dal', name: 'Toor Dal', nameHindi: 'तूर दाल', category: 'Pulses & Dal', emoji: '🟡', common: true },
  { id: 'moong-dal', name: 'Moong Dal', nameHindi: 'मूंग दाल', category: 'Pulses & Dal', emoji: '🟢', common: true },
  { id: 'chana-dal', name: 'Chana Dal', nameHindi: 'चना दाल', category: 'Pulses & Dal', emoji: '🟡' },
  { id: 'urad-dal', name: 'Urad Dal', nameHindi: 'उड़द दाल', category: 'Pulses & Dal', emoji: '⚪' },
  { id: 'masoor-dal', name: 'Masoor Dal', nameHindi: 'मसूर दाल', category: 'Pulses & Dal', emoji: '🔴' },
  { id: 'rajma', name: 'Rajma', nameHindi: 'राजमा', category: 'Pulses & Dal', emoji: '🔴' },
  { id: 'kabuli-chana', name: 'Kabuli Chana', nameHindi: 'काबुली चना', category: 'Pulses & Dal', emoji: '🟤' },
  { id: 'kala-chana', name: 'Kala Chana', nameHindi: 'काला चना', category: 'Pulses & Dal', emoji: '⚫' },
  { id: 'moong-whole', name: 'Whole Moong', nameHindi: 'साबुत मूंग', category: 'Pulses & Dal', emoji: '🟢' },
  { id: 'lobia', name: 'Lobia', nameHindi: 'लोबिया', category: 'Pulses & Dal', emoji: '⚪' },

  // Flour & Grains
  { id: 'atta', name: 'Wheat Flour (Atta)', nameHindi: 'आटा', category: 'Flour & Grains', emoji: '🌾', common: true },
  { id: 'rice', name: 'Rice', nameHindi: 'चावल', category: 'Flour & Grains', emoji: '🍚', common: true },
  { id: 'maida', name: 'Maida (All Purpose Flour)', nameHindi: 'मैदा', category: 'Flour & Grains', emoji: '⚪' },
  { id: 'besan', name: 'Besan (Gram Flour)', nameHindi: 'बेसन', category: 'Flour & Grains', emoji: '🟡', common: true },
  { id: 'sooji', name: 'Sooji/Rava', nameHindi: 'सूजी', category: 'Flour & Grains', emoji: '🟤' },
  { id: 'poha', name: 'Poha (Flattened Rice)', nameHindi: 'पोहा', category: 'Flour & Grains', emoji: '🍚' },
  { id: 'oats', name: 'Oats', nameHindi: 'ओट्स', category: 'Flour & Grains', emoji: '🌾' },
  { id: 'cornflour', name: 'Cornflour', nameHindi: 'कॉर्नफ्लोर', category: 'Flour & Grains', emoji: '🌽' },
  { id: 'bread', name: 'Bread', nameHindi: 'ब्रेड', category: 'Flour & Grains', emoji: '🍞' },
  { id: 'millet', name: 'Millet (Bajra)', nameHindi: 'बाजरा', category: 'Flour & Grains', emoji: '🌾' },
  { id: 'jowar', name: 'Jowar Flour', nameHindi: 'ज्वार', category: 'Flour & Grains', emoji: '🌾' },
  { id: 'rice-flour', name: 'Rice Flour', nameHindi: 'चावल का आटा', category: 'Flour & Grains', emoji: '⚪' },
  { id: 'vermicelli', name: 'Vermicelli/Sevai', nameHindi: 'सेवई', category: 'Flour & Grains', emoji: '🍝' },

  // Dairy
  { id: 'milk', name: 'Milk', nameHindi: 'दूध', category: 'Dairy', emoji: '🥛', common: true },
  { id: 'curd', name: 'Curd/Yogurt', nameHindi: 'दही', category: 'Dairy', emoji: '🫙', common: true },
  { id: 'paneer', name: 'Paneer', nameHindi: 'पनीर', category: 'Dairy', emoji: '🧀', common: true },
  { id: 'butter', name: 'Butter', nameHindi: 'मक्खन', category: 'Dairy', emoji: '🧈' },
  { id: 'cream', name: 'Fresh Cream', nameHindi: 'क्रीम', category: 'Dairy', emoji: '🥛' },
  { id: 'ghee', name: 'Ghee', nameHindi: 'घी', category: 'Dairy', emoji: '🫙', common: true },
  { id: 'khoya', name: 'Khoya/Mawa', nameHindi: 'खोया', category: 'Dairy', emoji: '🟤' },
  { id: 'condensed-milk', name: 'Condensed Milk', nameHindi: 'मिल्कमेड', category: 'Dairy', emoji: '🥛' },
  { id: 'cheese', name: 'Cheese', nameHindi: 'चीज़', category: 'Dairy', emoji: '🧀' },

  // Oils & Ghee
  { id: 'oil', name: 'Cooking Oil', nameHindi: 'तेल', category: 'Oils & Ghee', emoji: '🫙', common: true },
  { id: 'mustard-oil', name: 'Mustard Oil', nameHindi: 'सरसों तेल', category: 'Oils & Ghee', emoji: '🟡' },
  { id: 'coconut-oil', name: 'Coconut Oil', nameHindi: 'नारियल तेल', category: 'Oils & Ghee', emoji: '🥥' },

  // Masalas & Spices
  { id: 'salt', name: 'Salt', nameHindi: 'नमक', category: 'Masalas & Spices', emoji: '🧂', common: true },
  { id: 'red-chilli', name: 'Red Chilli Powder', nameHindi: 'लाल मिर्च', category: 'Masalas & Spices', emoji: '🌶️', common: true },
  { id: 'turmeric', name: 'Turmeric', nameHindi: 'हल्दी', category: 'Masalas & Spices', emoji: '🟡', common: true },
  { id: 'cumin', name: 'Cumin/Jeera', nameHindi: 'जीरा', category: 'Masalas & Spices', emoji: '🌿', common: true },
  { id: 'mustard-seeds', name: 'Mustard Seeds', nameHindi: 'राई', category: 'Masalas & Spices', emoji: '⚫' },
  { id: 'garam-masala', name: 'Garam Masala', nameHindi: 'गरम मसाला', category: 'Masalas & Spices', emoji: '🌿', common: true },
  { id: 'coriander-powder', name: 'Coriander Powder', nameHindi: 'धनिया पाउडर', category: 'Masalas & Spices', emoji: '🟤', common: true },
  { id: 'chana-masala', name: 'Chana Masala', nameHindi: 'छोले मसाला', category: 'Masalas & Spices', emoji: '🌶️' },
  { id: 'biryani-masala', name: 'Biryani Masala', nameHindi: 'बिरयानी मसाला', category: 'Masalas & Spices', emoji: '🌶️' },
  { id: 'amchur', name: 'Amchur (Dry Mango)', nameHindi: 'अमचूर', category: 'Masalas & Spices', emoji: '🟡' },
  { id: 'hing', name: 'Hing/Asafoetida', nameHindi: 'हींग', category: 'Masalas & Spices', emoji: '🟤', common: true },
  { id: 'bay-leaf', name: 'Bay Leaf', nameHindi: 'तेजपत्ता', category: 'Masalas & Spices', emoji: '🌿' },
  { id: 'cardamom', name: 'Cardamom/Elaichi', nameHindi: 'इलायची', category: 'Masalas & Spices', emoji: '🟢' },
  { id: 'cloves', name: 'Cloves', nameHindi: 'लौंग', category: 'Masalas & Spices', emoji: '🟤' },
  { id: 'cinnamon', name: 'Cinnamon', nameHindi: 'दालचीनी', category: 'Masalas & Spices', emoji: '🟤' },
  { id: 'pepper', name: 'Black Pepper', nameHindi: 'काली मिर्च', category: 'Masalas & Spices', emoji: '⚫' },
  { id: 'kashmiri-mirch', name: 'Kashmiri Red Chilli', nameHindi: 'कश्मीरी मिर्च', category: 'Masalas & Spices', emoji: '🔴' },
  { id: 'chat-masala', name: 'Chat Masala', nameHindi: 'चाट मसाला', category: 'Masalas & Spices', emoji: '🌶️' },
  { id: 'sugar', name: 'Sugar', nameHindi: 'चीनी', category: 'Masalas & Spices', emoji: '🍬', common: true },

  // Herbs
  { id: 'coriander', name: 'Coriander Leaves', nameHindi: 'धनिया', category: 'Herbs', emoji: '🌿', common: true },
  { id: 'mint', name: 'Mint Leaves', nameHindi: 'पुदीना', category: 'Herbs', emoji: '🌿' },
  { id: 'curry-leaves', name: 'Curry Leaves', nameHindi: 'करी पत्ता', category: 'Herbs', emoji: '🌿' },
  { id: 'fenugreek-leaves', name: 'Fenugreek Leaves', nameHindi: 'मेथी पत्ता', category: 'Herbs', emoji: '🌿' },

  // Sauces & Condiments
  { id: 'soy-sauce', name: 'Soy Sauce', nameHindi: 'सोय सॉस', category: 'Sauces & Condiments', emoji: '🟤' },
  { id: 'vinegar', name: 'Vinegar', nameHindi: 'सिरका', category: 'Sauces & Condiments', emoji: '🍾' },
  { id: 'ketchup', name: 'Tomato Ketchup', nameHindi: 'केचप', category: 'Sauces & Condiments', emoji: '🟥' },
  { id: 'tamarind', name: 'Tamarind/Imli', nameHindi: 'इमली', category: 'Sauces & Condiments', emoji: '🟤' },
  { id: 'coconut', name: 'Coconut', nameHindi: 'नारियल', category: 'Sauces & Condiments', emoji: '🥥' },

  // Nuts & Dry Fruits
  { id: 'cashew', name: 'Cashew', nameHindi: 'काजू', category: 'Nuts & Dry Fruits', emoji: '🥜' },
  { id: 'almonds', name: 'Almonds', nameHindi: 'बादाम', category: 'Nuts & Dry Fruits', emoji: '🥜' },
  { id: 'raisins', name: 'Raisins', nameHindi: 'किशमिश', category: 'Nuts & Dry Fruits', emoji: '🍇' },
  { id: 'peanuts', name: 'Peanuts', nameHindi: 'मूंगफली', category: 'Nuts & Dry Fruits', emoji: '🥜' },
  { id: 'sesame', name: 'Sesame Seeds', nameHindi: 'तिल', category: 'Nuts & Dry Fruits', emoji: '⚪' },

  // Fruits
  { id: 'lemon', name: 'Lemon', nameHindi: 'नींबू', category: 'Fruits', emoji: '🍋', common: true },
  { id: 'banana', name: 'Banana', nameHindi: 'केला', category: 'Fruits', emoji: '🍌' },
  { id: 'mango', name: 'Mango', nameHindi: 'आम', category: 'Fruits', emoji: '🥭' },
  { id: 'apple', name: 'Apple', nameHindi: 'सेब', category: 'Fruits', emoji: '🍎' },

  // Non-Veg
  { id: 'chicken', name: 'Chicken', nameHindi: 'चिकन', category: 'Non-Veg', emoji: '🍗' },
  { id: 'mutton', name: 'Mutton', nameHindi: 'मटन', category: 'Non-Veg', emoji: '🥩' },
  { id: 'fish', name: 'Fish', nameHindi: 'मछली', category: 'Non-Veg', emoji: '🐟' },
  { id: 'eggs', name: 'Eggs', nameHindi: 'अंडे', category: 'Non-Veg', emoji: '🥚' },
  { id: 'prawns', name: 'Prawns', nameHindi: 'झींगा', category: 'Non-Veg', emoji: '🍤' },

  // Frozen
  { id: 'frozen-peas', name: 'Frozen Peas', nameHindi: 'फ्रोज़न मटर', category: 'Frozen', emoji: '🟢' },
  { id: 'frozen-corn', name: 'Frozen Corn', nameHindi: 'फ्रोज़न मक्का', category: 'Frozen', emoji: '🌽' },

  // Bakery & Snacks
  { id: 'biscuits', name: 'Biscuits', nameHindi: 'बिस्किट', category: 'Bakery & Snacks', emoji: '🍪' },
  { id: 'papad', name: 'Papad', nameHindi: 'पापड़', category: 'Bakery & Snacks', emoji: '🫓' },
  { id: 'sev', name: 'Sev', nameHindi: 'सेव', category: 'Bakery & Snacks', emoji: '🟡' },
  { id: 'murmura', name: 'Murmura/Puffed Rice', nameHindi: 'मुरमुरा', category: 'Bakery & Snacks', emoji: '⚪' },

  // Sweet Items
  { id: 'jaggery', name: 'Jaggery/Gud', nameHindi: 'गुड़', category: 'Sweet Items', emoji: '🟤' },
  { id: 'honey', name: 'Honey', nameHindi: 'शहद', category: 'Sweet Items', emoji: '🍯' },
  { id: 'rose-water', name: 'Rose Water', nameHindi: 'गुलाब जल', category: 'Sweet Items', emoji: '🌹' },
];

export const ingredientCategories = [
  'All',
  'Vegetables',
  'Pulses & Dal',
  'Flour & Grains',
  'Dairy',
  'Oils & Ghee',
  'Masalas & Spices',
  'Herbs',
  'Sauces & Condiments',
  'Nuts & Dry Fruits',
  'Fruits',
  'Non-Veg',
  'Frozen',
  'Bakery & Snacks',
  'Sweet Items',
] as const;
