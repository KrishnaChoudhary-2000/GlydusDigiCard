#!/bin/bash

echo "Installing Glydus Digital Card dependencies..."
echo

echo "Installing root dependencies..."
pnpm install

echo
echo "Installing client dependencies..."
cd client
pnpm install
cd ..

echo
echo "Installing server dependencies..."
cd server
pnpm install
cd ..

echo
echo "Installation completed!"
echo
echo "To start development:"
echo "  pnpm run dev"
echo 