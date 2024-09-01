# User API Spec

## Register User

Endpoint : POST /api/users

Request Body :

```json
{
  "username": "reyhan",
  "password": "password",
  "name": "Reyhan Naufal Hakim"
}
```

Response Body (Success) :

```json
{
  "data": {
    "username": "reyhan",
    "name": "Reyhan Naufal Hakim"
  }
}
```

Response Body (Failed) :

```json
{
  "errors": "Username already registered"
}
```

## Login User

Endpoint : POST /api/users/login

Request Body :

```json
{
  "username": "reyhan",
  "password": "rahasia"
}
```

Response Body (Success) :

```json
{
  "data": {
    "username": "reyhan",
    "name": "Reyhan Naufal Hakim",
    "token": "session_id_generated"
  }
}
```

Response Body (Failed) :

```json
{
  "errors": "Username or password is wrong"
}
```

## Get User

Endpoint : GET /api/users/current

Headers :

- Authorization: token

Response Body (Success) :

```json
{
  "data": {
    "username": "reyhan",
    "name": "Reyhan Naufal Hakim"
  }
}
```

Response Body (Failed) :

```json
{
  "errors": "Unauthorized"
}
```

## Update User

Endpoint : PATCH /api/users/current

Headers :

- Authorization: token

Request Body :

```json
{
  "password": "rahasia", // optional, if want to change password
  "name": "Reyhan Naufal Hakim" // optional, if want to change name
}
```

Response Body (Success) :

```json
{
  "data": {
    "username": "reyhan",
    "name": "Reyhan Naufal Hakim"
  }
}
```

## Logout User

Endpoint : DELETE /api/users/current

Headers :

- Authorization: token

Response Body (Success) :

```json
{
  "data": true
}
```
