import { defineStore } from "pinia";
import { ref } from "vue";
import { schoolApi } from "@/api/restApi";

export const useSchoolStore = defineStore("school", () => {
    const schools = ref([])
    
    const fetchSchools = async () => {
        console.log('school.js - fetchSchools')
        try {
            const response = await schoolApi.getSchoolList()
            console.log('response', response)
            schools.value = response.data
        } catch (error) {
            console.log('error', error)
        }
    }
    return {
        schools,
        fetchSchools,
    }
});
