/*
Welcome to the content hub for your website!

To update the content on your website, you only need to edit this file.
This approach keeps all your data in one place, making it easy to manage without having to edit any HTML files directly.

Instructions:
- To change text, simply replace the text inside the quotes (e.g., "Your Name").
- To change an image, replace the image URL (e.g., "https://picsum.photos/seed/your-seed/200/200").
- To add a new item (like a team member or an event), copy one of the existing blocks (everything from the opening `{` to the closing `}`), paste it at the end of the list, and update the content. Make sure to add a comma after the closing `}` of the item before it.

*/

// --- LEADERSHIP DATA ---
const leadershipData = {
    director: {
        name: "Prof Jarugu Narasimha Moorthy",
        title: "Director, IISER TVM",
        message: "A message from the director can be placed here.", // Placeholder message
        imageUrl: "https://home.iitk.ac.in/~moorthy/assets/images/prof-jnm-74-independence-minified.jpg"
    },
    dosa: {
        name: "Prof Rajeev N Kini",
        title: "Dean of Student Affairs",
        message: "A message from the Dean of Student Affairs can be placed here.", // Placeholder message
        imageUrl: "https://www.iisertvm.ac.in/assets/uploads/faculties/Kini-2022_square1.JPG"
    },
    currentAdvisors: [
        {
            name: "Dr. Sanu Shameer",
            title: "Faculty Advisor, STC",
            message: "A message from the faculty advisor can be placed here.",
            imageUrl: "https://www.iisertvm.ac.in/assets/uploads/faculties/Sanu_Shameer_photo.jpg"
        },
        {
            name: "Dr. Krishnendu Gope",
            title: "Faculty Advisor, STC",
            message: "A message from the faculty advisor can be placed here.",
            imageUrl: "https://www.iisertvm.ac.in/assets/uploads/faculties/gope.jpg"
        }
    ],
    formerAdvisors: [
        { 
            name: "Prof Utpal Manna", 
            imageUrl: "https://www.iisertvm.ac.in/assets/uploads/faculties/ad9e83d050fa3aab5d1e7e2cbcb6a090.jpg",
            period: "2018-2020"
        },
        { 
            name: "Dr. Jishy Varghese", 
            imageUrl: "https://www.iisertvm.ac.in/assets/uploads/faculties/3af1a85fa07f89910478075a0b52c755.jpg",
            period: "2020-2022"
        },
        { 
            name: "Dr. Nisha N Kannan", 
            imageUrl: "https://www.iisertvm.ac.in/assets/uploads/faculties/Nisha_N_Kannan_IISER_copy_2.JPG",
            period: "2022-2023"
        }
    ]
};

const councilMembers = [
    { name: "Ishaani R Kamath", position: "Secretary (BS-MS 21)", imageUrl: "https://raw.githubusercontent.com/Coding-Club-of-IISER-Thiruvananthapuram/STC_IISERTVM/cc5730f3d080ea80ed9700f98799362d62e2a883/images/members/24-25/Secretary_Ishaani_R_Kamath_BSMS%20_21.jpg" },
    { name: "Pearl", position: "Member", imageUrl: "https://raw.githubusercontent.com/Coding-Club-of-IISER-Thiruvananthapuram/STC_IISERTVM/refs/heads/main/images/members/24-25/Pearl_23.jpg" },
    { name: "Arvind Lomrore", position: "Member", imageUrl: "https://raw.githubusercontent.com/Coding-Club-of-IISER-Thiruvananthapuram/STC_IISERTVM/refs/heads/main/images/members/24-25/Arvind%20Lomrore%20BSMS%2023.jpg" },
    { name: "Alan Varghese Jophy", position: "Member", imageUrl: "https://picsum.photos/seed/mem3/200/200" },
    { name: "Adheena Lakshmi", position: "Member", imageUrl: "https://raw.githubusercontent.com/Coding-Club-of-IISER-Thiruvananthapuram/STC_IISERTVM/refs/heads/main/images/members/24-25/Adheena%20Lakshmi_BSMS21.jpg" },
    { name: "Abhiram Mahesh", position: "Member", imageUrl: "https://raw.githubusercontent.com/Coding-Club-of-IISER-Thiruvananthapuram/STC_IISERTVM/refs/heads/main/images/members/24-25/Abhiram%20Mahesh_21.jpg" },
    { name: "Aashlesha Chavan", position: "Member", imageUrl: "https://raw.githubusercontent.com/Coding-Club-of-IISER-Thiruvananthapuram/STC_IISERTVM/refs/heads/main/images/members/24-25/Aashlesha_Chavan_BSMS22.jpeg" },
    { name: "A J Nithin", position: "Member", imageUrl: "https://raw.githubusercontent.com/Coding-Club-of-IISER-Thiruvananthapuram/STC_IISERTVM/refs/heads/main/images/members/24-25/A%20J%20Nithin%20Batch23.jpg" }
];

