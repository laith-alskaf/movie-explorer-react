# 📖 الدليل الشامل لإدارة الحالة (State Management) في React

> هذا الدليل مكتوب خصيصاً للمهندس **ليث الصقاف** — يشرح كل مفهوم من الصفر بأسلوب واضح وبسيط مع أمثلة عملية من مشروع CineWave.

---

## 📌 الفهرس

1. [ما هي "الحالة" (State) في React؟](#1-ما-هي-الحالة-state-في-react)
2. [لماذا نحتاج إدارة حالة مركزية؟](#2-لماذا-نحتاج-إدارة-حالة-مركزية)
3. [مقارنة بين حلول إدارة الحالة](#3-مقارنة-بين-حلول-إدارة-الحالة)
4. [لماذا اخترنا Zustand؟](#4-لماذا-اخترنا-zustand)
5. [شرح Zustand بالتفصيل](#5-شرح-zustand-بالتفصيل)
6. [المعمارية النظيفة لتنظيم الـ Store](#6-المعمارية-النظيفة-لتنظيم-الـ-store)
7. [مقارنة: الكود قبل وبعد Zustand](#7-مقارنة-الكود-قبل-وبعد-zustand)
8. [مفاهيم متقدمة](#8-مفاهيم-متقدمة)

---

## 1. ما هي "الحالة" (State) في React؟

### التعريف البسيط
**الحالة (State)** هي أي بيانات يمكن أن تتغير مع الوقت في تطبيقك وتؤثر على ما يراه المستخدم.

### أمثلة عملية من مشروعنا CineWave:

| الحالة | الوصف | أين تُستخدم حالياً |
|--------|-------|---------------------|
| `searchTerm` | النص الذي يكتبه المستخدم في صندوق البحث | `HomePage.jsx` |
| `selectedGenreId` | التصنيف المختار (أكشن، كوميدي...) | `HomePage.jsx` |
| `sortBy` | طريقة الترتيب (شعبية، تقييم، أحدث) | `HomePage.jsx` |
| `movies` | قائمة الأفلام الحالية | `useMovies.js` |
| `isLoading` | هل التطبيق يحمّل البيانات الآن؟ | `useMovies.js` |
| `genres` | قائمة التصنيفات من API | `HomePage.jsx` |
| `trendingMovies` | الأفلام الأكثر بحثاً | `useTrendingMovies.js` |

### كيف نتعامل مع الحالة الآن؟

```javascript
// الطريقة الحالية: useState في كل مكون
const [searchTerm, setSearchTerm] = useState('');        // في HomePage
const [movies, setMovies] = useState([]);                // في useMovies
const [trendingMovies, setTrendingMovies] = useState([]); // في useTrendingMovies
```

> **المشكلة**: كل حالة محبوسة في مكونها الخاص. إذا أراد مكون آخر الوصول لنفس البيانات، نحتاج لتمريرها عبر الـ Props من الأب للابن للحفيد... وهذا ما يُسمى **"Prop Drilling"** (حفر الخصائص).

---

## 2. لماذا نحتاج إدارة حالة مركزية؟

### المشكلة: Prop Drilling (حفر الخصائص)

تخيّل أنك تريد عرض عدد الأفلام في الـ Navbar الموجود في `App.jsx`، لكن بيانات الأفلام موجودة في `useMovies` الذي يُستخدم في `HomePage`:

```
                    App.jsx (يريد عرض عدد الأفلام)
                       ↓
                  HomePage.jsx (يملك البيانات)
                   ↓         ↓
            MovieGrid     GenreFilter
                ↓
           MovieCard (يحتاج أيضاً بيانات مشتركة)
```

> **بدون إدارة حالة مركزية**: يجب تمرير البيانات من أسفل لأعلى ومن أعلى لأسفل عبر كل طبقة — حتى لو لم تحتاجها الطبقة الوسطى!

### الحل: المتجر المركزي (Central Store)

```
          ┌──────────────────────────────────┐
          │        🏪 المتجر المركزي          │
          │    (Central Store / Zustand)      │
          │                                  │
          │  movies, searchTerm, genres,      │
          │  sortBy, isLoading, ...           │
          └──────────────────────────────────┘
                ↑       ↑        ↑       ↑
                │       │        │       │
            Navbar  HomePage  MovieCard  Footer
            (يقرأ)   (يقرأ    (يقرأ)    (يقرأ)
                    ويكتب)
```

> **الفكرة الجوهرية**: بدلاً من تمرير البيانات عبر الشجرة، يمكن لأي مكون الوصول مباشرة للمتجر المركزي — القراءة منه أو الكتابة فيه.

---

## 3. مقارنة بين حلول إدارة الحالة

### الحلول المتاحة في عالم React:

| المعيار | `useState` | `Context API` | `Redux Toolkit` | `Zustand` ✅ |
|---------|-----------|--------------|-----------------|-------------|
| **التعقيد** | بسيط جداً | متوسط | معقد | بسيط |
| **حجم الكود** | قليل | متوسط | كثير جداً | قليل جداً |
| **الأداء** | ممتاز (محلي) | ضعيف (يعيد رسم كل شيء) | ممتاز | ممتاز |
| **منحنى التعلم** | صفر | منخفض | **عالٍ جداً** | **منخفض** |
| **مناسب لمشروعنا** | ❌ محدود | ❌ مشاكل أداء | ⚠️ أكبر من حاجتنا | ✅ مثالي |
| **الشعبية** | مبني في React | مبني في React | الأشهر تاريخياً | **الأسرع نمواً** |

### لماذا ليس Redux؟

Redux رائع للمشاريع الضخمة (100+ مكون)، لكنه يتطلب:
- كتابة **Actions** و **Reducers** و **Dispatch** و **Middleware**
- ملفات كثيرة وكود مكرر (Boilerplate)
- فهم مفاهيم معقدة مثل **Immutability** و **Pure Functions**
- تثبيت حزم إضافية (`@reduxjs/toolkit`, `react-redux`)

> **القاعدة الذهبية**: لا تستخدم أداة معقدة لحل مشكلة بسيطة. هذا مبدأ **KISS** (Keep It Simple, Stupid) — أحد أهم مبادئ هندسة البرمجيات.

### مثال سريع للمقارنة

**نفس المهمة (تخزين نص البحث) بالأساليب المختلفة:**

#### Redux Toolkit (معقد):
```javascript
// 1. إنشاء Slice
const searchSlice = createSlice({
  name: 'search',
  initialState: { searchTerm: '' },
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    }
  }
});

// 2. تصدير Actions
export const { setSearchTerm } = searchSlice.actions;

// 3. تسجيل في Store
const store = configureStore({ reducer: { search: searchSlice.reducer } });

// 4. تغليف التطبيق بـ Provider
<Provider store={store}><App /></Provider>

// 5. استخدام في المكون
const searchTerm = useSelector(state => state.search.searchTerm);
const dispatch = useDispatch();
dispatch(setSearchTerm('batman'));
```

#### Zustand (بسيط):
```javascript
// 1. إنشاء Store
const useSearchStore = create((set) => ({
  searchTerm: '',
  setSearchTerm: (term) => set({ searchTerm: term }),
}));

// 2. استخدام في المكون مباشرة
const searchTerm = useSearchStore((state) => state.searchTerm);
const setSearchTerm = useSearchStore((state) => state.setSearchTerm);
setSearchTerm('batman');
```

> **لاحظ الفرق**: Zustand يحقق نفس النتيجة بـ **ثلث الكود** و **صفر ملفات إعداد** و **بدون Provider**.

---

## 4. لماذا اخترنا Zustand؟

### ما هو Zustand؟
**Zustand** (كلمة ألمانية تعني "حالة") هي مكتبة خفيفة وحديثة لإدارة الحالة في React، طوّرتها نفس الفريق الذي طوّر مكتبات React الشهيرة مثل `react-spring` و `react-three-fiber`.

### مميزات Zustand:

1. **لا تحتاج Provider** — على عكس Redux و Context، لا تحتاج لتغليف التطبيق بأي شيء
2. **كود أقل بـ 70%** — مقارنة بـ Redux Toolkit
3. **أداء ممتاز** — يعيد رسم المكونات المتأثرة فقط (وليس كل شجرة المكونات)
4. **تعمل مع Hooks** — تتكامل بشكل طبيعي مع نظام React Hooks الذي تعرفه
5. **دعم TypeScript** — جاهزة للمشاريع الاحترافية
6. **أقل من 2KB** — خفيفة جداً ولا تؤثر على حجم التطبيق

---

## 5. شرح Zustand بالتفصيل

### المفاهيم الأساسية

#### 🏪 الـ Store (المتجر)
المتجر هو المكان المركزي الذي تُخزّن فيه كل البيانات المشتركة. فكّر فيه كـ "قاعدة بيانات صغيرة" داخل المتصفح.

#### 📖 الـ State (الحالة)
البيانات المخزنة داخل المتجر (مثل: `movies`, `searchTerm`, `isLoading`).

#### ✏️ الـ Actions (الأفعال)
الدوال التي تُعدّل الحالة (مثل: `setSearchTerm()`, `fetchMovies()`).

#### 🔗 الـ Selectors (المحددات)
الطريقة التي يقرأ بها المكون جزءاً محدداً من الحالة.

### الصيغة الأساسية:

```javascript
import { create } from 'zustand';

// إنشاء المتجر
const useStore = create((set, get) => ({
  // ============ الحالة (State) ============
  count: 0,
  name: 'ليث',

  // ============ الأفعال (Actions) ============
  increment: () => set((state) => ({ count: state.count + 1 })),
  setName: (newName) => set({ name: newName }),
  
  // get() تسمح لك بقراءة الحالة الحالية داخل الـ Action
  doubleCount: () => {
    const current = get().count;
    set({ count: current * 2 });
  },
}));
```

### كيف تستخدمه في المكون:

```javascript
const MyComponent = () => {
  // ✅ قراءة حالة محددة (Selector) — يعيد رسم المكون فقط إذا تغيّر count
  const count = useStore((state) => state.count);
  
  // ✅ قراءة الـ Action
  const increment = useStore((state) => state.increment);
  
  return (
    <button onClick={increment}>العدد: {count}</button>
  );
};
```

### شرح `set` و `get`:

| الدالة | الغرض | مثال |
|--------|-------|------|
| `set({ key: value })` | تحديث الحالة (يدمج تلقائياً مع الحالة القديمة) | `set({ isLoading: true })` |
| `set((state) => ({ ... }))` | تحديث بناءً على الحالة السابقة | `set((s) => ({ count: s.count + 1 }))` |
| `get()` | قراءة الحالة الحالية داخل Action | `const movies = get().movies;` |

---

## 6. المعمارية النظيفة لتنظيم الـ Store

### كيف سننظم الملفات؟

بدلاً من متجر واحد ضخم، سنقسّم إلى **شرائح (Slices)** — كل شريحة مسؤولة عن ميزة واحدة:

```
src/
└── store/                          ← مجلد المتاجر الجديد
    ├── useMovieStore.js            ← متجر الأفلام (البحث + الفلترة + الفرز + النتائج)
    ├── useTrendingStore.js         ← متجر الأفلام الشائعة
    └── useMovieDetailStore.js      ← متجر تفاصيل الفيلم الواحد
```

### لماذا نقسّم المتاجر؟

هذا تطبيق عملي لمبدأ **Single Responsibility** من SOLID:
- كل متجر مسؤول عن ميزة واحدة فقط
- إذا تعطّل متجر الأفلام الشائعة، لن يتأثر متجر البحث
- يمكنك اختبار كل متجر بشكل مستقل

### مثال: متجر الأفلام (useMovieStore.js)

```javascript
import { create } from 'zustand';
import tmdbService from '../services/tmdb.service';

const useMovieStore = create((set, get) => ({
  // ═══════════ الحالة (State) ═══════════
  searchTerm: '',
  selectedGenreId: '',
  sortBy: 'popularity.desc',
  movies: [],
  genres: [],
  isLoading: false,
  errorMessage: '',

  // ═══════════ الأفعال (Actions) ═══════════
  setSearchTerm: (term) => set({ searchTerm: term }),
  
  setSelectedGenreId: (genreId) => set({ 
    selectedGenreId: genreId,
    searchTerm: '',   // إلغاء البحث عند اختيار تصنيف
  }),
  
  setSortBy: (sort) => set({ sortBy: sort }),

  fetchGenres: async () => {
    try {
      const data = await tmdbService.fetchGenres();
      set({ genres: data });
    } catch (err) {
      console.error('[MovieStore] Error loading genres:', err);
    }
  },

  fetchMovies: async () => {
    const { searchTerm, selectedGenreId, sortBy } = get();
    set({ isLoading: true, errorMessage: '' });

    try {
      const results = searchTerm
        ? await tmdbService.searchMovies(searchTerm)
        : await tmdbService.fetchPopularMovies(selectedGenreId, sortBy);
      set({ movies: results });
    } catch (error) {
      set({ errorMessage: 'حدث خطأ في جلب الأفلام.', movies: [] });
    } finally {
      set({ isLoading: false });
    }
  },
}));
```

### كيف يبدو المكون بعد Zustand:

```javascript
// ✅ قبل: 6 أسطر useState + useEffect + Custom Hook
// ✅ بعد: سطران فقط!

const HomePage = () => {
  const movies = useMovieStore((s) => s.movies);
  const isLoading = useMovieStore((s) => s.isLoading);
  const fetchMovies = useMovieStore((s) => s.fetchMovies);
  
  // ...
};
```

---

## 7. مقارنة: الكود قبل وبعد Zustand

### الملفات التي ستتغير:

| الملف | قبل | بعد |
|-------|------|------|
| `useMovies.js` | 79 سطر (Hook + useState × 4 + useEffect) | **يُحذف** ← منطقه ينتقل إلى `useMovieStore.js` |
| `useTrendingMovies.js` | 45 سطر | **يُحذف** ← منطقه ينتقل إلى `useTrendingStore.js` |
| `useMovieDetail.js` | 49 سطر | **يُحذف** ← منطقه ينتقل إلى `useMovieDetailStore.js` |
| `HomePage.jsx` | 126 سطر (6× useState + useEffect) | ~80 سطر (بسيط وواضح) |
| `MovieDetailPage.jsx` | 290 سطر | ~250 سطر (أبسط) |

### مقارنة بصرية:

```diff
- // ❌ قبل (HomePage.jsx) — 6 حالات و hook مخصص
- const [searchTerm, setSearchTerm] = useState('');
- const [genres, setGenres] = useState([]);
- const [selectedGenreId, setSelectedGenreId] = useState('');
- const [sortBy, setSortBy] = useState('popularity.desc');
- const { movies, isLoading, errorMessage } = useMovies(searchTerm, selectedGenreId, sortBy);
- const { trendingMovies } = useTrendingMovies();

+ // ✅ بعد (HomePage.jsx) — قراءة مباشرة من المتجر
+ const { movies, isLoading, errorMessage, searchTerm, genres, selectedGenreId, sortBy } 
+   = useMovieStore();
+ const { trendingMovies } = useTrendingStore();
```

---

## 8. مفاهيم متقدمة

### 🔄 Subscriptions (الاشتراكات)
Zustand تُعيد رسم المكون **فقط** عندما تتغير الحالة التي يقرأها. هذا يُسمى **Selective Re-rendering**:

```javascript
// ✅ هذا المكون يُعاد رسمه فقط عند تغيّر searchTerm
const SearchBar = () => {
  const searchTerm = useMovieStore((s) => s.searchTerm);
  // ...
};

// ✅ هذا المكون يُعاد رسمه فقط عند تغيّر movies
const MovieList = () => {
  const movies = useMovieStore((s) => s.movies);
  // ...
};
```

### 🧪 Middleware (البرمجيات الوسيطة)
Zustand تدعم إضافات قوية:

```javascript
import { devtools, persist } from 'zustand/middleware';

const useStore = create(
  devtools(           // ← يسمح بمراقبة الحالة في أدوات المطور
    persist(          // ← يحفظ الحالة في localStorage تلقائياً
      (set) => ({
        // ...
      }),
      { name: 'movie-store' }
    )
  )
);
```

### 📏 القواعد الذهبية لاستخدام Zustand:

1. **قسّم المتاجر** — لا تضع كل شيء في متجر واحد
2. **استخدم Selectors** — اقرأ فقط ما تحتاجه لتجنب إعادة الرسم غير الضرورية
3. **الـ Actions داخل المتجر** — لا تكتب منطق تغيير الحالة في المكونات
4. **الـ Services تبقى منفصلة** — المتجر يستدعي الـ Service، لا يحل محله
