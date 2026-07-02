import { defineStore } from "pinia";
import { ref } from "vue";
import { schoolApi } from "@/api/restApi";
import { useUiStore } from "./ui";


export const useSchoolStore = defineStore("school", () => {
    const uiStore = useUiStore()
    
    const universities = ref([])
    const colleges = ref([])
    const departments = ref([])
    const school = ref(null)
    
    const fetchUniversities = async () => {
        console.log('school.js - fetchUniversities')
        uiStore.isLoading = true
        universities.value = []
        colleges.value = []
        departments.value = []
        try {
            const response = await schoolApi.getUniversityList()
            console.log('response', response)
            universities.value = response.data
        } catch (error) {
            console.log('error', error)
            throw error
        } finally {
            uiStore.isLoading = false
        }
    }
    
    const fetchColleges = async (universityId) => {
        console.log('school.js - fetchColleges')
        uiStore.isLoading = true
        colleges.value = []
        departments.value = []
        try {
            const response = await schoolApi.getCollegeList(universityId)
            console.log('response', response)
            colleges.value = response.data
        } catch (error) {
            console.log('error', error)
            throw error
        } finally {
            uiStore.isLoading = false
        }
    }

    const fetchDepartments = async (collegeId) => {
        console.log('school.js - fetchDepartments')
        uiStore.isLoading = true
        departments.value = []
        try {
            const response = await schoolApi.getDepartmentList(collegeId)
            console.log('response', response)
            departments.value = response.data
        } catch (error) {
            console.log('error', error)
            throw error
        } finally {
            uiStore.isLoading = false
        }
    }

    return {
        universities, colleges, departments, school,
        fetchUniversities, fetchColleges, fetchDepartments
    }
});