const pastSecretaries = [
    { 
        year: "BS-MS 20", 
        name: "Devashish Kalmegh",
        imageUrl: "https://github.com/Coding-Club-of-IISER-Thiruvananthapuram/STC_IISERTVM/blob/main/images/members/Prev%20Secretaries/_23-_24_Devashish%20Kalmegh_BSMS%20_20.jpg?raw=true",
        period: "2023-2024"
    },
    { 
        year: "BS-MS 19", 
        name: "Ravikiran Hegde",
        imageUrl: "https://raw.githubusercontent.com/Coding-Club-of-IISER-Thiruvananthapuram/STC_IISERTVM/refs/heads/main/images/members/Prev%20Secretaries/_22-_23_Ravikiran_Hegde_BSMS%20_19.jpg",
        period: "2022-2023"
    },
    { 
        year: "BS-MS 18", 
        name: "Sharang Rajesh Iyer",
        imageUrl: "https://raw.githubusercontent.com/Coding-Club-of-IISER-Thiruvananthapuram/STC_IISERTVM/refs/heads/main/images/members/Prev%20Secretaries/_20-_22_Sharang%20Rajesh%20Iyer_BSMS%20_18.jpg",
        period: "2021-2022"
    }
];


// --- EVENTS DATA ---
const upcomingEvents = [
    {
        date: "OCT",
        title: "Anvesha",
        description: "Anvesha ’25 is almost here! IISER Thiruvananthapuram’s annual science fest kicks off on October 17."
    },
    {
        date: "SEP",
        title: "Know Your Faculty",
        description: "Organised by the CCIT, this short video series answers common questions in programming and helps you learn directly from our faculty experts."
    }
];

const pastEvents = [
    {
        date: "DEC",
        title: "WaveFronts",
        description: "Hosted by PSIT. A session on capturing the world of physics."
    },
    {
        date: "June",
        title: "Beyond Syntax",
        description: "Hosted by the CCIT Club, this webinar series features IISER Thiruvananthapuram alumni sharing their experiences with internships, programming careers, and publishing research in top conference venues."
    }
];


// --- UPDATES DATA ---
const latestUpdates = [
    {
        date: "Oct 17, 2025",
        title: "Anvesha '25",
        excerpt: "Anvesha ’25 is just around the corner, happening on October 17. Get ready with your projects that aim to reshape the world of research, innovation, and science and technology. We encourage enthusiastic participation from all candidates.",
        link: "#",
        imageUrl: "https://raw.githubusercontent.com/Coding-Club-of-IISER-Thiruvananthapuram/STC_IISERTVM/refs/heads/main/images/gallery/Events/Anvesha/img1.jpg"
    },
    {
        date: "Sep, 2025",
        title: "Club Registrations are Opening soon",
        excerpt: "Excited to join our clubs? Registrations for all affiliated clubs will be opening soon. Stay tuned!",
        link: "#",
        imageUrl: "https://images.pexels.com/photos/17484975/pexels-photo-17484975.png?_gl=1*ehav9k*_ga*MTAwNDM5MDMzNi4xNzU2NjYyNjk0*_ga_8JE65Q40S6*czE3NTY2NjI2OTQkbzEkZzEkdDE3NTY2NjI5MTAkajU5JGwwJGgw"
    }
];


// --- CLUB SPECIFIC DATA ---
// You can add team members for each club here.
const clubTeams = {
    ccit: [
        { name: "Saurab Mishra", position: "President", imageUrl: "https://picsum.photos/seed/member1/200/200" },
        { name: "Satyam", position: "Vice President", imageUrl: "https://picsum.photos/seed/member2/200/200" },
        { name: "ABC", position: "Events Coordinator", imageUrl: "https://picsum.photos/seed/member3/200/200" }
    ],
    psit: [
        // Add PSIT team members here
    ],
    // ... add other clubs
};
