<template>
    <div class="club-list-page">

        <!-- ===== 헤더 ===== -->
        <section class="page-header">
            <h1>동아리 찾기</h1>
            <p>다양한 동아리를 탐색하고 참여해보세요</p>
        </section>

        <!-- ===== 전체 동아리 탐색 ===== -->
        <section class="section-explore">
            <div class="section-title">
                <h2>전체 동아리</h2>
                <span class="count">{{ totalClubCount }}개</span>
            </div>

            <!-- 검색 & 필터 -->
            <div class="filter-bar">
                <input v-model="searchKeyword" placeholder="동아리명 검색" class="search-input" @input="onSearch" />
                <select v-model="filterCategory" @change="onFilter">
                    <option value="">전체 카테고리</option>
                    <option value="SPORT">스포츠</option>
                    <option value="CULTURE">문화</option>
                    <option value="ACADEMIC">학술</option>
                    <option value="ART">예술</option>
                    <option value="ETC">기타</option>
                </select>
                <select v-model="filterStatus" @change="onFilter">
                    <option value="">전체 상태</option>
                    <option value="ACTIVE">활동중</option>
                    <option value="INACTIVE">비활동</option>
                </select>
                <select v-model="filterJoinType" @change="onFilter">
                    <option value="">가입 방식</option>
                    <option value="FREE">자유가입</option>
                    <option value="APPROVAL">승인 후 가입</option>
                </select>
            </div>

            <!-- 전체 동아리 카드 목록 -->
            <div v-if="loadingAll" class="loading-wrap">
                <span>불러오는 중...</span>
            </div>

            <div v-else class="club-grid">
                <!-- <ClubCard v-for="club in allClubs" :key="club.clubId" :club="club" :is-joined="isJoined(club.clubId)"
                    @click="goToClub(club)" /> -->
                <div v-if="allClubs.length === 0" class="empty">
                    검색 결과가 없습니다.
                </div>
            </div>

            <BasePagination :current-page="allPage" :total-pages="allTotalPages" @change="onAllPageChange" />
        </section>

        <!-- ===== 내 동아리 ===== -->
        <section class="section-my">
            <div class="section-title">
                <h2>내 동아리</h2>
                <span class="count">{{ myClubs.length }}개</span>
            </div>

            <div v-if="loadingMy" class="loading-wrap">
                <span>불러오는 중...</span>
            </div>

            <div v-else class="my-club-list">

                <!-- 가입 대기 중인 동아리 -->
                <div v-if="pendingClubs.length" class="pending-section">
                    <h3>가입 대기 중 <span class="badge">{{ pendingClubs.length }}</span></h3>
                    <div class="club-grid">
                        <ClubCard v-for="item in pendingClubs" :key="item.clubId" :club="item" :is-joined="false"
                            :is-pending="true" @click="goToClub(item)" />
                    </div>
                </div>

                <!-- 가입된 동아리 -->
                <div class="joined-section">
                    <h3>가입된 동아리</h3>
                    <div v-if="joinedClubs.length === 0" class="empty">
                        가입된 동아리가 없습니다.
                    </div>
                    <div class="club-grid">
                        <MyClubCard v-for="item in joinedClubs" :key="item.clubId" :club="item"
                            @click="goToManage(item.clubId)" />
                    </div>
                </div>
            </div>
        </section>

    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useClubStore } from '@/stores/club'
// import ClubCard from '@/components/club/ClubCard.vue'
// import MyClubCard from '@/components/club/MyClubCard.vue'
// import BasePagination from '@/components/common/BasePagination.vue'

const router = useRouter()
const authStore = useAuthStore()
const clubStore = useClubStore()

// ── 전체 동아리 ──────────────────────────────────────
const allClubs = ref([])
const totalClubCount = ref(0)
const allPage = ref(1)
const allTotalPages = ref(1)
const loadingAll = ref(false)

// 필터
const searchKeyword = ref('')
const filterCategory = ref('')
const filterStatus = ref('')
const filterJoinType = ref('')

// ── 내 동아리 ─────────────────────────────────────────
const myClubs = ref([])   // {club, clubMember} 형태
const loadingMy = ref(false)

// ── 계산 ──────────────────────────────────────────────
const joinedClubs = computed(() =>
    myClubs.value.filter(m => m.clubMember.status === 'APPROVED')
)
const pendingClubs = computed(() =>
    myClubs.value.filter(m => m.clubMember.status === 'PENDING')
)

const joinedClubIds = computed(() =>
    new Set(joinedClubs.value.map(m => m.club.clubId))
)

function isJoined(clubId) {
    return joinedClubIds.value.has(clubId)
}

// ── API 호출 ──────────────────────────────────────────
async function loadAllClubs() {
    loadingAll.value = true
    try {
        const res = await clubStore.fetchAllClubs()
        allClubs.value = res.data
        totalClubCount.value = res.data.totalElements
        allTotalPages.value = res.data.totalPages
    } finally {
        loadingAll.value = false
    }
}

async function loadMyClubs() {
    loadingMy.value = true
    try {
        const res = await clubStore.fetchMyClubs()
        myClubs.value = res.data
    } finally {
        loadingMy.value = false
    }
}

// ── 이벤트 핸들러 ─────────────────────────────────────
let searchTimer = null
function onSearch() {
    clearTimeout(searchTimer)
    searchTimer = setTimeout(() => {
        allPage.value = 1
        loadAllClubs()
    }, 400)
}

function onFilter() {
    allPage.value = 1
    loadAllClubs()
}

function onAllPageChange(page) {
    allPage.value = page
    loadAllClubs()
}

// ── 페이지 이동 ────────────────────────────────────────
function goToClub(club) {
    router.push({ name: 'ClubDetail', params: { clubId: club.clubId } })
}

function goToManage(clubId) {
    router.push({ name: 'ClubMember', params: { clubId } })
}

// ── 초기화 ────────────────────────────────────────────
onMounted(() => {
    loadAllClubs()
    loadMyClubs()
})
</script>

<style scoped>
.club-list-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 32px 20px;
    display: flex;
    flex-direction: column;
    gap: 48px;
}

.page-header {
    text-align: center;
}

.page-header h1 {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 8px;
}

.section-title {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
}

.section-title h2 {
    font-size: 1.4rem;
    font-weight: 600;
}

.count {
    background: #e8f4ff;
    color: #1a73e8;
    padding: 2px 10px;
    border-radius: 99px;
    font-size: 0.85rem;
    font-weight: 600;
}

/* 필터 */
.filter-bar {
    display: flex;
    gap: 12px;
    margin-bottom: 20px;
    flex-wrap: wrap;
}

.search-input {
    flex: 1;
    min-width: 200px;
    padding: 10px 14px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 0.95rem;
}

.filter-bar select {
    padding: 10px 14px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 0.9rem;
    background: #fff;
    cursor: pointer;
}

/* 카드 그리드 */
.club-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 20px;
    margin-bottom: 20px;
}

.empty {
    color: #888;
    padding: 40px;
    text-align: center;
    grid-column: 1 / -1;
}

.pending-section {
    margin-bottom: 32px;
}

.pending-section h3 {
    font-size: 1rem;
    font-weight: 600;
    color: #f59e0b;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 8px;
}

.badge {
    background: #f59e0b;
    color: #fff;
    border-radius: 99px;
    padding: 1px 8px;
    font-size: 0.8rem;
}

.loading-wrap {
    text-align: center;
    padding: 40px;
    color: #aaa;
}
</style>
