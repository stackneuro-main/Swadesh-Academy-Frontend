
// software Development
import corejavaimg from "../assets/Images/Your paragraph text (9).webp"
import frontendimg from "../assets/Images/Your paragraph text (10).webp"
import Fullstackimg from "../assets/Images/Your paragraph text (13).webp"
import backendimg from "../assets/Images/Your paragraph text (11).webp"
import AIwithpython from "../assets/Images/Your paragraph text (14).webp"
import corepython from "../assets/Images/Your paragraph text (15).webp"
import AIMLimg from "../assets/Images/Your paragraph text (16).webp"
import E2Eproject from "../assets/Images/Your paragraph text (17).webp"
import Javastack  from "../assets/Images/Your paragraph text (1).png"
import Pythonstack from "../assets/Images/Your paragraph text (2).png"
import MobileApp from "../assets/Images/Your paragraph text (3).png"
import MERNstack from "../assets/Images/Your paragraph text.png"
export const ACADEMY_NAME = "Swadesh Academy";
export const ABOUT_US_TEXT = `
BriliantAcademy is a leading coaching center dedicated to providing quality education
to students of all levels. Our mission is to empower students with knowledge,
confidence, and academic excellence through experienced faculty and innovative teaching methods.
`;

export const CONTACT_INFO = {
  address: "",
  phone: "",
  email: "",
};

export const SOCIAL_LINKS = {
  facebook: "",
  instagram: "",
  youtube: "",
};


// coursesdata.js
export const softwareDevelopment = [
  { 
    name: "Gen AI", 
    oldPrice: 11200, 
    price: 8000, 
    duration: "4 months", 
    img: AIwithpython,
    tech: ["Python", "Machine Learning", "Prompt Engineering", "LangChain", "OpenAI API"]
  },
  { 
    name: "Frontend Development", 
    oldPrice: 7000, 
    price: 5000, 
    duration: "3 months", 
    img: frontendimg,
    tech: ["HTML", "CSS", "JavaScript", "React", "Tailwind CSS"]
  },
  { 
    name: "Backend Development", 
    oldPrice: 8400, 
    price: 6000, 
    duration: "4 months", 
    img: backendimg,
    tech: ["Node.js", "Express.js", "MongoDB", "REST API", "Authentication"]
  },
  { 
    name: "Full Stack Development", 
    oldPrice: 14000, 
    price: 10000, 
    duration: "7 months", 
    img: Fullstackimg,
    tech: ["HTML", "CSS", "JavaScript", "React", "Node.js", "Express.js", "MongoDB"]
  },
  { 
    name: "Gen AI Full Stack Development", 
    oldPrice: 16800, 
    price: 12000, 
    duration: "7 months", 
    img: Pythonstack,
    tech: ["React", "Node.js", "MongoDB", "Python", "AI Tools", "LangChain", "OpenAI API"]
  },
  { 
    name: "Core Python", 
    oldPrice: 7000, 
    price: 5000, 
    duration: "3 months", 
    img: corepython,
    tech: ["Python Basics", "OOPs", "File Handling", "Modules", "Error Handling"]
  },
  { 
    name: "Core Java", 
    oldPrice: 7000, 
    price: 5000, 
    duration: "3 months", 
    img: corejavaimg,
    tech: ["Java Basics", "OOPs", "Collections", "Exception Handling", "JDBC"]
  },
  { 
    name: "Mobile App Development", 
    oldPrice: 14000, 
    price: 10000, 
    duration: "6 months", 
    img: MobileApp,
    tech: ["React Native", "Expo", "JavaScript", "Firebase", "APIs"]
  },
  { 
    name: "Software Testing", 
    oldPrice: 7000, 
    price: 5000, 
    duration: "3 months", 
    img: E2Eproject,
    tech: ["Manual Testing", "Automation", "Selenium", "Test Cases", "Bug Tracking"]
  },
];
