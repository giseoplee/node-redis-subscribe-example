echo "start dockerizing!"
echo "."
echo ".."
echo "..."

docker stop $(docker ps -q -a  --filter="name=redis-subscribe")
docker rm $(docker ps -q -a --filter="name=redis-subscribe")

result=`docker images redis-subscribe`
target=`echo $result | cut -d ' ' -f9`
docker rmi $target

docker build -t redis-subscribe:v0.1 .
docker run --name=redis-subscribe -d -v /etc/localtime:/etc/localtime:ro -e TZ=Asia/Seoul watch:v0.1

echo "."
echo "."
echo "."
echo "completed subscribe process dockerizing!"
