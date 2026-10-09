#!/bin/bash

# Script de Verificación de Configuración Firebase + Netlify

echo "================================"
echo "  VERIFICACIÓN DE CONFIGURACIÓN  "
echo "================================"
echo ""

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 1. Verificar .env.local
echo -e "${BLUE}1. Verificando .env.local...${NC}"
if [ -f ".env.local" ]; then
  echo -e "${GREEN}✓ Archivo .env.local existe${NC}"
  
  MISSING=false
  for var in REACT_APP_FIREBASE_API_KEY REACT_APP_FIREBASE_AUTH_DOMAIN REACT_APP_FIREBASE_PROJECT_ID REACT_APP_FIREBASE_STORAGE_BUCKET; do
    if grep -q "^$var=" .env.local; then
      VALUE=$(grep "^$var=" .env.local | cut -d'=' -f2)
      if [ -z "$VALUE" ] || [[ "$VALUE" == *"DemoKey"* ]] || [[ "$VALUE" == *"demo"* ]]; then
        echo -e "${YELLOW}⚠ $var está vacía o usa valores de demostración${NC}"
        MISSING=true
      else
        echo -e "${GREEN}✓ $var configurada${NC}"
      fi
    else
      echo -e "${RED}✗ $var no encontrada en .env.local${NC}"
      MISSING=true
    fi
  done
  
  if [ "$MISSING" = true ]; then
    echo -e "${YELLOW}⚠ Algunas variables de Firebase no están completas${NC}"
  fi
else
  echo -e "${RED}✗ Archivo .env.local no existe${NC}"
fi
echo ""

# 2. Verificar .env.production
echo -e "${BLUE}2. Verificando .env.production...${NC}"
if [ -f ".env.production" ]; then
  echo -e "${GREEN}✓ Archivo .env.production existe${NC}"
else
  echo -e "${YELLOW}⚠ Archivo .env.production no existe (se creará)${NC}"
fi
echo ""

# 3. Verificar netlify.toml
echo -e "${BLUE}3. Verificando netlify.toml...${NC}"
if [ -f "netlify.toml" ]; then
  echo -e "${GREEN}✓ Archivo netlify.toml existe${NC}"
  
  if grep -q 'command = "npm run build"' netlify.toml; then
    echo -e "${GREEN}✓ Build command configurado correctamente${NC}"
  else
    echo -e "${RED}✗ Build command no configurado${NC}"
  fi
  
  if grep -q 'publish = "build"' netlify.toml; then
    echo -e "${GREEN}✓ Publish directory configurado correctamente${NC}"
  else
    echo -e "${RED}✗ Publish directory no configurado${NC}"
  fi
else
  echo -e "${RED}✗ Archivo netlify.toml no existe${NC}"
fi
echo ""

# 4. Verificar package.json
echo -e "${BLUE}4. Verificando package.json...${NC}"
if [ -f "package.json" ]; then
  echo -e "${GREEN}✓ Archivo package.json existe${NC}"
  
  if grep -q '"build": "react-scripts build"' package.json; then
    echo -e "${GREEN}✓ Script build configurado${NC}"
  fi
  
  if grep -q '"start": "react-scripts start"' package.json; then
    echo -e "${GREEN}✓ Script start configurado${NC}"
  fi
else
  echo -e "${RED}✗ Archivo package.json no existe${NC}"
fi
echo ""

# 5. Verificar dependencias
echo -e "${BLUE}5. Verificando dependencias instaladas...${NC}"
if [ -d "node_modules" ]; then
  echo -e "${GREEN}✓ node_modules existe${NC}"
  
  if [ -d "node_modules/firebase" ]; then
    echo -e "${GREEN}✓ Firebase instalado${NC}"
  else
    echo -e "${YELLOW}⚠ Firebase no está instalado${NC}"
  fi
  
  if [ -d "node_modules/react" ]; then
    echo -e "${GREEN}✓ React instalado${NC}"
  fi
else
  echo -e "${RED}✗ node_modules no existe. Ejecuta: npm install${NC}"
fi
echo ""

# 6. Resumen
echo "================================"
echo -e "${BLUE}RESUMEN${NC}"
echo "================================"
echo ""
echo -e "${BLUE}Pasos siguientes:${NC}"
echo ""
echo "1. ${YELLOW}Crear proyecto en Firebase:${NC}"
echo "   → Ve a https://console.firebase.google.com/"
echo "   → Crea un nuevo proyecto"
echo "   → Habilita Authentication (Email + Google)"
echo "   → Crea Realtime Database"
echo "   → Crea Storage"
echo ""
echo "2. ${YELLOW}Obtener credenciales:${NC}"
echo "   → Ve a Project Settings > Tu Aplicación > Web"
echo "   → Copia la configuración de Firebase"
echo ""
echo "3. ${YELLOW}Actualizar .env.local con tus credenciales reales${NC}"
echo ""
echo "4. ${YELLOW}Prueba local:${NC}"
echo "   → npm install"
echo "   → npm start"
echo ""
echo "5. ${YELLOW}Deploy a Netlify:${NC}"
echo "   → Ve a https://app.netlify.com/"
echo "   → Conecta tu repositorio de GitHub"
echo "   → Agrega las variables de entorno"
echo "   → Deploy"
echo ""
