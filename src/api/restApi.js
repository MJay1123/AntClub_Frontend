import api from "./axios";

export const authApi = {
    login: (request) => api.post("/member/login", request),
}

export const memberApi = {
    createMember: (data) => api.post("/member", data),
    getMember: (memberId) => api.get(`/member/${memberId}`)
}

export const schoolApi = {
    getUniversityList: () => api.get('/school/university'),
    getCollegeList: (universityId) => api.get(`/school/university/${universityId}`),
    getDepartmentList: (collegeId) => api.get(`school/college/${collegeId}`),
}

export const majorApi = {
    getMajorListInSchool: (schoolId) => api.get(`/major/school/${schoolId}`)
}

export const clubApi = {
    getClubListAll: () => api.get('/club'),
    getMemberClubs: (memberId) => api.get(`/club/member/${memberId}`),
    getClub: (clubId) => api.get(`/club/${clubId}`)
}

export const clubMemberApi = {
    getClubMembers: (clubId) => api.get(`/club-member/club/${clubId}`),
    getClubMemberByClubMemberId: (clubMemberId) => api.get(`/club-member/${clubMemberId}`),
    getClubMember: (clubId, memberId) => api.get(`/club-member/club/${clubId}/member/${memberId}`),
    create: (request) => api.post('/club-member', request),
    delete: (clubMemberId) => api.delete('/club-member'),
    updateStatus: (clubMemberId, dto) => api.patch(`/club-member/${clubMemberId}/status`, dto),
    updateRole: (clubMemberId, dto) => api.patch(`/club-member/${clubMemberId}/role`, dto),
}

export const semesterApi = {
    getSemesters: (clubId) => api.get(`/semester/club/${clubId}`),
    getSemester: (semesterId) => api.get(`/semester/${semesterId}`)
}

export const scheduleApi = {
    
}

