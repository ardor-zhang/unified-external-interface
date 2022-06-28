有两个提供登陆的三方服务 —— Firebase 和 Supabase，分别提供了五种能力，

- 邮箱注册
  - Firebase ——  createUserWithEmailAndPassword
  - Supabase —— registerByEmail
- 邮箱验证
  - Firebase ——  sendEmailVerification
  - Supabase —— emailForVerification
- 邮箱登陆
  - Firebase ——  signInWithEmailAndPassword
  - Supabase —— loginByEmail
- 密码重置
  - Firebase ——  sendPasswordResetEmail
  - Supabase —— resetPasswordByEmail
- 用户登出
  - Firebase ——  signOut
  - Supabase —— logout

当在项目中使用时，如果没有做逻辑的统一，那么代码中一定会出现大量的判断逻辑，用以实现用户在选择使用不同的服务时底层正确的使用对应的接口，诸如以下代码：

```ts
// 用户注册逻辑
if(用户选择的服务 == Firebase) {
  createUserWithEmailAndPassword(...)
} else {
  registerByEmail(...)         
}

// 用户登陆逻辑
if(用户选择的服务 == Firebase) {
  signInWithEmailAndPassword(...)
} else {
  loginByEmail(...)         
}
```

这仅仅只是接口层面的不同和所需的逻辑处理，除此之外，不同的服务提供的接口还存在以下差异：

- 所需要的参数格式不尽相同
- 所返回的响应体格式不尽相同
- 异常错误的捕获格式不尽相同

如果没有进行统一的处理，这些差异都会直接体现在业务逻辑中，并且伴随着所选服务的判断，诸如以下代码：

```js
// 用户注册逻辑
if(用户选择的服务 == Firebase) {
  formatFirebaseParams() // 格式化注册参数，不同的服务所需参数格式不同
  try {
    response = createUserWithEmailAndPassword(...)	// Firebase 注册逻辑
    user = formatFirebaseResponse(response) // 格式化返回体，不同的服务返回体格式不同         
  } catch (e) { // 处理异常，不同的服务捕获的异常错误格式不同
    if(e.code === '邮箱已存在') {
      throw '邮箱已存在' 
    } else if(){} ....
    ...
  }
  
} else {
  formatSupabaseParams() // 格式化注册参数
  try {
    response = registerByEmail(...)	// Supabase 注册逻辑
    user = formatSupabaseResponse(response) // 格式化返回体          
  } catch (e) { // 处理异常
    if(e.code === 1001) {
      throw '邮箱已存在' 
    } else if(){} ....
    ...
  }     
}
```

从上可以看到，在没有统一处理的情况下，这些逻辑直接杂糅在业务中显得十分的混乱，并且，可以预见的是，随着提供登陆的三方服务的增加，这里的逻辑将相应的增加，这将给开发带来了巨大的成本：

- 只要新增一种服务类型，每一个使用服务的地方都需要增加相应逻辑
- 只要新增一处使用，需要把所有服务对应的逻辑都添加上

有没有一种办法可以解决这个问题呢？能够实现以下特性：

1. 统一使用时的接口

   不论用户选择的是 Firebase 还是 Supabase，代码中调用的是统一的接口，如 createUser(email, password)，不再区分服务

2. 统一返回体格式

   不论用户选择的是 Firebase 还是 Supabase，业务代码中使用时返回的响应体结构一致

3. 统一异常捕获格式

   不论用户选择的是 Firebase 还是 Supabase，针对同一种类型的错误，捕获时返回的错误一致

