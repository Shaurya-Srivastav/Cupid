import { v4 as uuidv4 } from 'uuid';

// Define the Goal interface for type safety
interface Goal {
  id: string;
  title: string;
  date: Date;
  trophies: number;
  badge: string;
}

// Define subcategories within main categories for better compatibility
const verbCategories: { [category: string]: string[] } = {
  Creative: [
    'Create',
    'Build',
    'Paint',
    'Craft',
    'Compose',
    'Sketch',
    'Brew',
    'Make',
    'Design',
    'Develop',
    'Decorate',
    'Assemble',
    'Sculpt',
  ],
  Experiential: [
    'Explore',
    'Discover',
    'Experience',
    'Enjoy',
    'Try',
    'Investigate',
    'Master',
    'Navigate',
    'Uncover',
    'Conquer',
    'Grow',
    'Bond over',
    'Participate in',
    'Attend',
    'Join',
  ],
  Physical: [
    'Dance',
    'Cook',
    'Play',
    'Photograph',
    'Sail',
    'Kayak',
    'Hike',
    'Cycle',
    'Run',
    'Swim',
    'Practice Yoga',
    'Stretch',
    'Climb',
    'Exercise',
  ],
  Educational: [
    'Read',
    'Listen to',
    'Study',
    'Learn',
    'Research',
    'Understand',
    'Analyze',
    'Investigate',
    'Master',
    'Teach',
    'Explore',
    'Discover',
  ],
};

