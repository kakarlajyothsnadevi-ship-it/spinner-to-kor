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
    color: "221 30% 42%",
    emoji: "🎨",
    voice: "warm",
  },
  {
    id: "t-nova",
    name: "Nova",
    personality: "step-by-step",
    tagline: "Calm, methodical, one clear step at a time.",
    color: "217 24% 46%",
    emoji: "💅",
    voice: "gentle",
  },
  {
    id: "t-kai",
    name: "Kai",
    personality: "professional",
    tagline: "Clear, precise, and endlessly patient with logic.",
    color: "213 28% 40%",
    emoji: "💻",
    voice: "neutral",
  },
];

// ---------------------------------------------------------------------------
// Skill categories.
// ---------------------------------------------------------------------------
export const categories: SkillCategory[] = [
  { id: "c-makeup", name: "Makeup", emoji: "💄", color: "217 16% 48%", description: "Everyday looks, colour theory, and glam — safely." },
  { id: "c-nail", name: "Nail Art", emoji: "💅", color: "217 16% 48%", description: "Base coats to detailed designs and clean finishes." },
  { id: "c-coding", name: "Coding", emoji: "💻", color: "217 16% 48%", description: "Build real things with code, from your first line up." },
  { id: "c-drawing", name: "Drawing & Painting", emoji: "🖌️", color: "217 16% 48%", description: "Line, shade, colour, and composition." },
  { id: "c-baking", name: "Baking", emoji: "🧁", color: "217 16% 48%", description: "Cakes, breads, and treats with kitchen safety first." },
  { id: "c-photo", name: "Photography", emoji: "📷", color: "217 16% 48%", description: "Light, framing, and telling a story in a frame." },
  { id: "c-music", name: "Music Production", emoji: "🎧", color: "217 16% 48%", description: "Beats, mixing, and arranging your first track." },
  { id: "c-speaking", name: "Public Speaking", emoji: "🎤", color: "217 16% 48%", description: "Confidence, structure, and delivery." },
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
  {
    id: "course-drawing-101",
    categoryId: "c-drawing",
    name: "Sketching from Shapes",
    image: "🖌️",
    tutorId: "t-maya",
    ageGroups: ["child", "teen", "adult", "senior"],
    difficulty: "beginner",
    lessonCount: 3,
    estimatedHours: 3,
    materials: ["Pencil", "Eraser", "Paper"],
    rating: 4.6,
    ratingsCount: 540,
    paid: false,
    summary: "Turn simple circles and boxes into confident, well-proportioned drawings.",
    outcomes: ["See any object as simple shapes", "Build accurate proportions with guide lines", "Add light shading for depth"],
    modules: [
      { id: "m1", title: "See & Sketch", lessonIds: ["l-dr-1", "l-dr-2"] },
      { id: "m2", title: "Shade & Finish", lessonIds: ["l-dr-3"] },
    ],
    finalProject: "Draw an everyday object from shapes, add simple shading, and submit a photo.",
    lessons: [
      {
        id: "l-dr-1",
        title: "Seeing in Shapes",
        objective: "Break objects down into circles, boxes and cylinders.",
        durationMin: 15,
        materials: ["Pencil", "Paper"],
        safety: ["Work in good light and sit with a comfortable posture — rest your eyes every few minutes.", "Handle sharp pencils carefully and keep points away from others."],
        steps: [
          { id: "s1", title: "Spot the shapes", instruction: "Look at your object and find the big simple shapes inside it.", tutorScript: "Every object is built from simple shapes. Squint at your subject — do you see a circle, a box, a cylinder? Block those in lightly first.", reference: { kind: "diagram", caption: "A mug seen as a cylinder plus a handle loop" }, tip: "Draw lightly so you can erase easily." },
          { id: "s2", title: "Block it in", instruction: "Sketch those shapes lightly in the right positions and sizes.", tutorScript: "Now place your shapes on the page with light lines and rough sizes. Don't worry about detail yet — we're building the skeleton.", reference: { kind: "animation", caption: "Blocking in shapes before details" } },
        ],
      },
      {
        id: "l-dr-2",
        title: "Line & Proportion",
        objective: "Refine your shapes into an accurate outline.",
        durationMin: 16,
        materials: ["Pencil", "Eraser"],
        safety: ["Rest your hand and eyes between sketches to avoid strain."],
        steps: [
          { id: "s1", title: "Connect with guide lines", instruction: "Use light guide lines to line up edges and centres.", tutorScript: "Guide lines are your friend. Draw light lines to line up the top, bottom and centre — this keeps your proportions honest.", reference: { kind: "diagram", caption: "Guide lines aligning the top and base" }, tip: "Compare widths to heights with your pencil held at arm's length." },
          { id: "s2", title: "Firm up the outline", instruction: "Press a little harder to draw the true edges over your guides.", tutorScript: "Trace the real outline over your guides with slightly firmer lines, then gently erase the rough shapes underneath.", reference: { kind: "image", caption: "A clean outline over faint guides" } },
        ],
      },
      {
        id: "l-dr-3",
        title: "Shading for Depth",
        objective: "Add simple shading from a single light source.",
        durationMin: 16,
        materials: ["Pencil"],
        safety: ["Take a short break to avoid hand strain."],
        steps: [
          { id: "s1", title: "Find the light", instruction: "Decide where the light comes from; the opposite side is in shadow.", tutorScript: "Pick one light direction. The side facing the light stays bright; the opposite side gets shaded. Keeping this consistent makes it believable.", reference: { kind: "diagram", caption: "Light source and shadow side on a sphere" } },
          { id: "s2", title: "Build soft shadows", instruction: "Layer light pencil strokes to darken the shadow side gradually.", tutorScript: "Shade in soft layers — light strokes built up slowly. Leave a highlight where the light hits. Lovely depth!", reference: { kind: "animation", caption: "Layering shading from light to dark" }, tip: "Smudge gently with a tissue for smooth gradients." },
        ],
      },
    ],
  },
  {
    id: "course-baking-101",
    categoryId: "c-baking",
    name: "First-Time Cupcakes",
    image: "🧁",
    tutorId: "t-maya",
    ageGroups: ["teen", "adult", "senior"],
    difficulty: "beginner",
    lessonCount: 3,
    estimatedHours: 3,
    materials: ["Oven", "Muffin tin & paper liners", "Flour, sugar, butter, eggs", "Mixing bowl", "Oven mitts"],
    rating: 4.8,
    ratingsCount: 720,
    paid: false,
    summary: "Mix, bake, and decorate fluffy cupcakes — with kitchen safety at every step.",
    outcomes: ["Set up and work safely in the kitchen", "Mix a simple cupcake batter", "Bake and decorate a batch"],
    modules: [
      { id: "m1", title: "Prep & Mix", lessonIds: ["l-bk-1", "l-bk-2"] },
      { id: "m2", title: "Bake & Decorate", lessonIds: ["l-bk-3"] },
    ],
    finalProject: "Bake a batch of cupcakes, decorate them, and submit a photo of the finished cupcakes.",
    lessons: [
      {
        id: "l-bk-1",
        title: "Kitchen Safety & Setup",
        objective: "Prepare a clean, safe workspace and preheat the oven.",
        durationMin: 12,
        materials: ["Apron", "Oven mitts"],
        safety: ["Ask an adult before using the oven or stove — children should always bake with adult supervision.", "Wash hands, tie back long hair, and keep sleeves away from heat.", "Always use oven mitts and never touch hot trays with bare hands.", "Check for food allergies (eggs, dairy, gluten, nuts) before baking or sharing."],
        steps: [
          { id: "s1", title: "Clean and gather", instruction: "Wash hands, wipe surfaces, and lay out your ingredients and tools.", tutorScript: "Let's set up safely. Wash your hands, wipe the counter, and gather everything first — chefs call this 'everything in its place'. It keeps baking calm.", reference: { kind: "image", caption: "Ingredients measured and laid out" }, tip: "Measure everything before you start mixing." },
          { id: "s2", title: "Preheat safely", instruction: "With an adult, preheat the oven and line your tin.", tutorScript: "Ask an adult to help you preheat the oven to the recipe temperature. While it warms, pop paper liners into your muffin tin.", reference: { kind: "diagram", caption: "Paper liners placed in a muffin tin" } },
        ],
      },
      {
        id: "l-bk-2",
        title: "Mixing the Batter",
        objective: "Combine ingredients into a smooth batter without overmixing.",
        durationMin: 16,
        materials: ["Mixing bowl", "Whisk or spoon"],
        safety: ["Crack eggs into a separate cup first to catch any shell.", "Wipe up spills straight away to avoid slips."],
        steps: [
          { id: "s1", title: "Cream butter & sugar", instruction: "Beat soft butter and sugar until pale and fluffy.", tutorScript: "Beat the soft butter and sugar until pale and fluffy. This traps air and makes your cupcakes light.", reference: { kind: "animation", caption: "Creaming butter and sugar until pale" }, tip: "Room-temperature butter creams much more easily." },
          { id: "s2", title: "Add eggs, then flour", instruction: "Mix in eggs one at a time, then gently fold in the flour just until combined.", tutorScript: "Add eggs one at a time, then fold in the flour gently and stop as soon as it's combined. Overmixing makes cupcakes tough.", reference: { kind: "diagram", caption: "Folding flour in gently with a spatula" } },
        ],
      },
      {
        id: "l-bk-3",
        title: "Bake & Decorate",
        objective: "Bake safely and add a simple topping.",
        durationMin: 16,
        materials: ["Oven mitts", "Frosting or icing sugar"],
        safety: ["The tin and oven are very hot — always use oven mitts.", "Let cupcakes cool fully before decorating or eating.", "Keep pets and small children away from the hot oven."],
        steps: [
          { id: "s1", title: "Bake with care", instruction: "Fill liners two-thirds full and bake until a toothpick comes out clean.", tutorScript: "Fill each liner about two-thirds full. Using oven mitts, place the tray in and bake. They're done when a toothpick comes out clean.", reference: { kind: "image", caption: "Risen cupcakes, golden on top" }, tip: "Set a timer and check a couple of minutes early." },
          { id: "s2", title: "Cool then decorate", instruction: "Cool completely, then pipe or spread frosting and add toppings.", tutorScript: "Let them cool fully — frosting melts on warm cupcakes. Then swirl on frosting and add sprinkles. Enjoy your bake!", reference: { kind: "animation", caption: "Swirling frosting onto a cooled cupcake" } },
        ],
      },
    ],
  },
  {
    id: "course-photo-101",
    categoryId: "c-photo",
    name: "Phone Photography Basics",
    image: "📷",
    tutorId: "t-kai",
    ageGroups: ["teen", "adult", "senior"],
    difficulty: "beginner",
    lessonCount: 3,
    estimatedHours: 3,
    materials: ["Any smartphone", "A free photo editor (optional)"],
    rating: 4.7,
    ratingsCount: 610,
    paid: false,
    summary: "Take striking photos with the camera already in your pocket — light, framing, and focus.",
    outcomes: ["Use natural light well", "Compose with the rule of thirds", "Control focus and make simple edits"],
    modules: [
      { id: "m1", title: "Light & Composition", lessonIds: ["l-ph-1", "l-ph-2"] },
      { id: "m2", title: "Focus & Edit", lessonIds: ["l-ph-3"] },
    ],
    finalProject: "Shoot a 3-photo mini-series on one subject and submit your favourite shot.",
    lessons: [
      {
        id: "l-ph-1",
        title: "Seeing the Light",
        objective: "Use soft natural light for flattering photos.",
        durationMin: 14,
        materials: ["Smartphone"],
        safety: ["Never photograph people without their permission.", "Stay aware of your surroundings — don't step back into roads or off edges for a shot.", "Don't point the camera directly at the sun for long."],
        steps: [
          { id: "s1", title: "Find soft light", instruction: "Turn your subject toward a window or shoot in open shade.", tutorScript: "Great photos start with light. Soft light near a window or in open shade is flattering. Harsh midday sun makes hard shadows — avoid it when you can.", reference: { kind: "image", caption: "Subject lit softly from a window" }, tip: "The hour after sunrise and before sunset is the flattering 'golden hour'." },
          { id: "s2", title: "Keep light in front", instruction: "Position so the light falls on your subject, not behind it.", tutorScript: "Keep the light in front of or beside your subject, not behind — otherwise you get a dark silhouette. Turn around until the subject brightens.", reference: { kind: "diagram", caption: "Light in front of vs behind the subject" } },
        ],
      },
      {
        id: "l-ph-2",
        title: "Framing & Composition",
        objective: "Compose with the rule of thirds and clean backgrounds.",
        durationMin: 15,
        materials: ["Smartphone"],
        safety: ["Watch your step while you're framing a shot."],
        steps: [
          { id: "s1", title: "Turn on the grid", instruction: "Enable the camera grid and place your subject on a line or cross.", tutorScript: "Turn on your camera's grid. Place your subject along a line, or where two lines cross — it feels more natural than dead centre.", reference: { kind: "diagram", caption: "Rule-of-thirds grid with the subject on a cross" }, tip: "Leave space in the direction your subject is facing." },
          { id: "s2", title: "Simplify the background", instruction: "Move around to remove clutter behind your subject.", tutorScript: "Check what's behind your subject — a pole 'growing' out of someone's head ruins a shot. Step left or right to clean up the background.", reference: { kind: "image", caption: "Before and after a simplified background" } },
        ],
      },
      {
        id: "l-ph-3",
        title: "Focus & Simple Edits",
        objective: "Lock focus and exposure, then make light edits.",
        durationMin: 14,
        materials: ["Smartphone", "Free photo editor"],
        safety: ["Back up photos you care about."],
        steps: [
          { id: "s1", title: "Tap to focus", instruction: "Tap your subject to set focus, then slide to adjust brightness.", tutorScript: "Tap the screen on your subject to lock focus, then slide up or down to set brightness. Now your subject is sharp and well-exposed.", reference: { kind: "animation", caption: "Tapping to focus and adjusting exposure" } },
          { id: "s2", title: "Light editing", instruction: "Nudge brightness, contrast and crop — keep it natural.", tutorScript: "In your editor, gently lift brightness and contrast, and crop for a tighter frame. Small tweaks only — keep it looking real.", reference: { kind: "image", caption: "A subtle edit vs an over-edited photo" }, tip: "Less is more — go easy on heavy filters." },
        ],
      },
    ],
  },
  {
    id: "course-music-101",
    categoryId: "c-music",
    name: "Make Your First Beat",
    image: "🎧",
    tutorId: "t-kai",
    ageGroups: ["teen", "adult"],
    difficulty: "beginner",
    lessonCount: 3,
    estimatedHours: 4,
    materials: ["A computer", "A free DAW (e.g. GarageBand or BandLab)", "Headphones"],
    rating: 4.5,
    ratingsCount: 430,
    paid: false,
    summary: "Build a simple 8-bar beat: set a tempo, program drums, and add a melody.",
    outcomes: ["Set up a project and tempo", "Program a basic drum pattern", "Add a melody and arrange a loop"],
    modules: [
      { id: "m1", title: "Setup & Drums", lessonIds: ["l-mu-1", "l-mu-2"] },
      { id: "m2", title: "Melody & Arrange", lessonIds: ["l-mu-3"] },
    ],
    finalProject: "Make an 8-bar loop with drums and a melody, then submit the exported audio or a link.",
    lessons: [
      {
        id: "l-mu-1",
        title: "Set Up & Tempo",
        objective: "Create a project and choose a tempo.",
        durationMin: 16,
        materials: ["A free DAW", "Headphones"],
        safety: ["Keep headphone volume moderate to protect your hearing, and take listening breaks.", "Only download software from official sources."],
        steps: [
          { id: "s1", title: "New project", instruction: "Open your DAW and start a new empty project.", tutorScript: "Open your DAW and start a new project. Don't worry about all the buttons — we only need a few of them today.", reference: { kind: "image", caption: "A fresh, empty DAW project" } },
          { id: "s2", title: "Set the tempo", instruction: "Set the tempo (BPM) — try 90 for a relaxed beat.", tutorScript: "Set the tempo — that's beats per minute. Ninety BPM is a nice relaxed groove. You can change it later to speed things up.", reference: { kind: "diagram", caption: "Tempo / BPM control set to 90" }, tip: "Lower BPM feels calm; higher feels energetic." },
        ],
      },
      {
        id: "l-mu-2",
        title: "Program the Drums",
        objective: "Create a basic kick, snare and hi-hat pattern.",
        durationMin: 18,
        materials: ["A free DAW"],
        safety: ["Watch your listening volume."],
        steps: [
          { id: "s1", title: "Kick & snare", instruction: "Place a kick on beats 1 and 3, and a snare on beats 2 and 4.", tutorScript: "Add a drum track. Put a kick on beats one and three, and a snare on two and four. That's the heartbeat of most songs.", reference: { kind: "diagram", caption: "Kick on 1 and 3, snare on 2 and 4" } },
          { id: "s2", title: "Add hi-hats", instruction: "Add steady hi-hats to fill in the groove.", tutorScript: "Now sprinkle in hi-hats between the beats to add movement. Play it back — you've got a groove!", reference: { kind: "animation", caption: "Hi-hats filling out the pattern" }, tip: "Keep it simple — space is good." },
        ],
      },
      {
        id: "l-mu-3",
        title: "Melody & Arrange",
        objective: "Add a short melody and loop it to eight bars.",
        durationMin: 18,
        materials: ["A free DAW"],
        safety: ["Save your project often."],
        steps: [
          { id: "s1", title: "A simple melody", instruction: "Add an instrument and play a few notes from one scale.", tutorScript: "Add a melodic instrument and pick a few notes that sound good together — stick to one scale so nothing clashes. Hum a tune and find it.", reference: { kind: "diagram", caption: "A few notes in a C-major scale" }, tip: "Three or four notes can be plenty." },
          { id: "s2", title: "Loop eight bars", instruction: "Copy your pattern to fill eight bars, then export.", tutorScript: "Copy your drums and melody to fill eight bars. Listen top to bottom, then export your loop. You made a beat!", reference: { kind: "image", caption: "An 8-bar arranged loop" } },
        ],
      },
    ],
  },
  {
    id: "course-speaking-101",
    categoryId: "c-speaking",
    name: "Confident Public Speaking",
    image: "🎤",
    tutorId: "t-kai",
    ageGroups: ["teen", "adult", "senior"],
    difficulty: "beginner",
    lessonCount: 3,
    estimatedHours: 3,
    materials: ["A quiet room", "A phone to record (optional)"],
    rating: 4.9,
    ratingsCount: 880,
    paid: false,
    summary: "Calm your nerves, structure a short talk, and deliver it with steady confidence.",
    outcomes: ["Steady your breathing and voice", "Structure a clear short talk", "Deliver with eye contact and pacing"],
    modules: [
      { id: "m1", title: "Calm & Structure", lessonIds: ["l-sp-1", "l-sp-2"] },
      { id: "m2", title: "Deliver", lessonIds: ["l-sp-3"] },
    ],
    finalProject: "Prepare and record a 1-minute talk on a topic you like, then submit the recording.",
    lessons: [
      {
        id: "l-sp-1",
        title: "Calm Body, Calm Voice",
        objective: "Use breath and posture to steady nerves.",
        durationMin: 12,
        materials: ["A quiet room"],
        safety: ["Be kind to yourself — nerves are completely normal.", "If deep breathing makes you lightheaded, pause and breathe normally."],
        steps: [
          { id: "s1", title: "Ground and breathe", instruction: "Stand tall, plant your feet, and take slow belly breaths.", tutorScript: "Nerves are normal — even professionals feel them. Plant your feet, stand tall, and take a few slow breaths into your belly. A calm body makes a calm voice.", reference: { kind: "diagram", caption: "Balanced posture and slow breathing" } },
          { id: "s2", title: "Warm up your voice", instruction: "Hum gently, then say a sentence slowly and clearly.", tutorScript: "Hum softly to warm up, then say one sentence slowly and clearly. A little slower than feels natural is usually just right for listeners.", reference: { kind: "animation", caption: "Slow, clear speech pacing" }, tip: "Pauses feel long to you but sound natural to listeners." },
        ],
      },
      {
        id: "l-sp-2",
        title: "Structure a Short Talk",
        objective: "Organise a talk into a clear opening, points and close.",
        durationMin: 15,
        materials: ["Paper or a notes app"],
        safety: ["Keep notes brief so you can look up at your audience."],
        steps: [
          { id: "s1", title: "One clear message", instruction: "Write the single main idea you want people to remember.", tutorScript: "Start with one clear message — the single thing you want people to remember. Everything else supports it.", reference: { kind: "diagram", caption: "One core message at the centre" } },
          { id: "s2", title: "Three simple points", instruction: "Support it with three short points, each with an example.", tutorScript: "Give three short points, each with a small example. Three is easy to follow and easy to remember. Open, three points, close.", reference: { kind: "image", caption: "Opening, three points, closing" }, tip: "End by repeating your main message." },
        ],
      },
      {
        id: "l-sp-3",
        title: "Deliver with Confidence",
        objective: "Practise delivery with eye contact and pacing.",
        durationMin: 14,
        materials: ["A recorder (optional)"],
        safety: ["Practise somewhere you feel comfortable."],
        steps: [
          { id: "s1", title: "Practise out loud", instruction: "Say your talk aloud, glancing up as if to an audience.", tutorScript: "Practise out loud — not just in your head. Glance up as if you're meeting friendly eyes. Speaking it aloud is where confidence grows.", reference: { kind: "animation", caption: "Glancing up to make eye contact" } },
          { id: "s2", title: "Record and review", instruction: "Record a run-through and note one thing you did well.", tutorScript: "Record one run-through. Watch it kindly: note one thing you did well and one to tweak. Then smile — you're ready!", reference: { kind: "image", caption: "Reviewing a practice recording" }, tip: "Improve one thing at a time." },
        ],
      },
    ],
  },
];

