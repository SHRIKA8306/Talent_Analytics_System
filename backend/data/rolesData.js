const rolesData = [
    {
        role: "Frontend Developer",
        requiredSkills: ["HTML", "CSS", "JavaScript", "React", "Vue.js", "Angular", "TypeScript", "Redux", "Tailwind CSS", "Bootstrap", "Webpack", "Git"]
    },
    {
        role: "Backend Developer",
        requiredSkills: ["Node.js", "Express", "Python", "Django", "Java", "Spring Boot", "C#", ".NET", "Ruby on Rails", "Golang", "MongoDB", "PostgreSQL", "MySQL", "Redis", "REST API", "GraphQL", "Docker"]
    },
    {
        role: "Full Stack Developer",
        requiredSkills: ["HTML", "CSS", "JavaScript", "React", "Node.js", "Express", "MongoDB", "PostgreSQL", "Docker", "Git", "REST API", "TypeScript", "AWS"]
    },
    {
        role: "Data Analyst",
        requiredSkills: ["Python", "SQL", "Excel", "Power BI", "Tableau", "Statistics", "Pandas", "NumPy", "Data Visualization", "R", "Looker"]
    },
    {
        role: "Data Scientist",
        requiredSkills: ["Python", "R", "Machine Learning", "Deep Learning", "Statistics", "TensorFlow", "PyTorch", "SQL", "Data Profiling", "Big Data", "Hadoop", "Spark"]
    },
    {
        role: "Data Engineer",
        requiredSkills: ["Python", "SQL", "Spark", "Hadoop", "Kafka", "Airflow", "AWS", "GCP", "Snowflake", "ETL", "Data Warehousing"]
    },
    {
        role: "AI/Machine Learning Engineer",
        requiredSkills: ["Python", "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "Keras", "NLP", "Computer Vision", "Scikit-Learn", "C++", "CUDA", "Math"]
    },
    {
        role: "DevOps Engineer",
        requiredSkills: ["Linux", "Bash", "Docker", "Kubernetes", "AWS", "Azure", "GCP", "Jenkins", "GitLab CI", "Terraform", "Ansible", "Nginx", "Python"]
    },
    {
        role: "Cloud Engineer",
        requiredSkills: ["AWS", "Azure", "Google Cloud", "Linux", "Networking", "Security", "Docker", "Kubernetes", "Terraform", "Serverless"]
    },
    {
        role: "Cybersecurity Analyst",
        requiredSkills: ["Networking", "Security", "Linux", "Cryptography", "Penetration Testing", "Ethical Hacking", "Firewalls", "SIEM", "Wireshark", "Splunk"]
    },
    {
        role: "Network Engineer",
        requiredSkills: ["Cisco", "Routing", "Switching", "TCP/IP", "BGP", "OSPF", "VPN", "Firewalls", "Network Security", "Wireshark"]
    },
    {
        role: "Mobile App Developer (iOS)",
        requiredSkills: ["Swift", "Objective-C", "Xcode", "iOS SDK", "Core Data", "REST API", "UI/UX Design", "Git"]
    },
    {
        role: "Mobile App Developer (Android)",
        requiredSkills: ["Kotlin", "Java", "Android Studio", "Android SDK", "Firebase", "REST API", "SQLite", "Git"]
    },
    {
        role: "Cross-Platform Mobile Developer",
        requiredSkills: ["React Native", "Flutter", "Dart", "JavaScript", "TypeScript", "Firebase", "Redux", "Git"]
    },
    {
        role: "Software Engineer",
        requiredSkills: ["Java", "Python", "C++", "C#", "DSA", "OOP", "System Design", "Git", "Agile", "Testing", "SQL"]
    },
    {
        role: "Embedded Systems Engineer",
        requiredSkills: ["C", "C++", "Microcontrollers", "RTOS", "Linux", "Assembly", "IoT", "Hardware Debugging", "Python"]
    },
    {
        role: "Robotics Engineer",
        requiredSkills: ["C++", "Python", "ROS", "Computer Vision", "Machine Learning", "Control Systems", "Kinematics", "IoT"]
    },
    {
        role: "UI/UX Designer",
        requiredSkills: ["Figma", "Adobe XD", "Sketch", "Wireframing", "Prototyping", "User Research", "Interaction Design", "HTML", "CSS"]
    },
    {
        role: "Product Manager",
        requiredSkills: ["Agile", "Scrum", "Jira", "Product Strategy", "Market Research", "Roadmapping", "A/B Testing", "Data Analysis", "Leadership"]
    },
    {
        role: "Database Administrator",
        requiredSkills: ["SQL", "MySQL", "PostgreSQL", "Oracle", "MongoDB", "Database Tuning", "Backup & Recovery", "Linux", "Shell Scripting"]
    },
    {
        role: "Game Developer",
        requiredSkills: ["C#", "C++", "Unity", "Unreal Engine", "3D Math", "Physics Engines", "Game Design", "OpenGL"]
    },
    {
        role: "AR/VR Developer",
        requiredSkills: ["C#", "C++", "Unity", "Unreal Engine", "3D Modeling", "Computer Vision", "Oculus SDK", "ARKit", "ARCore"]
    },
    {
        role: "Blockchain Developer",
        requiredSkills: ["Solidity", "Smart Contracts", "Ethereum", "Web3.js", "Cryptography", "Rust", "Go", "C++", "Node.js"]
    },
    {
        role: "Quality Assurance (QA) Engineer",
        requiredSkills: ["Testing", "Selenium", "Cypress", "Jest", "JUnit", "Manual Testing", "Automation Testing", "Jira", "Python", "Java"]
    },
    {
        role: "Site Reliability Engineer (SRE)",
        requiredSkills: ["Linux", "Python", "Go", "Docker", "Kubernetes", "Monitoring", "Prometheus", "Grafana", "Incident Response", "AWS"]
    },
    {
        role: "Systems Administrator",
        requiredSkills: ["Windows Server", "Linux", "Active Directory", "Networking", "Virtualization", "VMware", "Troubleshooting", "Scripting", "PowerShell"]
    },
    {
        role: "Business Analyst",
        requiredSkills: ["Excel", "SQL", "Power BI", "Tableau", "Requirements Gathering", "UML", "BPMN", "Agile", "Stakeholder Management"]
    },
    {
        role: "Salesforce Developer",
        requiredSkills: ["Salesforce", "Apex", "Visualforce", "Lightning Web Components", "SOQL", "CRM", "JavaScript", "Java"]
    },
    {
        role: "RPA Developer",
        requiredSkills: ["UiPath", "Automation Anywhere", "Blue Prism", "Python", "JavaScript", "C#", "Process Automation", "Excel"]
    },
    {
        role: "IT Support Specialist",
        requiredSkills: ["Troubleshooting", "Help Desk", "Windows OS", "Mac OS", "Networking", "Active Directory", "Customer Service", "Hardware Configuration"]
    }
];

module.exports = rolesData;
