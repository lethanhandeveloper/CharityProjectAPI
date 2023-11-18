
export default class Exception extends Error {
    static WRONG_DB_USERNAME_PASSWORD = "Wrong database's username and password"
    static WRONG_CONNECTION_STRING = "Wrong server name/connection string"
    static CANNOT_CONNECT_MONGODB = "Cannot connect to Mongoose"
    static USER_EXISTS = "User already exists"
    static CANNOT_REGISTER_USER = "Cannot register user"
    static WRONG_EMAIL_AND_PASSWORD = "Wrong email and password"
    static SERVER_ERROR = "Server is error"
    static CAST_ERROR = "CastError"
    static VALIDATION_ERROR = "ValidationError"
}
