# retrieve auth and auth docker
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 257461805816.dkr.ecr.us-east-1.amazonaws.com

# build docker
docker build -t project-backend .

# tag image
docker tag project-backend:latest 257461805816.dkr.ecr.us-east-1.amazonaws.com/project-backend:latest

# push
docker push 257461805816.dkr.ecr.us-east-1.amazonaws.com/project-backend:latest

# deploy
cd aws_deploy
eb deploy