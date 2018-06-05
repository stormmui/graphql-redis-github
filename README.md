# graphql-redis-github

### You need to add this file in your repo

Be sure and not check this file into Github, it should already
be listed in the .gitignore file

[ GitHub personal access token ](https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/)

The filename is called **f1.js** and should be located inside the
top level **data** directory.

```
{"key": "Github personal access token goes here inside the quotes"}
```

### To get up and running:

##### Run this command

```
npr s9
```

s3 = **writeStarGazers** writes the logins out to a redis set  
s7 = **writeAvatars** reads the above redis set and writes out the login fields
to a redis hashmap  
s8 = **writeAvatarsJson** reads the above redis set and writes out the login fields
to a JSON file.  

### Coding notes for this repo

This
[post](https://blog.lavrton.com/javascript-loops-how-to-handle-async-await-6252dd3c795)
explains how to do javascript loops with async await

This
[post](https://goenning.net/2016/04/14/stop-reading-json-files-with-require/) discusses how to read or import JSON files correctly.
