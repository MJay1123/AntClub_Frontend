<template>
    <BaseModal v-model="isVisible" @close="showMemberDetailModal = false" :size="lg">
        <template #title>회원 상세 정보</template>
        <template #body>
            <div class="member-detail-modal">

                <!-- ===== 프로필 헤더 ===== -->
                <div class="profile-header">
                    <img :src="member.profileImage || defaultLogo" class="profile-avatar" alt="avatar" />
                    <div class="profile-info">
                        <div class="name-row">
                            <h2 class="member-name">{{ member.name }}</h2>
                            <ClubBadge type="role" :value="member.clubRole" />
                            <ClubBadge type="memberStatus" :value="member.status" size="sm" />
                            <ClubBadge type="gender" :value="member.gender" />
                        </div>
                        <p class="member-sub">{{ member.majorName }} · {{ member.studentId }}</p>
                        <p class="member-sub">{{ member.schoolName }}</p>
                    </div>
                </div>

                <!-- ===== 탭 ===== -->
                <div class="tab-nav">
                    <button v-for="tab in tabs" :key="tab.key" class="tab-btn"
                        :class="{ active: activeTab === tab.key }" @click="activeTab = tab.key">
                        {{ tab.icon }} {{ tab.label }}
                    </button>
                </div>

                <!-- ===== 기본 정보 탭 ===== -->
                <div v-if="activeTab === 'info'" class="tab-content">

                    <div class="info-grid">
                        <div class="info-item">
                            <span class="info-label">📞 전화번호</span>
                            <span>{{ formatPhoneNumber(member.phoneNumber) || '-' }}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">📧 이메일</span>
                            <span>{{ member.email || '-' }}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">🎂 생년월일</span>
                            <span>{{ formatDate(member.birthDate) }}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">📚 학년</span>
                            <span>{{ member.grade ? `${member.grade}학년` : '-' }}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">📋 재학 상태</span>
                            <span>{{ enrollmentLabel(member.enrollmentStatus) }}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">📅 가입일</span>
                            <span>{{ formatDate(member.joinDate) }}</span>
                        </div>
                    </div>
                    <div v-if="member.joinReason" class="section">
                        <p class="section-title">가입 동기</p>
                        <p class="desc-text">{{ member.joinReason }}</p>
                    </div>

                </div>

                <div v-else-if="activeTab === 'profile'" class="tab-content">

                    <div class="section">
                        <p class="section-title">성격 유형</p>
                        <div class="personality-grid">

                            <div class="personality-card" v-if="member.mbti">
                                <span class="personality-label">MBTI</span>
                                <span class="personality-value mbti">{{ member.mbti }}</span>
                            </div>
                            <div class="personality-card empty-card" v-else>
                                <span class="personality-label">MBTI</span>
                                <span class="personality-empty">미입력</span>
                            </div>

                            <!-- 에니어그램 -->
                            <div class="personality-card" v-if="member.personalityType">
                                <span class="personality-label">기타 유형</span>
                                <span class="personality-value">{{ member.personalityType }}</span>
                            </div>

                            <!-- 선호 역할 -->
                            <div class="personality-card" v-if="member.preferredRole">
                                <span class="personality-label">선호 역할</span>
                                <span class="personality-value">{{ preferredRoleLabel(member.preferredRole) }}</span>
                            </div>

                            <!-- 활동 시간대 -->
                            <div class="personality-card" v-if="member.activityPreference">
                                <span class="personality-label">선호 시간대</span>
                                <span class="personality-value">{{ activityPrefLabel(member.activityPreference)
                                    }}</span>
                            </div>

                        </div>
                    </div>

                    <!-- 관심사 / 특기 -->
                    <div class="section two-col">
                        <div>
                            <p class="section-title">관심사</p>
                            <div class="tag-list">
                                <span v-for="(interest, i) in parseList(member.interests)" :key="i"
                                    class="tag tag-blue">
                                    {{ interest }}
                                </span>
                                <span v-if="!member.interests" class="empty-text">없음</span>
                            </div>
                        </div>
                        <div>
                            <p class="section-title">특기</p>
                            <div class="tag-list">
                                <span v-for="(skill, i) in parseList(member.skills)" :key="i" class="tag tag-green">
                                    {{ skill }}
                                </span>
                                <span v-if="!member.skills" class="empty-text">없음</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- ===== 활동 통계 탭 ===== -->
                <div v-else-if="activeTab === 'stats'" class="tab-content">

                    <!-- 통계 카드 -->
                    <div class="stats-grid">
                        <div class="stats-card">
                            <p class="stats-label">전체 일정</p>
                            <p class="stats-value">{{ member.totalSchedules ?? 0 }}</p>
                            <p class="stats-unit">개</p>
                        </div>
                        <div class="stats-card">
                            <p class="stats-label">참여 신청</p>
                            <p class="stats-value blue">{{ member.appliedSchedules ?? 0 }}</p>
                            <p class="stats-unit">개</p>
                        </div>
                        <div class="stats-card">
                            <p class="stats-label">실제 참여</p>
                            <p class="stats-value green">{{ member.attendedSchedules ?? 0 }}</p>
                            <p class="stats-unit">개</p>
                        </div>
                        <div class="stats-card">
                            <p class="stats-label">신청 후 불참</p>
                            <p class="stats-value red">{{ member.absentAfterApply ?? 0 }}</p>
                            <p class="stats-unit">개</p>
                        </div>
                    </div>

                    <!-- 참여율 게이지 -->
                    <div class="section">

                        <div class="gauge-row">
                            <div class="gauge-info">
                                <span class="gauge-label">참여율</span>
                                <span class="gauge-value" :class="rateColor(member.attendanceRate)">
                                    {{ member.attendanceRate?.toFixed(1) ?? 0 }}%
                                </span>
                            </div>
                            <div class="gauge-bar">
                                <div class="gauge-fill" :class="rateColor(member.attendanceRate)"
                                    :style="{ width: `${member.attendanceRate ?? 0}%` }" />
                            </div>
                        </div>

                        <div class="gauge-row">
                            <div class="gauge-info">
                                <span class="gauge-label">불참율</span>
                                <span class="gauge-value" :class="noShowColor(member.noShowRate)">
                                    {{ member.noShowRate?.toFixed(1) ?? 0 }}%
                                </span>
                            </div>
                            <div class="gauge-bar">
                                <div class="gauge-fill" :class="noShowColor(member.noShowRate)"
                                    :style="{ width: `${member.noShowRate ?? 0}%` }" />
                            </div>
                        </div>

                    </div>

                    <!-- AI 점수 -->
                    <div class="section">
                        <p class="section-title">AI 활동 점수</p>
                        <div class="ai-score-grid">
                            <div class="ai-score-item">
                                <p class="ai-score-label">활동 점수</p>
                                <div class="ai-score-bar-wrap">
                                    <div class="ai-score-bar">
                                        <div class="ai-score-fill blue"
                                            :style="{ width: `${member.activityScore ?? 0}%` }" />
                                    </div>
                                    <span class="ai-score-num">{{ member.activityScore?.toFixed(1) ?? 0 }}</span>
                                </div>
                            </div>
                            <div class="ai-score-item">
                                <p class="ai-score-label">신뢰도 점수</p>
                                <div class="ai-score-bar-wrap">
                                    <div class="ai-score-bar">
                                        <div class="ai-score-fill green"
                                            :style="{ width: `${member.reliabilityScore ?? 0}%` }" />
                                    </div>
                                    <span class="ai-score-num">{{ member.reliabilityScore?.toFixed(1) ?? 0 }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 최근 참여 이력 -->
                    <div class="section">
                        <p class="section-title">최근 참여 이력</p>
                        <div class="history-list">
                            <div v-for="h in member.recentHistory ?? []" :key="h.scheduleId" class="history-item">
                                <span class="history-date">{{ formatDate(h.startedAt) }}</span>
                                <span class="history-title">{{ h.title }}</span>
                                <span class="history-status" :class="h.isAttended ? 'text-green' : 'text-red'">
                                    {{ h.isAttended ? '✅ 참여' : '❌ 불참' }}
                                </span>
                            </div>
                            <div v-if="!member.recentHistory?.length" class="empty-text">참여 이력이 없습니다.</div>
                        </div>
                    </div>

                </div>

                <!-- ===== 관리자 메모 탭 (임원 이상) ===== -->
                <div v-else-if="activeTab === 'memo'" class="tab-content">

                    <div class="section">
                        <p class="section-title">관리자 메모</p>
                        <textarea v-model="memoInput" class="memo-textarea" rows="6"
                            placeholder="이 회원에 대한 메모를 입력하세요..." />
                        <button class="btn btn-primary" style="margin-top: 10px" @click="saveMemo">
                            메모 저장
                        </button>
                    </div>

                    <!-- 역할 변경 -->
                    <div class="section">
                        <p class="section-title">역할 변경</p>
                        <div class="role-change-row">
                            <select v-model="selectedRole" class="role-select">
                                <option value="PRESIDENT">회장</option>
                                <option value="EXECUTIVE">임원</option>
                                <option value="MEMBER">회원</option>
                            </select>
                            <button class="btn btn-outline" @click="changeRole">변경</button>
                        </div>
                        <p class="role-changed-info" v-if="member.roleChangedAt">
                            마지막 변경: {{ formatDate(member.roleChangedAt) }}
                            <template v-if="member.roleChangedBy"> · {{ member.roleChangedBy }}님</template>
                        </p>
                    </div>

                    <!-- 회원 상태 변경 -->
                    <div class="section danger-section">
                        <p class="section-title">회원 상태</p>
                        <div class="danger-actions">
                            <button class="btn btn-danger" @click="$emit('expel', member.clubMemberId)">
                                강퇴 처리
                            </button>
                            <button v-if="member.status === 'APPROVED'" class="btn btn-warning"
                                @click="$emit('withdraw', member.clubMemberId)">
                                탈퇴 처리
                            </button>
                        </div>
                    </div>

                </div>

            </div>
        </template>
        <template #footer></template>
    </BaseModal>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useUiStore } from '@/stores/ui'
