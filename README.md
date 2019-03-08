# node-redis-subscribe-example
- Description : Redis Subscribe Example For Session Data Logging

## 레디스 TTL, subscribe를 이용한 세션 데이터 로깅
- 세션 데이터 저장 시 db0에는 세션 데이터, db1에는 TTL을 가진 데이터를 db0과 동일한 키로 저장
- [Example Flow]
    1. db0 > set key1_giseoplee { name: giseoplee, age: 28, mail: llgs901@naver.com }
    2. db1 > set key1_giseoplee 1
    3. db1 > expire key1_giseoplee 3600
    4. redis.conf 내 notify-keyspace-events Ex 설정
    5. (node - ioredis) psubscribe로 db1의 expired key event를 구독
    6. db1의 TTL이 만료되어 이벤트가 발생하면 해당 key를 반환
    7. 6에서 반환된 key로 db0에 있는 데이터를 mongoDB에 로깅

## 응용 방안
- pmessage event에서 반환된 key를 컨트롤할 수 있기 때문에 특정 시간 뒤에 이벤트를 발생시키는 비즈니스 로직에 적합
- 챗봇 내 사용자 세션 데이터 로깅 등으로 응용