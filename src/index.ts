import AuthService from "./auth/auth_service";
import {
  WeakPasswordAuthException,
  EmailAlreadyInUseAuthException,
  InvalidEmailAuthException,
} from "./auth/auth_exceptions";

// 当用户选择使用某种三方服务时，只需要在这里进行对应实例化即可，后续的所有接口都是一致的，不需要做任何的判断
const provider = AuthService.instance("firebase");
// 无论使用何种服务，使用时这里都一致的接口、参数、响应体和错误响应
async function handleRegister(email: string, password: string) {
  try {
    const user = await provider.createUser(email, password);
    // user 格式统一
  } catch (e) {
    if (e instanceof EmailAlreadyInUseAuthException) {
      // 抛出对应的错误信息
    } else if (e instanceof WeakPasswordAuthException) {
      // 抛出对应的错误信息
    } else if (e instanceof InvalidEmailAuthException) {
      // 抛出对应的错误信息
    } else {
      // 抛出对应的错误信息
    }
  }
}
