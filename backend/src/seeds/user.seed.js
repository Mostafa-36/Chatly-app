import { config } from "dotenv";
import { connectDB } from "../lib/db.js";
import User from "../models/user.model.js";

config();

const seedUsers = [
  // Female Users
  {
    email: "lily.evans@example.com",
    fullName: "Lily Evans",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/women/10.jpg",
  },
  {
    email: "grace.bennett@example.com",
    fullName: "Grace Bennett",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/women/11.jpg",
  },
  {
    email: "nora.scott@example.com",
    fullName: "Nora Scott",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/women/12.jpg",
  },
  {
    email: "hazel.morgan@example.com",
    fullName: "Hazel Morgan",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/women/13.jpg",
  },
  {
    email: "ella.hughes@example.com",
    fullName: "Ella Hughes",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/women/14.jpg",
  },
  {
    email: "aria.ward@example.com",
    fullName: "Aria Ward",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/women/15.jpg",
  },
  {
    email: "zoe.richards@example.com",
    fullName: "Zoe Richards",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/women/16.jpg",
  },
  {
    email: "ivy.kelly@example.com",
    fullName: "Ivy Kelly",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/women/17.jpg",
  },

  // Male Users
  {
    email: "ethan.brooks@example.com",
    fullName: "Ethan Brooks",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/men/10.jpg",
  },
  {
    email: "logan.reed@example.com",
    fullName: "Logan Reed",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/men/11.jpg",
  },
  {
    email: "jackson.cook@example.com",
    fullName: "Jackson Cook",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/men/12.jpg",
  },
  {
    email: "sebastian.foster@example.com",
    fullName: "Sebastian Foster",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/men/13.jpg",
  },
  {
    email: "leo.bailey@example.com",
    fullName: "Leo Bailey",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/men/14.jpg",
  },
  {
    email: "julian.bell@example.com",
    fullName: "Julian Bell",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/men/15.jpg",
  },
  {
    email: "theo.barnes@example.com",
    fullName: "Theo Barnes",
    password: "123456",
    profilePic: "https://randomuser.me/api/portraits/men/16.jpg",
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();

    await User.insertMany(seedUsers);
    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};

// Call the function
seedDatabase();
