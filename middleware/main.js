const io = require('socket.io-client')
/**
 * Перезапрашиваем данные клиента при переходах по страницам, для получения последних данных пользователя и продления сессии.
 * Сессия пользователя контролируеться со стороны сервера, если пользователь просматривает статические страницы
 * и проект не обращаеться к серверу, сессия не продляеться.
 */
export default async function (context) {
    // Если пользователь авторизован
    if(context.$auth.loggedIn){
        try{
            // Перезапрашиваем его данные
            await context.$auth.fetchUser()
            // Если у пользователя нет прав администратора или модератора, выкидываем с панели администратора
            if(context.$auth.$state.user.groups.indexOf(1)==-1 && context.$auth.$state.user.groups.indexOf(2)==-1){
                context.redirect(context.env.backendUrl)
            }
        }catch(err){
            console.log(err)
            // Если происходит ошибка убиваем авторизацию
            context.$auth.logout()
            context.redirect(context.env.backendUrl)
        }
    }
}