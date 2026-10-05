# Utiliser une image Node.js légère
FROM node:20-alpine

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier uniquement les fichiers de dépendances en premier
COPY package*.json ./

# Installer uniquement les dépendances de production
RUN npm ci --omit=dev

# Copier le reste du code source
COPY src/ ./src/

# Définir l'environnement en production
ENV NODE_ENV=production

# Utiliser l'utilisateur non-root 'node' fourni par l'image
USER node

# Exposer le port sur lequel l'application écoute
EXPOSE 3000

# Commande pour démarrer l'application
CMD ["npm", "start"]