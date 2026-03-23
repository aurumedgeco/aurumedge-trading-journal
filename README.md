# Aurum Edge Co. — Trading Journal

## Setup in VS Code (First Time Only)

### Step 1: Install Node.js
If you don't have Node.js installed:
- Go to https://nodejs.org
- Download the LTS version (green button)
- Install it (just click Next through everything)
- Restart VS Code after installing

### Step 2: Open this folder in VS Code
- Open VS Code
- File > Open Folder > select the `aurumedge-app` folder
- You should see package.json, src/, public/ in the sidebar

### Step 3: Open the Terminal in VS Code
- Press Ctrl + ` (backtick key, next to 1)
- Or go to Terminal > New Terminal

### Step 4: Install dependencies
Type this in the terminal and press Enter:
```
npm install
```
Wait for it to finish (takes 1-2 minutes the first time).

### Step 5: Run the app
```
npm start
```
Your browser will open automatically to http://localhost:3000
That's it — your trading journal is running!

## How to Stop the App
- Press Ctrl + C in the terminal

## How to Start it Again Later
- Open the folder in VS Code
- Open terminal (Ctrl + `)
- Type `npm start`

## Deploy to the Internet (Vercel — Free)

### Step 1: Create accounts
- Go to https://github.com and create a free account
- Go to https://vercel.com and sign up with your GitHub account

### Step 2: Push code to GitHub
In VS Code terminal:
```
git init
git add .
git commit -m "Aurum Edge Trading Journal"
```
Then create a new repository on github.com and follow their instructions to push.

### Step 3: Deploy on Vercel
- Go to vercel.com/new
- Click "Import" next to your GitHub repository
- Click "Deploy"
- Done! Vercel gives you a link like: aurumedge-trading-journal.vercel.app

### Step 4: Custom domain (optional)
- Buy a domain like aurumedge.co (~$12/year from Namecheap or Google Domains)
- In Vercel dashboard > Settings > Domains > Add your domain
- Follow the DNS instructions they show you

## Selling the App

### On Etsy / Gumroad:
Since this is a web app, you sell ACCESS to it:
- Option A: Sell the source code (this folder as a zip) — buyers self-host
- Option B: Host it yourself and sell the link — buyers just use it

### Recommended approach:
Host on Vercel for free, sell access through Gumroad at $19.99/one-time.
Each buyer gets the same link — their data saves in THEIR browser (localStorage),
so everyone's data is private and separate.

## Tech Stack
- React 18
- Recharts (charts)
- localStorage (data persistence)
- No backend needed
- No database needed
