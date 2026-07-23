import type {
  Badge,
  Certificate,
  Course,
  Homework,
  Quiz,
  SkillCategory,
  Tutor,
} from "./types";

// ---------------------------------------------------------------------------
// Tutors — friendly AI characters, each with a personality + voice preference.
// ---------------------------------------------------------------------------
export const tutors: Tutor[] = [
  {
    id: "t-maya",
    name: "Maya",
    personality: "friendly",
    tagline: "Playful, warm, and full of encouragement.",
    color: "6 78% 57%",
    emoji: "🎨",
    voice: "warm",
  },
  {
    id: "t-nova",
    name: "Nova",
    personality: "step-by-step",
    tagline: "Calm, methodical, one clear step at a time.",
    color: "258 68% 58%",
    emoji: "💅",
    voice: "gentle",
  },
  {
    id: "t-kai",
    name: "Kai",
    personality: "professional",
    tagline: "Clear, precise, and endlessly patient with logic.",
    color: "205 80% 45%",
    emoji: "💻",
    voice: "neutral",
  },
];

// ---------------------------------------------------------------------------
// Skill categories.
// ---------------------------------------------------------------------------
export const categories: SkillCategory[] = [
  { id: "c-makeup", name: "Makeup", emoji: "💄", color: "6 78% 57%", description: "Everyday looks, colour theory, and glam — safely." },
  { id: "c-nail", name: "Nail Art", emoji: "💅", color: "322 72% 58%", description: "Base coats to detailed designs and clean finishes." },
  { id: "c-coding", name: "Coding", emoji: "💻", color: "205 80% 45%", description: "Build real things with code, from your first line up." },
  { id: "c-drawing", name: "Drawing & Painting", emoji: "🖌️", color: "28 82% 52%", description: "Line, shade, colour, and composition." },
  { id: "c-baking", name: "Baking", emoji: "🧁", color: "38 88% 52%", description: "Cakes, breads, and treats with kitchen safety first." },
  { id: "c-photo", name: "Photography", emoji: "📷", color: "222 20% 40%", description: "Light, framing, and telling a story in a frame." },
  { id: "c-music", name: "Music Production", emoji: "🎧", color: "268 60% 55%", description: "Beats, mixing, and arranging your first track." },
  { id: "c-speaking", name: "Public Speaking", emoji: "🎤", color: "152 55% 40%", description: "Confidence, structure, and delivery." },
];

