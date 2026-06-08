export type ScoreField =
  | "toan"
  | "nguVan"
  | "ngoaiNgu"
  | "vatLi"
  | "hoaHoc"
  | "sinhHoc"
  | "lichSu"
  | "diaLi"
  | "gdcd";

export class Subject {
  constructor(
    public readonly code: string,
    public readonly name: string,
    public readonly scoreField: ScoreField,
  ) {}
}

export const SUBJECTS: readonly Subject[] = [
  new Subject("toan", "Math", "toan"),
  new Subject("ngu_van", "Literature", "nguVan"),
  new Subject("ngoai_ngu", "Foreign Language", "ngoaiNgu"),
  new Subject("vat_li", "Physics", "vatLi"),
  new Subject("hoa_hoc", "Chemistry", "hoaHoc"),
  new Subject("sinh_hoc", "Biology", "sinhHoc"),
  new Subject("lich_su", "History", "lichSu"),
  new Subject("dia_li", "Geography", "diaLi"),
  new Subject("gdcd", "Civic Education", "gdcd"),
];
