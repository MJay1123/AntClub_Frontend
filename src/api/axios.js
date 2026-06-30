import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:8080'
})

const noAuthUrls = [
    '/auth/login',
    '/auth/refresh',
    '/member/join',
]

const isNoAuthUrl = (url = '') => {
    return noAuthUrls.some(noAuthUrl => url.includes(noAuthUrl))
}

api.interceptors.request.use(
    config => {
        if (isNoAuthUrl(config.url)) {
            return config
        }

        const token = localStorage.getItem('accessToken')

        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }

        return config
    },
    error => Promise.reject(error)
)

export default api

