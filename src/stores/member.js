import { defineStore } from "pinia"
import { memberApi } from "@/api/restApi"
import { ref } from "vue"

export const useMemberStore = defineStore('member', () => {
    const member = ref(null)

    const fetchMember = async (memberId) => {
        console.log('member.js - fetchMember')
        member.value = null
        try {
            const response = await memberApi.getMember(memberId)
            console.log('response', response)
            member.value = response.data
        } catch (error){
            console.log('error', error)
        }
    }

    return {
        member,
        fetchMember
    }
})