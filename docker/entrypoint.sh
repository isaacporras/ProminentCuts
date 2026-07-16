#!/bin/sh
set -e

# Arranca como root (ver USER en el Dockerfile — ya no fija "node" ahí, se
# baja acá abajo) para poder arreglar el dueño de /app/data sin importar
# cómo haya quedado montado: volumen nombrado, bind mount de un VPS nuevo, o
# lo que sea. Sin esto, cada negocio nuevo necesita un `chown` manual por
# SSH antes del primer deploy o el contenedor crashea con SQLITE_CANTOPEN.
mkdir -p /app/data
chown -R node:node /app/data

exec su-exec node "$@"
