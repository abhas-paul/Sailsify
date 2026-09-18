# ⛵ Sailsify

> A modern web experience built with Next.js and React.

**Sailsify** is a modern, responsive web application designed with a clean interface and a component-based architecture. The project is built using the latest React and Next.js ecosystem, with Tailwind CSS for styling and Lucide for interface icons.

🔗 **Live Demo:** https://sailsify-iota.vercel.app/
🔗 **Repository:** https://github.com/abhas-paul/Sailsify

---

## ✨ Features

* 🎨 Modern and responsive user interface
* ⚡ Fast development with Next.js
* ⚛️ Built with React 19
* 🎯 Component-based architecture
* 🌙 Clean, customizable UI
* 📱 Responsive layouts for different screen sizes
* 🧩 Reusable UI components
* 🎭 Lucide icon integration
* 🗃️ Redux-based state management
* 🚀 Production-ready Next.js build system

---

## 🛠️ Tech Stack

| Technology         | Purpose                                      |
| ------------------ | -------------------------------------------- |
| **Next.js 15**     | React framework and application architecture |
| **React 19**       | UI development                               |
| **Tailwind CSS 4** | Styling and responsive design                |
| **React Redux**    | State management                             |
| **Lucide React**   | UI icons                                     |
| **JavaScript**     | Application logic                            |
| **PostCSS**        | CSS processing                               |

The project's `package.json` defines Next.js `15.3.8`, React `19`, React DOM `19`, React Redux `9.2.0`, Tailwind CSS `4`, and Lucide React among its dependencies.

---

## 📁 Project Structure

```text
Sailsify/
│
├── app/                    # Next.js application routes and pages
│
├── components/             # Reusable React components
│
├── public/                 # Static assets
│
├── components.json         # Component configuration
├── eslint.config.mjs       # ESLint configuration
├── jsconfig.json           # JavaScript configuration
├── next.config.mjs         # Next.js configuration
├── package.json            # Project dependencies and scripts
├── package-lock.json       # Dependency lockfile
├── postcss.config.mjs      # PostCSS configuration
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

* [Node.js](https://nodejs.org/)
* npm
* Git

### 1. Clone the repository

```bash
git clone https://github.com/abhas-paul/Sailsify.git
```

### 2. Enter the project directory

```bash
cd Sailsify
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run dev
```

The development server will start using Next.js with Turbopack.

Open:

```text
http://localhost:3000
```

---

## 📦 Available Scripts

### Development

```bash
npm run dev
```

Starts the Next.js development server with Turbopack.

### Production Build

```bash
npm run build
```

Creates an optimized production build.

### Production Server

```bash
npm start
```

Starts the application using the production build.

### Lint

```bash
npm run lint
```

Runs the project's linting configuration.

These scripts are defined in the repository's `package.json`.

---

## 🎨 Styling

Sailsify uses **Tailwind CSS 4** for styling.

This allows the interface to be built using utility classes while keeping the UI responsive and maintainable.

The project also uses:

```text
tailwind-merge
clsx
class-variance-authority
tw-animate-css
```

for composing and managing UI classes.

---

## 🧩 Components

Reusable interface elements are organized inside:

```text
components/
```

This keeps the application modular and makes it easier to reuse UI elements across different pages.

The project also includes a `components.json` configuration file for its component setup.

---

## 🗃️ State Management

Sailsify includes **React Redux** for application-level state management.

This makes it possible to maintain shared state across components without relying entirely on local React state.

```text
React
  │
  ├── Components
  │
  └── Redux Store
        │
        └── Application State
```

---

## 📱 Responsive Design

The interface is designed around responsive web principles, allowing the application to adapt to:

* 💻 Desktop screens
* 💻 Laptops
* 📱 Mobile devices
* 📟 Tablets

Tailwind CSS utilities are used to implement responsive layouts.

---

## 🏗️ Development

To work on the project locally:

```bash
git clone https://github.com/abhas-paul/Sailsify.git
cd Sailsify
npm install
npm run dev
```

After making changes, create a production build to verify that everything works correctly:

```bash
npm run build
```

---

## 🌐 Deployment

The repository currently lists a Vercel deployment:

**Live:** https://sailsify-iota.vercel.app/

For production deployment, the project can be deployed through platforms that support Next.js applications.

---

## 🤝 Contributing

Contributions, suggestions, and improvements are welcome.

### Fork the repository

```bash
git fork https://github.com/abhas-paul/Sailsify
```

Or fork it directly through GitHub.

### Create a branch

```bash
git checkout -b feature/my-feature
```

### Commit your changes

```bash
git add .
git commit -m "Add my feature"
```

### Push the branch

```bash
git push origin feature/my-feature
```

Then open a Pull Request.

---

## 🐛 Issues

If you encounter a bug or have a feature request, open an issue in the repository:

https://github.com/abhas-paul/Sailsify/issues

Please include:

* A description of the problem
* Steps to reproduce it
* Expected behaviour
* Actual behaviour
* Screenshots, if applicable
* Browser/device information where relevant

---

## 📄 License

No license is currently specified in the repository.

If this project is intended for public reuse, consider adding an appropriate open-source license.

---

## 👨‍💻 Author

**Abhas Paul**

GitHub:
https://github.com/abhas-paul

---

## ⭐ Support

If you find the project useful, consider giving the repository a ⭐ on GitHub.

---

<p align="center">
  Built with ❤️ using Next.js and React
</p>
