# 🛒 **Halal Meat Shop Inventory Management App**  

## 📋 **Table of Contents**  
1. [📖 Project Overview](#-project-overview)  
2. [✨ Features](#-features)  
3. [🛠️ Technologies Used](#-technologies-used)  
4. [📥 Setup and Installation](#-setup-and-installation)  
---

## 📖 **Project Overview**  
The **Halal Meat Shop Inventory Management App** is a React Native application designed to manage inventory and reordering for two meat shops. The app allows shop employees, super users, and supervisors to collaboratively manage stock levels, reorder calculations, and generate detailed reports.  

---

## ✨ **Features**  
- 📦 **Inventory Management**:  
  - Update stock levels.  
  - Calculate reorder quantities dynamically.  
- 👤 **User Account Management** (Super User):  
  - Add, edit, and deactivate employee accounts.  
- 📊 **Report Generation** (Supervisor):  
  - Generate PDF reports with custom filters.  
- 🔒 **Secure Authentication**:  
  - Access restricted to authenticated users only.  

---

## 🛠️ **Technologies Used**  

### **Frameworks and Libraries**  
- **React Native**: Core framework for building the app.  
- **Expo**: Simplifies React Native development and deployment.  

### **Key Libraries**  
1. **Navigation**:  
   - `@react-navigation/native` & `@react-navigation/drawer`: For smooth navigation and side drawer functionality.  

2. **State Management & Data Storage**:  
   - `@react-native-async-storage/async-storage`: Persistent local storage for user roles and app settings.  
   - `@react-native-firebase/app` & `@react-native-firebase/database`: Real-time database integration with Firebase.  

3. **UI and Styling**:  
   - `@expo-google-fonts/ubuntu`: Custom Ubuntu font for enhanced visuals.  
   - `react-native-paper`: Pre-built UI components for quick development.  

4. **PDF Generation**:  
   - `react-native-html-to-pdf`: For generating reports in PDF format.  
   - `expo-print`: Print support for generating and sharing PDF reports.  

5. **Animations**:  
   - `lottie-react-native`: Create engaging animations for loading screens and transitions.  

6. **Utilities**:  
   - `react-native-size-matters`: Simplifies scaling UI elements across different device sizes.  

---

## 📥 **Setup and Installation**  

1. Clone the repository:  
   ```bash
   git clone https://github.com/your-repo/halal-meat.git
