import { Module } from "./module";
import { Lo } from "./lo";

export class Li extends Lo {
  //Fields
	constructor($id: number, $title: string, $description: string) {
    super($id, $title, $description);
	}
  public static buildLis(data: Array<any>): Array<Li> {
    return data? data.map(d => new Li(d.id, d.title, d.description)): [];
  }
}
