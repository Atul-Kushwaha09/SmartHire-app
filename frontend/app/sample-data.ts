// Sample resume data for instant interactive demo testing

export const SAMPLE_RESUMES = [
  {
    name: "John_Doe_Senior_Backend.txt",
    type: "text/plain",
    content: `John Doe
john.doe@email.com | +1 (555) 123-4567 | San Francisco, CA | github.com/johndoe

SUMMARY:
Highly experienced Backend Engineer specializing in Python, FastAPI, and scalable system design. Proven track record of leading development teams, designing microservices architectures, and setting up automated CI/CD pipelines in AWS cloud environments. 

EXPERIENCE:
Senior Backend Engineer | TechCorp Inc. (2021 - Present)
- Designed and built a high-throughput transaction API using Python, FastAPI, and PostgreSQL, increasing system capacity by 150%.
- Containerized development and production staging environments using Docker, orchestrating container deployments using Kubernetes.
- Spearheaded CI/CD automation using GitHub Actions, reducing deployment time from 40 minutes to 6 minutes.
- Mentored 4 junior developers and reviewed architectures for robust security.

Software Engineer | Startup LLC (2018 - 2021)
- Developed REST APIs and microservices using Python and Flask.
- Integrated payment gateways (Stripe) and third-party SaaS services.
- Managed database migrations and optimization scripts for MySQL database.
- Collaborated on client web interfaces using React and JavaScript.

SKILLS:
- Languages: Python, JavaScript, SQL, Bash
- Frameworks/APIs: FastAPI, Django, Flask, React, REST APIs
- DevOps/Cloud: Docker, Kubernetes, AWS, Git, CI/CD, GitHub Actions
- Databases: PostgreSQL, MySQL, Redis

EDUCATION:
Master of Science in Computer Science
Stanford University (Graduated 2018)`
  },
  {
    name: "Alex_Rivera_Data_Scientist.txt",
    type: "text/plain",
    content: `Alex Rivera
alex.rivera@datasci.org | +1 (333) 888-9999 | Austin, TX

SUMMARY:
Data Scientist and Machine Learning Engineer with 3+ years of experience designing, training, and deploying statistical models. Technical expertise in Python, SQL, NLP, and machine learning pipelines using PyTorch and Scikit-Learn.

EXPERIENCE:
Data Scientist | Insights AI (2022 - Present)
- Built NLP parsing pipelines using Python and Hugging Face transformers to classify text, improving automated ticket routing accuracy by 30%.
- Trained regression and classification models using Scikit-Learn and Pandas to predict client churn.
- Wrote highly optimized SQL queries to aggregate and analyze product usage data across 2M+ active accounts.
- Maintained production ML microservices running inside Docker containers on AWS.

Junior Machine Learning Engineer | DataLabs (2021 - 2022)
- Cleaned and prepared large datasets for neural network training using Pandas and NumPy.
- Assisted in training Deep Learning models using PyTorch for computer vision tasks.
- Created interactive dashboards to visualize key performance metrics using Tableau and Power BI.

SKILLS:
- Languages: Python, SQL, R
- ML Libraries: PyTorch, Tensorflow, Scikit-Learn, Pandas, NumPy, NLP, Transformers
- DevOps/Cloud: AWS, Docker, Git, Linux
- Data Tools: Tableau, Power BI, SQL Server, MongoDB

EDUCATION:
Bachelor of Science in Data Science
University of Texas at Austin (Graduated 2021)`
  },
  {
    name: "Jane_Smith_Junior_Frontend.txt",
    type: "text/plain",
    content: `Jane Smith
jane.smith@webdev.com | +1 (444) 555-6666 | Chicago, IL | janesmith.dev

SUMMARY:
Motivated Junior Front-End Developer with a passion for building clean, user-friendly, and responsive web interfaces. Eager to contribute frontend skills in JavaScript, HTML, CSS, and Tailwind CSS. 

EXPERIENCE:
Junior Web Developer | WebSolutions Agency (2024 - Present)
- Crafted interactive landing pages and website layouts using HTML5, CSS3, and JavaScript.
- Standardized utility styling using Tailwind CSS, ensuring responsive design across mobile, tablet, and desktop views.
- Conducted cross-browser rendering bug fixes and improved site accessibility standards.
- Integrated jQuery widgets and simple REST APIs for contact forms.

Front-End Intern | Creative Digital (2023 - 2024)
- Assisted in building website templates using HTML, CSS, Bootstrap, and jQuery.
- Collaborated with UX design teams to translate Figma design screens into functioning web pages.
- Maintained documentation and performed version control using Git and GitHub.

SKILLS:
- Frontend Technologies: JavaScript, HTML, CSS, Sass, Tailwind CSS, Bootstrap, jQuery
- Design Tools: Figma, UI Design, Responsive Web Design
- Other: Git, GitHub, REST APIs

EDUCATION:
Associate Degree in Web Design and Development
Chicago Community College (Graduated 2023)`
  }
];

export function createSampleResumeFiles(): File[] {
  return SAMPLE_RESUMES.map(
    (resume) => new File([resume.content], resume.name, { type: resume.type })
  );
}
