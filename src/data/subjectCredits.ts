/**
 * Subject and Credit Data for B.Tech AI & Machine Learning (AIML) Program
 * Extracted from official IPU curriculum documents
 * Total Credits: 220 (across 8 semesters)
 */

export interface SubjectInfo {
    code: string;
    name: string;
    type: 'theory' | 'practical' | 'elective' | 'project';
    group: string;
    lectureHours: number;
    practicalHours: number;
    credits: number;
    isNUES?: boolean; // Non-University Exam Subject
}

export interface SemesterData {
    semester: number;
    subjects: SubjectInfo[];
    totalCredits: number;
}

// Subject code to credits mapping for quick lookup
export const subjectCreditsMap: Record<string, number> = {
    // Semester 1
    'ICT101': 3,
    'ICT103': 3,
    'ICT105': 3,
    'HS107': 3,
    'BS109': 3,
    'BS111': 4,
    'BS113': 3,
    'LLB115': 2,
    'ICT151': 1,
    'ICT153': 1,
    'ICT155': 1,
    'BS157': 1,
    'BS159': 1,

    // Semester 2
    'HS102': 3,
    'BS104': 3,
    'BS106': 4,
    'BS108': 3,
    'BS110': 4,
    'ICT114': 1, // NUES
    'EMES112': 4,
    'ICT152': 1,
    'BS156': 1,
    'BS158': 1,
    'ICT154': 1,
    'ICT160': 1,
    'ICT116': 3,
    'BS118': 3,
    'BT120': 3,

    // Semester 3
    'ARD201': 4,
    'ARD203': 4,
    'ARD205': 4,
    'ARD207': 4,
    'ARD209': 4,
    'MSAI211': 2, // NUES
    'ARD251': 2,
    'ARD253': 1,
    'ARD255': 1,

    // Semester 4
    'ARD202': 4,
    'ARD204': 4,
    'ARM206': 3,
    'ARM208': 4,
    'ARM210': 4,
    'ARD212': 3,
    'HSAI214': 2, // NUES
    'ARM252': 1,
    'ARM254': 1,
    'ARM256': 1,
    'ARM258': 1,

    // Semester 5
    'ARM301': 4,
    'ARD303': 4,
    'ARD305': 4,
    'HSAI307': 2, // NUES
    'AROXXX': 3, // OAE-1
    'ARD351': 1,
    'ARD353': 1,
    'ART355': 2, // Summer Training
    'ART357': 2, // NSS/NCC/Technical Club

    // Semester 6
    'HSAI302': 2, // NUES
    'MSAI304': 2, // NUES
    'ARD306': 4,
    'ARD308': 4,
    'ARD352': 1,
    'ARD354': 1,

    // Semester 7
    'ARD401': 4,
    'ARD403': 4,
    'ARD451': 1,
    'ARD453': 1,
    'ARP455': 4, // Minor Project
    'ART457': 1, // Summer Training Report

    // Semester 8
    'ARP452': 23, // Major Project - Dissertation
    'ART454': 23, // Internship - Dissertation

    // =====================================
    // Program Core Electives (PCE) - Semester 5
    // =====================================
    'ARD309': 4, // Pattern Recognition
    'ARD311': 4, // Ethics in AI
    'ARD313': 4, // Digital Logic and Computer Organization
    'ARD315': 4, // Soft Computing
    'ARM317': 4, // Blockchain Technology

    // =====================================
    // Program Core Electives (PCE) - Semester 6
    // =====================================
    // Theory Papers (4 credits each)
    'ARD310T': 4, // Predictive Analytics
    'ARD310P': 1, // Predictive Analytics Lab
    'ARD312T': 4, // Microprocessors
    'ARD312P': 1, // Microprocessors Lab
    'ARD314T': 4, // Introduction to Computer Vision
    'ARD314P': 1, // Image Processing and Computer Vision Lab
    'ARM316T': 4, // Web Technologies
    'ARM316P': 1, // Web Technologies Lab
    'ARD318T': 4, // Software Project Management
    'ARD318P': 1, // Software Project Management Lab
    'ARD320T': 4, // Human Computer Interface
    'ARD320P': 1, // Human Computer Interface Lab
    'ARD322T': 4, // Advanced Optimization Techniques
    'ARD322P': 1, // Advanced Optimization Techniques Lab
    'ARM324T': 4, // Genetic Algorithms
    'ARM324P': 1, // Genetic Algorithms Lab
    'ARM326T': 4, // Meta-heuristic Algorithms
    'ARM326P': 1, // Meta-heuristic Algorithms Lab
    'ARD328T': 4, // Artificial Neural Network
    'ARD328P': 1, // Artificial Neural Network Lab
    'ARD330T': 4, // Fuzzy Logic
    'ARD330P': 1, // Fuzzy Logic Lab

    // =====================================
    // Program Core Electives (PCE) - Semester 7
    // =====================================
    'ARD405': 4, // Embedded Systems
    'ARD407': 4, // Reinforcement Learning
    'ARM409': 4, // Quantum Computing
    'ARM411': 4, // Cyber Physical Systems
    'ARD413': 4, // Network Security and Cryptography
    'ARD415': 4, // Information Retrieval
    'ARD417': 4, // Time Series Analysis and Forecasting
    'ARD419': 4, // Semantic Web
    'ARD421': 4, // Software Testing
    'ARD423': 4, // Web Intelligence
    'ARD425': 4, // E-commerce
    'ARD427': 4, // Compiler Design
    'ARD429': 4, // Introduction to Large Language Models
    'ARD431': 4, // Introduction to Deep Learning

    // =====================================
    // Open Area Electives (OAE) - Semester 5
    // =====================================
    'ARO371': 3, // 3D-Printing Technologies
    'ARO373': 3, // Mobile Application Development
    'ARO375': 3, // Analysis and Design of Algorithms
    'ARO377': 3, // Software Engineering
    'ARO379': 3, // Internet of Things

    // =====================================
    // Open Area Electives (OAE) - Semester 6
    // =====================================
    'ARO372': 3, // Operations Management
    'ARO374': 3, // Metaverse
    'ARO376': 3, // Industry 4.0
    'ARO378': 3, // Supply Chain Management
    'ARO380': 3, // Software Project Management
    'ARO382': 3, // Modeling and Simulation
    'ARO384': 3, // Database Management Systems
    'ARO386': 3, // Introduction to Robotics

    // =====================================
    // Open Area Electives (OAE) - Semester 7
    // =====================================
    'ARO471': 3, // Software Metrics
    'ARO473': 3, // Introduction to Electric Vehicle
    'ARO475': 3, // Web Development
    'ARO477': 3, // Modern Manufacturing Processes
    'ARO479': 3, // Personal Finance
    'ARO481': 3, // Automobile Engineering
    'ARO483': 3, // Introduction to Smart Materials
    'ARO485': 3, // Cloud Dew Edge Fog(CDEF) Computing
    'ARO487': 3, // Social Media Analytics
    'ARO489': 3, // Natural Language Processing
};

