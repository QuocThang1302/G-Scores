import { IsNotEmpty, Matches } from "class-validator";

export class SearchScoreDto {
  @IsNotEmpty()
  @Matches(/^\d+$/, {
    message: "Student number must contain digits only.",
  })
  sbd!: string;
}
