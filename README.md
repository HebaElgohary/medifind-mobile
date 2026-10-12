# MediFind Mobile

MediFind is a React Native mobile application built with Expo. It helps users access medicine-related services through a mobile interface connected to a backend API.

## Tech Stack

- React Native
- Expo SDK 52
- React Navigation
- Redux Toolkit
- Axios
- React Hook Form
- React Native Paper

## Prerequisites

Before running the project, make sure you have installed:

- [Node.js](https://nodejs.org/)
- npm (included with Node.js)
- [Expo Go](https://expo.dev/go) for testing on a physical device, if compatible with the project's Expo SDK

## Getting Started

### 1. Clone the Repository

```bash
git clone YOUR_REPOSITORY_URL
cd medi_mob
```

Replace `YOUR_REPOSITORY_URL` with the actual GitHub repository URL.

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root by copying `.env.example`.

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

On macOS or Linux:

```bash
cp .env.example .env
```

Make sure the environment variables are configured correctly:

```dotenv
BASE_URL=https://medifind-backend-coral.vercel.app/
FEATURE_ENABLED=true
```

`BASE_URL` points to the deployed backend API. `FEATURE_ENABLED` controls the corresponding feature flag used by the application.

Do not commit your local `.env` file to GitHub.

### 4. Start the Application

Start the Expo development server:

```bash
npm start
```

You can also use the following commands:

```bash
npm run android
npm run ios
npm run web
```

Note: Running on iOS requires macOS with the appropriate iOS development tools. The web command runs the web version if the application's dependencies and components support it.

## Backend

The application connects to the deployed MediFind backend:

https://medifind-backend-coral.vercel.app/

The backend must be available for features that require API requests.

## Environment Variables

| Variable | Description |
|---|---|
| `BASE_URL` | Base URL of the backend API |
| `FEATURE_ENABLED` | Enables or disables the associated application feature |

Keep environment-specific configuration in `.env` and provide `.env.example` as a template for other developers.

## Contributing

1. Fork the repository.
2. Create a feature branch.
3. Make your changes and test them locally.
4. Submit a pull request.

## License

Add the project's license information here if applicable.