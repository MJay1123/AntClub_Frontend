// 날짜 포맷 (예: 2000-01-01)
export const formatDate = (dateStr) => {
    if (!dateStr) return '정보 없음'
    const date = new Date(dateStr)
    if (isNaN(date)) return dateStr
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
}

export const formatDatetime = (dateTimeStr) => {
    if (!dateTimeStr) return '정보 없음'

    const date = new Date(dateTimeStr)
    if (isNaN(date.getTime())) return dateTimeStr

    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    const h = String(date.getHours()).padStart(2, '0')
    const min = String(date.getMinutes()).padStart(2, '0')
    const s = String(date.getSeconds()).padStart(2, '0')

    return `${y}-${m}-${d} ${h}:${min}:${s}`
}

// 휴대폰 번호 하이픈(-) 추가 포맷
export const formatPhoneNumber = (phone) => {
    if (!phone) return '정보 없음'

    const cleaned = String(phone).replace(/[^0-9]/g, '')

    return cleaned.replace(
        /^(\d{2,3})(\d{3,4})(\d{4})$/,
        '$1-$2-$3'
    )
}