// Define subjects along with their corresponding categories and compatible verbs
const subjects: {
  text: string;
  category: keyof typeof verbCategories;
  compatibleVerbs: string[];
}[] = [
  // Creative Subjects
  {
    text: 'a new hobby together',
    category: 'Creative',
    compatibleVerbs: ['Create', 'Build', 'Paint', 'Craft', 'Make', 'Design', 'Develop', 'Decorate', 'Assemble', 'Sculpt'],
  },
  {
    text: 'a new board game',
    category: 'Creative',
    compatibleVerbs: ['Create', 'Design', 'Build', 'Make', 'Develop', 'Craft'],
  },
  {
    text: 'a piece of art',
    category: 'Creative',
    compatibleVerbs: ['Create', 'Paint', 'Craft', 'Compose', 'Sketch', 'Decorate', 'Sculpt'],
  },
  {
    text: 'a DIY craft',
    category: 'Creative',
    compatibleVerbs: ['Create', 'Craft', 'Make', 'Design', 'Build'],
  },
  {
    text: 'a musical instrument',
    category: 'Creative',
    compatibleVerbs: ['Compose', 'Play', 'Craft', 'Build', 'Design'],
  },
  {
    text: 'a handmade decoration',
    category: 'Creative',
    compatibleVerbs: ['Create', 'Craft', 'Decorate', 'Make', 'Design'],
  },
  {
    text: 'a pottery workshop',
    category: 'Creative',
    compatibleVerbs: ['Create', 'Craft', 'Paint', 'Decorate', 'Make', 'Design', 'Sculpt'],
  },
  {
    text: 'a scrapbook project',
    category: 'Creative',
    compatibleVerbs: ['Create', 'Make', 'Design', 'Decorate', 'Craft'],
  },
  
  // Experiential Subjects
  {
    text: 'an exotic cuisine',
    category: 'Experiential',
    compatibleVerbs: ['Explore', 'Discover', 'Experience', 'Enjoy', 'Try', 'Investigate', 'Master', 'Conquer'],
  },
  {
    text: 'a hidden gem in your city',
    category: 'Experiential',
    compatibleVerbs: ['Explore', 'Discover', 'Experience', 'Enjoy', 'Navigate', 'Uncover', 'Bond over'],
  },
  {
    text: 'a local event',
    category: 'Experiential',
    compatibleVerbs: ['Attend', 'Participate in', 'Join', 'Experience', 'Enjoy'],
  },
  {
    text: 'a beautiful sunset',
    category: 'Experiential',
    compatibleVerbs: ['Experience', 'Enjoy', 'Photograph', 'Explore', 'Uncover'],
  },
  {
    text: 'a cultural performance',
    category: 'Experiential',
    compatibleVerbs: ['Attend', 'Enjoy', 'Experience', 'Participate in', 'Explore'],
  },
  {
    text: 'an unusual dessert',
    category: 'Experiential',
    compatibleVerbs: ['Try', 'Explore', 'Enjoy', 'Discover', 'Experience'],
  },
  {
    text: 'a beautiful waterfall nearby',
    category: 'Experiential',
    compatibleVerbs: ['Explore', 'Discover', 'Experience', 'Enjoy', 'Photograph', 'Hike'],
  },
  {
    text: 'a unique landmark',
    category: 'Experiential',
    compatibleVerbs: ['Explore', 'Discover', 'Experience', 'Enjoy', 'Navigate'],
  },
  {
    text: 'a secluded beach',
    category: 'Experiential',
    compatibleVerbs: ['Explore', 'Discover', 'Experience', 'Enjoy', 'Photograph', 'Relax'],
  },
  {
    text: 'a local park',
    category: 'Experiential',
    compatibleVerbs: ['Explore', 'Discover', 'Experience', 'Enjoy', 'Photograph', 'Relax'],
  },
  {
    text: 'a public garden',
    category: 'Experiential',
    compatibleVerbs: ['Explore', 'Discover', 'Experience', 'Enjoy', 'Photograph', 'Relax'],
  },
  {
    text: 'a street food festival',
    category: 'Experiential',
    compatibleVerbs: ['Explore', 'Discover', 'Experience', 'Enjoy', 'Try', 'Bond over'],
  },
  {
    text: 'a wildlife sanctuary',
    category: 'Experiential',
    compatibleVerbs: ['Explore', 'Discover', 'Experience', 'Enjoy', 'Photograph', 'Learn about'],
  },
  {
    text: 'a vineyard tour',
    category: 'Experiential',
    compatibleVerbs: ['Explore', 'Discover', 'Experience', 'Enjoy', 'Taste', 'Photograph'],
  },
  {
    text: 'a ghost tour',
    category: 'Experiential',
    compatibleVerbs: ['Explore', 'Discover', 'Experience', 'Enjoy', 'Navigate'],
  },
  {
    text: 'a vintage market',
    category: 'Experiential',
    compatibleVerbs: ['Explore', 'Discover', 'Experience', 'Enjoy', 'Browse', 'Photograph'],
  },
  {
    text: 'a comedy show',
    category: 'Experiential',
    compatibleVerbs: ['Attend', 'Enjoy', 'Experience', 'Laugh at'],
  },
  {
    text: 'a retro arcade',
    category: 'Experiential',
    compatibleVerbs: ['Explore', 'Play', 'Experience', 'Enjoy'],
  },
  {
    text: 'a starry sky observation',
    category: 'Experiential',
    compatibleVerbs: ['Explore', 'Discover', 'Experience', 'Enjoy', 'Photograph'],
  },
  
  // Physical Subjects
  {
    text: 'an outdoor adventure',
    category: 'Physical',
    compatibleVerbs: ['Hike', 'Cycle', 'Run', 'Swim', 'Explore', 'Climb', 'Kayak', 'Sail'],
  },
  {
    text: 'a traditional dance',
    category: 'Physical',
    compatibleVerbs: ['Dance', 'Learn', 'Practice', 'Enjoy'],
  },
  {
    text: 'a scenic route for a walk',
    category: 'Physical',
    compatibleVerbs: ['Explore', 'Walk', 'Enjoy', 'Photograph', 'Relax'],
  },
  {
    text: 'a meditation practice',
    category: 'Physical',
    compatibleVerbs: ['Practice Yoga', 'Meditate', 'Relax', 'Stretch'],
  },
  {
    text: 'a kayaking route',
    category: 'Physical',
    compatibleVerbs: ['Kayak', 'Explore', 'Experience', 'Enjoy', 'Photograph'],
  },
  {
    text: 'a mountain trail',
    category: 'Physical',
    compatibleVerbs: ['Hike', 'Climb', 'Explore', 'Discover', 'Experience'],
  },
  {
    text: 'a dance class',
    category: 'Physical',
    compatibleVerbs: ['Dance', 'Learn', 'Practice', 'Enjoy'],
  },
  {
    text: 'a sailing lesson',
    category: 'Physical',
    compatibleVerbs: ['Sail', 'Learn', 'Practice', 'Enjoy'],
  },
  {
    text: 'a paintball match',
    category: 'Physical',
    compatibleVerbs: ['Play', 'Compete', 'Experience', 'Enjoy'],
  },
  {
    text: 'a scenic bike ride',
    category: 'Physical',
    compatibleVerbs: ['Cycle', 'Explore', 'Enjoy', 'Photograph'],
  },
  {
    text: 'a yoga session',
    category: 'Physical',
    compatibleVerbs: ['Practice Yoga', 'Meditate', 'Stretch', 'Relax'],
  },
  {
    text: 'a hiking expedition',
    category: 'Physical',
    compatibleVerbs: ['Hike', 'Explore', 'Discover', 'Experience', 'Enjoy'],
  },
  
  // Educational Subjects
  {
    text: 'a famous book',
    category: 'Educational',
    compatibleVerbs: ['Read', 'Analyze', 'Discuss', 'Understand', 'Explore'],
  },
  {
    text: 'a popular movie genre',
    category: 'Educational',
    compatibleVerbs: ['Explore', 'Study', 'Analyze', 'Discuss', 'Understand'],
  },
  {
    text: 'a new language',
    category: 'Educational',
    compatibleVerbs: ['Learn', 'Practice', 'Study', 'Master', 'Teach'],
  },
  {
    text: 'a historical site',
    category: 'Educational',
    compatibleVerbs: ['Explore', 'Learn about', 'Discover', 'Experience', 'Understand'],
  },
  {
    text: 'an interesting podcast',
    category: 'Educational',
    compatibleVerbs: ['Listen to', 'Analyze', 'Discuss', 'Understand', 'Learn from'],
  },
  {
    text: 'a new cooking technique',
    category: 'Educational',
    compatibleVerbs: ['Learn', 'Master', 'Practice', 'Study', 'Apply'],
  },
  {
    text: 'a challenging puzzle',
    category: 'Educational',
    compatibleVerbs: ['Solve', 'Complete', 'Tackle', 'Enjoy', 'Analyze'],
  },
  {
    text: 'an online tutorial',
    category: 'Educational',
    compatibleVerbs: ['Follow', 'Complete', 'Learn from', 'Participate in', 'Practice'],
  },
  {
    text: 'an astronomy event',
    category: 'Educational',
    compatibleVerbs: ['Attend', 'Observe', 'Learn about', 'Explore', 'Experience'],
  },
  {
    text: 'a book club meeting',
    category: 'Educational',
    compatibleVerbs: ['Attend', 'Discuss', 'Read', 'Analyze', 'Participate in'],
  },
  {
    text: 'a historical reenactment',
    category: 'Educational',
    compatibleVerbs: ['Attend', 'Participate in', 'Explore', 'Experience', 'Learn from'],
  },
  {
    text: 'a science exhibition',
    category: 'Educational',
    compatibleVerbs: ['Explore', 'Attend', 'Learn from', 'Discover', 'Experience'],
  },
  {
    text: 'a documentary series',
    category: 'Educational',
    compatibleVerbs: ['Watch', 'Analyze', 'Discuss', 'Learn from', 'Understand'],
  },
  {
    text: 'a coding workshop',
    category: 'Educational',
    compatibleVerbs: ['Attend', 'Learn', 'Practice', 'Develop', 'Master'],
  },
  {
    text: 'a language exchange meetup',
    category: 'Educational',
    compatibleVerbs: ['Attend', 'Practice', 'Learn', 'Teach', 'Engage in'],
  },
];