// ---------------------------------------------------------------------------
// Courses (full detail for the three MVP courses).
// ---------------------------------------------------------------------------
export const courses: Course[] = [
  {
    id: "course-makeup-101",
    categoryId: "c-makeup",
    name: "Everyday Makeup Essentials",
    image: "💄",
    tutorId: "t-maya",
    ageGroups: ["teen", "adult", "senior"],
    difficulty: "beginner",
    lessonCount: 3,
    estimatedHours: 2,
    materials: ["Moisturiser", "Foundation or tinted cream", "Blush", "Mascara", "Clean brushes"],
    rating: 4.8,
    ratingsCount: 1240,
    paid: false,
    summary:
      "A gentle, safety-first introduction to a natural everyday look. Learn prep, base, and a soft finish that suits your skin.",
    outcomes: [
      "Prep and protect your skin before makeup",
      "Apply an even, natural base",
      "Add soft colour and a clean finish",
    ],
    modules: [
      { id: "m1", title: "Prep & Base", lessonIds: ["l-mk-1", "l-mk-2"] },
      { id: "m2", title: "Colour & Finish", lessonIds: ["l-mk-3"] },
    ],
    finalProject: "Create a complete natural everyday look and submit before/after photos.",
    lessons: [
      {
        id: "l-mk-1",
        title: "Skin Prep & Hygiene",
        objective: "Cleanse, moisturise, and prepare skin safely before any product.",
        durationMin: 12,
        materials: ["Gentle cleanser", "Moisturiser", "Clean hands"],
        safety: [
          "Patch-test new products on your inner arm 24 hours before use.",
          "Never share brushes or applicators — it spreads bacteria.",
          "Avoid the eye area with products not labelled eye-safe.",
        ],
        steps: [
          {
            id: "s1",
            title: "Wash your hands and face",
            instruction: "Cleanse with a gentle face wash and pat dry with a clean towel.",
            tutorScript:
              "Let's start clean! Wash your hands first, then gently cleanse your face. Clean skin is the secret to makeup that lasts and stays kind to your skin.",
            reference: { kind: "diagram", caption: "Circular cleansing motion, forehead to chin" },
            tip: "Lukewarm water — hot water can dry out your skin.",
          },
          {
            id: "s2",
            title: "Moisturise",
            instruction: "Apply a pea-sized amount of moisturiser and let it absorb for a minute.",
            tutorScript:
              "Now a little moisturiser. This gives us a smooth base so everything glides on. Wait about a minute for it to sink in.",
            reference: { kind: "image", caption: "Even dots of moisturiser across the face" },
            tip: "If your skin feels tight, add a touch more.",
          },
        ],
      },
      {
        id: "l-mk-2",
        title: "Applying an Even Base",
        objective: "Apply a light, even base for a natural finish.",
        durationMin: 15,
        materials: ["Foundation or tinted cream", "Damp sponge or brush"],
        safety: [
          "Choose a shade that matches your jawline in natural light.",
          "Stop if you notice any redness or itching — remove the product.",
        ],
        steps: [
          {
            id: "s1",
            title: "Dot and blend",
            instruction: "Place small dots on forehead, cheeks, nose, and chin, then blend outward.",
            tutorScript:
              "Small dots, then blend outward with a damp sponge. We're building thin, even layers — less is more for a natural look.",
            reference: { kind: "animation", caption: "Blending outward from the centre of the face" },
            tip: "Bounce the sponge instead of dragging it.",
          },
        ],
      },
      {
        id: "l-mk-3",
        title: "Soft Colour & Finish",
        objective: "Add blush and mascara for a fresh, finished look.",
        durationMin: 14,
        materials: ["Blush", "Mascara"],
        safety: [
          "Keep mascara away from the waterline to protect your eyes.",
          "Replace mascara every 3 months to avoid eye infections.",
        ],
        steps: [
          {
            id: "s1",
            title: "Add blush",
            instruction: "Smile and sweep a little blush on the apples of your cheeks.",
            tutorScript:
              "Smile! Sweep a little blush on the apples of your cheeks and blend up toward your ears. Just a hint of colour brings your look to life.",
            reference: { kind: "image", caption: "Blush placement on the apples of the cheeks" },
          },
          {
            id: "s2",
            title: "Finish with mascara",
            instruction: "Wiggle mascara from root to tip on the upper lashes.",
            tutorScript:
              "Finally, mascara — wiggle from the root to the tip on your top lashes. And that's a complete natural look. You did it!",
            reference: { kind: "diagram", caption: "Root-to-tip mascara motion" },
            tip: "One coat is plenty for daytime.",
          },
        ],
      },
    ],
  },
  {
    id: "course-nail-101",
    categoryId: "c-nail",
    name: "Nail Art for Beginners",
    image: "💅",
    tutorId: "t-nova",
    ageGroups: ["teen", "adult", "senior"],
    difficulty: "beginner",
    lessonCount: 3,
    estimatedHours: 2,
    materials: ["Base coat", "Colour polish", "Top coat", "Dotting tool or toothpick", "Cotton pads"],
    rating: 4.7,
    ratingsCount: 980,
    paid: false,
    summary:
      "Go from bare nails to a clean, cute polka-dot design. Learn prep, smooth colour, and a simple pattern with a tidy finish.",
    outcomes: ["Prep and shape nails safely", "Apply smooth, even colour", "Add a simple dot pattern and seal it"],
    modules: [
      { id: "m1", title: "Prep & Colour", lessonIds: ["l-nl-1", "l-nl-2"] },
      { id: "m2", title: "Design & Finish", lessonIds: ["l-nl-3"] },
    ],
    finalProject: "Create a polka-dot manicure on all nails and submit a photo of both hands.",
    lessons: [
      {
        id: "l-nl-1",
        title: "Nail Prep & Base Coat",
        objective: "Clean, shape, and protect nails with a base coat.",
        durationMin: 12,
        materials: ["Base coat", "Nail file", "Cotton pads"],
        safety: [
          "File in one direction to avoid weakening the nail.",
          "Work in a ventilated space — polish fumes can be strong.",
          "Keep polish and remover away from young children and pets.",
        ],
        steps: [
          {
            id: "s1",
            title: "Shape gently",
            instruction: "File each nail in one direction into a soft rounded shape.",
            tutorScript:
              "We'll begin by shaping. File in one direction only — back and forth can split the nail. A soft round shape is friendly and strong.",
            reference: { kind: "diagram", caption: "One-direction filing motion" },
          },
          {
            id: "s2",
            title: "Apply base coat",
            instruction: "Paint a thin base coat and let it dry for two minutes.",
            tutorScript:
              "Now a thin base coat. This protects your natural nail and helps colour last. Show me your nails when the base coat is on.",
            reference: { kind: "image", caption: "Thin, even base coat across the nail" },
            tip: "Thin layers dry faster and smoother than one thick coat.",
          },
        ],
      },
      {
        id: "l-nl-2",
        title: "Smooth Colour Coats",
        objective: "Apply two thin, even colour coats.",
        durationMin: 16,
        materials: ["Colour polish"],
        safety: ["Take breaks if fumes feel strong.", "Avoid applying to broken or irritated skin."],
        steps: [
          {
            id: "s1",
            title: "First thin coat",
            instruction: "Apply one thin coat: one stroke down the middle, then each side.",
            tutorScript:
              "Three strokes: middle first, then each side. Keep it thin — we'll build the colour up in layers.",
            reference: { kind: "animation", caption: "Three-stroke colour application" },
          },
          {
            id: "s2",
            title: "Second coat",
            instruction: "Once dry, add a second thin coat for a rich, even colour.",
            tutorScript:
              "Let it dry, then a second thin coat evens everything out. Patience here makes the design step so much easier.",
            reference: { kind: "image", caption: "Even, opaque colour after two coats" },
          },
        ],
      },
      {
        id: "l-nl-3",
        title: "Polka-Dot Design & Top Coat",
        objective: "Add a dot pattern and seal with a top coat.",
        durationMin: 15,
        materials: ["Second colour", "Dotting tool or toothpick", "Top coat"],
        safety: ["Let each layer dry to avoid smudges and skin contact.", "Wash hands after finishing."],
        steps: [
          {
            id: "s1",
            title: "Dot the pattern",
            instruction: "Dip a dotting tool in a second colour and place evenly spaced dots.",
            tutorScript:
              "Dip your dotting tool, then press gently for neat, round dots. Space them evenly — three or four per nail looks lovely.",
            reference: { kind: "animation", caption: "Placing evenly spaced dots" },
            tip: "Re-dip between each dot for consistent size.",
          },
          {
            id: "s2",
            title: "Seal it",
            instruction: "Once fully dry, apply a top coat over the whole nail.",
            tutorScript:
              "Finish with a top coat to seal and shine. Let it dry fully, then show me both hands — I'd love to see your design!",
            reference: { kind: "image", caption: "Glossy sealed polka-dot manicure" },
          },
        ],
      },
    ],
  },
  {
    id: "course-coding-101",
    categoryId: "c-coding",
    name: "Your First Website with HTML & CSS",
    image: "💻",
    tutorId: "t-kai",
    ageGroups: ["child", "teen", "adult", "senior"],
    difficulty: "beginner",
    lessonCount: 3,
    estimatedHours: 3,
    materials: ["A computer", "A web browser", "A free code editor (or an online one)"],
    rating: 4.9,
    ratingsCount: 2100,
    paid: false,
    summary:
      "Build and style your very first web page. Learn how HTML structures content and CSS makes it beautiful — no prior experience needed.",
    outcomes: ["Write basic HTML structure", "Style a page with CSS", "Publish a simple personal profile page"],
    modules: [
      { id: "m1", title: "Structure with HTML", lessonIds: ["l-cd-1", "l-cd-2"] },
      { id: "m2", title: "Style with CSS", lessonIds: ["l-cd-3"] },
    ],
    finalProject: "Build a one-page personal profile with a heading, photo caption, and a styled bio.",
    lessons: [
      {
        id: "l-cd-1",
        title: "What is HTML?",
        objective: "Understand tags and write your first heading and paragraph.",
        durationMin: 18,
        materials: ["Code editor or online playground"],
        safety: [
          "Only download tools from official websites.",
          "Never paste code you don't understand from untrusted sources.",
        ],
        steps: [
          {
            id: "s1",
            title: "Tags come in pairs",
            instruction: "An element usually has an opening <tag> and closing </tag>.",
            tutorScript:
              "HTML is made of tags. Most come in pairs: an opening tag and a closing tag with a slash. The content lives in between. Simple, right?",
            reference: { kind: "diagram", caption: "<h1>Hello</h1> — opening, content, closing" },
          },
          {
            id: "s2",
            title: "Your first heading",
            instruction: "Type <h1>My First Page</h1> and view it in the browser.",
            tutorScript:
              "Let's write a heading: h1 is the biggest one. Type it out, save, and refresh your browser. You just made your first web page!",
            reference: { kind: "image", caption: "A large heading rendered in the browser" },
            tip: "h1 to h6 go from largest to smallest.",
          },
        ],
      },
      {
        id: "l-cd-2",
        title: "Structuring Content",
        objective: "Add paragraphs, an image caption, and a list.",
        durationMin: 20,
        materials: ["Code editor"],
        safety: ["Save often so you don't lose your work."],
        steps: [
          {
            id: "s1",
            title: "Paragraphs and lists",
            instruction: "Use <p> for text and <ul><li> for a bullet list.",
            tutorScript:
              "Now some content. Wrap sentences in p tags for paragraphs, and use ul with li items for a list. This is how we organise information.",
            reference: { kind: "diagram", caption: "Nested list structure: ul containing li items" },
          },
        ],
      },
      {
        id: "l-cd-3",
        title: "Styling with CSS",
        objective: "Change colours, fonts, and spacing with CSS.",
        durationMin: 22,
        materials: ["Code editor"],
        safety: ["Keep backups of files that work before big changes."],
        steps: [
          {
            id: "s1",
            title: "Add a style block",
            instruction: "Add <style> in the head and target elements like body { }.",
            tutorScript:
              "CSS makes things beautiful. Add a style block and set the body font and colour. One rule at a time — refresh and watch it change.",
            reference: { kind: "image", caption: "Before and after applying a CSS colour rule" },
            tip: "Change one property at a time so you can see what each does.",
          },
          {
            id: "s2",
            title: "Style your heading",
            instruction: "Give your h1 a colour and centre it with text-align.",
            tutorScript:
              "Let's style that heading — a colour and text-align center. Beautiful. You now know the two languages every website is built on!",
            reference: { kind: "animation", caption: "Heading centring and colour change" },
          },
        ],
      },
    ],
  },
];