/**
 * Credit patterns based on subject code prefixes and types
 * Used when exact match is not found in subjectCreditsMap
 */
const creditPatterns: { pattern: RegExp; credits: number; description: string }[] = [
    // Practical/Lab subjects (codes ending with P or containing 'Lab')
    { pattern: /^AR[DM]\d{3}P$/i, credits: 1, description: 'PCE Lab courses' },
    { pattern: /^AR[DM][2-4]5\d$/i, credits: 1, description: 'Practical/Lab courses (25x, 35x, 45x)' },

    // PCE Theory subjects (ARD/ARM 3xx, 4xx range - theory)
    { pattern: /^AR[DM]3[0-3]\d$/i, credits: 4, description: 'PCE Semester 5-6 Theory' },
    { pattern: /^AR[DM]4[0-3]\d$/i, credits: 4, description: 'PCE Semester 7 Theory' },

    // OAE subjects (ARO prefix)
    { pattern: /^ARO\d{3}$/i, credits: 3, description: 'Open Area Electives' },

    // Core PC subjects (ARD/ARM 2xx, 3xx theory)
    { pattern: /^AR[DM]2[0-1]\d$/i, credits: 4, description: 'Core PC Theory (Sem 3-4)' },
    { pattern: /^AR[DM]30[0-8]$/i, credits: 4, description: 'Core PC Theory (Sem 5-6)' },

    // HS/MS subjects (HSAI, MSAI prefix)
    { pattern: /^HSAI\d{3}$/i, credits: 2, description: 'Humanities/Social Science' },
    { pattern: /^MSAI\d{3}$/i, credits: 2, description: 'Management Science' },

    // Project subjects
    { pattern: /^ARP4[5]\d$/i, credits: 4, description: 'Minor Project' },
    { pattern: /^ART4[5]\d$/i, credits: 1, description: 'Training/Internship' },

    // Semester 1-2 subjects
    { pattern: /^ICT1[0-1]\d$/i, credits: 3, description: 'Sem 1-2 Theory' },
    { pattern: /^ICT15\d$/i, credits: 1, description: 'Sem 1-2 Practical' },
    { pattern: /^BS1[0-1]\d$/i, credits: 3, description: 'Basic Science Theory' },
    { pattern: /^BS15\d$/i, credits: 1, description: 'Basic Science Practical' },
    { pattern: /^HS1\d{2}$/i, credits: 3, description: 'Humanities Sem 1-2' },
];

