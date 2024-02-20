const getS = () => import('./test')

document.getElementById('app')!.innerHTML = '__UNPLUGIN__'
getS()
