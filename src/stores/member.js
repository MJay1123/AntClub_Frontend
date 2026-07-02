import { defineStore } from "pinia"
import { memberApi } from "@/api/restApi"
import { ref } from "vue"
import { useUiStore } from "./ui"


export const useMemberStore = defineStore('member', () => {
    const uiStore = useUiStore()
    
    const member = ref(null)

    const fetchMember = async (memberId) => {
        console.log('member.js - fetchMember')
        uiStore.isLoading = true
        member.value = null
        try {
            const response = await memberApi.getMember(memberId)
            console.log('response', response)
            member.value = response.data
        } catch (error){
            console.log('error', error)
            throw error
        } finally {
            uiStore.isLoading = false
        }
    }

    return {
        member,
        fetchMember
    }
})