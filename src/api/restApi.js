import api from "./axios";

export const memberApi = {
    createMember: (data) => api.post("/member", data),
    // getMe: () => api.get('/member/me'),
    // updateMemberImage: (imageFile) => api.patch(`/member/me/image`, imageFile),
    // updateMemberPassword: (dto) => api.patch(`/member/me/password`, dto),
    // updateMemberInfo: (dto) => api.patch(`/member/me`, dto),
}

export const schoolApi = {
    getSchoolList: () => api.get("/school")
}

export const majorApi = {
    getMajorListInSchool: (schoolId) => api.get(`/major/school/${schoolId}`)
}

