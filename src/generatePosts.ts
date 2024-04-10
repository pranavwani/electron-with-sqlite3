import fs from 'fs'
import {faker} from '@faker-js/faker'

// Function to generate a random post object
const generatePost = () => {
  return {
    userId: faker.number.int(),
    id: faker.number.int(),
    title: faker.lorem.sentence(),
    body: faker.lorem.paragraph()
  };
};

// Function to generate an array of post objects
const generatePostsArray = (numPosts: number) => {
  const posts = [];
  for (let i = 0; i < numPosts; i++) {
    posts.push(generatePost());
  }
  return posts;
};

// Number of posts to generate
const numPosts = 100; // Adjust as needed

// Generate the array of posts
const postsArray = generatePostsArray(numPosts);

// Write the array of posts to a JSON file
const fileName = 'posts.json';

fs.writeFileSync(fileName, JSON.stringify(postsArray, null, 2));

console.log(`Generated ${numPosts} posts. Saved to ${fileName}.`);
