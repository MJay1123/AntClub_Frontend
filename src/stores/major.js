import { defineStore } from "pinia";
import { ref } from "vue";
import { majorApi } from "@/api/restApi";

export const useMajorStore = defineStore("major", () => {
    const majors = ref([])
    
    const fetchMajorsInSchool = async (schoolId) => {
        try {
            const response = await majorApi.getMajorListInSchool(schoolId)
            console.log('fetchMajors - response', response)
            majors.value = response.data
        } catch (error) {
            console.log('major.js - fetchMajors :', error)
        }
    }
    return {
        majors,
        fetchMajorsInSchool,
    }
});
