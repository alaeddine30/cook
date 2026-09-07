import { Ingredient, IngredientCategory } from '../types';

export interface CategoryMeta {
  id: IngredientCategory;
  name: string;
  icon: string;
  count?: number;
}

export const INGREDIENT_CATEGORIES: CategoryMeta[] = [
  { id: 'vegetables', name: 'الخضروات', icon: '🥕' },
  { id: 'chicken', name: 'الدجاج والطيور', icon: '🍗' },
  { id: 'meat', name: 'اللحوم الحمراء', icon: '🥩' },
  { id: 'fish', name: 'الأسماك والمأكولات البحرية', icon: '🐟' },
  { id: 'grains', name: 'الحبوب والبقوليات', icon: '🌾' },
  { id: 'dairy', name: 'الألبان والأجبان والبيض', icon: '🧀' },
  { id: 'spices', name: 'التوابل والبهارات', icon: '🧂' },
  { id: 'other', name: 'مكونات أساسية وتموينية', icon: '🫒' },
];

export const INITIAL_INGREDIENTS: Ingredient[] = [
  // الخضروات
  { id: 'onion', name: 'بصل', category: 'vegetables', categoryName: 'الخضروات', icon: '🧅', isStaple: true },
  { id: 'garlic', name: 'ثوم', category: 'vegetables', categoryName: 'الخضروات', icon: '🧄', isStaple: true },
  { id: 'tomato', name: 'طماطم طازجة', category: 'vegetables', categoryName: 'الخضروات', icon: '🍅', isStaple: true },
  { id: 'potato', name: 'بطاطا', category: 'vegetables', categoryName: 'الخضروات', icon: '🥔', isStaple: true },
  { id: 'carrot', name: 'جزر', category: 'vegetables', categoryName: 'الخضروات', icon: '🥕', isStaple: true },
  { id: 'zucchini', name: 'كوسة (قرعة)', category: 'vegetables', categoryName: 'الخضروات', icon: '🥒' },
  { id: 'turnip', name: 'لفت (خردل)', category: 'vegetables', categoryName: 'الخضروات', icon: '🥗' },
  { id: 'hot_pepper', name: 'فلفل حار (حار)', category: 'vegetables', categoryName: 'الخضروات', icon: '🌶️', isStaple: true },
  { id: 'sweet_pepper', name: 'فلفل حلو (طرشي)', category: 'vegetables', categoryName: 'الخضروات', icon: '🫑' },
  { id: 'parsley', name: 'معدنوس (بقدونس)', category: 'vegetables', categoryName: 'الخضروات', icon: '🌿', isStaple: true },
  { id: 'coriander', name: 'قزبور (كزبرة خضراء)', category: 'vegetables', categoryName: 'الخضروات', icon: '🌱', isStaple: true },
  { id: 'celery', name: 'كرافس', category: 'vegetables', categoryName: 'الخضروات', icon: '🥬' },
  { id: 'mint', name: 'نعناع', category: 'vegetables', categoryName: 'الخضروات', icon: '🍃' },
  { id: 'eggplant', name: 'باذنجان', category: 'vegetables', categoryName: 'الخضروات', icon: '🍆' },
  { id: 'pumpkin', name: 'يقطين (كابويا)', category: 'vegetables', categoryName: 'الخضروات', icon: '🎃' },
  { id: 'cucumber', name: 'خيار', category: 'vegetables', categoryName: 'الخضروات', icon: '🥒' },
  { id: 'lettuce', name: 'خس طازج (سلاطة)', category: 'vegetables', categoryName: 'الخضروات', icon: '🥬', isStaple: true },
  { id: 'pickles', name: 'خيار مخلل (كورنيشون)', category: 'vegetables', categoryName: 'الخضروات', icon: '🥒' },

  // الدجاج
  { id: 'chicken_meat', name: 'دجاج (أفخاذ أو صدور)', category: 'chicken', categoryName: 'الدجاج والطيور', icon: '🍗', isStaple: true },
  { id: 'chicken_breast', name: 'صدر دجاج مقطع', category: 'chicken', categoryName: 'الدجاج والطيور', icon: '🥩' },
  { id: 'minced_chicken', name: 'دجاج مفروم', category: 'chicken', categoryName: 'الدجاج والطيور', icon: '🥣' },

  // اللحوم
  { id: 'lamb', name: 'لحم خروف (ضأن)', category: 'meat', categoryName: 'اللحوم الحمراء', icon: '🍖' },
  { id: 'beef', name: 'لحم بقر', category: 'meat', categoryName: 'اللحوم الحمراء', icon: '🥩' },
  { id: 'minced_meat', name: 'لحم مفروم (كفتة)', category: 'meat', categoryName: 'اللحوم الحمراء', icon: '🍔', isStaple: true },

  // الأسماك
  { id: 'sardine', name: 'سردين طازج', category: 'fish', categoryName: 'الأسماك والمأكولات البحرية', icon: '🐟' },
  { id: 'white_fish', name: 'سمك أبيض أو مرجان', category: 'fish', categoryName: 'الأسماك والمأكولات البحرية', icon: '🐠' },
  { id: 'tuna', name: 'تونة معلبة', category: 'fish', categoryName: 'الأسماك والمأكولات البحرية', icon: '🥫', isStaple: true },
  { id: 'shrimp', name: 'جمبري (روبيان)', category: 'fish', categoryName: 'الأسماك والمأكولات البحرية', icon: '🦐' },

  // الحبوب والبقوليات
  { id: 'couscous', name: 'كسكس (طعام)', category: 'grains', categoryName: 'الحبوب والبقوليات', icon: '🍚', isStaple: true },
  { id: 'rechta', name: 'رشتة طازجة أو يابسة', category: 'grains', categoryName: 'الحبوب والبقوليات', icon: '🍜' },
  { id: 'semolina_fine', name: 'دقيق سميد رقيق', category: 'grains', categoryName: 'الحبوب والبقوليات', icon: '🌾', isStaple: true },
  { id: 'semolina_medium', name: 'سميد متوسط أو خشن', category: 'grains', categoryName: 'الحبوب والبقوليات', icon: '🌾' },
  { id: 'freekeh', name: 'فريك (قمح أخضر)', category: 'grains', categoryName: 'الحبوب والبقوليات', icon: '🥣' },
  { id: 'chickpeas', name: 'حمص منقوع أو مطبوخ', category: 'grains', categoryName: 'الحبوب والبقوليات', icon: '🧆', isStaple: true },
  { id: 'pasta', name: 'مقارونة (معكرونة)', category: 'grains', categoryName: 'الحبوب والبقوليات', icon: '🍝', isStaple: true },
  { id: 'trida', name: 'تريدة أو تليتلي', category: 'grains', categoryName: 'الحبوب والبقوليات', icon: '🍲' },
  { id: 'chakhchoukha_dough', name: 'رقاق الشخشوخة (فطير)', category: 'grains', categoryName: 'الحبوب والبقوليات', icon: '🫓' },
  { id: 'dioul', name: 'أوراق الديول (ورق بوراك)', category: 'grains', categoryName: 'الحبوب والبقوليات', icon: '📜', isStaple: true },
  { id: 'rice', name: 'أرز', category: 'grains', categoryName: 'الحبوب والبقوليات', icon: '🍚', isStaple: true },
  { id: 'green_peas', name: 'جلبانة (بازلاء)', category: 'grains', categoryName: 'الحبوب والبقوليات', icon: '🟢' },
  { id: 'broad_beans', name: 'فول يابس أو أخضر', category: 'grains', categoryName: 'الحبوب والبقوليات', icon: '🫘' },
  { id: 'flour', name: 'فرينة (طحين أبيض)', category: 'grains', categoryName: 'الحبوب والبقوليات', icon: '🥡', isStaple: true },
  { id: 'burger_buns', name: 'خبز البرغر (ساندويتش)', category: 'grains', categoryName: 'الحبوب والبقوليات', icon: '🍔', isStaple: true },
  { id: 'tortilla', name: 'خبز تورتيلا أو طاكوس', category: 'grains', categoryName: 'الحبوب والبقوليات', icon: '🫓' },
  { id: 'chickpea_flour', name: 'فرينة الحمص (طحين الحمص للقرنطيطة)', category: 'grains', categoryName: 'الحبوب والبقوليات', icon: '🧆', isStaple: true },
  { id: 'baguette', name: 'خبز باغيت (للشطائر والقرنطيطة)', category: 'grains', categoryName: 'الحبوب والبقوليات', icon: '🥖', isStaple: true },

  // الألبان والأجبان والبيض
  { id: 'egg', name: 'بيض', category: 'dairy', categoryName: 'الألبان والأجبان والبيض', icon: '🥚', isStaple: true },
  { id: 'cheese_portions', name: 'جبن مثلثات أو طري', category: 'dairy', categoryName: 'الألبان والأجبان والبيض', icon: '🧀', isStaple: true },
  { id: 'grated_cheese', name: 'جبن مبشور (شيدر أو غرويير)', category: 'dairy', categoryName: 'الألبان والأجبان والبيض', icon: '🧀' },
  { id: 'cheddar_slices', name: 'جبن شيدر ساندويتش (شرائح)', category: 'dairy', categoryName: 'الألبان والأجبان والبيض', icon: '🧀', isStaple: true },
  { id: 'butter', name: 'زبدة', category: 'dairy', categoryName: 'الألبان والأجبان والبيض', icon: '🧈', isStaple: true },
  { id: 'milk', name: 'حليب', category: 'dairy', categoryName: 'الألبان والأجبان والبيض', icon: '🥛', isStaple: true },
  { id: 'laban', name: 'لبن أو رايب', category: 'dairy', categoryName: 'الألبان والأجبان والبيض', icon: '🥛' },

  // التوابل والبهارات
  { id: 'salt', name: 'ملح', category: 'spices', categoryName: 'التوابل والبهارات', icon: '🧂', isStaple: true },
  { id: 'black_pepper', name: 'فلفل أسود', category: 'spices', categoryName: 'التوابل والبهارات', icon: '⚫', isStaple: true },
  { id: 'ras_el_hanout', name: 'رأس الحانوت الجزائري', category: 'spices', categoryName: 'التوابل والبهارات', icon: '🌶️', isStaple: true },
  { id: 'cinnamon', name: 'قرفة (عود أو مطحونة)', category: 'spices', categoryName: 'التوابل والبهارات', icon: '🥢', isStaple: true },
  { id: 'cumin', name: 'كمون', category: 'spices', categoryName: 'التوابل والبهارات', icon: '🌱', isStaple: true },
  { id: 'paprika', name: 'فلفل عكري (بابريكا حمراء)', category: 'spices', categoryName: 'التوابل والبهارات', icon: '🔴', isStaple: true },
  { id: 'turmeric', name: 'كركم أو زعفران', category: 'spices', categoryName: 'التوابل والبهارات', icon: '🟡' },
  { id: 'caraway', name: 'كروية', category: 'spices', categoryName: 'التوابل والبهارات', icon: '🍂' },

  // مكونات أساسية أخرى
  { id: 'olive_oil', name: 'زيت زيتون حرة', category: 'other', categoryName: 'مكونات أساسية وتموينية', icon: '🫒', isStaple: true },
  { id: 'vegetable_oil', name: 'زيت مائدة نباتي', category: 'other', categoryName: 'مكونات أساسية وتموينية', icon: '🌻', isStaple: true },
  { id: 'smen', name: 'سمن بلدي', category: 'other', categoryName: 'مكونات أساسية وتموينية', icon: '🧈' },
  { id: 'tomato_paste', name: 'طماطم مصبرة (معجون)', category: 'other', categoryName: 'مكونات أساسية وتموينية', icon: '🥫', isStaple: true },
  { id: 'harissa', name: 'هريسة حارة', category: 'other', categoryName: 'مكونات أساسية وتموينية', icon: '🔥', isStaple: true },
  { id: 'lemon', name: 'ليمون (قارص)', category: 'other', categoryName: 'مكونات أساسية وتموينية', icon: '🍋', isStaple: true },
  { id: 'orange_blossom_water', name: 'ماء زهر', category: 'other', categoryName: 'مكونات أساسية وتموينية', icon: '🌸' },
  { id: 'honey', name: 'عسل أو شاربات', category: 'other', categoryName: 'مكونات أساسية وتموينية', icon: '🍯' },
  { id: 'dates_paste', name: 'غرس (عجينة تمر)', category: 'other', categoryName: 'مكونات أساسية وتموينية', icon: '🌴' },
  { id: 'almonds', name: 'لوز أو كاوكاو (فول سوداني)', category: 'other', categoryName: 'مكونات أساسية وتموينية', icon: '🥜' },
  { id: 'sugar', name: 'سكر', category: 'other', categoryName: 'مكونات أساسية وتموينية', icon: '🍬', isStaple: true },
  { id: 'baking_yeast', name: 'خميرة خبز أو حلوى', category: 'other', categoryName: 'مكونات أساسية وتموينية', icon: '🍞', isStaple: true },
  { id: 'olives', name: 'زيتون أخضر منزوع الملح', category: 'other', categoryName: 'مكونات أساسية وتموينية', icon: '🫒' },
  { id: 'prunes_dried', name: 'برقوق ومشمش مجفف (عين بقرة)', category: 'other', categoryName: 'مكونات أساسية وتموينية', icon: '🫐' },
  { id: 'raisins', name: 'زبيب', category: 'other', categoryName: 'مكونات أساسية وتموينية', icon: '🍇' },
  { id: 'mayonnaise', name: 'مايونيز', category: 'other', categoryName: 'مكونات أساسية وتموينية', icon: '🥣', isStaple: true },
  { id: 'ketchup', name: 'كاتشب', category: 'other', categoryName: 'مكونات أساسية وتموينية', icon: '🍅', isStaple: true },
];

export const ALGERIAN_PANTRY_PRESET: string[] = [
  'onion',
  'garlic',
  'tomato',
  'potato',
  'carrot',
  'zucchini',
  'turnip',
  'hot_pepper',
  'parsley',
  'coriander',
  'chicken_meat',
  'couscous',
  'chickpeas',
  'pasta',
  'dioul',
  'egg',
  'cheese_portions',
  'salt',
  'black_pepper',
  'ras_el_hanout',
  'cinnamon',
  'paprika',
  'olive_oil',
  'vegetable_oil',
  'tomato_paste',
  'harissa',
  'lemon',
];
