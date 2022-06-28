// login exceptions
export class UserNotFoundAuthException extends Error {}

export class WrongPasswordAuthException extends Error {}

// register exceptions
export class WeakPasswordAuthException extends Error {}

export class EmailAlreadyInUseAuthException extends Error {}

export class InvalidEmailAuthException extends Error {}

// generic exceptions
export class GenericAuthException extends Error {}

export class UserNotLoggedInAuthException extends Error {}