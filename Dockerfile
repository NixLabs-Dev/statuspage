# Step 1: Use an official Node.js image as a base
FROM node:18-alpine

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Step 4: Install the dependencies
RUN npm install

# Step 5: Copy the entire Next.js application into the container
COPY . .

ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

# Step 6: Regenerate the Prisma client
RUN npx prisma migrate deploy
RUN npx prisma generate

# Step 7: Build the Next.js app for production
RUN npm run build


# Step 8: Expose port 3000 to the outside world
EXPOSE 3000

# Step 10: Start Next.js app and cron daemon
CMD ["sh", "-c", "npm run backend & npm start"]