import ClubBadge from '@/components/club/ClubBadge.vue'
import defaultLogo from '@/assets/AntLogo.png'

// ── Props & Emits ─────────────────────────────────────
const props = defineProps({
    modelValue: { type: Boolean, default: false },
})

const isVisible = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
})

const emit = defineEmits(['close', 'updateStatus', 'updateRole'])

const ui = useUiStore()

// ── 탭 ────────────────────────────────────────────────
const tabs = [
    { key: 'info', label: '기본 정보', icon: '👤' },
    { key: 'profile', label: '성향', icon: '🧠' },
    { key: 'stats', label: '활동 통계', icon: '📊' },
    { key: 'memo', label: '관리', icon: '📝' },
]
const activeTab = ref('info')

// ── 유틸 ──────────────────────────────────────────────
function parseList(val) {
    if (!val) return []
    try { return JSON.parse(val) } catch { return val.split(',').map(s => s.trim()) }
}

function formatPhoneNumber(pn) {
    return pn ? `${pn.slice(0, 3)}-${pn.slice(3, 7)}-${pn.slice(7)}` : '-'
}

function formatDate(d) { return d ? d.slice(0, 10) : '-' }

function enrollmentLabel(v) {
    return { ENROLLED: '재학', LEAVE: '휴학', GRADUATED: '졸업', EXPELLED: '제적' }[v] ?? '-'
}
function preferredRoleLabel(v) {
    return {
        LEADER: '리더형',
        SUPPORTER: '서포터형',
        CREATOR: '창작형',
        ANALYZER: '분석형',
        EXECUTOR: '실행형',
    }[v] ?? v
}
function activityPrefLabel(v) {
    return { MORNING: '오전', AFTERNOON: '오후', EVENING: '저녁', WEEKEND: '주말' }[v] ?? v
}