// Full semester-wise data
export const semesterData: SemesterData[] = [
    {
        semester: 1,
        totalCredits: 29,
        subjects: [
            // Theory Papers
            { code: 'ICT101', name: 'Programming for Problem Solving', type: 'theory', group: 'ES', lectureHours: 3, practicalHours: 0, credits: 3 },
            { code: 'ICT103', name: 'Electrical Science', type: 'theory', group: 'ES', lectureHours: 3, practicalHours: 0, credits: 3 },
            { code: 'ICT105', name: 'Engineering Mechanics', type: 'theory', group: 'ES', lectureHours: 3, practicalHours: 0, credits: 3 },
            { code: 'HS107', name: 'Communication Skills-I', type: 'theory', group: 'HS', lectureHours: 3, practicalHours: 0, credits: 3 },
            { code: 'BS109', name: 'Engineering Chemistry - I', type: 'theory', group: 'BS', lectureHours: 3, practicalHours: 0, credits: 3 },
            { code: 'BS111', name: 'Engineering Mathematics - I', type: 'theory', group: 'BS', lectureHours: 4, practicalHours: 0, credits: 4 },
            { code: 'BS113', name: 'Engineering Physics - I', type: 'theory', group: 'BS', lectureHours: 3, practicalHours: 0, credits: 3 },
            { code: 'LLB115', name: 'Indian Constitution', type: 'theory', group: 'HS/MC', lectureHours: 2, practicalHours: 0, credits: 2, isNUES: true },
            // Practical/Viva Voce
            { code: 'ICT151', name: 'Programming for Problem Solving Lab', type: 'practical', group: 'ES', lectureHours: 0, practicalHours: 2, credits: 1 },
            { code: 'ICT153', name: 'Engineering Graphics-I', type: 'practical', group: 'ES', lectureHours: 0, practicalHours: 2, credits: 1 },
            { code: 'ICT155', name: 'Electrical Science Lab', type: 'practical', group: 'ES', lectureHours: 0, practicalHours: 2, credits: 1 },
            { code: 'BS157', name: 'Engineering Chemistry-I Lab', type: 'practical', group: 'BS', lectureHours: 0, practicalHours: 2, credits: 1 },
            { code: 'BS159', name: 'Engineering Physics - I Lab', type: 'practical', group: 'BS', lectureHours: 0, practicalHours: 2, credits: 1 },
        ],
    },
    {
        semester: 2,
        totalCredits: 29,
        subjects: [
            // Theory Papers
            { code: 'HS102', name: 'Communication Skills - II', type: 'theory', group: 'HS', lectureHours: 3, practicalHours: 0, credits: 3 },
            { code: 'BS104', name: 'Engineering Chemistry - II', type: 'theory', group: 'BS', lectureHours: 3, practicalHours: 0, credits: 3 },
            { code: 'BS106', name: 'Engineering Mathematics - II', type: 'theory', group: 'BS', lectureHours: 4, practicalHours: 0, credits: 4 },
            { code: 'BS108', name: 'Engineering Physics-II', type: 'theory', group: 'BS', lectureHours: 3, practicalHours: 0, credits: 3 },
            { code: 'BS110', name: 'Probability and Statistics for Engineers', type: 'theory', group: 'BS', lectureHours: 3, practicalHours: 2, credits: 4 },
            { code: 'ICT114', name: 'Human Values and Ethics', type: 'theory', group: 'HS/MC', lectureHours: 1, practicalHours: 0, credits: 1, isNUES: true },
            { code: 'EMES112', name: 'Environmental Studies', type: 'theory', group: 'BS/MC', lectureHours: 4, practicalHours: 0, credits: 4 },
            // Practical/Viva Voce
            { code: 'ICT152', name: 'Engineering Graphics-II Lab', type: 'practical', group: 'ES', lectureHours: 0, practicalHours: 2, credits: 1 },
            { code: 'BS156', name: 'Engineering Chemistry - II Lab', type: 'practical', group: 'BS', lectureHours: 0, practicalHours: 2, credits: 1 },
            { code: 'BS158', name: 'Engineering Physics - II Lab', type: 'practical', group: 'BS', lectureHours: 0, practicalHours: 2, credits: 1 },
            // One paper from following (Workshop or Programming in Python)
            { code: 'ICT154', name: 'Workshop Technology', type: 'practical', group: 'ES', lectureHours: 0, practicalHours: 2, credits: 1 },
            { code: 'ICT160', name: 'Programming in Python', type: 'practical', group: 'ES', lectureHours: 0, practicalHours: 2, credits: 1 },
            // Open Elective Papers
            { code: 'ICT116', name: 'Introduction to Manufacturing Process', type: 'elective', group: 'ES', lectureHours: 3, practicalHours: 0, credits: 3 },
            { code: 'BS118', name: 'Industrial Chemistry', type: 'elective', group: 'ES', lectureHours: 3, practicalHours: 0, credits: 3 },
            { code: 'BT120', name: 'Introduction to Biotechnology', type: 'elective', group: 'ES', lectureHours: 3, practicalHours: 0, credits: 3 },
        ],
    },
    {
        semester: 3,
        totalCredits: 26,
        subjects: [
            // Theory Papers
            { code: 'ARD201', name: 'Essential Mathematics for Artificial Intelligence', type: 'theory', group: 'BS', lectureHours: 4, practicalHours: 0, credits: 4 },
            { code: 'ARD203', name: 'Operating Systems', type: 'theory', group: 'PC', lectureHours: 4, practicalHours: 0, credits: 4 },
            { code: 'ARD205', name: 'Database Management System', type: 'theory', group: 'PC', lectureHours: 4, practicalHours: 0, credits: 4 },
            { code: 'ARD207', name: 'Foundation of Computer Science', type: 'theory', group: 'PC', lectureHours: 4, practicalHours: 0, credits: 4 },
            { code: 'ARD209', name: 'Data Structures', type: 'theory', group: 'PC', lectureHours: 4, practicalHours: 0, credits: 4 },
            { code: 'MSAI211', name: 'Accountancy for Engineers', type: 'theory', group: 'HS/MS', lectureHours: 2, practicalHours: 0, credits: 2, isNUES: true },
            // Practical / Viva Voce
            { code: 'ARD251', name: 'JAVA Lab', type: 'practical', group: 'PC', lectureHours: 0, practicalHours: 4, credits: 2 },
            { code: 'ARD253', name: 'Database Management System Lab', type: 'practical', group: 'PC', lectureHours: 0, practicalHours: 2, credits: 1 },
            { code: 'ARD255', name: 'Data Structures Lab', type: 'practical', group: 'PC', lectureHours: 0, practicalHours: 2, credits: 1 },
        ],
    },
    {
        semester: 4,
        totalCredits: 28,
        subjects: [
            // Theory Papers
            { code: 'ARD202', name: 'Software Engineering', type: 'theory', group: 'PC', lectureHours: 4, practicalHours: 0, credits: 4 },
            { code: 'ARD204', name: 'Introduction to Artificial Intelligence', type: 'theory', group: 'PC', lectureHours: 4, practicalHours: 0, credits: 4 },
            { code: 'ARM206', name: 'Data Warehousing and Data Mining', type: 'theory', group: 'PC', lectureHours: 3, practicalHours: 0, credits: 3 },
            { code: 'ARM208', name: 'Analysis and Design of Algorithm', type: 'theory', group: 'PC', lectureHours: 4, practicalHours: 0, credits: 4 },
            { code: 'ARM210', name: 'Introduction to Machine Learning', type: 'theory', group: 'PC', lectureHours: 4, practicalHours: 0, credits: 4 },
            { code: 'ARD212', name: 'Computer Network', type: 'theory', group: 'PC', lectureHours: 3, practicalHours: 0, credits: 3 },
            { code: 'HSAI214', name: 'Engineering Economics', type: 'theory', group: 'HS', lectureHours: 2, practicalHours: 0, credits: 2, isNUES: true },
            // Practical / Viva Voce
            { code: 'ARM252', name: 'Introduction to AI Lab', type: 'practical', group: 'PC', lectureHours: 0, practicalHours: 2, credits: 1 },
            { code: 'ARM254', name: 'Analysis and Design of Algorithm Lab', type: 'practical', group: 'PC', lectureHours: 0, practicalHours: 2, credits: 1 },
            { code: 'ARM256', name: 'Machine Learning Lab', type: 'practical', group: 'PC', lectureHours: 0, practicalHours: 2, credits: 1 },
            { code: 'ARM258', name: 'Computer Network Lab', type: 'practical', group: 'PC', lectureHours: 0, practicalHours: 2, credits: 1 },
        ],
    },
    {
        semester: 5,
        totalCredits: 26,
        subjects: [
            // Theory Papers
            { code: 'ARM301', name: 'Theory of Computation', type: 'theory', group: 'PC', lectureHours: 4, practicalHours: 0, credits: 4 },
            { code: 'ARD303', name: 'Data Visualization', type: 'theory', group: 'PC', lectureHours: 4, practicalHours: 0, credits: 4 },
            { code: 'ARD305', name: 'Big Data Analytics', type: 'theory', group: 'PC', lectureHours: 4, practicalHours: 0, credits: 4 },
            { code: 'HSAI307', name: 'Technical Writing', type: 'theory', group: 'HS/MS', lectureHours: 2, practicalHours: 0, credits: 2, isNUES: true },
            { code: 'OAE-1', name: 'Open Area Elective - 1 (OAE-1)', type: 'elective', group: 'OAE', lectureHours: 3, practicalHours: 0, credits: 3 },
            { code: 'PCE-1', name: 'Program Core Elective - 1 (PCE-1)', type: 'elective', group: 'PCE', lectureHours: 4, practicalHours: 0, credits: 4 },
            // Practical / Viva Voce
            { code: 'ARD351', name: 'Data Visualization Lab', type: 'practical', group: 'PC', lectureHours: 0, practicalHours: 2, credits: 1 },
            { code: 'ARD353', name: 'Big Data Analytics Lab', type: 'practical', group: 'PC', lectureHours: 0, practicalHours: 2, credits: 1 },
            { code: 'ART355', name: 'Summer Training (after 4th semester) Report', type: 'practical', group: 'PC', lectureHours: 0, practicalHours: 2, credits: 2 },
            { code: 'ART357', name: 'NSS / NCC / Cultural clubs / Technical Society / Technical club', type: 'practical', group: 'MC', lectureHours: 0, practicalHours: 4, credits: 2 },
        ],
    },
    {
        semester: 6,
        totalCredits: 30,
        subjects: [
            // Theory Papers
            { code: 'HSAI302', name: 'Elements of Indian History for Engineers', type: 'theory', group: 'HS/MS', lectureHours: 2, practicalHours: 0, credits: 2, isNUES: true },
            { code: 'MSAI304', name: 'Entrepreneurship Mindset', type: 'theory', group: 'HS/MS', lectureHours: 2, practicalHours: 0, credits: 2, isNUES: true },
            { code: 'ARD306', name: 'Natural Language Processing', type: 'theory', group: 'PC', lectureHours: 4, practicalHours: 0, credits: 4 },
            { code: 'ARD308', name: 'Cloud Dew Edge Fog(CDEF) Computing', type: 'theory', group: 'PC', lectureHours: 4, practicalHours: 0, credits: 4 },
            { code: 'OAE-2A', name: 'Open Area Elective - 2 (OAE-2)', type: 'elective', group: 'OAE', lectureHours: 3, practicalHours: 0, credits: 3 },
            { code: 'OAE-2B', name: 'Open Area Elective - 2 (OAE-2)', type: 'elective', group: 'OAE', lectureHours: 3, practicalHours: 0, credits: 3 },
            { code: 'PCE-2', name: 'Program Core Elective - 2 (PCE-2)', type: 'elective', group: 'PCE', lectureHours: 4, practicalHours: 0, credits: 4 },
            { code: 'PCE-3', name: 'Program Core Elective - 3 (PCE-3)', type: 'elective', group: 'PCE', lectureHours: 4, practicalHours: 0, credits: 4 },
            // Practical / Viva Voce
            { code: 'ARD352', name: 'Natural Language Processing Lab', type: 'practical', group: 'PC', lectureHours: 0, practicalHours: 2, credits: 1 },
            { code: 'ARD354', name: 'Cloud Dew Edge Fog(CDEF) Computing Lab', type: 'practical', group: 'PC', lectureHours: 0, practicalHours: 2, credits: 1 },
            { code: 'PCE-2-LAB', name: 'PCE-2 Lab', type: 'practical', group: 'PCE', lectureHours: 0, practicalHours: 2, credits: 1 },
            { code: 'PCE-3-LAB', name: 'PCE-3 Lab', type: 'practical', group: 'PCE', lectureHours: 0, practicalHours: 2, credits: 1 },
        ],
    },
    {
        semester: 7,
        totalCredits: 29,
        subjects: [
            // Theory Papers
            { code: 'ARD401', name: 'Recommender systems', type: 'theory', group: 'PC', lectureHours: 4, practicalHours: 0, credits: 4 },
            { code: 'ARD403', name: 'Social Media Analytics', type: 'theory', group: 'PC', lectureHours: 4, practicalHours: 0, credits: 4 },
            { code: 'PCE-4', name: 'Program Core Elective - 4 (PCE-4)', type: 'elective', group: 'PCE', lectureHours: 4, practicalHours: 0, credits: 4 },
            { code: 'PCE-5', name: 'Program Core Elective - 5 (PCE-5)', type: 'elective', group: 'PCE', lectureHours: 4, practicalHours: 0, credits: 4 },
            { code: 'OAE-4', name: 'Open Area Elective - 4 (OAE-4)', type: 'elective', group: 'OAE', lectureHours: 3, practicalHours: 0, credits: 3 },
            { code: 'OAE-5', name: 'Open Area Elective - 5 (OAE-5)', type: 'elective', group: 'OAE', lectureHours: 3, practicalHours: 0, credits: 3 },
            // Practical / Viva Voce
            { code: 'ARD451', name: 'Recommender systems Lab', type: 'practical', group: 'PC', lectureHours: 0, practicalHours: 2, credits: 1 },
            { code: 'ARD453', name: 'Social Media Analytics Lab', type: 'practical', group: 'PC', lectureHours: 0, practicalHours: 2, credits: 1 },
            { code: 'ARP455', name: 'Minor Project', type: 'project', group: 'PC', lectureHours: 0, practicalHours: 0, credits: 4 },
            { code: 'ART457', name: 'Summer Training (after 6th semester) Report', type: 'practical', group: 'PC', lectureHours: 0, practicalHours: 0, credits: 1 },
        ],
    },
    {
        semester: 8,
        totalCredits: 23,
        subjects: [
            // Students choose one of the following options
            { code: 'ARP452', name: 'Major Project - Dissertation', type: 'project', group: 'PC/Project', lectureHours: 0, practicalHours: 0, credits: 23 },
            // OR
            { code: 'ART454', name: 'Internship - Dissertation', type: 'project', group: 'PC/Internship', lectureHours: 0, practicalHours: 0, credits: 23 },
        ],
    },
];