// A handful of lighter "browse only" courses so Explore feels populated.
export const catalogTeasers: Pick<
  Course,
  "id" | "categoryId" | "name" | "image" | "tutorId" | "ageGroups" | "difficulty" | "lessonCount" | "estimatedHours" | "materials" | "rating" | "ratingsCount" | "paid" | "price" | "summary"
>[] = [
  { id: "teaser-draw", categoryId: "c-drawing", name: "Sketching from Shapes", image: "🖌️", tutorId: "t-maya", ageGroups: ["child", "teen", "adult"], difficulty: "beginner", lessonCount: 6, estimatedHours: 4, materials: ["Pencil", "Paper"], rating: 4.6, ratingsCount: 540, paid: false, summary: "Turn circles and boxes into confident drawings." },
  { id: "teaser-bake", categoryId: "c-baking", name: "First-Time Cupcakes", image: "🧁", tutorId: "t-maya", ageGroups: ["teen", "adult", "senior"], difficulty: "beginner", lessonCount: 5, estimatedHours: 3, materials: ["Oven", "Basic pantry"], rating: 4.8, ratingsCount: 720, paid: false, summary: "Bake and decorate fluffy cupcakes, safely." },
  { id: "teaser-photo", categoryId: "c-photo", name: "Phone Photography", image: "📷", tutorId: "t-kai", ageGroups: ["teen", "adult", "senior"], difficulty: "beginner", lessonCount: 7, estimatedHours: 4, materials: ["Any phone"], rating: 4.7, ratingsCount: 610, paid: false, summary: "Take striking photos with the camera in your pocket." },
  { id: "teaser-music", categoryId: "c-music", name: "Make Your First Beat", image: "🎧", tutorId: "t-kai", ageGroups: ["teen", "adult"], difficulty: "intermediate", lessonCount: 8, estimatedHours: 6, materials: ["Free DAW"], rating: 4.5, ratingsCount: 430, paid: false, summary: "Arrange drums and melody into a full loop." },
  { id: "teaser-speak", categoryId: "c-speaking", name: "Confident Public Speaking", image: "🎤", tutorId: "t-kai", ageGroups: ["teen", "adult", "senior"], difficulty: "intermediate", lessonCount: 6, estimatedHours: 4, materials: ["A quiet room"], rating: 4.9, ratingsCount: 880, paid: false, summary: "Structure a talk and deliver it with calm confidence." },
];

