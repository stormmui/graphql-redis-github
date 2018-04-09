# graphql-redis-github

This
[post](https://blog.lavrton.com/javascript-loops-how-to-handle-async-await-6252dd3c795)
explains how to do javascript loops with async await

**writeStarGazers** writes the user login out to a redis set
**writeAvatars** reads the above redis set and writes out the login fields
to a hashmap

s3 = writeStarGazers
s7 = writeAvatars

```
npr s8
```
