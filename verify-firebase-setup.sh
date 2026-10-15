#!/bin/bash

# 🔥 VERIFICADOR DE CONFIGURACIÓN FIREBASE
# Uso: bash verify-firebase-setup.sh

echo "════════════════════════════════════════════════════"
echo "🔥 VERIFICADOR FIREBASE - ALMACEN WAREHOUSE"
echo "════════════════════════════════════════════════════"
echo ""

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para verificar
check() {
    local name="$1"
    local value="$2"
    
    if [ -z "$value" ] || [ "$value" = "undefined" ]; then
        echo -e "${RED}❌${NC} $name: NO CONFIGURADO"
        return 1
    else
        # Ocultar valores sensibles (mostrar solo primeros 10 caracteres)
        local display=$(echo "$value" | cut -c1-20)"..."
        echo -e "${GREEN}✅${NC} $name: ${display}"
        return 0
    fi
}

# Leer .env.local
echo "📂 Leyendo configuración de .env.local..."
echo ""

ENV_FILE="/Users/ing.carlosjimenez/almacen/.env.local"

if [ ! -f "$ENV_FILE" ]; then
    echo -e "${RED}❌ Archivo .env.local no encontrado${NC}"
    echo "   Ruta esperada: $ENV_FILE"
    exit 1
fi

# Extraer variables
API_KEY=$(grep REACT_APP_FIREBASE_API_KEY "$ENV_FILE" | cut -d '=' -f2)
AUTH_DOMAIN=$(grep REACT_APP_FIREBASE_AUTH_DOMAIN "$ENV_FILE" | cut -d '=' -f2)
PROJECT_ID=$(grep REACT_APP_FIREBASE_PROJECT_ID "$ENV_FILE" | cut -d '=' -f2)
DATABASE_URL=$(grep REACT_APP_FIREBASE_DATABASE_URL "$ENV_FILE" | cut -d '=' -f2)
STORAGE_BUCKET=$(grep REACT_APP_FIREBASE_STORAGE_BUCKET "$ENV_FILE" | cut -d '=' -f2)
MESSAGING_SENDER=$(grep REACT_APP_FIREBASE_MESSAGING_SENDER_ID "$ENV_FILE" | cut -d '=' -f2)
APP_ID=$(grep REACT_APP_FIREBASE_APP_ID "$ENV_FILE" | cut -d '=' -f2)

# Verificar cada variable
PASS=0
FAIL=0

echo "🔑 Variables de Entorno:"
echo "────────────────────────────────────────"

check "REACT_APP_FIREBASE_API_KEY" "$API_KEY" && ((PASS++)) || ((FAIL++))
check "REACT_APP_FIREBASE_AUTH_DOMAIN" "$AUTH_DOMAIN" && ((PASS++)) || ((FAIL++))
check "REACT_APP_FIREBASE_PROJECT_ID" "$PROJECT_ID" && ((PASS++)) || ((FAIL++))
check "REACT_APP_FIREBASE_DATABASE_URL" "$DATABASE_URL" && ((PASS++)) || ((FAIL++))
check "REACT_APP_FIREBASE_STORAGE_BUCKET" "$STORAGE_BUCKET" && ((PASS++)) || ((FAIL++))
check "REACT_APP_FIREBASE_MESSAGING_SENDER_ID" "$MESSAGING_SENDER" && ((PASS++)) || ((FAIL++))
check "REACT_APP_FIREBASE_APP_ID" "$APP_ID" && ((PASS++)) || ((FAIL++))

echo ""
echo "════════════════════════════════════════════════════"

# Resumen
if [ $FAIL -eq 0 ]; then
    echo -e "${GREEN}✅ TODAS LAS VARIABLES CONFIGURADAS (7/7)${NC}"
    echo ""
    echo "📊 Estado:"
    echo "   Project ID: $PROJECT_ID"
    echo "   Auth Domain: $AUTH_DOMAIN"
    echo "   Database URL: $(echo $DATABASE_URL | cut -c1-40)..."
    echo ""
    echo "🚀 Próximo paso:"
    echo "   1. Reinicia el servidor: npm start"
    echo "   2. Abre: http://localhost:3000"
    echo "   3. Intenta hacer login"
    echo "   4. Abre la consola (F12) y busca:"
    echo "      '✅ [WAREHOUSE APP] Firebase inicializado correctamente'"
    echo ""
else
    echo -e "${RED}❌ FALTAN $FAIL VARIABLES${NC} ($(($PASS))/7)"
    echo ""
    echo "📝 Qué hacer:"
    echo "   1. Abre: /Users/ing.carlosjimenez/almacen/.env.local"
    echo "   2. Ve a: https://console.firebase.google.com/"
    echo "   3. Proyecto: almacenmercedes → Configuración del proyecto"
    echo "   4. Copia todas las credenciales"
    echo "   5. Actualiza .env.local"
    echo "   6. Guarda (Cmd+S)"
    echo "   7. Vuelve a ejecutar este script"
    echo ""
fi

echo "════════════════════════════════════════════════════"
