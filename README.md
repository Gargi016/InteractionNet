<p align="center">
  <img src="https://raw.githubusercontent.com/Gargi016/InteractionNet/main/docs/interactionnet%20poster.jpeg" alt="InteractionNet Project Banner">
</p>

<h1 align="center">InteractionNet </h1>

<p align="center">
  <i>An AI-Powered Prototype for Predicting Drug-Drug Interactions</i>
</p>

<p align="center">
    <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python">
    <img src="https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white" alt="Flask">
    <img src="https://img.shields.io/badge/Scikit--learn-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white" alt="Scikit-learn">
    <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript">
    <img src="https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white" alt="Render">
</p>

<p align="center">
  <a href="#-live-demo">Live Demo</a> •
  <a href="#-project-overview">Overview</a> •
  <a href="#-key-features">Key Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-results--evaluation">Results & Evaluation</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-the-team">The Team</a>
</p>

---

## 🚀 Live Demo

[![Deploy to Render](https://img.shields.io/badge/View_Live_Demo-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://interactionnet-cmmj.onrender.com)

**Click the badge above or follow the link to try the live application:** [https://interactionnet-cmmj.onrender.com](https://interactionnet-cmmj.onrender.com)

---

## 📖 Project Overview

Millions of patients worldwide are prescribed multiple medications (polypharmacy), creating a significant risk of harmful drug-drug interactions (DDIs). While some interactions are well-known, the sheer number of possible drug combinations makes it impossible to test them all. **InteractionNet** is a web-based prototype built for the IIC Hackathon to address this challenge. It leverages a machine learning model to analyze the chemical structures of two drugs and predict the likelihood of an interaction, providing a powerful proof-of-concept for a future clinical decision support tool.

---

## ✨ Key Features

- **AI-Powered Prediction**: Utilizes a `RandomForestClassifier` to predict interaction risk based on the drugs' molecular fingerprints.
- **Interactive 3D Molecule Viewer**: Renders the 3D structures of the selected drugs, offering an intuitive and educational experience.
- **Dynamic Drug Selection**: A user-friendly interface with dropdown menus populated from the dataset, preventing errors and simplifying the user experience.
- **Real-Time Feedback**: The frontend communicates asynchronously with the backend to provide instant "Analyzing..." status and a clear, color-coded final prediction.
- **Full-Stack Architecture**: Built on a robust Python/Flask backend and a dynamic JavaScript frontend.

---

## 🛠️ Tech Stack

| Backend | Machine Learning | Frontend | Deployment |
| :---: | :---: | :---: | :---: |
| Python | Scikit-learn | HTML5 & CSS3 | Render |
| Flask | RDKit | JavaScript | Gunicorn |
| | Pandas | jQuery | Docker |
| | | 3Dmol.js | |

---

## 📊 Results & Evaluation

Our application provides a clean and functional prototype that successfully demonstrates the core vision.

<p align="center">
  <b>Main Application Interface with Dropdowns</b><br><br>
  <img src="https://raw.githubusercontent.com/Gargi016/InteractionNet/main/docs/drop%20down%20option.jpg" alt="A screenshot of the main application view with dropdowns." width="700">
</p>
<p align="center">
  <b>A "Interacting" </b><br><br>
  <img src="https://raw.githubusercontent.com/Gargi016/InteractionNet/main/docs/interacting.jpg" alt="A screenshot showing a high-risk prediction with red styling." width="700">
</p>
<p align="center">
  <b>A "Non interacting" </b><br><br>
  <img src="https://raw.githubusercontent.com/Gargi016/InteractionNet/main/docs/non%20interacting.jpg" alt="A screenshot showing a successful low-risk prediction and two 3D models." width="700">
</p>

---

## 🚀 Getting Started

To run this project locally:

1.  **Clone the Repository**
    ```bash
    git clone [https://github.com/Gargi016/InteractionNet.git](https://github.com/Gargi016/InteractionNet.git)
    cd InteractionNet
    ```

2.  **Create and Activate a Virtual Environment**
    ```bash
    # Create the environment
    python -m venv venv
    # Activate (Windows)
    .\venv\Scripts\activate
    # Activate (Mac/Linux)
    source venv/bin/activate
    ```

3.  **Install Dependencies**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Run the Application**
    ```bash
    flask run
    ```
    The app will be available at `http://12.0.0.1:5000`.

---

## 🤝 The Team: Futuristic Four

This project was developed by:

- **Gargi Das**: [GitHub](https://github.com/Gargi016)
- **Ritvik Raj Singh**: [GitHub](https://github.com/Ritviks21)
- **Paarth Gupta**: [GitHub](https://github.com/paarthgupta-dev)
- **Rishabh Shrivastava**: [GitHub](https://github.com/Rishabh-prog19)
