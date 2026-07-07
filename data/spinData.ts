export interface SpinDish {
  name: string;
  emoji: string;
  veg: boolean;
  cuisine: string;
}

export interface SpinCuisine {
  id: string;
  label: string;
  emoji: string;
  dishes: SpinDish[];
}

export const spinCuisines: SpinCuisine[] = [
  {
    id: 'north-indian',
    label: 'North Indian',
    emoji: '🍛',
    dishes: [
      { name: 'Rajma Chawal', emoji: '🫘', veg: true, cuisine: 'North Indian' },
      { name: 'Dal Makhani', emoji: '🍲', veg: true, cuisine: 'North Indian' },
      { name: 'Paneer Butter Masala', emoji: '🧀', veg: true, cuisine: 'North Indian' },
      { name: 'Aloo Paratha', emoji: '🫓', veg: true, cuisine: 'North Indian' },
      { name: 'Chole Bhature', emoji: '🍞', veg: true, cuisine: 'North Indian' },
      { name: 'Kadai Paneer', emoji: '🥘', veg: true, cuisine: 'North Indian' },
      { name: 'Palak Paneer', emoji: '🥬', veg: true, cuisine: 'North Indian' },
      { name: 'Butter Chicken', emoji: '🍗', veg: false, cuisine: 'North Indian' },
      { name: 'Mutton Rogan Josh', emoji: '🥩', veg: false, cuisine: 'North Indian' },
      { name: 'Chicken Korma', emoji: '🍛', veg: false, cuisine: 'North Indian' },
      { name: 'Keema Naan', emoji: '🫓', veg: false, cuisine: 'North Indian' },
    ],
  },
  {
    id: 'south-indian',
    label: 'South Indian',
    emoji: '🥞',
    dishes: [
      { name: 'Masala Dosa', emoji: '🥞', veg: true, cuisine: 'South Indian' },
      { name: 'Idli Sambar', emoji: '🍚', veg: true, cuisine: 'South Indian' },
      { name: 'Vada', emoji: '🍩', veg: true, cuisine: 'South Indian' },
      { name: 'Upma', emoji: '🍲', veg: true, cuisine: 'South Indian' },
      { name: 'Pongal', emoji: '🫕', veg: true, cuisine: 'South Indian' },
      { name: 'Bisibelebath', emoji: '🍛', veg: true, cuisine: 'South Indian' },
      { name: 'Avial', emoji: '🥗', veg: true, cuisine: 'South Indian' },
      { name: 'Chettinad Chicken', emoji: '🍗', veg: false, cuisine: 'South Indian' },
      { name: 'Fish Curry Kerala', emoji: '🐟', veg: false, cuisine: 'South Indian' },
    ],
  },
  {
    id: 'punjabi',
    label: 'Punjabi',
    emoji: '🧡',
    dishes: [
      { name: 'Sarson Da Saag', emoji: '🥬', veg: true, cuisine: 'Punjabi' },
      { name: 'Makki Di Roti', emoji: '🫓', veg: true, cuisine: 'Punjabi' },
      { name: 'Paneer Tikka', emoji: '🍢', veg: true, cuisine: 'Punjabi' },
      { name: 'Dal Tadka', emoji: '🫕', veg: true, cuisine: 'Punjabi' },
      { name: 'Lassi', emoji: '🥛', veg: true, cuisine: 'Punjabi' },
      { name: 'Amritsari Kulcha', emoji: '🫓', veg: true, cuisine: 'Punjabi' },
      { name: 'Tandoori Chicken', emoji: '🍗', veg: false, cuisine: 'Punjabi' },
      { name: 'Mutton Biryani', emoji: '🍚', veg: false, cuisine: 'Punjabi' },
      { name: 'Chicken Tikka', emoji: '🍢', veg: false, cuisine: 'Punjabi' },
    ],
  },
  {
    id: 'mughlai',
    label: 'Mughlai',
    emoji: '👑',
    dishes: [
      { name: 'Veg Biryani', emoji: '🍚', veg: true, cuisine: 'Mughlai' },
      { name: 'Paneer Korma', emoji: '🥘', veg: true, cuisine: 'Mughlai' },
      { name: 'Shahi Tukda', emoji: '🍮', veg: true, cuisine: 'Mughlai' },
      { name: 'Dum Aloo', emoji: '🥔', veg: true, cuisine: 'Mughlai' },
      { name: 'Chicken Biryani', emoji: '🍚', veg: false, cuisine: 'Mughlai' },
      { name: 'Seekh Kebab', emoji: '🍢', veg: false, cuisine: 'Mughlai' },
      { name: 'Nihari', emoji: '🍲', veg: false, cuisine: 'Mughlai' },
      { name: 'Mutton Haleem', emoji: '🍛', veg: false, cuisine: 'Mughlai' },
      { name: 'Reshmi Kebab', emoji: '🍗', veg: false, cuisine: 'Mughlai' },
    ],
  },
  {
    id: 'street-food',
    label: 'Street Food',
    emoji: '🍢',
    dishes: [
      { name: 'Pani Puri', emoji: '🫙', veg: true, cuisine: 'Street Food' },
      { name: 'Bhel Puri', emoji: '🍿', veg: true, cuisine: 'Street Food' },
      { name: 'Aloo Chaat', emoji: '🥔', veg: true, cuisine: 'Street Food' },
      { name: 'Samosa', emoji: '🔺', veg: true, cuisine: 'Street Food' },
      { name: 'Dahi Puri', emoji: '🥣', veg: true, cuisine: 'Street Food' },
      { name: 'Pav Bhaji', emoji: '🍔', veg: true, cuisine: 'Street Food' },
      { name: 'Vada Pav', emoji: '🍔', veg: true, cuisine: 'Street Food' },
      { name: 'Egg Roll', emoji: '🥚', veg: false, cuisine: 'Street Food' },
      { name: 'Kathi Roll', emoji: '🌯', veg: false, cuisine: 'Street Food' },
    ],
  },
  {
    id: 'chinese',
    label: 'Indo-Chinese',
    emoji: '🍜',
    dishes: [
      { name: 'Veg Hakka Noodles', emoji: '🍜', veg: true, cuisine: 'Indo-Chinese' },
      { name: 'Veg Manchurian', emoji: '🥢', veg: true, cuisine: 'Indo-Chinese' },
      { name: 'Gobi Manchurian', emoji: '🥦', veg: true, cuisine: 'Indo-Chinese' },
      { name: 'Paneer Fried Rice', emoji: '🍚', veg: true, cuisine: 'Indo-Chinese' },
      { name: 'Chilli Paneer', emoji: '🌶️', veg: true, cuisine: 'Indo-Chinese' },
      { name: 'Spring Rolls', emoji: '🥟', veg: true, cuisine: 'Indo-Chinese' },
      { name: 'Chicken Noodles', emoji: '🍜', veg: false, cuisine: 'Indo-Chinese' },
      { name: 'Chicken Manchurian', emoji: '🥢', veg: false, cuisine: 'Indo-Chinese' },
      { name: 'Chilli Chicken', emoji: '🍗', veg: false, cuisine: 'Indo-Chinese' },
      { name: 'Egg Fried Rice', emoji: '🥚', veg: false, cuisine: 'Indo-Chinese' },
    ],
  },
  {
    id: 'continental',
    label: 'Continental',
    emoji: '🍝',
    dishes: [
      { name: 'Pasta Arrabbiata', emoji: '🍝', veg: true, cuisine: 'Continental' },
      { name: 'Margherita Pizza', emoji: '🍕', veg: true, cuisine: 'Continental' },
      { name: 'Bruschetta', emoji: '🥖', veg: true, cuisine: 'Continental' },
      { name: 'Veg Sandwich', emoji: '🥪', veg: true, cuisine: 'Continental' },
      { name: 'Mushroom Risotto', emoji: '🍄', veg: true, cuisine: 'Continental' },
      { name: 'Caesar Salad', emoji: '🥗', veg: true, cuisine: 'Continental' },
      { name: 'Chicken Pasta', emoji: '🍝', veg: false, cuisine: 'Continental' },
      { name: 'Chicken Burger', emoji: '🍔', veg: false, cuisine: 'Continental' },
      { name: 'Grilled Chicken', emoji: '🍗', veg: false, cuisine: 'Continental' },
    ],
  },
  {
    id: 'maharashtrian',
    label: 'Maharashtrian',
    emoji: '🌶️',
    dishes: [
      { name: 'Misal Pav', emoji: '🥣', veg: true, cuisine: 'Maharashtrian' },
      { name: 'Puran Poli', emoji: '🫓', veg: true, cuisine: 'Maharashtrian' },
      { name: 'Sabudana Khichdi', emoji: '🫕', veg: true, cuisine: 'Maharashtrian' },
      { name: 'Poha', emoji: '🍚', veg: true, cuisine: 'Maharashtrian' },
      { name: 'Modak', emoji: '🥮', veg: true, cuisine: 'Maharashtrian' },
      { name: 'Thalipeeth', emoji: '🫓', veg: true, cuisine: 'Maharashtrian' },
      { name: 'Kolhapuri Chicken', emoji: '🍗', veg: false, cuisine: 'Maharashtrian' },
      { name: 'Mutton Kheema', emoji: '🥩', veg: false, cuisine: 'Maharashtrian' },
    ],
  },
  {
    id: 'gujarati',
    label: 'Gujarati',
    emoji: '🍬',
    dishes: [
      { name: 'Dhokla', emoji: '🟡', veg: true, cuisine: 'Gujarati' },
      { name: 'Thepla', emoji: '🫓', veg: true, cuisine: 'Gujarati' },
      { name: 'Undhiyu', emoji: '🥘', veg: true, cuisine: 'Gujarati' },
      { name: 'Khandvi', emoji: '🥗', veg: true, cuisine: 'Gujarati' },
      { name: 'Dal Dhokli', emoji: '🫕', veg: true, cuisine: 'Gujarati' },
      { name: 'Fafda Jalebi', emoji: '🍩', veg: true, cuisine: 'Gujarati' },
      { name: 'Sev Tameta', emoji: '🍅', veg: true, cuisine: 'Gujarati' },
    ],
  },
];

export const DEFAULT_DISHES: SpinDish[] = [
  { name: 'Pizza', emoji: '🍕', veg: true, cuisine: 'Continental' },
  { name: 'Pasta', emoji: '🍝', veg: true, cuisine: 'Continental' },
  { name: 'Rajma Chawal', emoji: '🫘', veg: true, cuisine: 'North Indian' },
  { name: 'Masala Dosa', emoji: '🥞', veg: true, cuisine: 'South Indian' },
  { name: 'Chicken Biryani', emoji: '🍚', veg: false, cuisine: 'Mughlai' },
  { name: 'Veg Noodles', emoji: '🍜', veg: true, cuisine: 'Indo-Chinese' },
  { name: 'Chole Bhature', emoji: '🍞', veg: true, cuisine: 'North Indian' },
  { name: 'Pani Puri', emoji: '🫙', veg: true, cuisine: 'Street Food' },
];
