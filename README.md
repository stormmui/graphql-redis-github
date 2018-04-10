# graphql-redis-github

s3 = **writeStarGazers** writes the logins out to a redis set  
s7 = **writeAvatars** reads the above redis set and writes out the login fields
to a redis hashmap  
s8 = **writeAvatarsJson** reads the above redis set and writes out the login fields
to a JSON file.  

```
npr s9
```

### Coding notes for this repo

This
[post](https://blog.lavrton.com/javascript-loops-how-to-handle-async-await-6252dd3c795)
explains how to do javascript loops with async await

This
[post](https://goenning.net/2016/04/14/stop-reading-json-files-with-require/) discusses how to read or import JSON files correctly.
