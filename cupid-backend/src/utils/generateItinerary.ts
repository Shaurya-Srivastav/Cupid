// src/utils/generateItinerary.ts

import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const YELP_API_KEY = process.env.YELP_API_KEY || '';
const YELP_API_URL = 'https://api.yelp.com/v3/businesses/search';

const interestToCategoryMap: { [key: string]: string } = {
  restaurants: 'restaurants',
  museums: 'museums',
  parks: 'parks',
  movies: 'movietheaters',
  nightlife: 'nightlife',
  shopping: 'shopping',
  theaters: 'theater',
  coffee: 'coffee',
};

interface Place {
  id: string;
  name: string;
  categories: { alias: string; title: string }[];
  location: {
    display_address: string[];
  };
  coordinates: {
    latitude: number;
    longitude: number;
  };
  rating: number;
  price: string;
  image_url: string;
}

const getPriceLevels = (budget: '$' | '$$' | '$$$' | '$$$$'): number[] => {
  const priceLevels: { $: number[]; $$: number[]; $$$: number[]; $$$$: number[] } = {
    $: [1],
    $$: [1, 2],
    $$$: [1, 2, 3],
    $$$$: [1, 2, 3, 4],
  };
  return priceLevels[budget];
};

const searchYelp = async (
  categories: string,
  location: string,
  price: string
): Promise<Place[]> => {
  try {
    const response = await axios.get(YELP_API_URL, {
      headers: {
        Authorization: `Bearer ${YELP_API_KEY}`,
      },
      params: {
        categories,
        location,
        price,
        limit: 50,
      },
    });
    return response.data.businesses;
  } catch (error) {
    console.error('Error fetching from Yelp:', error);
    return [];
  }
};

const removeDuplicates = (places: Place[]): Place[] => {
  const uniquePlaces: { [key: string]: Place } = {};
  places.forEach((place) => {
    uniquePlaces[place.id] = place;
  });
  return Object.values(uniquePlaces);
};

export const generateItinerary = async (
  city: string,
  interests: string[],
  budget: string
): Promise<any[]> => {
  // Step 1: Validate and narrow down budget
  let narrowedBudget: '$' | '$$' | '$$$' | '$$$$' = '$'; // Default value
  if (budget === '$' || budget === '$$' || budget === '$$$' || budget === '$$$$') {
    narrowedBudget = budget;
  } else {
    console.warn(`Invalid budget "${budget}" provided. Defaulting to "$".`);
  }

  // Step 2: Get acceptable price levels based on narrowed budget
  const acceptablePriceLevels = getPriceLevels(narrowedBudget);

  // Convert price levels to Yelp price string format
  const priceString = acceptablePriceLevels.join(',');

  // Step 3: Map user's interests to Yelp categories
  const categories = interests
    .map((interest) => interestToCategoryMap[interest.toLowerCase()])
    .filter(Boolean)
    .join(',');

  if (!categories) {
    throw new Error('No valid interests provided.');
  }

  // Step 4: Search Yelp API with combined categories
  const yelpResults = await searchYelp(categories, city, priceString);

  // Step 5: Remove duplicates
  const uniquePlaces = removeDuplicates(yelpResults);

  // Step 6: Sort the places based on rating
  const sortedPlaces = uniquePlaces.sort((a, b) => b.rating - a.rating);

  // Step 7: Select top N places (e.g., 5)
  const topPlaces = sortedPlaces.slice(0, 5);

  // Step 8: Format the itinerary
  const itinerary = topPlaces.map((place) => ({
    name: place.name,
    coordinates: {
      latitude: place.coordinates.latitude,
      longitude: place.coordinates.longitude,
    },
    description: place.categories.map((cat) => cat.title).join(', '),
    rating: place.rating,
    cost: place.price ? place.price.length : 0,
    busy: false,
    imageUrl: place.image_url,
    address: place.location.display_address.join(', '),
  }));

  return itinerary;
};