// ---------------------------------------------------------------------------
// Homework, quizzes, badges, certificates, free-access benefits.
// ---------------------------------------------------------------------------
export const homeworks: Homework[] = [
  {
    id: "hw-mk-1",
    courseId: "course-makeup-101",
    lessonId: "l-mk-2",
    title: "Practise an even base",
    prompt: "Apply a light base on one cheek and share a well-lit photo. We'll look at evenness and coverage.",
    dueInDays: 3,
    submissionTypes: ["image", "text"],
    status: "pending",
  },
  {
    id: "hw-nl-1",
    courseId: "course-nail-101",
    lessonId: "l-nl-2",
    title: "Two smooth colour coats",
    prompt: "Paint two thin coats on three nails and upload a photo. Aim for an even, streak-free finish.",
    dueInDays: 3,
    submissionTypes: ["image"],
    status: "submitted",
    feedback: {
      wentWell: "Your colour is even and the edges are clean — lovely control on the strokes.",
      toImprove: "The tips are slightly thin; a small dab there next time seals the colour.",
      safety: "Great job keeping polish off the skin. Remember to work in a ventilated space.",
      nextStep: "You're ready for the polka-dot design in Lesson 3.",
      score: 88,
    },
  },
  {
    id: "hw-cd-1",
    courseId: "course-coding-101",
    lessonId: "l-cd-1",
    title: "Write a heading and paragraph",
    prompt: "Create an HTML file with one <h1> and one <p>. Paste your code or upload the file.",
    dueInDays: 5,
    submissionTypes: ["code", "text", "document"],
    status: "pending",
  },
];

