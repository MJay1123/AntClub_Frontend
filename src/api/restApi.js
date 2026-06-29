import api from "./axios";

export const authApi = {
    login: (request) => api.post("/member/login", request),
}

export const memberApi = {
    createMember: (data) => api.post("/member", data),
    getMember: (memberId) => api.get(`/member/${memberId}`)
}

export const schoolApi = {
    getSchoolList: () => api.get("/school")
}

export const majorApi = {
    getMajorListInSchool: (schoolId) => api.get(`/major/school/${schoolId}`)
}

