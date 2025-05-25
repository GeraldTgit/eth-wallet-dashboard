import redis

r = redis.Redis(host='redis', port=6379, decode_responses=True)

def get_cached(key):
    return r.get(key)

def set_cached(key, value, ttl):
    r.setex(key, ttl, value)
