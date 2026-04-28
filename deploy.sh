#!/bin/bash
# 职觉 ZhiJue 部署脚本
# 用法: bash deploy.sh

set -e

echo "=== 职觉 ZhiJue 部署开始 ==="

# 停止旧容器
echo ">>> 停止旧容器..."
docker compose down || true

# 构建并启动
echo ">>> 构建并启动容器..."
docker compose up --build -d

# 等待健康检查
echo ">>> 等待服务启动..."
sleep 10

# 检查状态
echo ">>> 容器状态:"
docker compose ps

echo "=== 部署完成 ==="
echo "访问 http://$(hostname -I | awk '{print $1}'):80"