export const quizzes: Quiz[] = [
  {
    id: "quiz-makeup-101",
    courseId: "course-makeup-101",
    title: "Everyday Makeup — Knowledge Check",
    questions: [
      {
        id: "q1",
        kind: "multiple-choice",
        prompt: "Why should you patch-test a new product before using it on your face?",
        options: ["To check the colour", "To check for allergic reactions", "To warm it up", "It's not needed"],
        correctIndex: 1,
        explanation: "A 24-hour patch test on the inner arm helps catch allergic reactions safely.",
      },
      {
        id: "q2",
        kind: "image",
        prompt: "Where should everyday blush go for a natural look?",
        imageCaption: "A face outline with cheeks highlighted",
        options: ["Under the eyes", "On the apples of the cheeks", "On the forehead", "On the chin"],
        correctIndex: 1,
        explanation: "The apples of the cheeks (where you smile) give a fresh, natural flush.",
      },
      {
        id: "q3",
        kind: "reflection",
        prompt: "In your own words, why does clean skin help makeup last longer?",
      },
    ],
  },
  {
    id: "quiz-nail-101",
    courseId: "course-nail-101",
    title: "Nail Art — Knowledge Check",
    questions: [
      {
        id: "q1",
        kind: "multiple-choice",
        prompt: "Which direction should you file your nails?",
        options: ["Back and forth", "One direction", "In circles", "It doesn't matter"],
        correctIndex: 1,
        explanation: "Filing in one direction prevents splitting and weakening.",
      },
      {
        id: "q2",
        kind: "multiple-choice",
        prompt: "Why apply thin coats instead of one thick coat?",
        options: ["Uses less polish", "Dries faster and smoother", "It's cheaper", "No reason"],
        correctIndex: 1,
        explanation: "Thin coats dry faster, smoother, and are less likely to smudge.",
      },
    ],
  },
  {
    id: "quiz-coding-101",
    courseId: "course-coding-101",
    title: "HTML & CSS — Knowledge Check",
    questions: [
      {
        id: "q1",
        kind: "multiple-choice",
        prompt: "What does the <h1> tag create?",
        options: ["A paragraph", "The largest heading", "A link", "An image"],
        correctIndex: 1,
        explanation: "h1 is the largest, most important heading on the page.",
      },
      {
        id: "q2",
        kind: "multiple-choice",
        prompt: "What is CSS mainly used for?",
        options: ["Structuring content", "Styling and layout", "Storing data", "Sending email"],
        correctIndex: 1,
        explanation: "CSS controls colours, fonts, spacing, and layout.",
      },
      {
        id: "q3",
        kind: "reflection",
        prompt: "What is one thing you'd like to style differently on your page, and why?",
      },
    ],
  },
];