function rateColor(r) {
    if (r >= 80) return 'green'
    if (r >= 50) return 'yellow'
    return 'red'
}
function noShowColor(r) {
    if (r >= 30) return 'red'
    if (r >= 10) return 'yellow'
    return 'green'
}
</script>

<style scoped>
.member-detail-modal {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

/* ── 프로필 헤더 ────────────────────────────────────── */
.profile-header {
    display: flex;
    align-items: center;
    gap: 16px;
    padding-bottom: 16px;
    border-bottom: 1px solid #f3f4f6;
}

.profile-avatar {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid #e5e7eb;
    flex-shrink: 0;
}

.profile-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.name-row {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
}

.member-name {
    font-size: 1.2rem;
    font-weight: 700;
    color: #111;
    margin: 0;
}

.member-sub {
    font-size: 0.85rem;
    color: #6b7280;
    margin: 0;
}

/* ── 탭 ────────────────────────────────────────────── */
.tab-nav {
    display: flex;
    border-bottom: 2px solid #f3f4f6;
    gap: 2px;
}

.tab-btn {
    padding: 8px 16px;
    border: none;
    background: transparent;
    font-size: 0.88rem;
    color: #6b7280;
    cursor: pointer;
    border-radius: 6px 6px 0 0;
    font-weight: 500;
    transition: all 0.15s;
    white-space: nowrap;
}

.tab-btn:hover {
    background: #f9fafb;
    color: #111;
}

.tab-btn.active {
    color: #2563eb;
    font-weight: 700;
    border-bottom: 2px solid #2563eb;
    margin-bottom: -2px;
}

/* ── 탭 콘텐츠 ─────────────────────────────────────── */
.tab-content {
    display: flex;
    flex-direction: column;
    gap: 16px;
    min-height: 280px;
}

/* ── 기본 정보 그리드 ──────────────────────────────── */
.info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
}

