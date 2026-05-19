#!/bin/bash

# Script para configurar la base de datos PostgreSQL para ControlGastos
# Ejecutar como: bash setup-database.sh

echo "=== Setup Database ControlGastos ==="

# Variables (desde .env)
DB_HOST="localhost"
DB_PORT="5432"
DB_USERNAME="ctrlgasto_user"
DB_PASSWORD="ctrlgasto123"
DB_DATABASE="ctrlgasto"

echo "Verificando PostgreSQL..."
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL no está instalado"
    echo "Instálalo con: sudo apt install postgresql postgresql-contrib"
    exit 1
fi

echo "PostgreSQL version:"
psql --version

echo ""
echo "=== Iniciando PostgreSQL (si no está corriendo) ==="
echo "En Ubuntu/Debian:"
echo "  sudo service postgresql start"
echo ""

echo "=== Creando base de datos y usuario ==="
echo ""
echo "Ejecuta los siguientes comandos como usuario postgres:"
echo ""
echo "# Conectarse a PostgreSQL"
echo "sudo -u postgres psql"
echo ""
echo "# Dentro de psql, ejecutar:"
echo ""

cat << 'EOF'
-- Crear usuario (si no existe)
CREATE USER ctrlgasto_user WITH PASSWORD 'ctrlgasto123';

-- Alternativamente, si ya existe:
-- ALTER USER ctrlgasto_user WITH PASSWORD 'ctrlgasto123';

-- Dar permisos
ALTER ROLE ctrlgasto_user CREATEDB;

-- Crear base de datos
CREATE DATABASE ctrlgasto OWNER ctrlgasto_user;

-- Conectarse a la BD
\c ctrlgasto

-- Dar privilegios completos
GRANT ALL PRIVILEGES ON DATABASE ctrlgasto TO ctrlgasto_user;
GRANT ALL PRIVILEGES ON SCHEMA public TO ctrlgasto_user;

-- Verificar que todo está bien
\l
\du
\q
EOF

echo ""
echo "=== Verificar conexión ==="
echo ""
echo "Después de ejecutar los comandos, prueba la conexión:"
echo "psql -U ctrlgasto_user -d ctrlgasto -h localhost -c \"SELECT NOW();\""
echo ""

echo "=== Ejecutar la aplicación ==="
echo ""
echo "Una vez la BD esté configurada, en el directorio backend ejecuta:"
echo "npm run start:dev"
echo ""
echo "TypeORM sincronizará automáticamente las tablas."
