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
    public readonly displayName: string,
  ) {}
}

export const SUBJECTS: readonly Subject[] = [
  new Subject("toan", "Math", "toan", "Toan"),
  new Subject("ngu_van", "Literature", "nguVan", "Ngu van"),
  new Subject("ngoai_ngu", "Foreign Language", "ngoaiNgu", "Ngoai ngu"),
  new Subject("vat_li", "Physics", "vatLi", "Vat li"),
  new Subject("hoa_hoc", "Chemistry", "hoaHoc", "Hoa hoc"),
  new Subject("sinh_hoc", "Biology", "sinhHoc", "Sinh hoc"),
  new Subject("lich_su", "History", "lichSu", "Lich su"),
  new Subject("dia_li", "Geography", "diaLi", "Dia li"),
  new Subject("gdcd", "Civic Education", "gdcd", "GDCD"),
];
