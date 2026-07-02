import { defineStore } from "pinia";
import { ref } from "vue";
import { schoolApi } from "@/api/restApi";

export const useSchoolStore = defineStore("school", () => {
    const universities = ref([])
    const colleges = ref([])
    const departments = ref([])
    const school = ref(null)
    
    const fetchUniversities = async () => {
        console.log('school.js - fetchUniversities')
        try {
            const response = await schoolApi.getUniversityList()
            console.log('response', response)
            universities.value = response.data
        } catch (error) {
            console.log('error', error)
        }
    }

    const fetchColleges = async (universityId) => {
        console.log('school.js - fetchColleges')
        try {
            const response = await schoolApi.getCollegeList(universityId)
            console.log('response', response)
            colleges.value = response.data
        } catch (error) {
            console.log('error', error)
        }
    }

    const fetchDepartments = async (collegeId) => {
        console.log('school.js - fetchDepartments')
        try {
            const response = await schoolApi.getDepartmentList(collegeId)
            console.log('response', response)
            departments.value = response.data
        } catch (error) {
            console.log('error', error)
        }
    }

    return {
        universities, colleges, departments, school,
        fetchUniversities, fetchColleges, fetchDepartments
    }
});
