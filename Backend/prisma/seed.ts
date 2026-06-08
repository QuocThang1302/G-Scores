import { createReadStream, existsSync } from "node:fs";
import { resolve } from "node:path";

import "dotenv/config";
import csvParser from "csv-parser";
import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const batchSize = 1000;
const csvFilePath = resolve(__dirname, "../data/diem_thi_thpt_2024.csv");

type CsvRow = {
  sbd?: string;
  toan?: string;
  ngu_van?: string;
  ngoai_ngu?: string;
  vat_li?: string;
  hoa_hoc?: string;
  sinh_hoc?: string;
  lich_su?: string;
  dia_li?: string;
  gdcd?: string;
  ma_ngoai_ngu?: string;
};

function parseNullableScore(value: string | undefined): number | null {
  const trimmed = value?.trim();

  if (!trimmed) {
    return null;
  }

  const parsed = Number(trimmed);
  return Number.isNaN(parsed) ? null : parsed;
}

function parseNullableString(value: string | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function mapCsvRow(row: CsvRow): Prisma.ExamScoreCreateManyInput | null {
  const sbd = row.sbd?.trim();

  if (!sbd) {
    return null;
  }

  return {
    sbd,
    toan: parseNullableScore(row.toan),
    nguVan: parseNullableScore(row.ngu_van),
    ngoaiNgu: parseNullableScore(row.ngoai_ngu),
    vatLi: parseNullableScore(row.vat_li),
    hoaHoc: parseNullableScore(row.hoa_hoc),
    sinhHoc: parseNullableScore(row.sinh_hoc),
    lichSu: parseNullableScore(row.lich_su),
    diaLi: parseNullableScore(row.dia_li),
    gdcd: parseNullableScore(row.gdcd),
    maNgoaiNgu: parseNullableString(row.ma_ngoai_ngu),
  };
}

async function insertBatch(
  batch: Prisma.ExamScoreCreateManyInput[],
  processedRows: number,
): Promise<number> {
  if (batch.length === 0) {
    return 0;
  }

  const result = await prisma.examScore.createMany({
    data: batch,
    skipDuplicates: true,
  });

  console.log(
    `Processed ${processedRows} rows. Inserted ${result.count} new records in this batch.`,
  );

  return result.count;
}

async function main(): Promise<void> {
  if (!existsSync(csvFilePath)) {
    throw new Error(`CSV file not found: ${csvFilePath}`);
  }

  let batch: Prisma.ExamScoreCreateManyInput[] = [];
  let processedRows = 0;
  let insertedRows = 0;
  let skippedRows = 0;

  const stream = createReadStream(csvFilePath).pipe(csvParser());

  for await (const row of stream as AsyncIterable<CsvRow>) {
    processedRows += 1;

    const record = mapCsvRow(row);

    if (!record) {
      skippedRows += 1;
      continue;
    }

    batch.push(record);

    if (batch.length >= batchSize) {
      insertedRows += await insertBatch(batch, processedRows);
      batch = [];
    }
  }

  insertedRows += await insertBatch(batch, processedRows);

  console.log(
    `Import finished. Processed ${processedRows} rows, inserted ${insertedRows} new records, skipped ${skippedRows} invalid rows.`,
  );
}

main()
  .catch((error: unknown) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