// Define extras aligned with subjects for better coherence
const extras = [
  // Creative Extras
  'while sharing each other’s childhood stories',
  'with a themed playlist',
  'while documenting the experience',
  'while writing a joint diary entry',
  'while making a scrapbook of the experience',
  'with a list of fun challenges',
  'while exchanging roles for the day',

  // Experiential Extras
  'while taking photos',
  'blindfolded',
  'in a new neighborhood',
  'without spending any money',
  'at midnight',
  'during sunrise',
  'with a picnic',
  'while trying to find the best local snack',
  'wearing matching outfits',
  'on bicycles',
  'as if you were tourists',
  'dressed in vintage clothes',
  'while cooking something together afterward',

  // Physical Extras
  'in fancy clothes',
  'in complete silence',
  'using only public transport',
  'while making a short film about it',
  'wearing costumes',
  'while focusing on mindfulness',

  // Educational Extras
  'while taking notes diligently',
  'while discussing key points',
  'with a study partner',
  'while teaching each other',
  'while creating mind maps',
  'with a quiet study environment',
];

// Define categories for badges to classify goals
const categories = [
  'Romantic Escapade',
  'Adventurous Quest',
  'Relaxation Retreat',
  'Cultural Immersion',
  'Learning Experience',
  'Mystery Adventure',
  'Culinary Journey',
  'Creative Collaboration',
  'Outdoor Exploration',
  'Mindful Moments',
  'Historical Discovery',
  'Whimsical Fun',
  'Artistic Expression',
  'Scenic Beauty',
  'Wellness and Health',
];

