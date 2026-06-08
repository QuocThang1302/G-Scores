export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ExamScore {
  id?: string;
  sbd: string;
  toan?: number | null;
  nguVan?: number | null;
  ngu_van?: number | null;
  ngoaiNgu?: number | null;
  ngoai_ngu?: number | null;
  vatLi?: number | null;
  vat_li?: number | null;
  hoaHoc?: number | null;
  hoa_hoc?: number | null;
  sinhHoc?: number | null;
  sinh_hoc?: number | null;
  lichSu?: number | null;
  lich_su?: number | null;
  diaLi?: number | null;
  dia_li?: number | null;
  gdcd?: number | null;
  maNgoaiNgu?: string | null;
  ma_ngoai_ngu?: string | null;
}

export interface ScoreLevelReport {
  subject?: string;
  subjectName?: string;
  name?: string;
  excellent?: number;
  good?: number;
  average?: number;
  poor?: number;
  greaterThanOrEqual8?: number;
  from6ToUnder8?: number;
  from4ToUnder6?: number;
  lessThan4?: number;
  ge8?: number;
  gte8?: number;
  score_gte_8?: number;
  score_6_to_8?: number;
  score_4_to_6?: number;
  score_lt_4?: number;
}

export interface TopGroupAStudent {
  sbd: string;
  toan?: number | null;
  vatLi?: number | null;
  vat_li?: number | null;
  hoaHoc?: number | null;
  hoa_hoc?: number | null;
  tong_diem?: number | null;
  totalGroupA?: number | null;
  groupAScore?: number | null;
  totalScore?: number | null;
}

export interface DashboardSummary {
  examYear: number;
  totalCandidates: number;
}

export interface SubjectAverage {
  code: string;
  name: string;
  displayName?: string;
  average: number | null;
  candidateCount: number;
  candidatePercentage?: number;
}

export interface MathScoreDistributionBucket {
  score: number;
  label: string;
  lowerBound?: number;
  upperBound?: number;
  count: number;
}

export interface SubjectScoreDistribution {
  code: string;
  name: string;
  displayName?: string;
  candidateCount: number;
  buckets: MathScoreDistributionBucket[];
}

export interface DashboardData {
  summary: DashboardSummary;
  subjectAverages: SubjectAverage[];
  mathScoreDistribution: MathScoreDistributionBucket[];
  subjectScoreDistributions?: SubjectScoreDistribution[];
}
