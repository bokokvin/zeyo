# ZEYO

##### Clone the repository  
`git clone https://github.com/bokokvin/zeyo.git`

##### Move inside it
`cd zeyo`

##### Install Docker
If it's not already installed, then install Docker. You can use https://docs.docker.com/docker-for-windows/install/

##### Build your docker image
`docker build -t bokokvin/zeyo .`

##### Verify your image is successfully create
`docker images`

##### Launch your container 
`docker run -d -p 49160:3000 -d bokokvin/zeyo`

Navigate to http://localhost:49160/home && create your account and enjoy making transactions online

##### Stop container
```
docker ps 
docker rm CONTAINER_ID
```

** GOOD LUCK !! **