.info-item {
    display: flex;
    flex-direction: column;
    gap: 3px;
}

.info-label {
    font-size: 0.78rem;
    font-weight: 600;
    color: #9ca3af;
}

.info-item span {
    font-size: 0.9rem;
    color: #111;
}

/* ── 섹션 ──────────────────────────────────────────── */
.section {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.section-title {
    font-size: 0.82rem;
    font-weight: 700;
    color: #6b7280;
    margin: 0;
}

.desc-text {
    font-size: 0.9rem;
    color: #374151;
    line-height: 1.6;
    white-space: pre-line;
    margin: 0;
}

.two-col {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
}

/* ── 성격 유형 ─────────────────────────────────────── */
.personality-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
}

.personality-card {
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    padding: 12px 14px;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.personality-card.empty-card {
    opacity: 0.5;
}

.personality-label {
    font-size: 0.75rem;
    color: #9ca3af;
    font-weight: 600;
}

.personality-value {
    font-size: 1.1rem;
    font-weight: 700;
    color: #111;
}

.personality-value.mbti {
    font-size: 1.4rem;
    color: #2563eb;
    letter-spacing: 0.05em;
}

.personality-empty {
    font-size: 0.85rem;
    color: #d1d5db;
}

/* ── 태그 ──────────────────────────────────────────── */
.tag-list {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

.tag {
    padding: 4px 12px;
    border-radius: 99px;
    font-size: 0.8rem;
    font-weight: 500;
}

.tag-blue {
    background: #dbeafe;
    color: #1d4ed8;
}

.tag-green {
    background: #dcfce7;
    color: #15803d;
}

/* ── SNS ────────────────────────────────────────────── */
.sns-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.sns-item {
    padding: 6px 14px;
    border-radius: 8px;
    font-size: 0.85rem;
    font-weight: 500;
    text-decoration: none;
    transition: opacity 0.15s;
}

.sns-item:hover {
    opacity: 0.8;
}

.instagram {
    background: #fce7f3;
    color: #9d174d;
}

.github {
    background: #f3f4f6;
    color: #111;
}

/* ── 통계 카드 ─────────────────────────────────────── */
.stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
}

.stats-card {
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    padding: 14px;
    text-align: center;
}

.stats-label {
    font-size: 0.78rem;
    color: #9ca3af;
    margin: 0 0 4px;
}

.stats-value {
    font-size: 1.8rem;
    font-weight: 700;
    color: #111;
    line-height: 1;
}

.stats-value.blue {
    color: #2563eb;
}

.stats-value.green {
    color: #16a34a;
}

.stats-value.red {
    color: #dc2626;
}

.stats-unit {
    font-size: 0.78rem;
    color: #9ca3af;
    margin: 2px 0 0;
}

/* ── 게이지 ─────────────────────────────────────────── */
.gauge-row {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 12px;
}

.gauge-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.gauge-label {
    font-size: 0.85rem;
    color: #6b7280;
    font-weight: 600;
}

.gauge-value {
    font-size: 0.95rem;
    font-weight: 700;
}

.gauge-value.green {
    color: #16a34a;
}

.gauge-value.yellow {
    color: #d97706;
}

.gauge-value.red {
    color: #dc2626;
}

.gauge-bar {
    height: 8px;
    background: #f3f4f6;
    border-radius: 99px;
    overflow: hidden;
}

.gauge-fill {
    height: 100%;
    border-radius: 99px;
    transition: width 0.5s ease;
}

.gauge-fill.green {
    background: #16a34a;
}

.gauge-fill.yellow {
    background: #d97706;
}

.gauge-fill.red {
    background: #dc2626;
}

/* ── AI 점수 ─────────────────────────────────────────── */
.ai-score-grid {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.ai-score-item {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.ai-score-label {
    font-size: 0.82rem;
    color: #6b7280;
    margin: 0;
}

.ai-score-bar-wrap {
    display: flex;
    align-items: center;
    gap: 10px;
}

.ai-score-bar {
    flex: 1;
    height: 8px;
    background: #f3f4f6;
    border-radius: 99px;
    overflow: hidden;
}

.ai-score-fill {
    height: 100%;
    border-radius: 99px;
    transition: width 0.5s ease;
}

.ai-score-fill.blue {
    background: #2563eb;
}

.ai-score-fill.green {
    background: #16a34a;
}

.ai-score-num {
    font-size: 0.85rem;
    font-weight: 700;
    color: #374151;
    min-width: 32px;
    text-align: right;
}

/* ── 참여 이력 ─────────────────────────────────────── */
.history-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
    max-height: 180px;
    overflow-y: auto;
}

.history-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 12px;
    background: #f9fafb;
    border-radius: 8px;
    font-size: 0.85rem;
}

.history-date {
    color: #9ca3af;
    min-width: 80px;
    flex-shrink: 0;
}

.history-title {
    flex: 1;
    color: #111;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.history-status {
    flex-shrink: 0;
    font-weight: 600;
    font-size: 0.82rem;
}

/* ── 메모 탭 ────────────────────────────────────────── */
.memo-textarea {
    width: 100%;
    padding: 12px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    font-size: 0.9rem;
    resize: vertical;
    line-height: 1.6;
    box-sizing: border-box;
    outline: none;
    transition: border 0.15s;
}

.memo-textarea:focus {
    border-color: #2563eb;
}

.memo-textarea:disabled {
    background: #f9fafb;
    color: #6b7280;
}

/* 역할 변경 */
.role-change-row {
    display: flex;
    gap: 10px;
    align-items: center;
}

.role-select {
    padding: 8px 12px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    font-size: 0.9rem;
    background: #fff;
}

.role-changed-info {
    font-size: 0.8rem;
    color: #9ca3af;
    margin: 0;
}

/* 위험 구역 */
.danger-section {
    border-top: 1px dashed #fca5a5;
    padding-top: 16px;
}

.danger-actions {
    display: flex;
    gap: 10px;
}

/* ── 버튼 ──────────────────────────────────────────── */
.btn {
    padding: 8px 18px;
    border-radius: 8px;
    font-size: 0.88rem;
    cursor: pointer;
    border: none;
    font-weight: 600;
    transition: all 0.15s;
}

.btn-primary {
    background: #2563eb;
    color: #fff;
}

.btn-primary:hover {
    background: #1d4ed8;
}

.btn-outline {
    background: #fff;
    border: 1px solid #e5e7eb;
    color: #374151;
}

.btn-outline:hover {
    background: #f3f4f6;
}

.btn-danger {
    background: #fee2e2;
    color: #dc2626;
    border: 1px solid #fca5a5;
}

.btn-danger:hover {
    background: #fecaca;
}

.btn-warning {
    background: #fef3c7;
    color: #d97706;
    border: 1px solid #fcd34d;
}

.btn-warning:hover {
    background: #fde68a;
}

/* ── 공통 ──────────────────────────────────────────── */
.empty-text {
    font-size: 0.85rem;
    color: #d1d5db;
}

.text-green {
    color: #16a34a;
}

.text-red {
    color: #dc2626;
}

@media (max-width: 480px) {
    .info-grid {
        grid-template-columns: 1fr;
    }

    .stats-grid {
        grid-template-columns: repeat(2, 1fr);
    }

    .personality-grid {
        grid-template-columns: 1fr;
    }

    .two-col {
        grid-template-columns: 1fr;
    }
}
</style>
