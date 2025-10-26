#!/bin/bash
set -euo pipefail

ARCHIVES_BASE="./archives"
CERTS_DIR="./certs"

docker run --name drupal-honey --rm -d \
  -v "${ARCHIVES_BASE}/drupal:/workdir" \
  -v "${CERTS_DIR}:/certs" \
  -v "${ARCHIVES_BASE}/drupal:/archive" \
  -p 8001:8080 \
  minaq3/wpr:latest replay archive.wprgo wpr_cert.pem wpr_key.pem

docker run --name gitlab-honey --rm -d \
  -v "${ARCHIVES_BASE}/gitlab:/workdir" \
  -v "${CERTS_DIR}:/certs" \
  -v "${ARCHIVES_BASE}/gitlab:/archive" \
  -p 8002:8080 \
  minaq3/wpr:latest replay archive.wprgo wpr_cert.pem wpr_key.pem

docker run --name grav-honey --rm -d \
  -v "${ARCHIVES_BASE}/grav:/workdir" \
  -v "${CERTS_DIR}:/certs" \
  -v "${ARCHIVES_BASE}/grav:/archive" \
  -p 8003:8080 \
  minaq3/wpr:latest replay archive.wprgo wpr_cert.pem wpr_key.pem

docker run --name metabase-honey --rm -d \
  -v "${ARCHIVES_BASE}/metabase:/workdir" \
  -v "${CERTS_DIR}:/certs" \
  -v "${ARCHIVES_BASE}/metabase:/archive" \
  -p 8004:8080 \
  minaq3/wpr:latest replay archive.wprgo wpr_cert.pem wpr_key.pem

docker run --name wordpress-honey --rm -d \
  -v "${ARCHIVES_BASE}/wordpress:/workdir" \
  -v "${CERTS_DIR}:/certs" \
  -v "${ARCHIVES_BASE}/wordpress:/archive" \
  -p 8005:8080 \
  minaq3/wpr:latest replay archive.wprgo wpr_cert.pem wpr_key.pem

docker run --name ghost-honey --rm -d \
  -v "${ARCHIVES_BASE}/ghost:/workdir" \
  -v "${CERTS_DIR}:/certs" \
  -v "${ARCHIVES_BASE}/ghost:/archive" \
  -p 8006:8080 \
  minaq3/wpr:latest replay archive.wprgo wpr_cert.pem wpr_key.pem

docker run --name grafana-honey --rm -d \
  -v "${ARCHIVES_BASE}/grafana:/workdir" \
  -v "${CERTS_DIR}:/certs" \
  -v "${ARCHIVES_BASE}/grafana:/archive" \
  -p 8007:8080 \
  minaq3/wpr:latest replay archive.wprgo wpr_cert.pem wpr_key.pem

docker run --name jenkins-honey --rm -d \
  -v "${ARCHIVES_BASE}/jenkins:/workdir" \
  -v "${CERTS_DIR}:/certs" \
  -v "${ARCHIVES_BASE}/jenkins:/archive" \
  -p 8008:8080 \
  minaq3/wpr:latest replay archive.wprgo wpr_cert.pem wpr_key.pem

docker run --name phpmyadmin-honey --rm -d \
  -v "${ARCHIVES_BASE}/phpmyadmin:/workdir" \
  -v "${CERTS_DIR}:/certs" \
  -v "${ARCHIVES_BASE}/phpmyadmin:/archive" \
  -p 8009:8080 \
  minaq3/wpr:latest replay archive.wprgo wpr_cert.pem wpr_key.pem

docker run --name zabbix-honey --rm -d \
  -v "${ARCHIVES_BASE}/zabbix:/workdir" \
  -v "${CERTS_DIR}:/certs" \
  -v "${ARCHIVES_BASE}/zabbix:/archive" \
  -p 8010:8080 \
  minaq3/wpr:latest replay archive.wprgo wpr_cert.pem wpr_key.pem
