// src/utils/generateItinerary.ts

import OpenAI from 'openai';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

const YELP_API_KEY = process.env.YELP_API_KEY || '';
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY || '';

interface Place {
  name: string;
  category: string;
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  rating: number;
  price: string;
  image_url: string;
}

export const generateItinerary = async (
  city: string,
  interests: string[],
  budget: string
): Promise<any[]> => {
  // Step 1: Start with a basic itinerary to fall back on if APIs fail
  let places: Place[] = [
    {
      name: 'Central Park',
      category: 'Park',
      address: 'New York, NY 10022',
      coordinates: { latitude: 40.785091, longitude: -73.968285 },
      rating: 4.7,
      price: '$',
      image_url: 'https://example.com/image1.jpg',
    },
    {
      name: 'The Museum of Modern Art',
      category: 'Museum',
      address: '11 W 53rd St, New York, NY 10019',
      coordinates: { latitude: 40.761433, longitude: -73.977622 },
      rating: 4.8,
      price: '$$',
      image_url: 'https://example.com/image2.jpg',
    },
    {
      name: 'Popular Coffee Shop',
      category: 'Cafe',
      address: '201 W 14th St, New York, NY 10011',
      coordinates: { latitude: 40.737228, longitude: -74.000423 },
      rating: 4.5,
      price: '$',
      image_url: 'https://example.com/image3.jpg',
    },
  ];

  try {
    // Step 2: If OpenAI quota allows, generate a more personalized itinerary using OpenAI
    if (process.env.OPENAI_API_KEY) {
      const openaiResponse = await openai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: `You are a helpful assistant for planning date itineraries.`,
          },
          {
            role: 'user',
            content: `Generate a date itinerary in ${city} for someone interested in ${interests.join(
              ', '
            )} with a budget of ${budget}. Provide a list of 3-5 places, including details like name, category, and a brief description.`,
          },
        ],
        model: 'gpt-4o-mini-2024-07-18', // Updated to use GPT-4o-mini
      });
      
      const extractedPlaces = await extractPlacesFromText(openaiResponse.choices[0].message?.content || '');
      places = extractedPlaces.map((place) => ({
        ...place,
        category: place.category || 'General',
        address: '',
        coordinates: { latitude: 0, longitude: 0 },
        rating: 0,
        price: '',
        image_url: '',
      }));
    }
  } catch (error) {
    console.error('Error using OpenAI for itinerary:', error);
  }

  // Step 3: Enhance the itinerary with Yelp API data
  const itinerary = [];
  for (const place of places) {
    const yelpData = await searchYelp(place.name, city);
    if (yelpData) {
      itinerary.push({
        name: yelpData.name,
        position: [
          yelpData.coordinates.latitude,
          yelpData.coordinates.longitude,
        ],
        description: yelpData.categories.map((cat: any) => cat.title).join(', '),
        rating: yelpData.rating,
        cost: yelpData.price ? yelpData.price.length : 0,
        busy: false,
        imageUrl: yelpData.image_url,
      });
    } else {
      // If Yelp data isn't found, add the original placeholder data
      itinerary.push({
        name: place.name,
        position: [
          place.coordinates.latitude,
          place.coordinates.longitude,
        ],
        description: place.category,
        rating: place.rating,
        cost: place.price.length,
        busy: false,
        imageUrl: place.image_url,
      });
    }
  }

  return itinerary;
};

// Helper function to parse places from OpenAI's response
const extractPlacesFromText = async (
  text: string
): Promise<{ name: string; category?: string }[]> => {
  try {
    const places = JSON.parse(text);
    return places;
  } catch {
    // Fallback if parsing fails
    return [
      { name: 'Fallback Place 1', category: 'General' },
      { name: 'Fallback Place 2', category: 'General' },
      { name: 'Fallback Place 3', category: 'General' },
    ];
  }
};

// Yelp search function to find detailed data on a place
const searchYelp = async (term: string, location: string): Promise<any> => {
  try {
    const response = await axios.get(
      'https://api.yelp.com/v3/businesses/search',
      {
        headers: {
          Authorization: `Bearer ${YELP_API_KEY}`,
        },
        params: {
          term,
          location,
          limit: 1,
        },
      }
    );
    return response.data.businesses[0];
  } catch (error) {
    console.error('Error fetching from Yelp:', error);
    return null;
  }
};
