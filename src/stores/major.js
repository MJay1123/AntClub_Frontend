import { defineStore } from "pinia";
import { ref } from "vue";
import { majorApi } from "@/api/restApi";

export const useMajorStore = defineStore("major", () => {
    const majors = ref([])
    
    const fetchMajorsInSchool = async (schoolId) => {
        console.log('major.js - fetchMajorsInSchool')
        try {
            const response = await majorApi.getMajorListInSchool(schoolId)
            console.log('response', response)
            majors.value = response.data
        } catch (error) {
            console.log('error', error)
        }
    }
    return {
        majors,
        fetchMajorsInSchool,
    }
});
