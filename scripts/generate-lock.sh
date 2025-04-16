#!/bin/bash

# This script generates a proper package-lock.json file

# Remove existing node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Install dependencies to generate a fresh package-lock.json
npm install

echo "Generated package-lock.json file. Make sure to commit this file to your repository."