/**
 * Get credits for a subject by its code
 * @param subjectCode - The subject code (e.g., 'ICT101')
 * @returns The credits for the subject, or undefined if not found
 */
export function getSubjectCredits(subjectCode: string): number | undefined {
    // First check direct mapping
    if (subjectCreditsMap[subjectCode]) {
        return subjectCreditsMap[subjectCode];
    }

    // Search in semester data for more complex lookups
    for (const semester of semesterData) {
        const subject = semester.subjects.find(
            (s) => s.code === subjectCode || s.code.toLowerCase() === subjectCode.toLowerCase()
        );
        if (subject) {
            return subject.credits;
        }
    }

    // Try pattern-based inference for unknown subjects
    for (const { pattern, credits } of creditPatterns) {
        if (pattern.test(subjectCode)) {
            return credits;
        }
    }

    return undefined;
}

/**
 * Get full subject information by its code
 * @param subjectCode - The subject code (e.g., 'ICT101')
 * @returns The full subject info, or undefined if not found
 */
export function getSubjectInfo(subjectCode: string): SubjectInfo | undefined {
    for (const semester of semesterData) {
        const subject = semester.subjects.find(
            (s) => s.code === subjectCode || s.code.toLowerCase() === subjectCode.toLowerCase()
        );
        if (subject) {
            return subject;
        }
    }
    return undefined;
}

/**
 * Get total credits for a semester
 * @param semesterNumber - The semester number (1-8)
 * @returns The total credits for that semester
 */
export function getSemesterTotalCredits(semesterNumber: number): number {
    const semester = semesterData.find((s) => s.semester === semesterNumber);
    return semester?.totalCredits ?? 0;
}

/**
 * Get all subjects for a semester
 * @param semesterNumber - The semester number (1-8)
 * @returns Array of subjects for that semester
 */
export function getSemesterSubjects(semesterNumber: number): SubjectInfo[] {
    const semester = semesterData.find((s) => s.semester === semesterNumber);
    return semester?.subjects ?? [];
}

/**
 * Calculate total credits across all semesters
 * @returns Total program credits
 */
export function getTotalProgramCredits(): number {
    return semesterData.reduce((total, semester) => total + semester.totalCredits, 0);
}

// Export default for convenience
export default {
    subjectCreditsMap,
    semesterData,
    getSubjectCredits,
    getSubjectInfo,
    getSemesterTotalCredits,
    getSemesterSubjects,
    getTotalProgramCredits,
};
