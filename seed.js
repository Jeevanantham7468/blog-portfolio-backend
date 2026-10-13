// Seeds sample blog posts into MongoDB.
// Usage: npm run seed
require('dotenv').config();

const mongoose = require('mongoose');
const Blog = require('./models/Blog');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/blogDB';

const author = 'Jeevanantham';

const blogs = [
  {
    newTitle: 'Building Scalable Full Stack Apps with React and Node.js',
    newContent:
      'Modern full stack development combines React on the frontend with Node.js and Express on the backend. By using a component-based architecture and asynchronous, event-driven APIs, you can ship fast and responsive web experiences that scale as your user base grows.',
    date: 'October 10, 2026',
    likes: 42,
    author,
  },
  {
    newTitle: 'Demystifying MongoDB & Mongoose in Modern Applications',
    newContent:
      'MongoDB is a document-oriented NoSQL database offering flexibility, scalability and ease of use. Paired with Mongoose schemas and models, you get structured validation while keeping schema agility — the best of both worlds.',
    date: 'October 8, 2026',
    likes: 35,
    author,
  },
  {
    newTitle: 'Securing User Authentication with Firebase',
    newContent:
      'Authentication is the foundation of user trust. Firebase Authentication provides enterprise-grade security out of the box: email/password sign-in, social providers, token revocation and role-based access control. This portfolio uses it to protect the admin area.',
    date: 'October 5, 2026',
    likes: 51,
    author,
  },
  {
    newTitle: 'Styling Faster with Tailwind CSS',
    newContent:
      'Tailwind CSS is a utility-first framework that lets you build custom interfaces without leaving your markup. It keeps styles consistent, speeds up iteration, and produces tiny production bundles thanks to purging unused classes.',
    date: 'October 2, 2026',
    likes: 28,
    author,
  },
  {
    newTitle: 'REST vs GraphQL: Choosing the Right API Style',
    newContent:
      'REST is simple, cacheable and battle-tested, which makes it a great default. GraphQL shines when clients need flexible, nested data in a single request. The right choice depends on your clients, team and data shape — not on hype.',
    date: 'September 29, 2026',
    likes: 19,
    author,
  },
  {
    newTitle: 'Deploying a MERN App with Render, Vercel and Atlas',
    newContent:
      'A production-ready deployment uses MongoDB Atlas for data, a Render web service for the Express API, and Vercel for the React frontend. Set your environment variables, allow the host in Atlas Network Access, and you have a fully live full stack app.',
    date: 'September 25, 2026',
    likes: 47,
    author,
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log(`Connected to ${mongoose.connection.name}`);

    let inserted = 0;
    for (const blog of blogs) {
      // Insert only if a post with the same title does not already exist,
      // so running the seed again never creates duplicates.
      const result = await Blog.updateOne(
        { newTitle: blog.newTitle },
        { $setOnInsert: blog },
        { upsert: true }
      );
      if (result.upsertedCount > 0) inserted += 1;
    }

    const total = await Blog.countDocuments();
    console.log(`Inserted ${inserted} new blog(s). Total blogs: ${total}`);
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seed();