// All catalogue skills are now full, playable courses — no browse-only stubs.
export const catalogTeasers: Pick<
  Course,
  "id" | "categoryId" | "name" | "image" | "tutorId" | "ageGroups" | "difficulty" | "lessonCount" | "estimatedHours" | "materials" | "rating" | "ratingsCount" | "paid" | "price" | "summary"
>[] = [];

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
  {
    id: "hw-dr-1",
    courseId: "course-drawing-101",
    lessonId: "l-dr-1",
    title: "Block in an object from shapes",
    prompt: "Pick an everyday object, block it in with simple shapes, and upload a photo of your light sketch.",
    dueInDays: 4,
    submissionTypes: ["image"],
    status: "pending",
  },
  {
    id: "hw-bk-1",
    courseId: "course-baking-101",
    lessonId: "l-bk-1",
    title: "Show your safe setup",
    prompt: "Set up your baking station safely and list the allergy warnings you'd give. Upload a photo and your notes.",
    dueInDays: 5,
    submissionTypes: ["image", "text"],
    status: "pending",
  },
  {
    id: "hw-ph-1",
    courseId: "course-photo-101",
    lessonId: "l-ph-2",
    title: "A rule-of-thirds photo",
    prompt: "Take one photo using the grid with your subject on a line or cross. Upload your shot.",
    dueInDays: 4,
    submissionTypes: ["image"],
    status: "pending",
  },
  {
    id: "hw-mu-1",
    courseId: "course-music-101",
    lessonId: "l-mu-2",
    title: "Your first drum pattern",
    prompt: "Program a kick-and-snare pattern and share a short exported clip or a link.",
    dueInDays: 6,
    submissionTypes: ["audio", "link"],
    status: "pending",
  },
  {
    id: "hw-sp-1",
    courseId: "course-speaking-101",
    lessonId: "l-sp-2",
    title: "Outline a 1-minute talk",
    prompt: "Write your one main message and three supporting points. Submit your outline as text.",
    dueInDays: 4,
    submissionTypes: ["text", "document"],
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
  {
    id: "quiz-drawing-101",
    courseId: "course-drawing-101",
    title: "Sketching — Knowledge Check",
    questions: [
      { id: "q1", kind: "multiple-choice", prompt: "Why do we block in simple shapes first?", options: ["To use more paper", "To build accurate proportions before details", "It looks messy on purpose", "No reason"], correctIndex: 1, explanation: "Blocking in shapes first gets the proportions right before you commit to details." },
      { id: "q2", kind: "multiple-choice", prompt: "For believable shading, the light should be...", options: ["From many directions", "From one consistent direction", "Always from below", "Ignored"], correctIndex: 1, explanation: "One consistent light direction makes the shadows look real." },
    ],
  },
  {
    id: "quiz-baking-101",
    courseId: "course-baking-101",
    title: "Cupcakes — Knowledge Check",
    questions: [
      { id: "q1", kind: "multiple-choice", prompt: "Before using the oven, you should...", options: ["Use it alone quickly", "Ask an adult and use oven mitts", "Touch the tray to test heat", "Leave the kitchen"], correctIndex: 1, explanation: "Always involve an adult and use oven mitts — the oven and tray get very hot." },
      { id: "q2", kind: "multiple-choice", prompt: "Why shouldn't you overmix the batter?", options: ["It's faster", "It makes cupcakes tough", "It saves flour", "No reason"], correctIndex: 1, explanation: "Overmixing develops gluten and makes cupcakes dense and tough." },
      { id: "q3", kind: "reflection", prompt: "Which allergy warnings would you give before sharing your cupcakes?" },
    ],
  },
  {
    id: "quiz-photo-101",
    courseId: "course-photo-101",
    title: "Phone Photography — Knowledge Check",
    questions: [
      { id: "q1", kind: "multiple-choice", prompt: "Where should the light usually be for a clear photo of a person?", options: ["Behind the subject", "In front of or beside the subject", "Turned off", "Pointed at the lens"], correctIndex: 1, explanation: "Light in front of or beside the subject avoids a dark silhouette." },
      { id: "q2", kind: "multiple-choice", prompt: "The rule of thirds suggests placing your subject...", options: ["Always dead centre", "On a grid line or where lines cross", "In a corner only", "Out of frame"], correctIndex: 1, explanation: "Placing the subject on a third line or intersection feels more natural." },
    ],
  },
  {
    id: "quiz-music-101",
    courseId: "course-music-101",
    title: "First Beat — Knowledge Check",
    questions: [
      { id: "q1", kind: "multiple-choice", prompt: "In a basic pattern, the snare usually lands on...", options: ["Beats 1 and 3", "Beats 2 and 4", "Every beat", "No beats"], correctIndex: 1, explanation: "Kick on 1 and 3, snare on 2 and 4 is the classic backbeat." },
      { id: "q2", kind: "multiple-choice", prompt: "To protect your hearing while producing, you should...", options: ["Turn it up to maximum", "Keep volume moderate and take breaks", "Never use headphones", "Ignore volume"], correctIndex: 1, explanation: "Moderate volume and regular breaks protect your hearing." },
    ],
  },
  {
    id: "quiz-speaking-101",
    courseId: "course-speaking-101",
    title: "Public Speaking — Knowledge Check",
    questions: [
      { id: "q1", kind: "multiple-choice", prompt: "A simple, memorable talk structure is...", options: ["Ten points, no opening", "Opening, three points, closing", "Just reading a page", "Only a conclusion"], correctIndex: 1, explanation: "One message, three supporting points, and a close is easy to follow and remember." },
      { id: "q2", kind: "reflection", prompt: "What is one thing that helps you feel calmer before speaking?" },
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

// ---------------------------------------------------------------------------
// Tutorial Library — short, interactive step-through tutorials with narration.
// ---------------------------------------------------------------------------
export const tutorials: import("./types").Tutorial[] = [
  {
    id: "tut-nail-dots",
    title: "Neat Polka-Dot Nails in 4 Steps",
    categoryId: "c-nail",
    difficulty: "beginner",
    durationMin: 4,
    ageGroups: ["teen", "adult", "senior"],
    summary: "A quick, tidy polka-dot design from base coat to shine.",
    image: "💅",
    steps: [
      { title: "Prep & base coat", narration: "Start clean. File in one direction, then paint a thin base coat to protect your nail.", visual: "🧾" },
      { title: "Two thin colour coats", narration: "Add colour in thin layers — middle stroke first, then each side. Let each coat dry.", visual: "💗" },
      { title: "Dot the pattern", narration: "Dip a dotting tool and press gently for round, even dots. Re-dip between each one.", visual: "⚪" },
      { title: "Seal with top coat", narration: "Finish with a glossy top coat to seal the design and make it last.", visual: "✨" },
    ],
  },
  {
    id: "tut-makeup-base",
    title: "A Natural Everyday Base",
    categoryId: "c-makeup",
    difficulty: "beginner",
    durationMin: 3,
    ageGroups: ["teen", "adult", "senior"],
    summary: "Prep, base, and a soft finish for a fresh everyday look.",
    image: "💄",
    steps: [
      { title: "Cleanse & moisturise", narration: "Clean skin first, then a little moisturiser so everything glides on smoothly.", visual: "🧴" },
      { title: "Dot and blend base", narration: "Small dots on forehead, cheeks, nose and chin, then bounce a damp sponge to blend.", visual: "🫧" },
      { title: "Add a hint of blush", narration: "Smile and sweep blush on the apples of your cheeks for a fresh flush.", visual: "🌸" },
      { title: "Finish with mascara", narration: "Wiggle mascara root to tip on your top lashes. One coat is plenty for daytime.", visual: "👁️" },
    ],
  },
  {
    id: "tut-code-heading",
    title: "Your First Web Heading",
    categoryId: "c-coding",
    difficulty: "beginner",
    durationMin: 3,
    ageGroups: ["child", "teen", "adult", "senior"],
    summary: "Write and style your first HTML heading.",
    image: "💻",
    steps: [
      { title: "Tags come in pairs", narration: "HTML uses tags. Most have an opening tag and a closing tag with a slash. Content sits between them.", visual: "🏷️" },
      { title: "Write a heading", narration: "Type h1 with your title inside. Save and refresh — you just made a web page!", visual: "🔠" },
      { title: "Add a style block", narration: "In the head, add a style block to change colours, fonts and spacing.", visual: "🎨" },
      { title: "Centre and colour it", narration: "Give your h1 a colour and text-align center. Beautiful — that's HTML and CSS!", visual: "🌈" },
    ],
  },
  {
    id: "tut-draw-shapes",
    title: "Draw Anything from Simple Shapes",
    categoryId: "c-drawing",
    difficulty: "beginner",
    durationMin: 3,
    ageGroups: ["child", "teen", "adult"],
    summary: "Turn circles and boxes into confident sketches.",
    image: "🖌️",
    steps: [
      { title: "Start with shapes", narration: "Every object hides simple shapes. Block in circles and boxes lightly first.", visual: "⭕" },
      { title: "Connect the forms", narration: "Join your shapes with gentle guide lines to find the outline.", visual: "✏️" },
      { title: "Refine the outline", narration: "Press a little harder to draw the real edges over your guides.", visual: "📐" },
      { title: "Add light shading", narration: "Shade one side softly to give your drawing depth.", visual: "🌗" },
    ],
  },
  {
    id: "tut-bake-cupcakes",
    title: "Fluffy Cupcakes, Step by Step",
    categoryId: "c-baking",
    difficulty: "beginner",
    durationMin: 5,
    ageGroups: ["teen", "adult", "senior"],
    summary: "Mix, bake, and decorate — with kitchen safety first.",
    image: "🧁",
    steps: [
      { title: "Safety & setup", narration: "Wash hands, tie back hair, and ask an adult before using the oven. Preheat it safely.", visual: "🧼" },
      { title: "Mix the batter", narration: "Cream butter and sugar, add eggs, then fold in flour gently — don't overmix.", visual: "🥣" },
      { title: "Bake with care", narration: "Fill liners two-thirds full. Use oven mitts. Bake until a toothpick comes out clean.", visual: "🔥" },
      { title: "Cool then decorate", narration: "Let them cool fully, then pipe frosting and add toppings. Enjoy!", visual: "🎨" },
    ],
  },
  {
    id: "tut-speak-confident",
    title: "Speak with Calm Confidence",
    categoryId: "c-speaking",
    difficulty: "intermediate",
    durationMin: 4,
    ageGroups: ["teen", "adult", "senior"],
    summary: "Structure a short talk and deliver it steadily.",
    image: "🎤",
    steps: [
      { title: "Breathe and ground", narration: "Take a slow breath. Plant your feet. A calm body makes a calm voice.", visual: "🌬️" },
      { title: "Open with one idea", narration: "Start with a single clear sentence about what you'll share.", visual: "💡" },
      { title: "Three simple points", narration: "Give three short points. Pause between each so your listener keeps up.", visual: "3️⃣" },
      { title: "Close and smile", narration: "End by repeating your main idea, then smile. You did it!", visual: "😊" },
    ],
  },
];

// Convenience lookups -------------------------------------------------------
export const getCourse = (id: string) => courses.find((c) => c.id === id);
export const getTutor = (id: string) => tutors.find((t) => t.id === id);
export const getCategory = (id: string) => categories.find((c) => c.id === id);
export const getQuizByCourse = (courseId: string) => quizzes.find((q) => q.courseId === courseId);
export const getLesson = (courseId: string, lessonId: string) =>
  getCourse(courseId)?.lessons.find((l) => l.id === lessonId);
