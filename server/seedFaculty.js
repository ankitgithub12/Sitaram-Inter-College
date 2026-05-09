const mongoose = require('mongoose');
require('dotenv').config();
const { User } = require('./models');

const facultyData = [
  {
    name: "Mrs. Renu Saini",
    username: "renu_saini",
    password: "Teacher@2026",
    position: "Senior Science Teacher",
    qualification: "M.Sc (Physics), B.Ed",
    experience: "12 Years Experience",
    description: "Dedicated science educator with expertise in experimental physics and science pedagogy. She inspires curiosity through hands-on learning and is passionate about making science engaging and accessible for every student.",
    department: "science",
    photoUrl: "/assets/faculty/renu-saini.jpg",
    role: "teacher",
    subject: "Science"
  },
  {
    name: "Mrs. Kiran",
    username: "kiran_teacher",
    password: "Teacher@2026",
    position: "Senior History Teacher",
    qualification: "M.A. (History), B.Ed",
    experience: "15 Years Experience",
    description: "A specialist in Indian history and cultural studies, she connects the past with the present to help students understand contemporary issues. She believes in nurturing critical thinking through historical perspectives.",
    department: "humanities",
    photoUrl: "/assets/kiran.png",
    role: "teacher",
    subject: "History"
  },
  {
    name: "Mrs. Kamlesh",
    username: "kamlesh_teacher",
    password: "Teacher@2026",
    position: "Senior Home Science Teacher",
    qualification: "M.Sc. (Home Science), B.Ed",
    experience: "10+ Years Experience",
    description: "A specialist in nutritional sciences and human development, she teaches students essential life skills, blending theory with practical application in areas like dietetics, textile design, and resource management.",
    department: "home-science",
    photoUrl: "/assets/placeholder-female-avatar.png",
    role: "teacher",
    subject: "Home Science"
  },
  {
    name: "Mr. Khempal Singh",
    username: "khempal_singh",
    password: "Teacher@2026",
    position: "Senior Hindi Teacher",
    qualification: "M.A. (Hindi), B.Ed",
    experience: "20 Years Experience",
    description: "With deep expertise in Hindi literature and pedagogy, he focuses on strengthening students' language proficiency and communication skills. His teaching combines tradition with modern methods of learning.",
    department: "language",
    photoUrl: "/assets/khempal singh.jpg",
    role: "teacher",
    subject: "Hindi"
  },
  {
    name: "Mr. Ammar Haider",
    username: "ammar_haider",
    password: "Teacher@2026",
    position: "Senior English Teacher",
    qualification: "M.A. (English), B.Ed",
    experience: "11 Years Experience",
    description: "An expert in British literature and creative writing, he encourages students to express themselves confidently while enhancing critical and analytical skills through literature and language learning.",
    department: "english",
    photoUrl: "/assets/Ammar Haider.jpeg",
    role: "teacher",
    subject: "English"
  },
  {
    name: "Mr. Narotam Singh",
    username: "narotam_singh",
    password: "Teacher@2026",
    position: "Urdu Language Teacher",
    qualification: "M.A. (Urdu), B.Ed",
    experience: "14 Years Experience",
    description: "Passionate about Urdu literature and poetry, he works to preserve the beauty of the language while helping students develop strong reading, writing, and interpretative skills in Urdu.",
    department: "urdu",
    photoUrl: "/assets/Narotam singh.png",
    role: "teacher",
    subject: "Urdu"
  },
  {
    name: "Mr. Chanderpal Singh",
    username: "chanderpal_singh",
    password: "Teacher@2026",
    position: "Senior Mathematics Teacher",
    qualification: "M.Sc (Mathematics), B.Ed",
    experience: "15 Years Experience",
    description: "A specialist in applied mathematics, he emphasizes logical thinking and problem-solving. His innovative methods make mathematics practical, engaging, and enjoyable for learners.",
    department: "math",
    photoUrl: "/assets/chandarpal singh.jpeg",
    role: "teacher",
    subject: "Mathematics"
  },
  {
    name: "Mr. Bablu Saini",
    username: "bablu_saini",
    password: "Teacher@2026",
    position: "Chemistry Teacher",
    qualification: "M.Sc (Chemistry), B.Ed",
    experience: "10 Years Experience",
    description: "Expert in Physical and Organic Chemistry, he focuses on practical applications of chemical concepts. His teaching bridges theoretical knowledge with real-life experiments, sparking curiosity in learners.",
    department: "science",
    photoUrl: "/assets/faculty/Bablu Saini.jpg",
    role: "teacher",
    subject: "Chemistry"
  },
  {
    name: "Mr. Rajpal Singh",
    username: "rajpal_singh",
    password: "Teacher@2026",
    position: "Senior Biology Teacher",
    qualification: "M.Sc (Biology), B.Ed",
    experience: "8 Years Experience",
    description: "Specializes in life sciences and holistic development. He blends biological knowledge with fitness education, ensuring students understand both the science of life and healthy living.",
    department: "physical",
    photoUrl: "/assets/rajpal singh.jpeg",
    role: "teacher",
    subject: "Biology"
  },
  {
    name: "Mr. Keshav Kumar",
    username: "keshav_kumar",
    password: "Teacher@2026",
    position: "Art Teacher",
    qualification: "B.F.A",
    experience: "5 Years Experience",
    description: "A creative professional specializing in traditional Indian art forms, he motivates students to express their imagination freely. His classes encourage artistic skills, innovation, and appreciation of cultural heritage.",
    department: "arts",
    photoUrl: "/assets/faculty/keshav-kumar.jpg",
    role: "teacher",
    subject: "Arts"
  },
  {
    name: "Mrs. Kapil Kumar",
    username: "kapil_kumar",
    password: "Teacher@2026",
    position: "Social Studies Teacher",
    qualification: "M.A. (Political Science), B.Ed",
    experience: "12 Years Experience",
    description: "An expert in civics and political science, she guides students in understanding society, governance, and global perspectives. Her teaching emphasizes responsibility, awareness, and active citizenship.",
    department: "humanities",
    photoUrl: "/assets/kapil kumar staff.jpeg",
    role: "teacher",
    subject: "Social Studies"
  }
];

const seedFaculty = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    for (const faculty of facultyData) {
      const existing = await User.findOne({ username: faculty.username });
      if (!existing) {
        await User.create(faculty);
        console.log(`Added: ${faculty.name}`);
      } else {
        // Update existing with new fields
        Object.assign(existing, faculty);
        await existing.save();
        console.log(`Updated: ${faculty.name}`);
      }
    }

    console.log('Faculty seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding faculty:', err);
    process.exit(1);
  }
};

seedFaculty();