// Utility function to select a random element from an array
const getRandom = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// Enhanced generateRandomGoal function with improved coherence
export const generateRandomGoal = (count: number): Goal[] => {
  const uniqueGoals = new Set<string>();
  const goals: Goal[] = [];

  while (uniqueGoals.size < count) {
    // Select a random subject
    const subjectObj = getRandom(subjects);
    const subjectCategory = subjectObj.category;

    // Fetch compatible verbs based on the subject's category
    const compatibleVerbs = subjectObj.compatibleVerbs;

    // If no compatible verbs are found, skip to the next iteration
    if (!compatibleVerbs || compatibleVerbs.length === 0) continue;

    // Select a random verb from the compatible verbs
    const verb = getRandom(compatibleVerbs);
    const subject = subjectObj.text;

    // Optionally add an extra aligned with the category
    const categoryExtras = extras.filter((extra) => {
      // Simple keyword matching based on category
      if (subjectCategory === 'Creative') {
        return [
          'sharing each other’s childhood stories',
          'themed playlist',
          'documenting the experience',
          'writing a joint diary entry',
          'making a scrapbook of the experience',
          'list of fun challenges',
          'exchanging roles for the day',
        ].some((keyword) => extra.includes(keyword));
      } else if (subjectCategory === 'Experiential') {
        return [
          'taking photos',
          'blindfolded',
          'new neighborhood',
          'spending any money',
          'midnight',
          'sunrise',
          'picnic',
          'best local snack',
          'matching outfits',
          'bicycles',
          'tourists',
          'vintage clothes',
          'cooking something together afterward',
        ].some((keyword) => extra.includes(keyword));
      } else if (subjectCategory === 'Physical') {
        return [
          'fancy clothes',
          'complete silence',
          'public transport',
          'making a short film about it',
          'wearing costumes',
          'focusing on mindfulness',
        ].some((keyword) => extra.includes(keyword));
      } else if (subjectCategory === 'Educational') {
        return [
          'taking notes diligently',
          'discussing key points',
          'study partner',
          'teaching each other',
          'creating mind maps',
          'quiet study environment',
        ].some((keyword) => extra.includes(keyword));
      }
      return false;
    });

    const extra = Math.random() > 0.5 ? getRandom(categoryExtras) : '';

    // Construct the goal title
    const goalTitle = `${verb} ${subject}${extra ? ' ' + extra : ''}`;

    // Ensure the goal is unique and logically coherent
    if (!uniqueGoals.has(goalTitle)) {
      uniqueGoals.add(goalTitle);

      // Generate a realistic completion date within the next year
      const currentDate = new Date();
      const futureDate = new Date(
        currentDate.getTime() + Math.random() * 365 * 24 * 60 * 60 * 1000
      );

      // Assign a random number of trophies between 1 and 10
      const trophies = Math.floor(Math.random() * 10) + 1;

      // Assign a random badge category
      const badge = getRandom(categories);

      // Push the new goal to the goals array
      goals.push({
        id: uuidv4(),
        title: goalTitle,
        date: futureDate,
        trophies,
        badge,
      });
    }
  }

  return goals;
};
