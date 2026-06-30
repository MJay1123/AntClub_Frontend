import { defineStore } from "pinia"
import { clubMemberApi } from "@/api/restApi"
import { ref } from "vue"

export const useClubMemberStore = defineStore('club-member', () => {
    const clubMembers = ref([])
    const approvedMembers = ref([])
    const pendingMembers = ref([])
    const clubMember = ref(null)

    const fetchClubMembers = async(clubId) => {
        console.log('clubMember.js - fetchClubMembers')
        try {
            const response = await clubMemberApi.getClubMembers(clubId)
            console.log('response', response)
            clubMembers.value = response.data
            approvedMembers.value = response.data.filter(m => m.status === 'APPROVED')
            pendingMembers.value = response.data.filter(m => m.status === 'PENDING')
        } catch (error) {
            console.log('error', error)
        }
    }

    const fetchClubMember = async (clubId, memberId) => {
        console.log('clubMember.js - fetchClubMember')
        try {
            const response = await clubMemberApi.getClubMember(clubId, memberId)
            console.log('response', response)
            clubMember.value = response.data
        } catch (error) {
            console.log('error', error)
        }
    }

    return {
        clubMembers, approvedMembers, pendingMembers, clubMember,
        fetchClubMembers, fetchClubMember
    }
})