export const badges: Badge[] = [
  { id: "b-first-step", name: "First Step", emoji: "🌱", description: "Completed your first lesson.", earned: true },
  { id: "b-streak-3", name: "3-Day Streak", emoji: "🔥", description: "Learned three days in a row.", earned: true },
  { id: "b-nail-pro", name: "Nail Novice", emoji: "💅", description: "Finished a nail art lesson.", earned: true },
  { id: "b-quiz-ace", name: "Quiz Ace", emoji: "🎯", description: "Scored 100% on a quiz.", earned: false },
  { id: "b-project", name: "Project Builder", emoji: "🏗️", description: "Completed a course project.", earned: false },
  { id: "b-course", name: "Course Champion", emoji: "🏆", description: "Completed a full course.", earned: false },
];

export const certificates: Certificate[] = [
  {
    id: "cert-nail-101",
    courseName: "Nail Art for Beginners",
    tutorName: "Nova",
    issuedOn: "2026-07-10",
    category: "Nail Art",
  },
];

// SkillBloom is 100% free — no paywall, no payment. Everything below is
// included for every learner at no cost.
export const freeIncludes: string[] = [
  "Every course and skill — nothing locked",
  "Unlimited AI tutor classes",
  "Homework reviews and feedback",
  "Quizzes, projects, and guided practice",
  "Certificates and badges",
  "Voice tutor and step-by-step lessons",
  "Family profiles with parental controls",
  "Progress tracking and weekly summaries",
];

// Convenience lookups -------------------------------------------------------
export const getCourse = (id: string) => courses.find((c) => c.id === id);
export const getTutor = (id: string) => tutors.find((t) => t.id === id);
export const getCategory = (id: string) => categories.find((c) => c.id === id);
export const getQuizByCourse = (courseId: string) => quizzes.find((q) => q.courseId === courseId);
export const getLesson = (courseId: string, lessonId: string) =>
  getCourse(courseId)?.lessons.find((l) => l.id === lessonId);
