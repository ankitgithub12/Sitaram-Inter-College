require('dotenv').config();
const mongoose = require('mongoose');
const { Admin, Teacher, Student } = require('./models');

const MONGODB_URI = process.env.MONGODB_URI;

const migrate = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Access the 'users' collection directly using native driver or a temporary model
    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');
    
    const allUsers = await usersCollection.find({}).toArray();
    console.log(`🔍 Found ${allUsers.length} users in legacy collection`);

    let migratedCount = 0;

    for (const user of allUsers) {
      // Check if already migrated
      const username = user.username;
      
      const adminExists = await Admin.findOne({ username });
      const teacherExists = await Teacher.findOne({ username });
      const studentExists = await Student.findOne({ username });

      if (adminExists || teacherExists || studentExists) {
        console.log(`⏩ Skipping ${username}, already exists in new collection`);
        continue;
      }

      // Create in new collection
      const role = user.role || 'student';
      const userData = { ...user };
      delete userData._id; // Let Mongo generate new ID or keep old one?
      // Better to keep same ID if possible to maintain refs, but since we are moving collections, we can just copy.
      // If we want to keep IDs, we need to handle it carefully.
      
      if (role === 'admin') {
        await Admin.create(user);
      } else if (role === 'teacher') {
        await Teacher.create(user);
      } else {
        await Student.create(user);
      }
      
      migratedCount++;
      console.log(`✅ Migrated ${username} as ${role}`);
    }

    console.log(`🏁 Migration complete. ${migratedCount} users moved.`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  }
};

migrate();
