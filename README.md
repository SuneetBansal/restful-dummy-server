# restful-dummy-server
This can be used to mock Rest API responses.

## How to install 
npm install -g restful-dummy-server

## How to use
### CLI options

#### 1. port
```js
"scripts": {
    "start": "restful-dummy-server -port 4000"
}
```

This will start restful dummy server on port 4000


#### 2. host
You can also mention host.
```js
"scripts": {
    "start": "restful-dummy-server -port 4000 -host xx.xx.xx.xx"
}
```

#### 3. static
```js
"scripts": {
    "start": "restful-dummy-server -port 4000 -static ./data"
}
```

**static** is used to know the relative path of a folder where all statics files are hosted. Which then would be used by Dummy server to download files against the rest api dowbloaded request.
Here this folder is **data**.


#### 4. config
```js
"scripts": {
    "start": "restful-dummy-server -port 4000 -static ./data -config ./test"
}
```

**config** is used to know the relative path of a folder which are having dummy request response instruction files in **.json** extensions only.

Note - 
1. Assuming **port** is 4000 for all below examples.
2. **data** folder is having **test.png** file

Example 1-
**test/config.json**

```js
[{
    "request": {
        "url": "/get/message",
        "method": "get"
    },
    "response": {
        "headers": {},
        "body": "Hello Dummy Server"
    }
}]
```

In this case if you hit http://localhost:5000/get/message then you will get **Hello Dummy Server** as response.


Example 2-
**test/config.json**

```js
[{
    "request": {
        "url": "/get/:message",
        "method": "get"
    },
    "response": {
        "headers": {},
        "body": { "message": "Hello Dummy Server" }
    }
}]
```

In this case if you hit http://localhost:5000/get/test or http://localhost:5000/get/msg etc. then you will get **{ "message": "Hello Dummy Server" }** as response.


Example 3-
**test/config.json**

```js
[{
    "request": {
        "url": "/get/png/*.*",
        "method": "get"
    },
    "response": {
        "headers": {
            "Content-Disposition": "attachment;filename= test.png;"
        },
        "body": "./test.png"
    }
}]
```

In this case if you hit http://localhost:5000/get/png/abc.png or http://localhost:5000/get/png/msg.png etc. then **test.png** will be downloaded as response.


Example 4-
**test/config.json**

```js
[{
    "request": {
        "url": "/get/**/*.*",
        "method": "get"
    },
    "response": {
        "headers": {
            "Content-Disposition": "attachment;filename= test.png;"
        },
        "body": "./test.png"
    }
}]
```

In this case if you hit http://localhost:5000/get/png/abc.png or http://localhost:5000/get/png/png2/msg.jpeg etc. then **test.png** will be downloaded as response.


Example 5-
**test/config.json**

```js
[{
    "request": {
        "url": "/get/**/*.png",
        "method": "get"
    },
    "response": {
        "headers": {
            "Content-Disposition": "attachment;filename= test.png;"
        },
        "body": "./test.png"
    }
}]
```

In this case if you hit http://localhost:5000/get/png/abc.png or http://localhost:5000/get/png/png2/msg.png etc. then **test.png** will be downloaded as response.


Example 6-
**test/config.json**

```js
[{
    "request": {
        "url": "/get/**/*.png",
        "method": "get"
    },
    "response": {
        "headers": {
            "Content-Disposition": "attachment;filename= test.png;"
        },
        "body": "./test.png",
        "delay": 2000 
    }
}]
```

Above **delay** is the special attribute which would cause Dummy server to respond in 2000 milliseconds.


#### 5. proxy
```js
"scripts": {
    "start": "restful-dummy-server -port 4000 -static ./data -config ./test -proxy localhost:2000"
}
```

If **proxy** is provided then Dummy server will redirect the request to the proxy server if there is no matching record found.


