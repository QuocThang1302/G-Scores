CREATE TABLE exam_scores (
    id BIGSERIAL PRIMARY KEY,

    sbd VARCHAR(20) NOT NULL UNIQUE,

    toan DOUBLE PRECISION,
    ngu_van DOUBLE PRECISION,
    ngoai_ngu DOUBLE PRECISION,
    vat_li DOUBLE PRECISION,
    hoa_hoc DOUBLE PRECISION,
    sinh_hoc DOUBLE PRECISION,
    lich_su DOUBLE PRECISION,
    dia_li DOUBLE PRECISION,
    gdcd DOUBLE PRECISION,

    ma_ngoai_ngu VARCHAR(20),

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_exam_scores_sbd
ON exam_scores (sbd);

CREATE INDEX IF NOT EXISTS idx_exam_scores_group_a
ON exam_scores (toan, vat_li, hoa_hoc);
